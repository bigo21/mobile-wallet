// Side-effect stylesheet imports resolved through package `exports`
declare module 'swiper/css';
// `?inline` asset imports resolve to a base64 data URL
declare module '*.pdf?inline' {
	const dataUrl: string;
	export default dataUrl;
}
