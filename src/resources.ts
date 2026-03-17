// src/resources.ts
const modules = import.meta.glob(
	['./**/*.ts', './**/*.vue', './**/*.webp', '!./resources.ts', '!./main.ts'],
	{ eager: false } // Default is false
);

let cache: any = null;

export async function getResources() {
	if (cache) return cache;

	const tree: any = {};

	// 1. Trigger all imports in parallel and wait for them
	const paths = Object.keys(modules);
	const loadedModules = await Promise.all(paths.map((path) => modules[path]()));

	// 2. Build the tree
	paths.forEach((path, index) => {
		const mod = loadedModules[index] as any;
		const cleanPath = path.replace(/^\.\//, '').replace(/\.(ts|vue|webp)$/, '');
		const parts = cleanPath.split('/');

		let current = tree;
		parts.forEach((part, i) => {
			if (i === parts.length - 1) {
				current[part] = mod?.default || mod;
			} else {
				current[part] = current[part] || {};
				current = current[part];
			}
		});
	});

	cache = tree;
	return tree;
}