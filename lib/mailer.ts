import nodemailer from "nodemailer";

export type OrderStatusEmailStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "return_requested"
  | "return_approved"
  | "return_rejected"
  | "returned"
  | "cancelled";

/**
 * Gmail transporter (SERVER ONLY)
 */
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_PASS,
  },
});

/**
 * Delivery OTP Email
 */
export async function sendDeliveryOtpEmail(email: string, otp: string) {
  await transporter.sendMail({
    from: `"Order Delivery" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Your Delivery OTP",
    html: `
      <div style="font-family:Arial,sans-serif">
        <h2>Delivery Verification</h2>
        <p>Your order delivery OTP is:</p>
        <h1 style="letter-spacing:4px">${otp}</h1>
        <p>This OTP is valid for 10 minutes.</p>
      </div>
    `,
  });
}

/**
 * Vendor status email (approved or rejected)
 */
export async function sendVendorStatusEmail({
  email,
  name,
  shopName,
  status,
  rejectedReason,
}: {
  email: string;
  name: string;
  shopName?: string;
  status: "approved" | "rejected";
  rejectedReason?: string;
}) {
  const isRejected = status === "rejected";

  const subject = isRejected
    ? "Your vendor account request was rejected"
    : "Your vendor account has been approved";

  const title = isRejected
    ? "Vendor request update ⚠️"
    : "Vendor approval confirmed ✅";

  const body = isRejected
    ? `Your vendor account request for <strong>${shopName || "Shopfinity Marketplace"}</strong> was rejected by the admin.${rejectedReason ? `<br/><br/><strong>Reason:</strong> ${rejectedReason}` : ""}`
    : `Your vendor account for <strong>${shopName || "Shopfinity Marketplace"}</strong> has been approved by the admin.`;

  const response = await transporter.sendMail({
    from: `"Shopfinity Team" <${process.env.GMAIL_USER}>`,
    to: email,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>${title}</h2>
        <p>Hello ${name},</p>
        <p>${body}</p>
        <p>${isRejected ? "You can still contact the admin for more details." : "You can now login and start managing your products."}</p>
        <br/>
        <p>Regards,<br/>Shopfinity Team</p>
      </div>
    `,
  });

  console.log(`[GMAIL RESPONSE] ${status}`, response.messageId);
  return response;
}

export async function sendVendorApprovalEmail(payload: {
  email: string;
  name: string;
  shopName?: string;
}) {
  return sendVendorStatusEmail({
    ...payload,
    status: "approved",
  });
}

export async function sendOrderStatusEmail({
  email,
  name,
  orderId,
  status,
}: {
  email: string;
  name: string;
  orderId: string;
  status: OrderStatusEmailStatus;
}) {
  const statusLabels: Record<OrderStatusEmailStatus, string> = {
    pending: "Pending",
    confirmed: "Confirmed",
    shipped: "Shipped",
    delivered: "Delivered",
    return_requested: "Return Requested",
    return_approved: "Return Approved",
    return_rejected: "Return Rejected",
    returned: "Returned",
    cancelled: "Cancelled",
  };

  const statusMessages: Record<OrderStatusEmailStatus, string> = {
    pending: `Your order <strong>#${orderId}</strong> has been received and is currently being processed. We will keep you updated as it moves forward.`,
    confirmed: `Your order <strong>#${orderId}</strong> has been confirmed successfully and is now being prepared for shipment.`,
    shipped: `Your order <strong>#${orderId}</strong> has been shipped and is on its way to your delivery address.`,
    delivered: `Your order <strong>#${orderId}</strong> has been delivered successfully. We hope you’re enjoying your purchase.`,
    return_requested: `We have received your return request for order <strong>#${orderId}</strong>. Our team is reviewing it and will update you shortly.`,
    return_approved: `Your return request for order <strong>#${orderId}</strong> has been approved. Refund processing has been initiated and will be completed shortly.`,
    return_rejected: `Your return request for order <strong>#${orderId}</strong> could not be approved. Please review the details provided and contact support if you need further assistance.`,
    returned: `The refund for order <strong>#${orderId}</strong> has been processed successfully and is now complete.`,
    cancelled: `Your order <strong>#${orderId}</strong> has been cancelled successfully. If you paid online, refund processing will begin shortly.`,
  };

  const subject =
    status === "return_requested"
      ? "Return request received"
      : status === "return_approved"
        ? "Return approved"
        : status === "return_rejected"
          ? "Return request update"
          : status === "returned"
            ? "Refund processed successfully"
            : status === "cancelled"
              ? "Order cancelled"
              : `Order update: ${statusLabels[status]}`;

  const message = `Hello ${name},<br/><br/>${statusMessages[status]}`;

  const response = await transporter.sendMail({
    from: `"Shopfinity Team" <${process.env.GMAIL_USER}>`,
    to: email,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.7; color: #1f2937;">
        <div style="max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 10px; background-color: #ffffff;">
          <h2 style="margin-bottom: 12px; color: #111827;">Order Status Update</h2>
          <p>${message}</p>
          <p style="margin-top: 16px;">Thank you for shopping with us. We appreciate your trust in our service.</p>
          <br/>
          <p style="margin: 0;">Regards,<br/><strong>Shopfinity Team</strong></p>
        </div>
      </div>
    `,
  });

  console.log(`[GMAIL RESPONSE] order-status:${status}`, response.messageId);
  return response;
}