// v2.ts - simple 2D vector library, treating
// [number, number] as vectors

// ////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////

// Scalar Math

export function lerp(start: number, end: number, u: number) {
  return (end - start) * u + start
}

export function lerpTo(start: number, end: number, maxDelta: number): number {
  let d = end - start
  if (Math.abs(d) < maxDelta) {
    return end
  }
  d = d > 0 ? 1 : -1 // sign of d
  return start + d * maxDelta
}

export function randomSigned(random = Math.random): number {
  return random() * 2 - 1
}

export function randomPolarity(random = Math.random): 1 | -1 {
  return (Math.floor(random() * 2) * 2 - 1) as (1 | -1)
}

export function frac(x: number): number {
  return x - Math.floor(x)
}

// largestBit(16) == 5
export function largestBit(n: number): number {
  n = Math.abs(n) | 0
  let q = 0
  while (n > 0) {
    q++
    n = n >> 1
  }
  return q
}

export function isPowerOfTwo(n: number): boolean {
  return n > 0 && !((n - 1) & n)
}

export function leastPowerOfTwoGreaterOrEqualTo(n: number): number {
  n = Math.abs(n) | 0
  let q = 1
  while (true) {
    if (q >= n) {
      return q
    }
    q <<= 2
  }
}

export function range(startOrStop: number, stop: (number | undefined) = undefined, step: (number | undefined) = undefined): number[] {
  if (typeof stop == 'undefined') {
    // one param defined
    stop = startOrStop
    startOrStop = 0
  }
  if (typeof step == 'undefined') {
    step = 1
  }
  if ((step > 0 && startOrStop >= stop) || (step < 0 && startOrStop <= stop)) {
    return []
  }
  const result = []
  for (let i = startOrStop; step > 0 ? i < stop : i > stop; i += step) {
    result.push(i)
  }
  return result
}

export function integerModulo(num: number, base: number): number {
  num = Math.floor(num) | 0
  base = Math.floor(base) | 0
  if (base <= 0) {
    throw new Error('integerModulo may not be called with a negative base')
  }
  let result = num % base
  if (result < 0) {
    result += base
  }
  return result
}

export function sign(arg0: number): number {
  if (arg0 < 0) {
    return -1
  } else if (arg0 > 0) {
    return 1
  }
  return 0
}

// classic interpolation. return 0 and 1 when value outside min and max
// respectively, smoothly interpolate between 0 and 1 inside min..max
export function smoothstep(min: number, max: number, value: number): number {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}


export function mapUnit(u: number, minResult: number, maxResult: number): number {
  return (u * (maxResult - minResult)) + minResult
}

export function clamp(v: number, min = 0, max = 1) {
  return Math.min(Math.max(min, v), max)
}


// ////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////

// 2D Vectors

export type V2 = [number, number] // x, y
export type Rect2 = [number, number, number, number] // x, y, w, h

export function v2(x: number, y: number): V2 {
  return [x, y]
}
export function x(v: V2): number {
  return v[0]
}

export function y(v: V2): number {
  return v[1]
}


export function eq2(a: V2 | null, b: V2 | null): boolean {
  if (a == b) {
    return true
  }
  if (!a || !b) {
    return false
  }
  return a[0] == b[0] && a[1] == b[1]
}

export function add2(a: V2, b: V2): V2 {
  return [a[0] + b[0], a[1] + b[1]]
}

export function splat2(n: number): V2 {
  return [n, n]
}

export function sub2(a: V2, b: V2): V2 {
  return [a[0] - b[0], a[1] - b[1]]
}



export function scale2(a: V2, s: number): V2 {
  return [a[0] * s, a[1] * s]
}

export function mix2(a: V2, b: V2, u: number): V2 {
  return [a[0] * (1 - u) + b[0] * u, a[1] * (1 - u) + b[1] * u]
}

export function length2(a: V2): number {
  return Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2))
}

// export function length3(a: V3): number {
//   return Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2))
// }

export function lengthSquared2(a: V2): number {
  return Math.pow(a[0], 2) + Math.pow(a[1], 2)
}

export function distance2(a: V2, b: V2): number {
  return length2(sub2(a, b))
}

export function distanceSquared2(a: V2, b: V2): number {
  const c = sub2(a, b)
  return c[0] * c[0] + c[1] * c[1]
}

export function dot2(a: V2, b: V2): number {
  return a[0] * b[0] + a[1] * b[1]
}

