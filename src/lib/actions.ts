import type { Action } from 'svelte/action';

/** Counts up from 0 to `target` (keeping its decimals) once the element scrolls into view. */
export const counter: Action<HTMLElement, number> = (node, target) => {
	let timer: ReturnType<typeof setInterval> | undefined;

	const observer = new IntersectionObserver((entries) => {
		if (!entries[0].isIntersecting) return;
		observer.disconnect();

		const decimals = (String(target).split('.')[1] ?? '').length;
		// Page language decides the decimal separator (2.2 vs 2,2)
		const format = (n: number) =>
			n.toLocaleString(document.documentElement.lang || undefined, {
				minimumFractionDigits: decimals,
				maximumFractionDigits: decimals
			});
		const step = target / 200;
		let current = 0;
		timer = setInterval(() => {
			current += step;
			node.textContent = format(Math.min(current, target));
			if (current >= target) clearInterval(timer);
		}, 10);
	});
	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
			clearInterval(timer);
		}
	};
};

/** Parallax scrolling for an image (Ukiyo). */
export const parallax: Action<HTMLElement> = (node) => {
	let instance: import('ukiyojs').default | undefined;
	let destroyed = false;

	void import('ukiyojs').then(({ default: Ukiyo }) => {
		if (!destroyed) instance = new Ukiyo(node);
	});

	return {
		destroy() {
			destroyed = true;
			instance?.destroy();
		}
	};
};

/** Slides the container in from the left while the inner image slides from the right. */
export const reveal: Action<HTMLElement> = (node) => {
	let timeline: gsap.core.Timeline | undefined;
	let destroyed = false;

	void (async () => {
		const { gsap } = await import('gsap');
		const { ScrollTrigger } = await import('gsap/ScrollTrigger');
		if (destroyed) return;
		gsap.registerPlugin(ScrollTrigger);

		const image = node.querySelector('img');
		timeline = gsap.timeline({
			scrollTrigger: { trigger: node, toggleActions: 'restart none none reset' }
		});
		timeline.set(node, { autoAlpha: 1 });
		timeline.from(node, { duration: 1.5, xPercent: -100, ease: 'power2.out' });
		timeline.from(image, { duration: 1.5, xPercent: 100, scale: 1.3, delay: -1.5, ease: 'power2.out' });
	})();

	return {
		destroy() {
			destroyed = true;
			timeline?.scrollTrigger?.kill();
			timeline?.kill();
		}
	};
};
