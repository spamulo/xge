export * from './v2'
export * from './rand'
export * from './blob'

export function getAsset(path: string): string {
	if (!path) {
		throw new Error('getAsset wasn\'t passed a path')
	}
	return './vault/' + (window as any).gameName + '/' + path
}

export function removeItemOnce(arr: any[], value: any): any[] {
	const index = arr.indexOf(value);
	if (index > -1) {
		arr.splice(index, 1);
	}
	return arr;
}

export function formatDuration(ms: number, noSpace = false, terse = false, noMs = false) {
	ms = ms - 0
	const sp = noSpace ? '' : ' '
	const v = (ms < 0) ? '-' : ''
	ms = Math.abs(ms)
	const MS = ms % 1000
	const s = Math.floor((ms - MS) * 0.001)
	const S = s % 60
	const m = Math.floor((s - S) / 60)
	const M = m % 60
	const h = Math.floor((m - M) / 60)
	const H = h % 60
	const d = Math.floor((h - H) / 24)
	const D = d

	const z = (_s: number) => (_s + '').padStart(2, '0')
	let result
	if (terse) {
		if (D >= 1) {
			result = `${D}d${z(H)}`
		} else if (H >= 1) {
			result = `${H}h${z(M)}`
		} else if (M >= 1) {
			result = `${M}m${z(S)}`
		} else if (S >= 10) {
			result = `${(S)}s`
		} else if (S >= 2) {
			result = `${(S + MS * 0.001).toFixed(1)}s`
		} else if (S >= 1) {
			result = `${(S + MS * 0.001).toFixed(2)}s`
		} else {
			result = `${MS}ms`
		}
	} else {
		result = [D, H, M, S].filter(x => !!x).map(x => x + '').join(':')
		if (!noMs) {
			result = result + '.' + (MS + '').padStart(3, '0')
		}
	}
	return result
}

export function profile(targetFunc: (() => void)): number { // ms
	const t = Date.now()
	targetFunc()
	return Date.now() - t
}

export async function profileAsync(message: string, targetFunc: (() => Promise<void>)): Promise<number> {
	const t = Date.now()
	await targetFunc()
	return Date.now() - t
}

export function clamp(v: number, min = 0, max = 1) {
	return Math.min(Math.max(min, v), max)
}

(window as any).clamp = clamp

export function sortByMutates<T>(arr: T[], keyFunc: ((arg0: T) => any)): T[] {
	arr.sort((a: T, b: T) => {
		const [A, B] = [keyFunc(a), keyFunc(b)]
		if (A < B) {
			return -1
		} else if (!(A <= B)) { // account for screwy heterogeneous types
			return 1
		}
		return 0
	})
	return arr
}

// non-problematic CSVs only. no quoting, no commas or newlines in fields, no shinnanigens
export function parseCsv(data: string): string[][] {
	return data.split('\n').map(s => s.trim()).map(row => row.split(',').map(cell => {
		return cell
	}))
}

export async function loadCsvFromUrl(url: string): Promise<string[][]> {
	const response = await fetch(url)
	const text = await response.text()
	const csvLines = parseCsv(text)
	return csvLines
}

export async function loadTxtFromUrl(url: string): Promise<string[]> {
	const response = await fetch(url)
	const text = await response.text()
	const lines = text.split('\n')
	return lines
}

export function sleep(ms: number): Promise<void> {
	return new Promise<void>(resolve => setTimeout(resolve, ms))
}

export function manipulateChar(char: string, func: (s: number) => number) {
	return String.fromCharCode(func(char.charCodeAt(0)))
}

export function timeout(promise: any, ms: number) {
	return new Promise((resolve, reject) => {
		let resolved = false
		let rejected = false
		setTimeout(() => {
			if (!resolved) {
				rejected = true
				reject(new Error('timed out'))
			}
		}, ms)
		promise.then((result: any) => {
			if (!rejected) {
				resolved = true
				resolve(result)
			}
		})
	})
}

export function genId(): string {
	return (new Array(10)).fill(0).map(() => {
		return Math.floor(Math.random() * 256).toString(16)
	}).join('')
}
// //
export function uriSafeEncode(s: string) {
	return (btoa(s).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '~')).split('').reverse().join('')
}

