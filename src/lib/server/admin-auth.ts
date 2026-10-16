import { ADMIN_NAME, ADMIN_PASSWORD } from '$app/env/private';
import { createHash, timingSafeEqual } from 'node:crypto';

export const adminCookie = 'mw_admin';

/** Nobody gets in until both the name and the password are set */
const configured = () => !!ADMIN_NAME?.trim() && !!ADMIN_PASSWORD;

/** The name is matched without regard to case or surrounding spaces */
const normalizeName = (name: string) => name.trim().toLowerCase();

/** What the session cookie holds: derived from the credentials, so changing either logs everyone out */
export const adminToken = () =>
	createHash('sha256').update(`mw-admin|${normalizeName(ADMIN_NAME ?? '')}|${ADMIN_PASSWORD}`).digest('hex');

function safeEqual(a: string, b: string) {
	const left = Buffer.from(a);
	const right = Buffer.from(b);
	return left.length === right.length && timingSafeEqual(left, right);
}

export function checkCredentials(name: string, password: string) {
	if (!configured()) return false;
	// Both are always compared, so the response time doesn't tell which one was wrong
	const nameOk = safeEqual(normalizeName(name), normalizeName(ADMIN_NAME!));
	const passwordOk = safeEqual(password, ADMIN_PASSWORD!);
	return nameOk && passwordOk;
}

export const isAdmin = (cookie: string | undefined) => configured() && !!cookie && safeEqual(cookie, adminToken());
