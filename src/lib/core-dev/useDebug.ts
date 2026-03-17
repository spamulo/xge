const debug = ref({
	environment: 'live' as 'live' | 'local' | 'qa'
})
const host = location.host.split(':')[0]
if (host == 'localhost') {
	debug.value.environment = 'local'
} else if (host.startsWith('qa.')) {
	debug.value.environment = 'qa'
}

export function useDebug() {
	return debug
}
