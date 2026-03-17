import { computed, MaybeRefOrGetter, Ref, ref, toValue, watch } from "vue"

export const _isNotifies = Symbol("isNotifies")
export const _isNotifiable = Symbol("isNotifiable")

export type Notifies<T> = {
	(handler: (arg0: T) => void, until?: Notifies<unknown>): () => void
} & IsNotifies

export type IsNotifies = {
	[_isNotifies]: true
}

// CORRECTED FUNCTION
export function isNotifies(n: unknown): n is Notifies<unknown> {
	// A valid notifier must be a function and have the symbol.
	// This robustly handles null, undefined, or other non-function values.
	return typeof n === 'function' && !!(n as any)[_isNotifies]
}

// CORRECTED FUNCTION
export function isNotifiable(n: unknown): n is Notifiable<unknown> {
	// A valid notifiable in our system is also a function with a symbol.
	return typeof n === 'function' && !!(n as any)[_isNotifiable]
}

export type IsNotifiable = {
	[_isNotifiable]: true
}

export type NotVoidNotifiable<T> = {
	trigger(arg0: T): void
} & IsNotifiable

export type VoidNotifiable = {
	trigger(): void
} & IsNotifiable

export type Notifiable<T> = ([T] extends [void] ? VoidNotifiable : NotVoidNotifiable<T>)

export type Notifier<T> = Notifies<T> & Notifiable<T>

export function notifier<T>(): Notifier<T> {
	const handlers: Set<(arg0: T) => void> = new Set()
	const on = function on(h: (arg0: T) => void, until?: Notifies<unknown>): () => void {
		handlers.add(h)
		const _off = () => {
			off(h)
		}
		if (until) {
			until(_off)
		}
		return _off
	}
	const off = function off(h: (arg0: T) => void): void {
		handlers.delete(h)
	}
	const trigger = function trigger(arg0: T) {
		for (const h of handlers) {
			h(arg0)
		}
	}
	Object.assign(on, {
		trigger, [_isNotifies]: true, [_isNotifiable]: true
	})
	return on as any // whatever
}

export function nextNotify<T>(n: Notifies<T>): Promise<T> {
	return new Promise(resolve => {
		const h = (t: T) => {
			resolve(t)
			off()
		}
		const off = n(h)
	})
}

export function notifierToRef<T>(startValue: T, notifies: Notifies<T>): Ref<T> {
	const r = ref(startValue)
	notifies((t) => {
		r.value = t
	})
	return r as any
}

export function refToNotifier<T>(r: MaybeRefOrGetter<T>): Notifies<T> {
	const notifies = notifier<T>()
	watch(() => toValue(r), newR => {
		notifies.trigger(newR)
	})
	return notifies
}

export function untriggerable<T>(n: Notifier<T>): Notifies<T> {
	// this is just a type guard
	return n
}

export interface Destroyable {
	readonly destroyNotifier: Notifies<void>;
	destroy(): void; // should call this.destroyNotifier.trigger()
	isDestroyed(): boolean
}

// example destroyable implementation, doesn't allow external
// triggering of the destroy notifier except by destroy()
class ExampleDestroyable implements Destroyable {
	private readonly _destroyNotifier: Notifier<void> = notifier<void>();
	public readonly destroyNotifier: Notifies<void> = this._destroyNotifier;
	private _isDestroyed = false
	public isDestroyed(): boolean {
		return this._isDestroyed
	}
	public destroy(): void {
		// do cleanup before notifying others
		this._destroyNotifier.trigger();
		// do cleanup after notifying others
		this._isDestroyed = true
	}
}