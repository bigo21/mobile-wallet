import { ADMIN_PASSWORD } from '$app/env/private';
import { createHash, timingSafeEqual } from 'node:crypto';

export const adminCookie = 'mw_admin';

/** What the session cookie holds: derived from the password, so changing it logs everyone out */
export const adminToken = () => createHash('sha256').update(`mw-admin|${ADMIN_PASSWORD}`).digest('hex');

function safeEqual(a: string, b: string) {
	const left = Buffer.from(a);
	const right = Buffer.from(b);
	return left.length === right.length && timingSafeEqual(left, right);
}

/** No password set means nobody gets in */
export const checkPassword = (input: string) => !!ADMIN_PASSWORD && safeEqual(input, ADMIN_PASSWORD);

export const isAdmin = (cookie: string | undefined) => !!ADMIN_PASSWORD && !!cookie && safeEqual(cookie, adminToken());
