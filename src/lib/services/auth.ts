import type { DB } from "$lib/infra/db";
import { Session, User } from "$lib/infra/db/schema";
import genId from "$lib/utils/gen-id";
import type winston from "winston";
import bcrypt from "bcryptjs";
import { isDuplicateKeyError } from "$lib/infra/db/helpers";

class AuthService {
    private db: DB;
    private logger: winston.Logger;

    public static SESSION_EXPIRES_IN_MS = 1_000 * 60 * 60 * 24 * 365

    public static ERR_SESSION_NOT_FOUND = "You are not logged in"
    public static ERR_UNEXPECTED = "An error occured.  Please try again later"
    public static ERR_ACCOUNT_WITH_EMAIL_ALR_EXISTS = "An account with that email already exists"
    public static ERR_INVALID_EMAIL = "The email you entered is invalid"
    public static ERR_WEAK_PASSWORD = "Your password is too weak.  Choose a password greater than 8 characters"

    constructor(db: DB, logger: winston.Logger) {
        this.db = db;
        this.logger = logger;
    }

    public async signup(params: {
        name: string;
        email: string;
        password: string;

        userAgent: string | null;
        ipAddress: string | null;
    }): Promise<ServiceMethodOutput<{ userId: string; sessionId: string }>> {
        if (!AuthService.isEmailValid(params.email)) return {
            isSuccess: false,
            message: AuthService.ERR_INVALID_EMAIL
        }
        if (!AuthService.isPasswordValid(params.password)) return {
            isSuccess: false,
            message: AuthService.ERR_WEAK_PASSWORD
        }

        const userId = genId();
        const sessionId = genId();

        try {
            const passwordHash = bcrypt.hashSync(params.password, 10);

            await this.db.batch([
                this.db.insert(User).values({
                    id: userId,
                    createdAt: Date.now(),
                    name: params.name,
                    email: params.email,
                    passwordHash,
                }),

                this.db.insert(Session).values({
                    id: sessionId,
                    userId,
                    createdAt: new Date(),
                    expiresAt: new Date(Date.now() + AuthService.SESSION_EXPIRES_IN_MS),
                    userAgent: params.userAgent,
                    ipAddress: params.ipAddress
                })
            ])
        }
        catch (e) {
            if (isDuplicateKeyError(e, User.email))
                return {
                    isSuccess: false,
                    message: AuthService.ERR_ACCOUNT_WITH_EMAIL_ALR_EXISTS
                }
            this.logger.error("Failed to signup user", e)
            return { isSuccess: false, message: AuthService.ERR_UNEXPECTED };
        }

        return {
            isSuccess: true,
            data: { userId, sessionId }
        }
    }


    private static isEmailValid(email: string): boolean {
        return true
    }
    private static isPasswordValid(email: string): boolean {
        return true
    }

}

export default AuthService