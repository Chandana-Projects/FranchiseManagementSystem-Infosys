-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "acknowledged_at" TIMESTAMP(6),
ADD COLUMN     "channel" VARCHAR(20),
ADD COLUMN     "deep_link_url" VARCHAR(255),
ADD COLUMN     "escalated" BOOLEAN DEFAULT false,
ADD COLUMN     "escalated_at" TIMESTAMP(6),
ADD COLUMN     "is_acknowledged" BOOLEAN DEFAULT false,
ADD COLUMN     "priority" VARCHAR(10) DEFAULT 'low',
ADD COLUMN     "recipient_role" VARCHAR(30),
ADD COLUMN     "recipient_user_id" INTEGER,
ADD COLUMN     "resolved" BOOLEAN DEFAULT false,
ADD COLUMN     "resolved_at" TIMESTAMP(6),
ADD COLUMN     "sla_minutes" INTEGER DEFAULT 30,
ALTER COLUMN "is_read" DROP NOT NULL;

-- CreateTable
CREATE TABLE "escalations" (
    "escalation_id" SERIAL NOT NULL,
    "notification_id" INTEGER NOT NULL,
    "escalated_to_role" VARCHAR(30),
    "escalated_to_user" INTEGER,
    "reason" TEXT,
    "sent_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "acknowledged_at" TIMESTAMP(6),

    CONSTRAINT "escalations_pkey" PRIMARY KEY ("escalation_id")
);

-- CreateTable
CREATE TABLE "action_plans" (
    "plan_id" SERIAL NOT NULL,
    "notification_id" INTEGER,
    "outlet_id" INTEGER,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "priority" VARCHAR(10) DEFAULT 'medium',
    "status" VARCHAR(20) DEFAULT 'open',
    "assigned_to" INTEGER,
    "due_date" DATE,
    "created_by" INTEGER,
    "evidence_url" VARCHAR(500),
    "comments" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMP(6),

    CONSTRAINT "action_plans_pkey" PRIMARY KEY ("plan_id")
);

-- CreateTable
CREATE TABLE "notification_rules" (
    "rule_id" SERIAL NOT NULL,
    "event_type" VARCHAR(50) NOT NULL,
    "priority" VARCHAR(10) NOT NULL,
    "channels" TEXT[],
    "sla_minutes" INTEGER NOT NULL DEFAULT 30,
    "auto_escalate" BOOLEAN NOT NULL DEFAULT true,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_rules_pkey" PRIMARY KEY ("rule_id")
);

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "fk_notification_user" FOREIGN KEY ("recipient_user_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "escalations" ADD CONSTRAINT "fk_escalation_notification" FOREIGN KEY ("notification_id") REFERENCES "notifications"("notification_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "action_plans" ADD CONSTRAINT "fk_plan_outlet" FOREIGN KEY ("outlet_id") REFERENCES "outlets"("outlet_id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "action_plans" ADD CONSTRAINT "fk_plan_assignee" FOREIGN KEY ("assigned_to") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "action_plans" ADD CONSTRAINT "fk_plan_creator" FOREIGN KEY ("created_by") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE NO ACTION;
