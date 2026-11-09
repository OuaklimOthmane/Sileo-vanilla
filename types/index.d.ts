// Types for sileo-vanilla. (c) 2026 Ouaklim Othmane, MIT.

export type ToastState = "success" | "loading" | "error" | "warning" | "info" | "action";
export type ToastPosition = "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right";
export type ToastTheme = "light" | "dark" | "system";

/** Plain text, a DOM node, or `{ html }` for markup you wrote yourself (never pass user input as html). */
export type ToastContent = string | Node | { html: string };

export interface ToastButton {
	title: string;
	onClick?: (event: MouseEvent) => void;
	/** Filled with the state colour (in a `buttons` row). */
	primary?: boolean;
}

export interface ToastStyles {
	/** Extra classes for the title. */
	title?: string;
	/** Extra classes for the description area. */
	description?: string;
	/** Extra classes for the round icon badge. */
	badge?: string;
	/** Extra classes for the action button. */
	button?: string;
}

export interface ToastOptions {
	/** Toasts with the same id replace each other with a morph. Default: one shared id, so one toast at a time. */
	id?: string;
	/** Short title shown in the pill. Defaults to the state name. */
	title?: ToastContent;
	/** Details that unfold below the pill. */
	description?: ToastContent;
	/** Action button inside the unfolded card. */
	button?: ToastButton;
	/** Several buttons side by side (e.g. "Cancel" and a primary "Delete"). Takes over `button`. */
	buttons?: ToastButton[];
	/** Milliseconds before the toast leaves (default 6000). `null` keeps it until dismissed. */
	duration?: number | null;
	position?: ToastPosition;
	/** Badge icon: an SVG / HTML string or a DOM node. */
	icon?: string | Node;
	/** Toast colour (any SVG fill). Default: from the theme. */
	fill?: string;
	/** Corner radius in px (default 16). Higher values make the gooey blur more expensive. */
	roundness?: number;
	/** Unfold and fold timings in ms, or `false` to unfold only on hover. `collapse: false` keeps it open once
	 * unfolded, even when the mouse leaves (for a question waiting for an answer). */
	autopilot?: false | { expand?: number; collapse?: number | false };
	/** Extra class on the toast element. */
	className?: string;
	styles?: ToastStyles;
	/** Called once the toast has left the screen. */
	onDismiss?: (id: string) => void;
}

export interface ShowOptions extends ToastOptions {
	type?: ToastState;
}

export interface PromiseOptions<T = unknown> {
	id?: string;
	position?: ToastPosition;
	loading: ToastOptions;
	success?: ToastOptions | ((data: T) => ToastOptions);
	error?: ToastOptions | ((error: unknown) => ToastOptions);
	/** Turn the result into an action toast instead of a success toast. */
	action?: ToastOptions | ((data: T) => ToastOptions);
}

export interface ToastApi {
	show(options: ShowOptions): string;
	success(options?: ToastOptions): string;
	error(options?: ToastOptions): string;
	warning(options?: ToastOptions): string;
	info(options?: ToastOptions): string;
	action(options?: ToastOptions): string;
	/** One toast for a slow task: loading, then success / action or error. Returns the original promise. */
	promise<T>(promise: Promise<T> | (() => Promise<T>), options: PromiseOptions<T>): Promise<T>;
	dismiss(id?: string): void;
	/** Remove every toast at once, or only those at one position. */
	clear(position?: ToastPosition): void;
}

export interface ToasterSettings {
	/** Default position of new toasts (default "top-right"). */
	position?: ToastPosition;
	/** Distance from the screen edges: px number, CSS length, or per side. */
	offset?: number | string | { top?: number | string; right?: number | string; bottom?: number | string; left?: number | string };
	/** "light" (dark toasts, default), "dark" (light toasts) or "system". */
	theme?: ToastTheme;
	/** Defaults merged into every toast. */
	options?: ToastOptions;
	/** Add the stylesheet automatically on first use (default true). Set false and link `sileo-vanilla/styles.css` yourself. */
	injectStyles?: boolean;
}

export declare const toast: ToastApi;
/** Same object as `toast`, under Sileo's name. */
export declare const sileo: ToastApi;
export declare function configure(settings?: ToasterSettings): Required<Omit<ToasterSettings, "offset">> & Pick<ToasterSettings, "offset">;
export default toast;
