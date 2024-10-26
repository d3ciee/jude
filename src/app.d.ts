// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			db: import("$lib/infra/db").DB;
			logger: import("winston").Logger;
			services: {
				rules: import("$lib/services/rules").default;
			}

		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export { };
