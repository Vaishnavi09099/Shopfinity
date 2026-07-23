
import { Queue } from "bullmq";
import { redisConnection } from "@/lib/redis";
import {
  sendOrderStatusEmail,
  sendProductStatusEmail,
  sendVendorStatusEmail,
} from "@/lib/mailer";
import "./worker";

export type VendorApprovalEmailPayload = {
  email: string;
  name: string;
  shopName?: string;
  status?: "approved" | "rejected";
  rejectedReason?: string;
  sendDirectly?: boolean;
};

export type OrderStatusEmailPayload = {
  email: string;
  name: string;
  orderId: string;
  status:
    | "pending"
    | "confirmed"
    | "shipped"
    | "delivered"
    | "return_requested"
    | "return_approved"
    | "return_rejected"
    | "returned"
    | "cancelled";
  sendDirectly?: boolean;
};

export type ProductApprovalEmailPayload = {
  email: string;
  name: string;
  productName?: string;
  status: "approved" | "rejected";
  rejectedReason?: string;
  sendDirectly?: boolean;
};

export const vendorApprovalQueue = new Queue("vendor-approval", {
  connection: redisConnection,
});

export const orderStatusQueue = new Queue("order-status", {
  connection: redisConnection,
});

export const productApprovalQueue = new Queue("product-approval", {
  connection: redisConnection,
});

export async function enqueueVendorApprovalEmail(payload: VendorApprovalEmailPayload) {
  console.log("[QUEUE] Enqueuing vendor approval email", payload);

  try {
    const job = await vendorApprovalQueue.add("send-vendor-approval-email", payload, {
      removeOnComplete: true,
      removeOnFail: true,
    });

    console.log("[QUEUE] Job added to queue", { jobId: job.id });
    return job;
  } catch (queueError) {
    console.error("[QUEUE] Failed to enqueue vendor approval email, sending directly", queueError);
    return await sendVendorStatusEmail({
      email: payload.email,
      name: payload.name,
      shopName: payload.shopName,
      status: payload.status || "approved",
      rejectedReason: payload.rejectedReason,
    });
  }
}

export async function enqueueProductApprovalEmail(payload: ProductApprovalEmailPayload) {
  console.log("[QUEUE] Enqueuing product approval email", payload);

  try {
    const job = await productApprovalQueue.add("send-product-approval-email", payload, {
      removeOnComplete: true,
      removeOnFail: true,
    });

    console.log("[QUEUE] Job added to queue", { jobId: job.id });
    return job;
  } catch (queueError) {
    console.error("[QUEUE] Failed to enqueue product approval email, sending directly", queueError);
    return await sendProductStatusEmail({
      email: payload.email,
      name: payload.name,
      productName: payload.productName,
      status: payload.status,
      rejectedReason: payload.rejectedReason,
    });
  }
}

export async function enqueueOrderStatusEmail(payload: OrderStatusEmailPayload) {
  console.log("[QUEUE] Enqueuing order status email", payload);

  try {
    const job = await orderStatusQueue.add("send-order-status-email", payload, {
      removeOnComplete: true,
      removeOnFail: true,
    });

    console.log("[QUEUE] Job added to queue", { jobId: job.id });
    return job;
  } catch (queueError) {
    console.error("[QUEUE] Failed to enqueue order status email, sending directly", queueError);
    return await sendOrderStatusEmail(payload);
  }
}