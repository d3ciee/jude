import { Claim } from '$lib/server/db/schema.js';

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

export type GptResponseType = GptAnalysisResponse | GptOcrResponse | GptProviderResponse | GptSocialProfilerResponse;



export type GptAnalysisResponse = {
    isValid: boolean,
    analysis: ClaimAnalysis | null;
}

export type GptOcrResponse = {
    extractedData: Record<string, string | number | boolean | null>;
    documentType: DocumentTypes;
    confidenceLevel: number;
    documentCount: number;
};

export type GptProviderResponse = {
    extractedData: {
        providerName: string;
        location: string;
        contactNumber: string;
        website: string;
        ratings: number;
        numberOfReviews: number;
        trustabilityScore: number;
        servicesOffered: string;
        accreditations: string;
        operatingHours: string;
        emergencyServices: boolean;
        affiliations: string;
        insuranceAccepted: string;
    };
    confidenceLevel: number;
};

export type GptSocialProfilerResponse = {
    extractedData: {
        fullName: string;
        birthDate: string;
        knownAliases: string;
        occupation: string;
        location: string;
        socialMediaHandles: {
            twitter: string;
            linkedin: string;
            facebook: string;
            instagram: string;
        };
        followersCount: number;
        publications: string;
        organizationAffiliations: string;
        notableAchievements: string;
        knownInterests: string;
        relatedPersons: string;
    };
    confidenceLevel: number;
};




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

export type Claim = {
    memberName: string;
    memberIntials: string;
    memberNumber: string;
    treatmentDate: number;
    patientName: string;
    amountCharged: number;
    tariff: number;
    providerName: string;
    providerAddress: string;
    providerContact: string;
}

export enum DocumentTypes {
    HospitalClaim = 'HospitalClaim',
    DiagnosticClaim = 'DiagnosticClaim',
    Prescription = 'Prescription',
    Invoice = 'Invoice',
    Receipt = 'Receipt',
    DoctorsNote = 'DoctorsNote',
    CostBreakdown = 'CostBreakdown',
    Unknown = 'Unknown'
}