export function lerp2(a: V2, b: V2, u: number): V2 {
  return [a[0] * (1 - u) + b[0] * u, a[1] * (1 - u) + b[1] * u]
}

export function lerpTo2(fromPos: V2, toPos: V2, maxMovement: number): V2 {
  if (distance2(fromPos, toPos) < maxMovement) {
    return toPos
  }
  const delta = sub2(toPos, fromPos)
  return add2(fromPos, scale2(normalize2(delta), maxMovement))
}

export function mul2(a: V2, b: V2): V2 {
  return [a[0] * b[0], a[1] * b[1]]
}

export function halfRound2(a: V2): V2 {
  return [Math.floor(a[0] + 0.5), Math.floor(a[1] + 0.5)]
}

export function floor2(a: V2): V2 {
  return [Math.floor(a[0]), Math.floor(a[1])]
}

export function ceil2(a: V2): V2 {
  return [Math.ceil(a[0]), Math.ceil(a[1])]
}

// how far do you have to travel on a grid to get to `a`
export function manhattanLength2(a: V2): number {
  return Math.abs(a[0]) + Math.abs(a[1])
}

// if you were to travel the least distance to shoot `a`
// how far would the bullet travel?
export function chebyshevLength2(a: V2): number {
  return Math.max(Math.abs(a[0]), Math.abs(a[1]))
}

export function safeDivide2(a: V2, b: V2): V2 {
  return [b[0] == 0 ? 0 : a[0] / b[0], b[1] == 0 ? 0 : a[1] / b[1]]
}

export function min2(a: V2, b: V2): V2 {
  return [Math.min(a[0], b[0]), Math.min(a[1], b[1])]
}

export function max2(a: V2, b: V2): V2 {
  return [Math.max(a[0], b[0]), Math.max(a[1], b[1])]
}

export function toString2(a: V2): string {
  return '[' + Math.floor(a[0]) + ', ' + Math.floor(a[1]) + ']'
}

export function toFixed2(a: V2, digits = 1) {
  return `${a[0].toFixed(digits)}, ${a[1].toFixed(digits)}`
}

export function isInt2(a: V2): boolean {
  return Math.floor(a[0]) == a[0] && Math.floor(a[1]) == a[1]
}

export function normalize2(a: V2): V2 {
  const L = length2(a)
  if (L > 0) {
    return [a[0] / L, a[1] / L]
  } else {
    throw new Error('Divide by zero in normalize2, maybe use normalizeOrZero2?')
  }
}

export function normalize3(a: V3): V3 {
  const L = length3(a)
  if (L > 0) {
    return [a[0] / L, a[1] / L, a[2] / L]
  } else {
    throw new Error('Divide by zero in normalize3, maybe use normalizeOrZero3?')
  }
}

export function isOrthogonal(a: V2): boolean { // positively matches the origin
  return a[0] == 0 || a[1] == 0
}

export function isDiagonal(a: V2): boolean { // positively matches the origin
  return a[0] == a[1] || a[0] == -a[1]
}

export function normalizeOrZero2(a: V2): V2 {
  const L = length2(a)
  if (L > 0) {
    return [a[0] / L, a[1] / L]
  } else {
    return [0, 0]
  }
}

export function normalizeOrZero3(a: V3): V3 {
  const L = length3(a)
  if (L > 0) {
    return [a[0] / L, a[1] / L, a[2] / L]
  } else {
    return [0, 0, 0]
  }
}
// with x+ to the right and y down, that is, screen coordinates
// rotate `v` 90 degrees clockwise
export function clockwise90(v: V2): V2 {
  return [-v[1], v[0]]
}

export function anticlockwise90(v: V2): V2 {
  return [v[1], -v[0]]
}

// return the unit vector in the cardinal direction most aligned with v
// cardinalDirection2([-1.2, 1.1]) = [-1, 0]
export function cardinalDirection2(v: V2): V2 {
  if (Math.abs(v[0]) > Math.abs(v[1])) {
    // horizontal
    return [v[0] <= 0 ? (v[0] >= 0 ? 0 : -1) : 1, 0]
  } else {
    // vertical or zero
    return [0, v[1] <= 0 ? (v[1] >= 0 ? 0 : -1) : 1]
  }
}

