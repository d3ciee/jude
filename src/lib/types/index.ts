// Entity Types
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

// DTOs
export interface CreateRule {
    name: string;
    description: string;
}

export type GetListOfRules = {
    limit: number;
    offset: number;
}