
export interface User {
    id: string;
    email: string;
    name: string;
    passwordHash: string;
    createdAt: number;
}

export interface Session {
    id: string;
    userId: string;
    expiresAt: number;
    createdAt: number;
    userAgent: string | null;
    ipAddress: string | null;
}

export interface Rule {
    id: string;
    description: string;
    name: string;
    active: boolean;
    createdAt: number;
    createdBy: string;
}

export interface CreateRule {
    name: string;
    description: string;
}

export interface ClaimAnalysis {
    isValid: boolean;
    analysis: {
        claimant: {
            name: string;
            age: number;
        };
        claimDetails: {
            submissionDate: string;
            treatmentType: string;
            healthcareProvider: string;
            claimAmount: number;
            location: string;
            supportingDocuments: string;
        };
        fraudDetection: {
            trustabilityScore: number;
            flags: string[];
        };
        ruleViolations: {
            rule: string;
            description: string;
        }[];
        metrics: {
            estimatedPayoutTime: string;
            missingInformation: string[];
            potentialSavings: number;
            humanInterventionRequired: boolean;
        };
    } | null;
}