// reflect the direction `dir` in the plane with normal `normal`
// optionally attenuated
export function reflect2(dir: V2, normal: V2, attenuationX = 1): V2 {
  const dot = dir[0] * normal[0] + dir[1] * normal[1]
  return sub2(dir, scale2(normal, dot * (1 + attenuationX)))
}

// generate a vector at least `radius` away from `fixedPoint`, as close as
// possible to `startPoint`
export function standoff2(startPoint: V2, fixedPoint: V2, radius: number): V2 {
  if (distance2(startPoint, fixedPoint) < radius) {
    return add2(fixedPoint, scale2(normalize2(sub2(startPoint, fixedPoint)), radius))
  } else {
    return startPoint
  }
}

// clip `v` to be at most `maxLength` long
export function maxLength2(v: V2, maxLength: number): V2 {
  const len = distance2([0, 0], v)
  if (len > maxLength) {
    return scale2(v, maxLength / len)
  } else {
    return v
  }
}

export function unitRect2(): Rect2 {
  return [0, 0, 1, 1]
}

export function constrainToRect2(v: V2, r: Rect2): V2 {
  return [clamp(v[0], r[0], r[0] + r[2]), clamp(v[1], r[1], r[1] + r[3])]
}

export function constrain2(v: V2, max: V2): V2 {
  return [Math.min(v[0], max[0]), Math.min(v[1], max[1])]
}

export function betweenInclusive2(a: V2, low: V2, high: V2): boolean {
  return a[0] >= low[0] && a[1] >= low[1] && a[0] <= high[0] && a[1] <= high[1]
}


// Rotation tools

export function normalizeAngle(a: number): number { // normalize from 0..2pi
  const c = (a / (Math.PI * 2))
  return (c - Math.floor(c)) * (Math.PI * 2)
}

export function normalizeAngleDelta(a: number): number { // normalize from -pi to pi
  return normalizeAngle(a + Math.PI) - Math.PI
}

export function lerpToAngle(fromAngle: number, toAngle: number, maxMovement: number): number {
  const delta = normalizeAngleDelta(toAngle - fromAngle)
  const movement = lerpTo(0, delta, maxMovement)
  return fromAngle + movement
}

export function randomAngleAwayFromOrigin(minDelta: number, random = Math.random): number {
  return (random() * (Math.PI * 2 - minDelta * 2)) + minDelta
}

export function atan2(v: V2): number {
  return Math.atan2(v[1], v[0])
}

// in screen coords, top left origin, rotate clockwise
// in graph coords anticlockwise
export function rotate2(v: V2, angle: number): V2 {
  return [v[0] * Math.cos(angle) - v[1] * Math.sin(angle), v[0] * Math.sin(angle) + v[1] * Math.cos(angle)]
}

export function unsignedAngleBetween(va: V2, vb: V2): number {
  return Math.acos(dot2(normalize2(va), normalize2(vb)))
}

export function angleBetween(va: V2, vb: V2): number { // get the normalized angle delta between va and vb
  // that is, starting from va and rotating anticlockwise, what angle takes you to vb?
  return normalizeAngleDelta(atan2(vb) - atan2(va))
}

// XXX this is quite application specific and makes little sense
export function lineCoords(a: V2, b: V2, p: V2): V2 {
  // the x is the distance across the line segment, 0 is on the line
  // y is distance along it, 0..(dist between a and b)
  const dist = distance2(a, b)
  const tangent = normalize2(sub2(b, a))
  const normal: V2 = [-tangent[1], tangent[0]]
  const ballAlong = dot2(sub2(p, a), tangent)
  const ballX = dot2(sub2(p, a), normal)
  return [ballX, ballAlong]
}

export function orthogonalNeighbours(v: V2): V2[] {
  return [
    add2(v, [-1, 0]),
    add2(v, [1, 0]),
    add2(v, [0, -1]),
    add2(v, [0, 1]),
  ]
}

export function diagonalNeighbours(v: V2): V2[] {
  return [
    add2(v, [-1, -1]),
    add2(v, [1, 1]),
    add2(v, [1, -1]),
    add2(v, [-1, 1]),
  ]
}

export function allNeighbours(v: V2): V2[] {
  return [
    add2(v, [-1, 0]),
    add2(v, [1, 0]),
    add2(v, [0, -1]),
    add2(v, [0, 1]),
    add2(v, [-1, -1]),
    add2(v, [1, 1]),
    add2(v, [1, -1]),
    add2(v, [-1, 1]),
  ]
}

