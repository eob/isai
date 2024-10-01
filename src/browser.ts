import { isai } from ".";

(function () {
	if (typeof globalThis === "object") {
		globalThis.isai = isai;
		return;
	}
	if (typeof window === "object") {
		window.isai = isai;
		return;
	}
	if (typeof global === "object") {
		global.isai = isai;
		return;
	}
	if (typeof self === "object") {
		self.isai = isai;
	}
})();
