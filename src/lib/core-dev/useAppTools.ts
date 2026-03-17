import type { AppTools } from "@/App.vue";
export function useAppTools() {
	return inject("appTools") as AppTools
}