export function rasterDisc2(r: number): V2[] {
  if (r == 0) {
    return []
  }
  const r2 = r * r
  const result = []
  for (let y = Math.floor(-r); y <= Math.ceil(r); y++) {
    for (let x = Math.floor(-r); x <= Math.ceil(r); x++) {
      if (x * x + y * y <= r2) {
        result.push([x, y] as V2)
      }
    }
  }
  return result
}

export function greaterThan2(a: V2, b: V2): boolean {
  return a[0] > b[0] && a[1] > b[1]
}

export function greaterThanOrEqualTo2(a: V2, b: V2): boolean {
  return a[0] >= b[0] && a[1] >= b[1]
}

export function lessThan2(a: V2, b: V2): boolean {
  return a[0] < b[0] && a[1] < b[1]
}

export function lessThanOrEqualTo2(a: V2, b: V2): boolean {
  return a[0] <= b[0] && a[1] <= b[1]
}

export function pointInRect(v: V2, rect: Rect2): boolean {
  return v[0] >= rect[0] && v[0] <= rect[0] + rect[2] && v[1] >= rect[1] && v[1] <= rect[1] + rect[3]
}

export function within2(a: V2, low: V2, high: V2): boolean {
  return a[0] > low[0] && a[1] > low[1] && a[0] < high[0] && a[1] < high[1]
}

export function withinInclusive2(a: V2, low: V2, high: V2): boolean {
  return a[0] >= low[0] && a[1] >= low[1] && a[0] <= high[0] && a[1] <= high[1]
}

export function withinHalfInclusive2(v: V2, low: V2, high: V2): boolean {
  return (v[0] >= low[0] && v[0] < high[0]) &&
    (v[1] >= low[1] && v[1] < high[1])
}

export function raster2(v: V2, width: number): number {
  if (v[0] < 0 || v[1] < 0 || v[0] >= width) {
    console.warn('raster2 issue')
  }
  return v[0] + (v[1] * width)
}

export function invRaster2(i: number, width: number): V2 {
  return [i % width, (i / width) | 0]
}

export function raster2Fast(v: V2, widthBits: number): number {
  return v[0] | (v[1] << widthBits)
}

export function invRaster2Fast(i: number, widthBits: number): V2 {
  return [i & ((1 << widthBits) - 1), i >> widthBits]
}

export function rectOrigin2(r: Rect2): V2 {
  return [r[0], r[1]]
}

export function rectSize2(r: Rect2): V2 {
  return [r[2], r[3]]
}

export function expandRect2(r: Rect2, amount: V2): Rect2 {
  return [r[0] - amount[0], r[1] - amount[1], r[2] + amount[0] * 2, r[3] + amount[1] * 2]
}

export function rect2(origin: V2, size: V2): Rect2 {
  return [origin[0], origin[1], size[0], size[1]]
}

export function rectFromCenterHalfSize2(center: V2, halfSize: V2): Rect2 {
  return [center[0] - halfSize[0], center[1] - halfSize[0], halfSize[0] * 2, halfSize[1] * 2]
}

// returns a subset of a rect, made smaller by `amount` in `direction`
// great for progress bars, eg. for a 30% filled horizontal bar, call
// rectPart(r, [-1, 0], 0.3)
export function rectPart(r: Rect2, direction: V2, amount: number): Rect2 {
  if (eq2(direction, [-1, 0])) {
    return [r[0], r[1], r[2] * amount, r[3]]
  } else if (eq2(direction, [0, -1])) {
    return [r[0], r[1], r[2], r[3] * amount]
  } else if (eq2(direction, [1, 0])) {
    return [r[0] + r[2] * (1 - amount), r[1], r[2] * amount, r[3]]
  } else if (eq2(direction, [0, 1])) {
    return [r[0], r[1] + r[3] * (1 - amount), r[2], r[3] * amount]
  } else {
    throw new Error(`invalid direction ${direction}`)
  }
}

export function rectCenter2(r: [number, number, number, number]): V2 {
  return [r[0] + r[2] * 0.5, r[1] + r[3] * 0.5]
}

// inclusive
// size = max - min
export function rectAroundPoints2(points: V2[]): Rect2 | undefined {
  if (points.length == 0) {
    return undefined
  }
  let min = points[0] as V2
  let max = points[0] as V2
  for (const p of points) {
    min = min2(min, p)
    max = max2(max, p)
  }
  return rect2(min, sub2(max, min))
}

