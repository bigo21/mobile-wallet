// Small in-memory limiter: stops one visitor from flooding the inbox or using the
// presentation form to email strangers. Per server instance — good enough for a site
// like this; use a shared store (e.g. Redis) if it ever runs on many instances.
const hits = new Map<string, number[]>();

export function rateLimited(key: string, { max = 5, windowMs = 10 * 60 * 1000 } = {}) {
	const now = Date.now();
	const recent = (hits.get(key) ?? []).filter((time) => now - time < windowMs);
	recent.push(now);
	hits.set(key, recent);

	// Keep the map from growing forever
	if (hits.size > 5000) {
		for (const [k, times] of hits) if (times.every((time) => now - time >= windowMs)) hits.delete(k);
	}
	return recent.length > max;
}
