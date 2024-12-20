// See https://svelte.dev/docs/kit/types#app.d.ts

import type AuthService from "$lib/services/auth";

// for information about these interfaces
declare global {
	type Result<T> = {
		success: true;
		data: T;
	} | {
		success: false;
		error: string;
	};


	namespace App {
		type RequestContext = {
			userId: string;
			requestId: string;
		}
		interface Locals {
			db: import("$lib/server/db").DB;
			logger: import("winston").Logger;
			session?: import("$lib/types").Session;
			services: {
				rules: import("$lib/server/services/rules").default;
				claims: import("$lib/server/services/claims").default;
				oai: import("$lib/server/services/oai").default;
				audit: import("$lib/server/services/audit").default;
			}
			providers: {
				storage: import("$lib/server/providers/storage").default;
				email: import("$lib/server/providers/email").default;
				whatsapp: import("$lib/server/providers/whatsapp").default;
			}
		}
	}
}

export { };