export function rasterRect2(r: Rect2, inclusive = false): V2[] {
  const result: V2[] = []
  for (let j = r[1]; j < r[1] + r[3] + (inclusive ? 1 : 0); j++) {
    for (let i = r[0]; i < r[0] + r[2] + (inclusive ? 1 : 0); i++) {
      result.push([i, j])
    }
  }
  return result
}


export function spiral2(size: number) {
  const res: [number, number][] = []
  let x = 0
  let y = 0
  let dx = 0
  let dy = -1
  for (let i = 0; i < size * size; i++) {
    res.push([x, y])
    if (x == y || (x < 0 && x == -y) || (x > 0 && x == 1 - y)) {
      [dx, dy] = [-dy, dx]
    }
    [x, y] = [x + dx, y + dy]
  }
  return res
}

export function adventures2(distance: number): V2[] {
  const res: V2[] = [[0, 0]]
  for (let i = 1; i < distance; i++) {
    for (const n of orthogonalNeighbours([0, 0])) {
      res.push(scale2(n, i))
    }
  }
  return res
}



export function random2(random = Math.random): V2 {
  return [
    random(),
    random()
  ]
}

export function randomIntV2(exclusiveUpperBound: V2, random = Math.random): V2 {
  return [
    (random() * exclusiveUpperBound[0]) | 0,
    (random() * exclusiveUpperBound[1]) | 0,
  ]
}

// yeah there are better ways of doing this
export function randomUnitDisc2(random = Math.random): V2 {
  let s = 1
  while (true) {
    const v: V2 = [random() * 2 - 1, random() * 2 - 1]
    if (lengthSquared2(v) < 1) {
      return v
    }
    s *= 0.9
    const w = scale2([random() * 2 - 1, random() * 2 - 1], s)
    if (lengthSquared2(w) < 1) {
      return w
    }
  }
}

// ////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////

// L2 - compress int V2s into the upper and lower 16 bits of a 32 bit int

// Define L2 as a type that represents a number. This is used for representing 2D coordinates in a compressed manner.
export type L2 = number;

/* These variables are constants that define certain properties of the 2D space represented by these L2 values:
 - w is the width of the world, or how many cells along the x-axis we can represent. It's equal to 32768 (1 << 15).
   - row is the number of cells in a single row. It's equal to 65536 (1 << 16).
   - wMask is used for bitwise operations that wrap around at the boundaries of the world, i.e., it masks off all bits above the highest 15 bits.
   - halfW is half the width of the world, useful for centering coordinates in the range -16384 to 16383. */
export const w = 1 << 15 // 32768
export const row = 1 << 16 // 65536
export const wMask = w - 1 // 32767
export const halfW = w >> 1 // 16384

// This function converts a V2 (a two-component vector) to an L2. The L2 value is calculated by shifting and bitwise OR operations on the components of the V2.
export function V2ToL2(v: V2): L2 {
  return ((v[1] + halfW) << 16) + (v[0] + halfW)
}

function _c(n: number): number {
  n = n | 0
  if (n < 0 || n >= wMask) {
    // console.log(n)
    throw new Error('bad')
  }
  return n
  // return (Math.max(0, n | 0), wMask)
}

// Similar to V2ToL2, but it also checks if the input values are within valid ranges and throws an error if they aren't.
export function safeV2ToL2(v: V2): L2 {
  return (_c(v[1] + halfW) << 16) + _c(v[0] + halfW)
}

// Converts an L2 back to a V2 by masking off the irrelevant bits and shifting them into their correct positions.
export function L2ToV2(l: L2): V2 {
  return [(l & wMask) - halfW, (l >> 16) - halfW]
}

export function l2(x: number, y: number) {
  return V2ToL2([x, y])
}

// ////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////

// HTML Elements

export function elementSize(elem: HTMLElement): V2 {
  const box = elem.getBoundingClientRect();
  return [box.width, box.height]
}

export function elementOrigin(elem: HTMLElement | HTMLElement[]): V2 { // crossbrowser version
  if (Array.isArray(elem)) {
    if (elem.length == 0) {
      throw new Error('oh no')
    }
    elem = elem[0] as HTMLElement
  }
  const box = elem.getBoundingClientRect();

  const body = document.body;
  const docEl = document.documentElement;

  const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
  const scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

  const clientTop = docEl.clientTop || body.clientTop || 0;
  const clientLeft = docEl.clientLeft || body.clientLeft || 0;

  const top = box.top + scrollTop - clientTop;
  const left = box.left + scrollLeft - clientLeft;

  return [Math.round(left), Math.round(top)]
}