// localStorage can throw errors causing boot to app boot to fail.
// report but catch errors and return null if the operation was not successful.
export function safeLocalStorageGet(key: string, defaultValue: string | null = null): string | null {
	try {
		const val = localStorage.getItem(key)
		if (val === 'null' || val === null) {
			console.warn('LocalStorage contained \'null\'')
			return defaultValue
		}
		return val
	} catch (e) {
		console.warn('LocalStorage get failed')
		console.error(e)
		return defaultValue
	}
}

export function safeLocalStorageSet(key: string, value: string): string | null {
	try {
		localStorage.setItem(key, value)
		return value
	} catch (e) {
		console.warn('LocalStorage set failed')
		console.error(e)
		return null
	}
}

export async function doAll(promises: any, serial = false) {
	promises = promises.filter((x: any) => x)
	if (serial) {
		const result = []
		for (const prom of promises) {
			result.push(await prom)
		}
		return result
	} else {
		return Promise.all(promises)
	}
}

export function $getAssetFilename(name: string) {
	const x = (window as any)._page_config
	if (x[name]) {
		return x[name]
	} else {
		throw new Error(`$getAssetFilename not found ${name}`)
	}
}

export function $getAssetPath(name: string) {
	const x = (window as any)._page_config
	if (x[name]) {
		return `vault/${(window as any).gameName}/${x[name]}`
	} else {
		throw new Error(`$getAssetFilename not found ${name}`)
	}
}

export function log(...args: any[]) {
	// XXX replace me with a super advanced logging system
	console.log(...args)
}

export const importTime = Date.now()

export function timeSinceImport() {
	return (Date.now() - importTime) * 0.001
}

export function showTime() {
	console.log('T +' + timeSinceImport())
}

// export function debugLog(...args: any[]) {
//   console.log(...args)
// }

export function localMode(): boolean {
	// !!(window.location.host.endsWith('.org.uk') ||
	return window.location.host.startsWith('localhost:') ||
		window.location.host.startsWith('127.0.0.1:') || window.location.host.startsWith('monolith:')
}

export function stagingMode(): boolean {
	return !!(window.location.host.endsWith('.org.uk') || window.location.host.startsWith('qa.'))
}

if (localMode()) {
	console.log("🧑‍💻 we are in localMode - hello :)")
}

if (stagingMode()) {
	console.log("🛋️ we are in staging")
}
(window as any).ubc = []

export const debugLog: typeof console.log = (localMode() || stagingMode()) ? console.log : ((s: any) => { (window as any).ubc.push(s) }) as any
// if  {
//   debugLog = console.log
// }

export function safeJSONParse(s: string) {
	try {
		return JSON.parse(s)
	} catch (e) {
		console.error(e)
		return null
	}
}

export function orError(value: any, errorStringFunc: () => string) {
	if (value) {
		return value
	} else {
		throw new Error(errorStringFunc())
	}
}

export function win(f: any) {
	(window as any)[f.name] = f
}

export type MinMaxResult<T> = {
	item: T,
	score: number,
	index: number,
}

export function maxBy<T>(arr: T[], scoreFunc: (t: T) => number): MinMaxResult<T> {
	if (arr.length == 0) {
		throw new Error('oh no')
	}
	let maxScore = scoreFunc(arr[0])
	let maxI = 0
	for (let i = 1; i < arr.length; i++) {
		const s = scoreFunc(arr[i])
		if (s > maxScore) {
			maxScore = s
			maxI = i
		}
	}
	return {
		item: arr[maxI],
		index: maxI,
		score: maxScore,
	}
}

export function minBy<T>(arr: T[], scoreFunc: (t: T) => number): MinMaxResult<T> {
	if (arr.length == 0) {
		throw new Error('oh no')
	}
	let minScore = scoreFunc(arr[0])
	let minI = 0
	for (let i = 1; i < arr.length; i++) {
		const s = scoreFunc(arr[i])
		if (s < minScore) {
			minScore = s
			minI = i
		}
	}
	return {
		item: arr[minI],
		index: minI,
		score: minScore,
	}
}



export function ofRange<T>(count: number, func: (i: number) => T): T[] {
	const result: T[] = []
	for (let i = 0; i < count; i++) {
		result.push(func(i))
	}
	return result
}
