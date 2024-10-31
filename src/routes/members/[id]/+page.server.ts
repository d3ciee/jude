import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals, params }) => {
    if (!locals.session) {
        error(401, {
            message: "Please login to access this page"
        });
    }

    // This is placeholder data - to be replaced with real service calls
    const props = {
        success: true,
        data: {
            member: {
                id: params.id,
                name: "John Doe",
                membershipNumber: "MEM123456",
                email: "john@example.com",
                claims: [
                    {
                        id: "CLM1",
                        status: "processing",
                        amount: 1200,
                        submittedDate: "2024-01-15",
                        type: "Medical",
                        progress: 65
                    },
                    {
                        id: "CLM2",
                        status: "completed",
                        amount: 800,
                        submittedDate: "2024-01-01",
                        type: "Dental",
                        progress: 100
                    }
                ],
                alerts: [
                    {
                        type: "warning",
                        message: "Increased cases of flu in your area",
                        date: "2024-01-20"
                    }
                ]
            }
        }
    };

    return {
        props
    };
});
