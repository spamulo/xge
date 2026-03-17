// A notifier is a typed event conduit, effectively a Promise<T> that can
// fire multiple times. It maintains no buffer - handlers only see events
// that were fired during their tenure

import { computed, MaybeRefOrGetter, Ref, ref, toValue, watch } from "vue"

export const _isNotifies = Symbol("isNotifies")
export const _isNotifiable = Symbol("isNotifiable")

export type Notifies<T> = {
  (handler: (arg0: T) => void, until?: Notifies<unknown>): () => void
} & IsNotifies

export type IsNotifies = {
  [_isNotifies]: true
}

export function isNotifies(n: Notifies<unknown> | unknown): n is Notifies<unknown> {
  return !!(n as any)[_isNotifies]
}

export function isNotifiable(n: Notifiable<unknown> | unknown): n is Notifiable<unknown> {
  return !!(n as any)[_isNotifiable]
}

export type IsNotifiable = {
  [_isNotifiable]: true
}

export type NotVoidNotifiable<T> = {
  trigger(arg0: T): void
} & IsNotifiable

export type VoidNotifiable = {
  trigger(): void
} & IsNotifiable

// [T] extends [void] rather than T extends void addresses a subtle type issue.
// with tuple types like 'a' | 'b', the type is distributed unexpectedly.

// The issue arises from TypeScript's distribution of conditional types over union types,
// which can lead to incorrect type inference. By wrapping the generic type `T` in a tuple
// (`[T]`), we prevent this distribution, ensuring the conditional type is evaluated as a
// whole and avoiding the `never` type problem.

export type Notifiable<T> = ([T] extends [void] ? VoidNotifiable : NotVoidNotifiable<T>)

export type Notifier2<T> = Notifies<T> & Notifiable<T>

export function notifier2<T>(): Notifier2<T> {
  const handlers: Set<(arg0: T) => void> = new Set()
  const on = function on(h: (arg0: T) => void, until?: Notifies<unknown>): () => void {
    handlers.add(h)
    const _off = () => {
      off(h)
    }
    if (until) {
      until(_off)
    }
    return _off
  }
  const off = function off(h: (arg0: T) => void): void {
    handlers.delete(h)
  }
  const trigger = function trigger(arg0: T) {
    for (const h of handlers) {
      h(arg0)
    }
  }
  Object.assign(on, {
    trigger, [_isNotifies]: true, [_isNotifiable]: true
  })
  return on as any // whatever
}

export function nextNotify<T>(n: Notifies<T>): Promise<T> {
  return new Promise(resolve => {
    const h = (t: T) => {
      resolve(t)
      off()
    }
    const off = n(h)
  })
}

export function notifierToRef<T>(startValue: T, notifies: Notifies<T>): Ref<T> {
  const r = ref(startValue)
  notifies((t) => {
    r.value = t
  })
  return r as any
}

export function refToNotifier<T>(r: MaybeRefOrGetter<T>): Notifies<T> {
  const notifies = notifier2<T>()
  watch(() => toValue(r), newR => {
    notifies.trigger(newR)
  })
  return notifies
}

export function uncallableNotifier<T>(n: Notifier2<T>): Notifies<T> {
  // this is just a type guard
  return n
}

export type CollectingNotifier<ArgT, RetT> = {
  on(handler: (arg0: ArgT) => RetT): () => void
}

export function collectingNotifier<ArgT, RetT>(): CollectingNotifier<ArgT, RetT> {
  const handlers: Set<(arg0: ArgT) => RetT> = new Set()
  const trigger = function trigger(arg0: ArgT) {
    const values: RetT[] = []
    for (const h of handlers) {
      values.push(h(arg0))
    }
    return values
  }
  function on(h: (arg0: ArgT) => RetT): () => void {
    handlers.add(h)
    const _off = () => {
      off(h)
    }
    return _off
  }
  function off(h: (arg0: ArgT) => RetT): void {
    handlers.delete(h)
  }
  Object.assign(on, {
    trigger, off
  })
  return trigger as any // whatever
}


// onUntil(handler: (arg0: T) => void, destroyNotifier: Notifier<void> | Notifier<number>): void
// function onUntil(h: (arg0: T) => void, destroyNotifier: Notifier<void> | Notifier<number>) {
//   on(h)
//   destroyNotifier.on(() => {
//     off(h)
//   })
// }


// export function race<E, F>(a: Notifier<E>, b: Notifier<F>): Notifier<E | F> {
//   const c = useNotifier<E | F>()
//   let fired = false
//   a.on(e => {
//     if (!fired) {
//       fired = true
//       c.call(e)
//     }
//   })
//   b.on(f => {
//     if (!fired) {
//       fired = true
//       c.call(f)
//     }
//   })
//   return c
// }

// export function race2<E, F>(a: Notifier<E>, b: Notifier<F>): [Notifier<E>, Notifier<F>] {
//   const c = useNotifier<E>()
//   const d = useNotifier<F>()
//   let fired = false
//   a.on(e => {
//     if (!fired) {
//       fired = true
//       c.call(e)
//     }
//   })
//   b.on(f => {
//     if (!fired) {
//       fired = true
//       d.call(f)
//     }
//   })
//   return [c, d]
// }