export const getCoords = elementOrigin // legacy

export function measureElement(elem: HTMLElement | HTMLElement[]): Rect2 { // crossbrowser version
  if (Array.isArray(elem)) {
    if (elem.length == 0) {
      throw new Error('oh no')
    }
    elem = elem[0] as HTMLElement
  }
  const box = elem.getBoundingClientRect();

  const body = document.body;
  const docEl = document.documentElement;

  const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
  const scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

  const clientTop = docEl.clientTop || body.clientTop || 0;
  const clientLeft = docEl.clientLeft || body.clientLeft || 0;

  const top = box.top + scrollTop - clientTop;
  const left = box.left + scrollLeft - clientLeft;

  return [Math.round(left), Math.round(top), box.width, box.height]
}

export function getEventCoords(e: (MouseEvent | TouchEvent)): V2 {
  if (e instanceof MouseEvent) {
    return [e.clientX, e.clientY]
  } else if (e instanceof TouchEvent && e.changedTouches.length > 0) {
    return [e.changedTouches[0]!.clientX, e.changedTouches[0]!.clientY]
  }
  return [0, 0]
}

// XXX mess

export function towardsByOne2(from: V2, to: V2): V2 {
  const a: V2 = [...from]
  if (a[0] < to[0]) {
    a[0] += 1
  } else if (a[0] > to[0]) {
    a[0] -= 1
  }
  if (a[1] < to[1]) {
    a[1] += 1
  } else if (a[1] > to[1]) {
    a[1] -= 1
  }
  return a
}



export function linearTransform(smin: number, smax: number, dmin: number, dmax: number) {
  return {
    xform: (s: number) => ((s - smin) / (smax - smin)) * (dmax - dmin) + dmin,
    inverseXform: (d: number) => ((d - dmin) / (dmax - dmin)) * (smax - smin) + smin,
  }
}

export function linearTransform2(smin: V2, smax: V2, dmin: V2, dmax: V2) {
  return {
    xform: (s: V2) => add2(mul2(safeDivide2(sub2(s, smin), sub2(smax, smin)), sub2(dmax, dmin)), dmin),
    inverseXform: (d: V2) => add2(mul2(safeDivide2(sub2(d, dmin), sub2(dmax, dmin)), sub2(smax, smin)), smin),
  }
}

export function spriteSheetByCoords2(i: V2, spriteSize: number): { origin: V2, size: V2, bottomRight: V2 } {
  return {
    origin: scale2(i, spriteSize),
    size: splat2(spriteSize),
    bottomRight: scale2(add2(i, splat2(1)), spriteSize)
  }
}

export function spriteSheetByIndex2(index: number, spriteSize: number, sheetCellSideCount: number): { origin: V2, size: V2, bottomRight: V2 } {
  return spriteSheetByCoords2([index % sheetCellSideCount, Math.floor(index / sheetCellSideCount)], spriteSize)
}

export function sum2(vs: V2[]): V2 {
  let a: V2 = [0, 0]
  for (const v of vs)
    a = add2(a, v)
  return a
}

export function sum(vs: number[]): number {
  let a = 0
  for (const v of vs)
    a += v
  return a
}

export function product(vs: number[]): number {
  let a = 1
  for (const v of vs)
    a *= v
  return a
}


export function mean2(vs: V2[]): V2 {
  if (vs.length == 0)
    return [0, 0]
  return scale2(sum2(vs), 1 / vs.length)
}

export function orthoTransform2(rectA: Rect2, rectB: Rect2, p: V2): V2 {
  return [
    rectB[0] + rectB[2] * (p[0] - rectA[0]) / rectA[2],
    rectB[1] + rectB[3] * (p[1] - rectA[1]) / rectA[3],
  ]
}

export function neg2(v: V2): V2 {
  return [-v[0], -v[1]]
}

// limited 3D support

export type V3 = [number, number, number]

export function eq3(a: V3, b: V3): boolean {
  return a[0] == b[0] && a[1] == b[1] && a[2] == b[2]
}

