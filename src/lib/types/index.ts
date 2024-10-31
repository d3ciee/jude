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

export type GptResponseType = GptOcrResponse | GptProviderResponse | GptSocialProfilerResponse | GptCostAnalysisResponse | GptClaimAnalysisResponse;

export type GptCostAnalysisResponse = {
    costAnalysis: {
        totalCost: number;
        breakdown: {
            consultation: number;
            medication: number;
            procedures: number;
            laboratory: number;
            other: number;
        };
        reasonableness: {
            score: number;
            concerns: string[];
            recommendations: string[];
        };
        marketComparison: {
            percentileRank: number;
            averageCost: number;
            variance: number;
        };
        flags: {
            overpriced: boolean;
            missingItems: boolean;
            inconsistencies: boolean;
        };
    };
    confidenceLevel: number;
};



export type GptOcrResponse = {
    extractedData: {};
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
        avatar: string;
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




export type GptClaimAnalysisResponse =
    {
        memberNumber: string;
        patientName: string;
        providerName: string;
        claimAmount: number;
        approvedAmount: number;
        rejectedAmount: number;
        verdict: 'approved' | 'partially approved' | 'rejected';
        flags: { type: string; description: string; severity: 'low' | 'medium' | 'high' }[];
        ruleViolations: { ruleId: string; description: string; impact: 'low' | 'medium' | 'high'; suggestedResolution: string }[];
        metrics: {
            processingTime: number;
            numberOfServices: number;
            averageServiceCost: number;
            totalAmountClaimed: number;
            totalAmountApproved: number;
            totalAmountRejected: number;
            supportingDocumentsReviewed: number;
            missingSupportingDocuments: string[];
        };
        adjustments: { adjustmentType: string; description: string; amountAdjusted: number }[];
        breakdown: { serviceLine: number; serviceDescription: string; claimedAmount: number; approvedAmount: number; rejectedAmount: number; notes?: string }[];
        paymentDetails: { payableAmount: number; reason: string; paymentStatus: 'pending' | 'processed' | 'rejected'; expectedPaymentDate: string };
        humanInterventionRequired: boolean;
        summary: string;
    }


export type GetListOfRules = {
    limit: number;
    offset: number;
}

export type ClaimDoc = {
    // Member/Patient Information
    bankCode?: string; // Example: CIMAS, ENG, GENHEALTH, etc.
    planCode?: string; // Specific code for plan type if applicable
    membershipNumber: string; // Membership number of the claimant
    memberName: string; // Name of the main member (parent/guardian if applicable)
    patientName: string; // Patient's name as indicated on the form
    patientRelationship: string; // Relationship of the patient to the member
    patientDateOfBirth?: string; // Date of birth of the patient (optional, if available)

    postalAddress?: string; // Postal address of the member
    contactNumber?: string; // Contact telephone number

    treatmentDate: string; // Date of treatment (format: dd/mm/yyyy)
    claimDate?: string; // Date the claim was submitted (if different from treatment date)
    claimStatus?: string; // Status of claim processing (e.g., 'Pending', 'Approved', 'Rejected')
    isAccidentRelated?: boolean; // Whether the treatment was due to an accident
    accidentType?: string; // If accident, type of accident (e.g., Road Traffic Accident, Accident at Work)

    providerName: string; // Name of the healthcare provider or institution
    providerContact?: string; // Contact details for the provider
    providerStamp: boolean; // Whether the provider's official stamp is present
    providerSignature: boolean; // Whether the provider's official signature is present

    referringPractitioner?: string; // Name of referring doctor (if specialist referral)

    // Service/Itemized Charges
    services: {
        lineNumber: number;
        tariffNumber: number;
        modifiers?: string; // Additional service codes or modifiers if applicable
        quantity: number; // Quantity of services provided
        year: number; // Year of service
        month: number; // Month of service
        days: number; // Days of service if inpatient
        feeCharged: number; // Fee charged for the service
    }[];

    grossAmountClaimed: number; // Gross amount being claimed

    diagnosisCode?: string; // Code for primary diagnosis if provided
    diagnosisDescription?: string; // Description of diagnosis

    // Additional Notes/Flags
    additionalNotes?: string; // Any additional information provided in the claim form
    flaggedForReview?: boolean; // Flag indicating whether the claim needs manual review
};


export enum DocumentTypes {
    Claim = 'Claim',
    Prescription = 'Prescription',
    Invoice = 'Invoice',
    Receipt = 'Receipt',
    DoctorsNote = 'DoctorsNote',
    CostBreakdown = 'CostBreakdown',
    Unknown = 'Unknown'
}
