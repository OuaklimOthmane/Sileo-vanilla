// sileo-vanilla documentation site: theme switch, copy buttons, Preview / Code tabs, "Try it" examples, sidebar.
(() => {
	const { toast, configure } = window.SileoVanilla;
	const root = document.documentElement;

	/* theme: remembered per visitor; the toasts follow it */
	const saved = (() => {
		try {
			return localStorage.getItem("sv-theme");
		} catch (e) {
			return null;
		}
	})();
	const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
	const setTheme = (t) => {
		root.dataset.theme = t;
		configure({ theme: t });
		try {
			localStorage.setItem("sv-theme", t);
		} catch (e) {
			/* private mode: fine */
		}
	};
	setTheme(saved || (prefersDark ? "dark" : "light"));
	// keep toasts at the top clear of the sticky header
	configure({ offset: { top: 64 } });
	document.querySelectorAll("[data-theme-toggle]").forEach((b) =>
		b.addEventListener("click", () => setTheme(root.dataset.theme === "dark" ? "light" : "dark"))
	);

	/* copy buttons */
	document.querySelectorAll("[data-copy]").forEach((b) =>
		b.addEventListener("click", () => {
			const text = b.dataset.copy || b.closest(".copy-wrap").querySelector("pre").innerText;
			navigator.clipboard.writeText(text).then(() => toast.success({ id: "copy", title: "Copied" }));
		})
	);

	/* Preview / Code tabs */
	document.querySelectorAll(".example").forEach((ex) => {
		const tabs = ex.querySelectorAll(".tabs button");
		tabs.forEach((t) =>
			t.addEventListener("click", () => {
				tabs.forEach((x) => x.classList.toggle("on", x === t));
				ex.querySelector(".pane").hidden = t.dataset.tab !== "preview";
				ex.querySelector("pre").hidden = t.dataset.tab !== "code";
			})
		);
	});

	/* examples: data-demo="name" runs window.demos[name] */
	document.addEventListener("click", (e) => {
		const b = e.target.closest("[data-demo]");
		if (b && window.demos && window.demos[b.dataset.demo]) window.demos[b.dataset.demo](b);
	});

	/* sidebar: highlight the section in view */
	const links = [...document.querySelectorAll(".side a[href^='#']")];
	if (links.length && "IntersectionObserver" in window) {
		const byId = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
		const io = new IntersectionObserver(
			(entries) => {
				for (const en of entries) {
					if (!en.isIntersecting) continue;
					links.forEach((a) => a.classList.remove("on"));
					const a = byId.get(en.target.id);
					if (a) a.classList.add("on");
				}
			},
			{ rootMargin: "-80px 0px -70% 0px" }
		);
		byId.forEach((_, id) => {
			const h = document.getElementById(id);
			if (h) io.observe(h);
		});
	}
})();