export function add3(a: V3, b: V3): V3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
}

export function sub3(a: V3, b: V3): V3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
}

export function scale3(a: V3, s: number): V3 {
  return [a[0] * s, a[1] * s, a[2] * s]
}

export function lengthSquared3(a: V3): number {
  return a[0] * a[0] + a[1] * a[1] + a[2] * a[2]
}

export function length3(a: V3): number {
  return Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2])
}

export function distanceSquared3(a: V3, b: V3): number {
  const c = sub3(a, b)
  return c[0] * c[0] + c[1] * c[1] + c[2] * c[2]
}

export function distance3(a: V3, b: V3): number {
  const c = sub3(a, b)
  return Math.sqrt(c[0] * c[0] + c[1] * c[1] + c[2] * c[2])
}

export function randomUnitSphere3(): V3 {
  let s = 1.0
  while (true) {
    const v: V3 = [s * (Math.random() * 2 - 1), s * (Math.random() * 2 - 1), s * (Math.random() * 2 - 1)]
    s *= 0.95
    if (lengthSquared3(v) <= 1) {
      return v
    }
  }
}

// Extra stuff

export function leftmostFilledBit(n: number): number { // xxx check this
  n = Math.abs(n) | 0
  let q = 0
  while (n > 0) {
    q++
    n = n >> 1
  }
  return q
}

export function perturb2(v: V2, s: number): V2 {
  return add2(v, scale2(randomUnitDisc2(), s))
}

// Assuming V2, add2, sub2, scale2, length2, lengthSquared2, distance2, dot2, normalize2, clamp are available.
// These types and functions are part of the initial context.

/**
 * Interface representing the core result of a line segment-disc intersection test.
 */
interface LineSegmentDiscIntersectionResult {
  /** True if the line segment intersects (touches or passes through) the disc. */
  intersects: boolean;
  /**
   * Array of 0, 1, or 2 points where the segment crosses or touches the disc boundary.
   * If `intersects` is true but `intersectionPoints` is empty, it implies the entire segment
   * is contained within the disc (or one endpoint is exactly at the center and the other is inside).
   */
  intersectionPoints: V2[];
  /**
   * If the segment is penetrating the disc (i.e., some part of it is strictly inside),
   * this is the depth of the deepest penetration. Returns 0 if not penetrating (e.g., only touching).
   */
  penetrationDepth: number;
  /**
   * If the segment is penetrating the disc, this is the normal vector describing the
   * penetration. It points from the closest point on the segment to the disc's center.
   * Returns `[0,0]` if not penetrating.
   */
  penetrationNormal: V2;
}

/**
 * Epsilon value for floating-point comparisons to account for precision errors.
 */
const EPSILON = 1e-9;

/**
 * Finds the intersection of a line segment and a disc, returning essential information
 * for basic collision detection and response.
 *
 * @param p1 The start point of the line segment.
 * @param p2 The end point of the line segment.
 * @param discCenter The center of the disc.
 * @param discRadius The radius of the disc.
 * @returns An object detailing if and how the segment intersects the disc.
 */
