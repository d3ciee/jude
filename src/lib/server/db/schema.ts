import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

const User = sqliteTable("user", {
    id: text("id").notNull().primaryKey(),
    email: text("email").notNull().unique(),
    name: text("name").notNull(),
    passwordHash: text("password_hash").notNull(),
    createdAt: integer("created_at").notNull()
})

const Session = sqliteTable("session", {
    id: text("id").notNull().primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => User.id),
    expiresAt: integer("expires_at").notNull(),
    createdAt: integer("created_at").notNull(),
    userAgent: text("user_agent"),
    ipAddress: text("ip_address")
});

const sessionRelations = relations(Session, ({ one }) => ({
    user: one(User, {
        fields: [Session.userId],
        references: [User.id]

    })
}))

const Rule = sqliteTable("rules", {
    id: text("id").notNull().primaryKey(),
    description: text("description").notNull(),
    name: text("name").notNull().unique(),
    active: integer({ mode: 'boolean' }).notNull(),
    createdAt: integer("created_at").notNull(),
    createdBy: text("created_by").notNull().references(() => User.id)
});

const rulesRelations = relations(Rule, ({ one }) => ({
    createdBy: one(User, {
        fields: [Rule.createdBy],
        references: [User.id]
    })
}))

const WhatsappSession = sqliteTable("whatsapp_session", {
    id: text("id").notNull().primaryKey(),
    createdAt: integer("created_at").notNull(),
    msisdn: text("msisdn").notNull(),
    step: integer("step").default(0),
    status: text("status", { enum: ["active", "inactive"] }).notNull(),
    memberNumber: text("member_number"),
})

const Claim = sqliteTable("claim", {
    id: text("id").notNull().primaryKey(),
    createdAt: integer("created_at").notNull(),
    status: text("stage", { enum: ["pending", "approved", "rejected"] }).notNull(),
    procesingStep: text("processing_step", { enum: ["pending", "parsing-files", "fetching-social-profile", "fetching-provider-profile"] }).notNull(),
    submittedBy: text("submitted_by", { enum: ["member", "provider"] }).notNull(),
    submissionChannel: text("submission_channel", { enum: ["portal", "email", "app"] }).notNull(),
    membershipNumber: text("membership_number").notNull(),

    socialProfile: text("social_profile", { mode: "json" }),
    socialProfileConfidence: text("social_profile_confidence"),

    providerProfile: text("provider_profile", { mode: "json" }),
    providerProfileConfidence: text("provider_profile_confidence"),

    costAnalysis: text("cost_analysis", { mode: "json" }),
    costAnalysisConfidence: text("cost_analysis_confidence"),

    analysis: text("analysis", { mode: "json" }),

    metadata: text("metadata", { mode: "json" })
})
type TClaim = typeof Claim.$inferSelect

const File = sqliteTable("files", {
    id: text("id").notNull().primaryKey(),
    createdAt: integer("created_at").notNull(),
    name: text("name").notNull(),
    fileStorageKey: text("file_storage_key").notNull().unique(),
    size: integer("size").notNull(),
    type: text("type").notNull(),

    // @manasseh: we can fill this with the parsed data so i can use it in the claims page
    // Just make it a Record<string,primitive> so i can Object.entries it inside the claims page
    extractedData: text("extracted_data", { mode: "json" }),
    extractedDataConfidence: text("extracted_data_confidence"),


    claimId: text("claim_id").notNull().references(() => Claim.id)
})
type TFile = typeof File.$inferSelect


const AuditLog = sqliteTable("audit_log", {
    id: text("id").notNull().primaryKey(),
    createdAt: integer("created_at").notNull(),
    userId: text("user_id").notNull().references(() => User.id),
    action: text("action").notNull(),
    details: text("details").notNull()
})

const auditLogRelations = relations(AuditLog, ({ one }) => ({
    user: one(User, {
        fields: [AuditLog.userId],
        references: [User.id]
    })
}))

const fileRelations = relations(File, ({ one }) => ({
    claim: one(Claim, {
        fields: [File.claimId],
        references: [Claim.id]
    })
}))
const claimRelations = relations(Claim, ({ one, many }) => ({
    files: many(File)
}))

export {
    User,
    Session,
    Rule,
    Claim,
    File,
    AuditLog,
    WhatsappSession,
    rulesRelations,
    auditLogRelations,
    sessionRelations,
    fileRelations,
    claimRelations,

    type TClaim,
    type TFile

}
