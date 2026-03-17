import { parseModule, generateCode, builders, loadFile, writeFile } from "magicast";
import fs from 'vite-plugin-fs/browser';
export default async function () {
	const moo = fs.readFile("src/lib/test-dev/moo.ts")
	console.log(moo)
}