export interface HostApi {
	saveData: (data: any) => Promise<boolean>;
}
export interface ChildApi {
	updateStatus: (msg: string) => Promise<void>;
}