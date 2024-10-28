
export interface User {
    id: string;
    email: string;
    name: string;
    passwordHash: string;
    createdAt: number;
}

export type Session = {
    id: string;
    userId: string;
    expiresAt: number;
    createdAt: number;
    userAgent: string | null;
    ipAddress: string | null;
}

export type Rule = {
    id: string;
    description: string;
    name: string;
    active: boolean;
    createdAt: number;
    createdBy: {
        name: string;
        email: string;
        id: string;
    };
}

export interface CreateRule {
    name: string;
    description: string;
}



export type GptResponse = {
    isValid: boolean,
    analysis: ClaimAnalysis | null;
}

export type ClaimAnalysis = {
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
}


export type GetListOfRules = {
    limit: number;
    offset: number;
}