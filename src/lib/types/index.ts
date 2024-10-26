// Entity Types
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

// DTOs
export interface CreateRule {
    name: string;
    description: string;
}
