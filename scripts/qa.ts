import { exec, execSync, spawn } from 'child_process'
import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import slack from './slack'

import { build } from 'vite';
import { resolve } from 'path';
import { execute, formatDuration, formatFileSize, getGitCommitInfo, isGitClean } from './buildTools'


async function runBuild(gameName: string) {
	// 1. Set your Environment Variable natively
	// This is the equivalent of 'export MY_VAR=value'
	// const gameName = 'Game2'
	const t = Date.now()
	// look in packages for env packages to build
	const envFilePath = path.join('packages', `${gameName}.package`);
	let packageVars: Record<string, string> = {};
	if (fs.existsSync(envFilePath)) {
		const packageContent = fs.readFileSync(envFilePath, 'utf-8');
		packageContent.split('\n').forEach(line => {
			const [key, value] = line.split('=');
			if (key && value) {
				packageVars[key.trim()] = value.trim();
			}
		});
	}
	process.env.VITE_GAME_NAME = gameName || packageVars['VITE_GAME_NAME']
	if (packageVars['VITE_EXTRA_GAMES']) {
		process.env.VITE_EXTRA_GAMES = packageVars['VITE_EXTRA_GAMES']
	}

	const { hash } = await getGitCommitInfo()
	const outDir = `dist-auto/${gameName}_${hash}`

	try {
		await build({
			// 2. Pass your Vite config or overrides here
			configFile: resolve('./vite.config.js'),
			build: {
				outDir: outDir,
			},
			// 3. You can even pass env vars directly into the define block
			define: {
				__BUILD_TIME__: JSON.stringify(new Date().toISOString()),
			}
		});

		console.log('Build completed successfully!');
		const dt = Date.now() - t
		const t2 = Date.now()

		// zip and rsync to qa server
		await execute(`./deploy_qa.sh ${gameName}_${hash}`)
		var stats = await fs.promises.stat(`./dist-auto/${gameName}_${hash}.zip`)
		const zipSizeStr = formatFileSize(stats.size)
		const qaUrl = `https://qa.wearefreakgames.com/xge/${gameName}_${hash}`
		const zipUrl = `https://qa.wearefreakgames.com/xge/${gameName}_${hash}.zip`

		const dt2 = Date.now() - t2

		const msg = `:large_green_circle: xge qa build • \`${gameName}\` • :gear: ${formatDuration(dt, true, true)} • :cloud: ${formatDuration(dt2, true, true)}
${qaUrl}
${zipUrl} - ${zipSizeStr}`
		slack.sendMessage(msg)
	} catch (error) {
		console.error('Build failed:', error);
		process.exit(1);
	}
}

async function main() {
	if (!await isGitClean()) {
		console.log(chalk.redBright('GIT IS NOT CLEAN!'))
		console.log('commit changes before building')
		return
	}
	const gameNames = await fs.promises.readdir('./src/games')
	console.log(gameNames)
	let args = process.argv.slice(2)
	const gameArg = args[0]
	if (gameNames.includes(gameArg)) {
		await runBuild(gameArg)
	} else {
		for (let gn of gameNames) {
			const rx = new RegExp(gameArg)
			if (gn.search(rx) > -1) {
				console.log(`${gameArg} matched ${gn}`)
				await runBuild(gn)
			} else {
				console.log(`${gameArg} did not match ${gn}`)
			}
		}
	}

	console.log(args)
	console.log('qa build')

}

main()