export function lineSegmentDiscIntersection(
  p1: V2,
  p2: V2,
  discCenter: V2,
  discRadius: number
): LineSegmentDiscIntersectionResult {
  const segmentVec = sub2(p2, p1); // Vector from P1 to P2
  const segmentLengthSq = lengthSquared2(segmentVec);

  const intersectionPoints: V2[] = [];
  let closestPointOnSegment = p1; // Default for penetration calculations
  let distanceFromSegmentToCenter = distance2(p1, discCenter);

  // Handle degenerate segment (p1 == p2)
  if (segmentLengthSq < EPSILON) {
    const distSq = distanceSquared2(p1, discCenter);
    const dist = Math.sqrt(distSq);
    const isPenetrating = dist < discRadius - EPSILON;

    if (dist < discRadius + EPSILON) { // Touches or inside
      if (Math.abs(dist - discRadius) < EPSILON) {
        intersectionPoints.push(p1); // Point touches the disc boundary
      }
      return {
        intersects: true,
        intersectionPoints: intersectionPoints,
        penetrationDepth: isPenetrating ? discRadius - dist : 0,
        penetrationNormal: isPenetrating && dist > EPSILON ? normalize2(sub2(discCenter, p1)) : [0, 1], // Arbitrary normal if at center
      };
    } else {
      return {
        intersects: false,
        intersectionPoints: [],
        penetrationDepth: 0,
        penetrationNormal: [0, 0],
      };
    }
  }

  // Vector from disc center to P1
  const p1ToCenterVec = sub2(p1, discCenter);

  // Coefficients for the quadratic equation At^2 + Bt + C = 0
  const A = segmentLengthSq;
  const B = 2 * dot2(p1ToCenterVec, segmentVec);
  const C = lengthSquared2(p1ToCenterVec) - (discRadius * discRadius);

  const discriminant = B * B - 4 * A * C;

  // Find intersection points with the infinite line
  if (discriminant >= -EPSILON) { // Intersections exist (or tangent)
    const sqrtDiscriminant = Math.sqrt(Math.max(0, discriminant));
    const t1 = (-B - sqrtDiscriminant) / (2 * A);
    const t2 = (-B + sqrtDiscriminant) / (2 * A);

    // Check if t1 is on the segment and add intersection point
    if (t1 >= -EPSILON && t1 <= 1 + EPSILON) {
      intersectionPoints.push(add2(p1, scale2(segmentVec, clamp(t1, 0, 1))));
    }
    // Check if t2 is on the segment and distinct from t1
    if (discriminant > EPSILON && t2 >= -EPSILON && t2 <= 1 + EPSILON) {
      const p_t2 = add2(p1, scale2(segmentVec, clamp(t2, 0, 1)));
      if (intersectionPoints.length === 0 || distanceSquared2(intersectionPoints[0], p_t2) > EPSILON * EPSILON) {
        intersectionPoints.push(p_t2);
      }
    }
  }

  // --- Penetration Calculation (using closest point on segment to disc center) ---
  // Parameter 't' for the closest point on the *infinite* line to the disc center
  const tClosestOnLine = dot2(sub2(discCenter, p1), segmentVec) / segmentLengthSq;
  // Clamp 't' to [0, 1] to find the closest point on the *segment*
  const tOnSegment = clamp(tClosestOnLine, 0, 1);
  closestPointOnSegment = add2(p1, scale2(segmentVec, tOnSegment));
  distanceFromSegmentToCenter = distance2(closestPointOnSegment, discCenter);

  const isPenetrating = distanceFromSegmentToCenter < discRadius - EPSILON;
  const penetrationDepth = isPenetrating ? discRadius - distanceFromSegmentToCenter : 0;

  let penetrationNormal: V2 = [0, 0];
  if (isPenetrating && distanceFromSegmentToCenter > EPSILON) {
    penetrationNormal = normalize2(sub2(discCenter, closestPointOnSegment));
  } else if (isPenetrating && distanceFromSegmentToCenter <= EPSILON && discRadius > EPSILON) {
    // If closest point on segment is the disc center itself
    penetrationNormal = [0, 1]; // Arbitrary non-zero normal
  }

  // A segment intersects if it has boundary points, or if it's fully inside (no boundary points, but penetrating)
  const intersects = intersectionPoints.length > 0 || isPenetrating;

  return {
    intersects: intersects,
    intersectionPoints: intersectionPoints,
    penetrationDepth: penetrationDepth,
    penetrationNormal: penetrationNormal,
  };
}

// export function unitCirclePoints2(n: number): V2[] {
//   const points: V2[] = []
//   for (let i = 0; i < n; i++) {
//     const a = i / n * Math.PI * 2
//     points.push([Math.cos(a), Math.sin(a)])
//   }
//   return points
// }

export function circlePoints2(n: number, r = 1, c: V2 = [0, 0]): V2[] {
  return along(circlePath(r, c), n, 0, 1, true)
}

export function valuesBetween(count: number, min = 0, max = 1, loop = false) {
  const r = []
  if (loop)
    count += 1
  for (let i = 0; i < count; i++) {
    r.push(min + (i / Math.min(count - 1, 1)) * (max - min))
    if (loop && i == count - 2)
      break
  }
  return r
}

export function along<T>(func: (u: number) => T, count: number, min = 0, max = 1, loop = false) {
  return valuesBetween(count, min, max, loop).map(func)
}

export function linePath2(a: V2, b: V2) {
  return (u: number) => {
    return lerp2(a, b, u)
  }
}

export function circlePath(r = 1, c: V2 = [0, 0]) {
  return (u: number) => {
    return rotate2([r, 0], u * Math.PI * 2)
  }
}