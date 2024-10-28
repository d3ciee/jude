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

const Claim = sqliteTable("types", {
    id: text("id").notNull().primaryKey(),
    createdAt: integer("created_at").notNull(),
    status: text("stage", { enum: ["pending", "approved", "rejected"] }).notNull(),
    procesingStep: text("processing_step", { enum: ["pending", "parsing-files", "checking-rules", "<WILL_ADD_MORE_LATER,CAN_ONLY_THINK_OF_THESE>"] }).notNull(),
    submittedBy: text("submitted_by", { enum: ["member", "provider"] }).notNull(),
    submissionChannel: text("submission_channel", { enum: ["portal", "email", "app"] }).notNull(),
})
type TClaim = typeof Claim.$inferSelect

const File = sqliteTable("files", {
    id: text("id").notNull().primaryKey(),
    createdAt: integer("created_at").notNull(),
    name: text("name").notNull(),
    fileStorageKey: text("file_storage_key").notNull().unique(),
    size: integer("size").notNull(),
    type: text("type").notNull(),
    claimId: text("claim_id").notNull().references(() => Claim.id)
})
type TFile = typeof File.$inferSelect


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
    rulesRelations,
    sessionRelations,
    fileRelations,
    claimRelations,

    type TClaim,
    type TFile

}
