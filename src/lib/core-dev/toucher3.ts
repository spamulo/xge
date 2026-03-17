import { add2, distance2, elementOrigin, elementSize, eq2, getCoords, length2, lerp2, mean2, measureElement, mul2, rectCenter2, rectOrigin2, rectSize2, safeDivide2, scale2, sub2, V2 } from '../misc-dev/v2'
import { isRef, MaybeRefOrGetter, onUnmounted, ref, Ref, toValue, watch, watchEffect } from 'vue'
import { Notifier2, notifier2 } from './notifier2'

function getTouchPos(t: Touch): V2 {
  return [t.pageX, t.pageY]
}

function removeItemOnce(arr: any[], value: any): any[] {
  const index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

export class FingerTouch {
  pos: V2
  t: number
  identifier: number
  constructor(public touch: Touch) {
    this.pos = [touch.pageX, touch.pageY]
    this.t = Date.now()
    this.identifier = touch.identifier
  }
}

export class Finger {
  identifier: number
  pos: Ref<V2>
  delta: V2
  deltaTotal: V2 = [0, 0]
  velocity: V2 = [0, 0]
  smoothedVelocity: V2 = [0, 0]
  touches: FingerTouch[] = []
  startTime = Date.now()
  lastTime = Date.now()
  lastTouch: FingerTouch
  deltaTime = 0
  onMove = notifier2<void>()
  onEnd = notifier2<void>()
  time: number

  constructor(public initialFingerTouch: FingerTouch) {
    this.identifier = initialFingerTouch.identifier
    this.pos = ref(initialFingerTouch.pos)
    this.lastTouch = initialFingerTouch
    this.delta = [0, 0]
    this.time = Date.now()
  }
  _updateWithNewFingerTouch(ft: FingerTouch) {
    if (ft.identifier != this.identifier)
      console.warn('identifier mismatch')
    this.delta = sub2(ft.pos, this.pos.value)
    this.deltaTotal = add2(this.deltaTotal, this.delta)
    this.pos.value = ft.pos
    this.touches.push(ft)
    this.lastTouch = ft
    this.time = Date.now()

    this.deltaTime = this.time - this.lastTime

    this.velocity = scale2(this.delta, 1 / (Math.max(1, this.deltaTime) * 0.001))
    if (this.smoothedVelocity) {
      if (!eq2(this.velocity, [0, 0])) {
        this.smoothedVelocity = lerp2(this.smoothedVelocity, this.velocity, 0.5)
      }
    } else {
      this.smoothedVelocity = this.smoothedVelocity || this.velocity
    }

    this.onMove.trigger()
  }
  _end(ft: FingerTouch) {
    this.onEnd.trigger()
  }
}
function waitForRefToNotBeUndefined<T>(r: Ref<T | undefined>): Promise<void> {
  if (r.value !== undefined) {
    return new Promise((resolve) => resolve())
  } else {
    return new Promise((resolve) => {
      const unWatch = watch(r, (newR) => {
        if (newR !== undefined) {
          unWatch()
          resolve()
        }
      })
    })
  }
}

function callbackWhenRefNotUndefined<T>(r: T | Ref<T | undefined>, cb: (_: Ref<T>) => void): void {
  if (!isRef(r)) {
    cb(r as any)
    return
  }
  if (r.value !== undefined) {
    cb(r as any)
  } else {
    const unWatch = watch(r, (newR) => {
      if (newR !== undefined) {
        unWatch()
        cb(r as any)
      }
    })
  }
}

export function cloneMaybeV2(v: MaybeRefOrGetter<V2> | MaybeRefOrGetter<V2 | null> | V2 | null): V2 | null {
  const w = toValue(v)
  return w ? [...w] : null
}

function movements(points: { p: V2, t: number }[]): { delta: V2, deltaTime: number, velocity: V2 }[] {
  if (points.length < 2)
    return []
  const result = []
  let a = points[0]
  for (let i = 1; i < points.length; i++) {
    // ingest a point
    const point = points[i]
    const p = point.p
    const t = point.t
    // check that it has actually moved
    if (eq2(a.p, p))
      continue // if it hasn't moved, don't record it
    // create and push the delta, update a
    const deltaTime = t - a.t
    if (deltaTime == 0)
      continue // if it's at the same instant, don't record it. We should probably overwrite it, but in practice this only happens when the mouse is released and the prior condition is true
    const delta = sub2(p, a.p)
    result.push({
      delta,
      deltaTime,
      velocity: scale2(delta, 1 / deltaTime)
    })
    a = point
  }
  return result
}

function tail<T>(a: T[], n: number): T[] {
  return a.slice(a.length - n)
}

function assuredlyLast<T>(a: T[]): T {
  if (a.length == 0)
    throw new Error(`assuredlyLast() of empty array`)
  return a[a.length - 1]
}

function maybeLast<T>(a: T[]): T | undefined {
  return a[a.length - 1]
}

// function tail(a, n) {
//   return a.slice(a.length - n)
// }

// tracks a V2 which may be null. When it becomes null, values get reset, tracker2 tracks
// statistics about the latest non-null run
export function tracker2(p: MaybeRefOrGetter<V2 | null>) {
  const v = toValue(p)
  const value = ref(cloneMaybeV2(v))
  const start: Ref<V2 | null> = ref(cloneMaybeV2(v))
  const startT: Ref<number | null> = ref(v ? Date.now() : null)
  const distance = ref(0)
  // const points: Ref<{ p: V2, t: number }[]> = ref([])
  const onStart = notifier2<void>()
  const onMove = notifier2<void>()
  const onEnd = notifier2<void>()
  if (isRef(p)) {
    watch(p, (newP: V2 | null, oldP: V2 | null) => {
      if (oldP == null) {
        if (newP == null) {
          return
        }
        // onset
        start.value = [...newP]
        distance.value = 0
        // points.value = []
        startT.value = Date.now()
        onStart.trigger()
      } else {
        if (newP == null) {
          // termination
          onEnd.trigger()
        } else {
          if (eq2(oldP, newP)) {
            // degenerate case, no movement
          } else {
            // movement
            const t = Date.now()
            // points.value.push({ p: newP, t })
            distance.value += distance2(oldP, newP)
            onMove.trigger()
          }
        }
      }
    })
  }
  // function getVelocity(samples = 1): V2 | null {
  //   // look through the last few items in the points list and try to derive a velocity.
  //   // take the last 6 points, compute the deltas
  //   const moves = movements(tail(points.value, samples + 5))
  //   const vels = tail(moves, samples).map(m => m.velocity)
  //   const mean = mean2(vels)
  //   return mean
  // }
  return { start, value, distance, onStart, onMove, onEnd }
  // , points, getVelocity
}

export class Toucher3 {
  fingers: Map<number, Finger> = new Map()
  onDestroy = notifier2<void>()
  onStart = notifier2<Finger>()
  // onMove = notifier2<Finger>()
  // onEnd = notifier2<Finger>()
  pos: Ref<V2 | null> = ref(null)
  primaryFinger: number | null = null
  _isSetup = false
  onScroll = notifier2<number>()
  destroy() {
    this.onDestroy.trigger()
  }
  constructor(eventSource: Ref<HTMLElement | undefined>) {
    callbackWhenRefNotUndefined(eventSource, (eventSource) => {
      this.setup(eventSource.value)
    })
  }
  teardown = () => { }
  setup(eventSource: HTMLElement) {
    if (this._isSetup)
      throw new Error('toucher already set up')
    this._isSetup = true

    const touchStart = (touchEvent: TouchEvent) => {
      const changedTouches = touchEvent.changedTouches
      // console.log('ts')
      // console.log(`${JSON.stringify(changedTouches)}`)
      for (const touch of changedTouches as any) {
        const _finger = this.fingers.get(touch.identifier)
        if (_finger) {
          console.warn('finger already present')
        }
        const fingerTouch = new FingerTouch(touch)
        const finger = new Finger(fingerTouch)
        this.fingers.set(finger.identifier, finger)
        // console.log(`set finger ${JSON.stringify(finger)}`)

        if (this.primaryFinger == null) {
          this.primaryFinger = finger.identifier
        }
        // console.log('tx')
        this.onStart.trigger(finger)
      }
      touchEvent.preventDefault()
    }
    eventSource.addEventListener('touchstart', touchStart)
    this.onDestroy(() => eventSource.removeEventListener('touchstart', touchStart))

    const touchMove = (touchEvent: TouchEvent) => {
      const changedTouches = touchEvent.changedTouches
      for (const touch of changedTouches as any) {
        const finger = this.fingers.get(touch.identifier)
        if (!finger)
          throw new Error(`move event for unknown finger ${touch.identifier}`)
        // console.log(`update ${JSON.stringify(touchEvent)}`)

        if (this.primaryFinger == finger.identifier) {
          this.pos.value = finger.pos.value
        }

        finger._updateWithNewFingerTouch(new FingerTouch(touch))
        touchEvent.preventDefault()
      }
    }

    eventSource.addEventListener('touchmove', touchMove)
    this.onDestroy(() => eventSource.removeEventListener('touchmove', touchMove))
    const touchEnd = (touchEvent: TouchEvent) => {
      const changedTouches = touchEvent.changedTouches
      for (const touch of changedTouches as any) {
        const finger = this.fingers.get(touch.identifier)
        if (!finger)
          throw new Error(`move event for unknown finger ${touch.identifier}`)

        if (this.primaryFinger == finger.identifier) {
          this.pos.value = finger.pos.value
          this.primaryFinger = null
        }

        finger._end(new FingerTouch(touch))
        touchEvent.preventDefault()
        this.fingers.delete(touch.identifier)
      }
    }
    eventSource.addEventListener('touchend', touchEnd)
    this.onDestroy(() => eventSource.removeEventListener('touchend', touchEnd))


    //     // set up mouse events which pretend to be touch events

    let mouseIsDown = false

    const mouseEventToIdentifier = (event: MouseEvent) => {
      return -1 - event.button
    }

    const mouseDown = (event: MouseEvent) => {
      // disabling right click / context menu is buggy as hell, don't bother
      // also shoulder buttons are buggy.
      // console.log('md')
      if (event.button >= 2) {
        return
      }
      mouseIsDown = true
      event.preventDefault()
      document.addEventListener('mouseup', mouseUp)
      document.addEventListener('mousemove', mouseMove)
      touchStart({
        preventDefault() { },
        changedTouches: [
          {
            identifier: mouseEventToIdentifier(event),
            pageX: event.pageX,
            pageY: event.pageY,
          }
        ]
      } as any) // any alert: we are spoofing
    }
    const mouseMove = (event: MouseEvent) => {
      event.preventDefault()
      if (!mouseIsDown)
        return


      const relevantFingers = Array.from(this.fingers.values()).filter(f => f.identifier < 0)
      // console.log(JSON.stringify(relevantFingers))
      const changedTouches = relevantFingers.map(f => {
        return {
          identifier: f.identifier,
          pageX: event.pageX,
          pageY: event.pageY,
        }
      })
      // console.log(JSON.stringify(changedTouches))
      touchMove({
        preventDefault() { },
        changedTouches
      } as any) // any alert: we are spoofing
    }
    const mouseUp = (event: MouseEvent) => {
      event.preventDefault()
      document.removeEventListener('mouseup', mouseUp)
      document.removeEventListener('mousemove', mouseMove)
      mouseIsDown = false
      touchEnd({
        preventDefault() { },
        changedTouches: [
          {
            identifier: mouseEventToIdentifier(event),
            pageX: event.pageX,
            pageY: event.pageY,
          }
        ]
      } as any) // any alert: we are spoofing
    }

    eventSource.addEventListener('mousedown', mouseDown)
    this.onDestroy(() => {
      eventSource.removeEventListener('mousedown', mouseDown)
    })

    const ambientMouseMove = (event: MouseEvent) => {
      // console.log('ambient', this.pos.value)
      event.preventDefault()
      this.pos.value = [event.pageX, event.pageY]
    }

    eventSource.addEventListener('mousemove', ambientMouseMove)
    this.onDestroy(() => {
      eventSource.removeEventListener('mousemove', ambientMouseMove)
    })

    eventSource.addEventListener("wheel", (event: WheelEvent) => {
      // console.log(event)tileCardStyle
      this.onScroll.trigger(event.deltaY)
    })
    this.onDestroy(() => {
      eventSource.removeEventListener('mousemove', ambientMouseMove)
    })

  }
}

export function useToucher3(eventSource: Ref<HTMLElement | undefined>) {
  const t = new Toucher3(eventSource)
  onUnmounted(() => {
    t.destroy()
  })
  return t
}

export function relativeTo(pos: Ref<V2 | null>, element: Ref<HTMLElement | null>): Ref<V2 | null> {
  const r: Ref<V2 | null> = ref(null)
  watchEffect(() => {
    // console.log('a')
    if (pos.value) {
      // console.log('b')
      if (element.value) {
        // console.log('c')
        const r2 = measureElement(element.value)
        const o = rectOrigin2(r2)
        r.value = sub2(pos.value, o)
        // console.log(r.value)
        return
      }
    }
    r.value = null
  })
  return r
}

export function relativeToPercent(pos: Ref<V2 | null>, element: Ref<HTMLElement | null>): Ref<V2 | null> {
  const r: Ref<V2 | null> = ref(null)
  watchEffect(() => {
    // console.log('a')
    if (pos.value) {
      // console.log('b')
      if (element.value) {
        // console.log('c')
        const r2 = measureElement(element.value)
        const o = rectOrigin2(r2)
        const s = rectSize2(r2)
        const percentPos = mul2(sub2(pos.value, o), safeDivide2([100, 100], s))
        r.value = percentPos
        // console.log(r.value)
        return
      }
    }
    r.value = null
  })
  return r
}

export function getRelativeToPercent(e: HTMLElement, container: HTMLElement): V2 {
  let r: V2 = [0, 0]
  // console.log('a')
  // console.log('c')
  // const par = e.parentElement!
  const containRect = measureElement(container)
  const o = rectOrigin2(containRect)
  const s = rectSize2(containRect)

  const elRect = measureElement(e)
  const elPos = rectOrigin2(elRect)
  const ww = rectCenter2(elRect)
  const percentPos = mul2(sub2(ww, o), safeDivide2([100, 100], s))
  r = percentPos
  return r
}

