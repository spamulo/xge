// rand.ts - extra random utilities, see also gel/rng

export function randInt(exclusiveUpperBound: number): number {
  // random number between [0, exclusiveUpperBound - 1] inclusive :)
  return ((Math.random() * 0xFFFFFF) | 0) % (exclusiveUpperBound)
}

export function randRange(lowerBound: number, upperBound: number): number {
  return lowerBound + Math.random() * (upperBound - lowerBound)
}

export function randomChoice<T>(arr: Array<T>): T | null {
  if (arr.length === 0) {
    return null
  }
  return arr[Math.floor(Math.random() * arr.length)]
}

export function randomChoiceNotEmpty<T>(arr: Array<T>): T {
  if (arr.length === 0) {
    throw new Error('can\'t select random element - array empty')
  }
  return arr[Math.floor(Math.random() * arr.length)]
}

export function shuffleMutates<T>(ar: T[]): T[] {
  for (let i = ar.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ar[i], ar[j]] = [ar[j], ar[i]];
  }
  return ar;
}


export function randomChoiceNoReplace<T>(arr: Array<T>, count: number): T[] {
  const a = shuffleMutates([...arr])
  return a.slice(0, count)
}

// a seedable pseudo RNG
export function xoshiro128ss(a: number, b: number, c: number, d: number) {
  return function () {
    // es-lint-disable-next-line
    const t = b << 9
    let r = b * 5;
    r = (r << 7 | r >>> 25) * 9;
    c ^= a;
    d ^= b;
    b ^= c;
    a ^= d;
    c ^= t;
    d = d << 11 | d >>> 21;
    return (r >>> 0) / 4294967296;
  }
}

export type PRNG = {
  random(): number
}
const prng: PRNG = { random: xoshiro128ss(12345, 858281, 38377, 9417285) } // seeded rng

export function makePrng(seed: string | number): PRNG {
  const a = [84729471, 53858616, 81828592, 54839211]
  if (typeof seed == 'number')
    a[0] = (a[0] ^ seed) | 0
  else {
    for (let i = 0; i < seed.length; i++) {
      a[i % 4] ^= (i ^ 255) * seed.charCodeAt(i)
    }
  }
  const p = { random: xoshiro128ss(a[0], a[1], a[2], a[3]) }
  for (let i = 0; i < 20; i++)
    p.random()
  return p
}
