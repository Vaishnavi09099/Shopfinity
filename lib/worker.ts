import { Worker } from "bullmq";
import { redisConnection } from "@/lib/redis";
import { sendOrderStatusEmail, sendVendorStatusEmail } from "@/lib/mailer";
import type { OrderStatusEmailPayload, VendorApprovalEmailPayload } from "@/lib/queue";

console.log("[WORKER] Initializing vendor approval worker");

export const vendorApprovalWorker = new Worker(
  "vendor-approval",
  async (job) => {
    const payload = job.data as VendorApprovalEmailPayload;
    console.log("[WORKER] Processing job", { jobId: job.id, data: payload });

    if (payload.sendDirectly) {
      console.log("[WORKER] Skipping queue processing because email was sent directly", {
        jobId: job.id,
      });
      return { sent: true, skipped: true };
    }

    try {
      await sendVendorStatusEmail({
        email: payload.email,
        name: payload.name,
        shopName: payload.shopName,
        status: payload.status || "approved",
        rejectedReason: payload.rejectedReason,
      });
      console.log("[WORKER] Email sent successfully", { jobId: job.id });
      return { sent: true };
    } catch (error) {
      console.error("[WORKER] Vendor approval email failed", error);
      throw error;
    }
  },
  { connection: redisConnection }
);

vendorApprovalWorker.on("ready", () => {
  console.log("[WORKER] Worker is ready and listening");
});

vendorApprovalWorker.on("failed", (job, err) => {
  console.error("[WORKER] Job failed", { jobId: job?.id, data: job?.data, error: err });
});

vendorApprovalWorker.on("completed", (job) => {
  console.log("[WORKER] Job completed", { jobId: job.id });
});

export const orderStatusWorker = new Worker(
  "order-status",
  async (job) => {
    const payload = job.data as OrderStatusEmailPayload;
    console.log("[WORKER] Processing order status email", { jobId: job.id, data: payload });

    if (payload.sendDirectly) {
      console.log("[WORKER] Skipping email because it was already sent directly", {
        jobId: job.id,
      });
      return { sent: true, skipped: true };
    }

    try {
      await sendOrderStatusEmail({
        email: payload.email,
        name: payload.name,
        orderId: payload.orderId,
        status: payload.status,
      });
      console.log("[WORKER] Order status email sent successfully", { jobId: job.id });
      return { sent: true };
    } catch (error) {
      console.error("[WORKER] Order status email failed", error);
      throw error;
    }
  },
  { connection: redisConnection }
);

orderStatusWorker.on("ready", () => {
  console.log("[WORKER] Order status worker is ready and listening");
});

orderStatusWorker.on("failed", (job, err) => {
  console.error("[WORKER] Order status job failed", { jobId: job?.id, data: job?.data, error: err });
});

orderStatusWorker.on("completed", (job) => {
  console.log("[WORKER] Order status job completed", { jobId: job.id });
});
