import { ref, onMounted, onUnmounted } from "vue";

export function useBridge<TLocal extends object, TRemote extends object>(
	localApi: TLocal,
	targetWindow: Window | null | (() => Window | null),
	origin: string = "*"
) {
	const isReady = ref(false);
	// Store resolvers by a unique callId
	const pendingCalls = new Map<string, { resolve: Function; reject: Function }>();

	const getTarget = () => (typeof targetWindow === "function" ? targetWindow() : targetWindow);

	const handleMessage = async (event: MessageEvent) => {
		if (origin !== "*" && event.origin !== origin) return;

		const { type, key, payload, callId } = event.data;

		if (type === "ACTION") {
			const fn = (localApi as any)[key];
			if (typeof fn === "function") {
				try {
					const result = await fn(...payload);
					getTarget()?.postMessage({ type: "ACTION_RES", callId, payload: result }, origin);
				} catch (err) {
					console.error(`Bridge error executing ${key}:`, err);
				}
			}
		}

		else if (type === "ACTION_RES") {
			const promise = pendingCalls.get(callId);
			if (promise) {
				promise.resolve(payload);
				pendingCalls.delete(callId);
			}
		}

		else if (type === "HANDSHAKE") {
			isReady.value = true;
			getTarget()?.postMessage({ type: "HANDSHAKE_ACK" }, origin);
		}

		else if (type === "HANDSHAKE_ACK") {
			isReady.value = true;
		}
	};

	const remote = new Proxy({} as TRemote, {
		get(_, key: string) {
			// Return a function that triggers the postMessage
			return (...args: any[]) => {
				return new Promise((resolve, reject) => {
					const callId = Math.random().toString(36).slice(2, 11);
					pendingCalls.set(callId, { resolve, reject });

					// Ensure args are serializable
					const safeArgs = JSON.parse(JSON.stringify(args));

					const target = getTarget();
					if (!target) return reject(new Error("Target window not found"));

					target.postMessage({
						type: "ACTION",
						key,
						payload: safeArgs,
						callId
					}, origin);
				});
			};
		}
	});

	onMounted(() => {
		window.addEventListener("message", handleMessage);
		// Ping the other side
		getTarget()?.postMessage({ type: "HANDSHAKE" }, origin);
	});

	onUnmounted(() => {
		window.removeEventListener("message", handleMessage);
	});

	return { remote, isReady };
}