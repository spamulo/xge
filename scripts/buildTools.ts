import chalk from 'chalk'
import { exec, execSync, spawn } from 'child_process'
import stripAnsi from 'strip-ansi'


export function execute(cmd): Promise<string> {
	return new Promise((resolve) => {
		exec(cmd, (error, stdout, stderr) => {
			if (stderr.trim())
				console.log(stderr)
			resolve(stdout)
		})
	})
}

export async function isGitClean() {
	let res = await execute('git status --porcelain')
	return res.trim().length == 0
}

export function fileSizeStr(size: number) {
	if (!size) {
		return '0'
	}
	const i = Math.floor(Math.log(size) / Math.log(1024))
	return (size / Math.pow(1024, i)).toFixed(2) + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i]
}

export function ok(message) {
	console.error(chalk.green.bold('--OK-- ') + message)
}

export function warn(message) {
	console.error(chalk.yellow.bold('-WARN- ') + message)
}

export function info(message) {
	console.error(chalk.cyan.bold('-INFO- ') + message)
}

export function critical(message) {
	console.error(chalk.white.bold.bgRed('-CRIT- ' + message + ' '))
	process.exit(1)
}

export function heading(message) {
	message = chalk.magenta('### ') + message + chalk.magenta(' ###')
	let s = chalk.magenta((new Array(stripAnsi(message).length)).fill('#').join(''))
	console.log(s)
	console.log(message)
	console.log(s)
}

export async function getGitCommitInfo() {
	let x = await execute('git log --oneline')
	let lines = x.trim().split('\n')
	let hash = lines[0].split(' ')[0]
	let comment = lines[0].substr(lines[0].indexOf(' ') + 1)
	let count = lines.length
	return { hash, comment, count }
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


export function formatFileSize(size: number): string {
	if (!size) {
		return '0'
	}
	const i = Math.floor(Math.log(size) / Math.log(1024))
	return (size / Math.pow(1024, i)).toFixed(2) + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i]
}
