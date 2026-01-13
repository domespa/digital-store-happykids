import nodemailer from "nodemailer";
import { OrderResponse } from "../types/order";
import { cloudinaryService } from "./cloudinaryService";

// Interface per EmailService
interface EmailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  from?: string;
}

// CONF NAMECHEAPCHOP
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "mail.privateemail.com",
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

class EmailService {
  // Metodo generico per inviare email
  async sendEmail(options: EmailOptions): Promise<void> {
    await transporter.sendMail({
      from: options.from || process.env.EMAIL_USER,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
  }

  // EMAIL RESET
  async sendPasswordResetEmail(
    email: string,
    firstName: string,
    resetToken: string
  ): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Reset Password - ShethrivesADHD</title>
      </head>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
          <h1 style="color: #333; text-align: center;">Reset Your Password</h1>
          
          <p>Hi ${firstName},</p>
          
          <p>You requested to reset your password for your ShethrivesADHD account. Click the button below to set a new password:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          
          <p><strong>This link will expire in 1 hour.</strong></p>
          
          <p>If you didn't request this password reset, you can safely ignore this email.</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 14px;">
            If the button doesn't work, copy and paste this link in your browser:<br>
            <a href="${resetUrl}">${resetUrl}</a>
          </p>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({
      to: email,
      subject: "Reset Your Password - ShethrivesADHD",
      html: htmlContent,
    });
  }

  // VERIFICA EMAIL
  async sendEmailVerificationEmail(
    email: string,
    firstName: string,
    verificationToken: string
  ): Promise<void> {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Verify Your Email - ShethrivesADHD</title>
      </head>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
          <h1 style="color: #333; text-align: center;">Welcome to ShethrivesADHD!</h1>
          
          <p>Hi ${firstName},</p>
          
          <p>Thank you for registering with ShethrivesADHD! To complete your registration, please verify your email address:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Verify Email
            </a>
          </div>
          
          <p><strong>This link will expire in 7 days.</strong></p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 14px;">
            If the button doesn't work, copy and paste this link in your browser:<br>
            <a href="${verificationUrl}">${verificationUrl}</a>
          </p>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({
      to: email,
      subject: "Verify Your Email - ShethrivesADHD",
      html: htmlContent,
    });
  }

  // EMAIL NOTIFICA CAMBIO PASSWORD
  async sendPasswordChangedNotificationEmail(
    email: string,
    firstName: string
  ): Promise<void> {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Password Changed - ShethrivesADHD</title>
      </head>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
          <h1 style="color: #333; text-align: center;">Password Changed Successfully</h1>
          
          <p>Hi ${firstName},</p>
          
          <p>This email confirms that your ShethrivesADHD account password was successfully changed on ${new Date().toLocaleString()}.</p>
          
          <p><strong>If you didn't make this change:</strong></p>
          <ul>
            <li>Someone may have accessed your account</li>
            <li>Contact our support immediately</li>
            <li>Consider changing your password again</li>
          </ul>
          
          <p>If you made this change, no further action is needed.</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 14px;">
            For security reasons, this notification was sent to all email addresses associated with your account.
          </p>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({
      to: email,
      subject: "Password Changed - ShethrivesADHD",
      html: htmlContent,
    });
  }

  // EMAIL CONFERMA ORDINE
  async sendOrderConfirmation(order: OrderResponse): Promise<boolean> {
    try {
      console.log("📧 SENDING ORDER CONFIRMATION");
      console.log("📦 Order ID:", order.id);
      console.log("📦 Order Status:", order.status);
      console.log("📦 Order Items:", order.orderItems.length);

      const emailSubject = `Order Confirmation #${order.id.slice(
        -8
      )} - ShethrivesADHD Store`;

      // GENERIAMO IL LINK TEMPORANEO PER IL DOWNLOAD
      const downloadLinks = (
        await Promise.all(
          order.orderItems.map(async (item) => {
            console.log("🔍 Processing item:", {
              productId: item.productId,
              productName: item.product?.name,
              filePath: item.product?.filePath,
            });

            if (!item.product?.filePath) {
              console.log("⚠️ SKIPPING - No filePath for:", item.product?.name);
              return null;
            }

            console.log(
              "🔗 Generating download link for:",
              item.product.filePath
            );
            const downloadUrl = await cloudinaryService.generateDownload(
              item.product.filePath
            );

            console.log("✅ Download URL generated successfully");

            return {
              productName: item.product.name,
              downloadUrl: downloadUrl,
            };
          })
        )
      ).filter((link) => link !== null);

      console.log("📋 Total download links generated:", downloadLinks.length);

      const emailHTML = this.generateOrderConfirmationHTML(
        order,
        downloadLinks
      );

      await this.sendEmail({
        to: order.customerEmail,
        subject: emailSubject,
        html: emailHTML,
        from: `"ShethrivesADHD" <${process.env.EMAIL_USER}>`,
      });

      console.log(
        `✅ Order confirmation email sent to: ${order.customerEmail}`
      );
      return true;
    } catch (error) {
      console.error("❌ Failed to send order confirmation email:", error);
      return false;
    }
  }

  // EMAIL AGGIORNAMENTO ORDINE
  async sendOrderStatusUpdate(
    order: OrderResponse,
    previousStatus?: string
  ): Promise<boolean> {
    try {
      let subject = `Order Update #${order.id.slice(-8)}`;

      if (order.status === "PAID") {
        subject = `Payment Completed - Order #${order.id.slice(-8)}`;
      } else if (order.status === "COMPLETED") {
        subject = `Your products are ready - Order${order.id.slice(-8)}`;
      }

      const downloadLinks = (
        await Promise.all(
          order.orderItems.map(async (item) => {
            if (!item.product?.filePath) return null;
            const downloadUrl = await cloudinaryService.generateDownload(
              item.product.filePath
            );

            return {
              productName: item.product.name,
              downloadUrl: downloadUrl,
            };
          })
        )
      ).filter((link) => link !== null);

      const emailHTML = this.generateOrderConfirmationHTML(
        order,
        downloadLinks
      );

      await this.sendEmail({
        to: order.customerEmail,
        subject: subject,
        html: emailHTML,
        from: `"ShethrivesADHD" <${process.env.EMAIL_USER}>`,
      });

      console.log(
        `Order status update email sent to: ${order.customerEmail} (${previousStatus} → ${order.status})`
      );
      return true;
    } catch (error) {
      console.error("Failed to send order status update email:", error);
      return false;
    }
  }

  // EMAIL NOTIFICA VENDITORE
  async sendVendorNotification(order: OrderResponse): Promise<boolean> {
    try {
      const VENDOR_EMAIL = "dumiii1988@gmail.com";

      console.log("📧 SENDING VENDOR NOTIFICATION");
      console.log("📦 Order ID:", order.id);
      console.log("💰 Total:", order.total);

      const emailSubject = `🔔 New Order Received #${order.id.slice(
        -8
      )} - €${order.total.toFixed(2)}`;

      const emailHTML = this.generateVendorNotificationHTML(order);

      await this.sendEmail({
        to: VENDOR_EMAIL,
        subject: emailSubject,
        html: emailHTML,
        from: `"ShethrivesADHD Store" <${process.env.EMAIL_USER}>`,
      });

      console.log(`✅ Vendor notification sent to: ${VENDOR_EMAIL}`);
      return true;
    } catch (error) {
      console.error("❌ Failed to send vendor notification:", error);
      return false;
    }
  }

  // Template HTML per email venditore
  private generateVendorNotificationHTML(order: OrderResponse): string {
    const orderItemsHTML = order.orderItems
      .map(
        (item) => `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 12px 8px;">
          <strong>${item.product?.name || "Product"}</strong>
          ${
            item.product?.filePath
              ? '<br><span style="color: #28a745; font-size: 12px;">✓ Digital file attached</span>'
              : ""
          }
        </td>
        <td style="padding: 12px 8px; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px 8px; text-align: right;">€${item.price.toFixed(
          2
        )}</td>
        <td style="padding: 12px 8px; text-align: right; font-weight: bold;">€${(
          item.price * item.quantity
        ).toFixed(2)}</td>
      </tr>
    `
      )
      .join("");

    const statusColor =
      order.status === "COMPLETED" || order.status === "PAID"
        ? "#28a745"
        : order.status === "PENDING"
        ? "#ffc107"
        : "#dc3545";

    const statusEmoji =
      order.status === "COMPLETED"
        ? "✅"
        : order.status === "PAID"
        ? "💳"
        : order.status === "PENDING"
        ? "⏳"
        : "❌";

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Order - ShethrivesADHD</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">🔔 New Order Received!</h1>
            <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Order #${order.id.slice(
              -8
            )}</p>
          </div>

          <!-- Status Badge -->
          <div style="padding: 20px; text-align: center; background: #f8f9fa;">
            <span style="display: inline-block; padding: 8px 20px; background: ${statusColor}; color: white; border-radius: 20px; font-weight: bold;">
              ${statusEmoji} ${order.status}
            </span>
            <span style="display: inline-block; padding: 8px 20px; margin-left: 10px; background: #6c757d; color: white; border-radius: 20px; font-weight: bold;">
              Payment: ${order.paymentStatus}
            </span>
          </div>

          <!-- Order Details -->
          <div style="padding: 30px;">
            <h2 style="color: #333; margin: 0 0 20px 0; font-size: 18px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
              📋 Order Details
            </h2>
            
            <table style="width: 100%; margin-bottom: 20px; font-size: 14px;">
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Order ID:</strong></td>
                <td style="padding: 8px 0; text-align: right;">${order.id}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Date:</strong></td>
                <td style="padding: 8px 0; text-align: right;">${new Date(
                  order.createdAt
                ).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Payment Method:</strong></td>
                <td style="padding: 8px 0; text-align: right;">
                  <span style="padding: 4px 8px; background: #e7f3ff; color: #0066cc; border-radius: 4px; font-size: 12px;">
                    ${order.paymentProvider || "N/A"}
                  </span>
                </td>
              </tr>
            </table>

            <!-- Customer Info -->
            <h2 style="color: #333; margin: 30px 0 20px 0; font-size: 18px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
              👤 Customer Information
            </h2>
            
            <table style="width: 100%; margin-bottom: 20px; font-size: 14px;">
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Name:</strong></td>
                <td style="padding: 8px 0; text-align: right;">
                  ${order.customerFirstName || ""} ${
      order.customerLastName || ""
    }
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Email:</strong></td>
                <td style="padding: 8px 0; text-align: right;">
                  <a href="mailto:${
                    order.customerEmail
                  }" style="color: #667eea; text-decoration: none;">
                    ${order.customerEmail}
                  </a>
                </td>
              </tr>
              ${
                order.userId
                  ? `
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>User ID:</strong></td>
                <td style="padding: 8px 0; text-align: right; font-family: monospace; font-size: 12px;">
                  ${order.userId}
                </td>
              </tr>
              `
                  : `
              <tr>
                <td colspan="2" style="padding: 8px 0;">
                  <span style="padding: 4px 8px; background: #fff3cd; color: #856404; border-radius: 4px; font-size: 12px;">
                    👤 Guest Order
                  </span>
                </td>
              </tr>
              `
              }
            </table>

            <!-- Products Table -->
            <h2 style="color: #333; margin: 30px 0 20px 0; font-size: 18px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
              🛍️ Products (${order.orderItems.length})
            </h2>
            
            <table style="width: 100%; border-collapse: collapse; background: #f8f9fa; border-radius: 8px; overflow: hidden;">
              <thead>
                <tr style="background: #667eea; color: white;">
                  <th style="padding: 12px 8px; text-align: left;">Product</th>
                  <th style="padding: 12px 8px; text-align: center;">Qty</th>
                  <th style="padding: 12px 8px; text-align: right;">Price</th>
                  <th style="padding: 12px 8px; text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${orderItemsHTML}
                <tr style="background: #28a745; color: white; font-weight: bold; font-size: 16px;">
                  <td colspan="3" style="padding: 15px 8px; text-align: right;">TOTAL:</td>
                  <td style="padding: 15px 8px; text-align: right;">€${order.total.toFixed(
                    2
                  )}</td>
                </tr>
              </tbody>
            </table>

            <!-- Quick Actions -->
            <div style="margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px; text-align: center;">
              <p style="margin: 0 0 15px 0; color: #666; font-size: 14px;">Quick Actions</p>
              <a href="${process.env.FRONTEND_URL}/admin/orders" 
                 style="display: inline-block; margin: 5px; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
                📊 View in Admin Panel
              </a>
              <a href="mailto:${order.customerEmail}" 
                 style="display: inline-block; margin: 5px; padding: 12px 24px; background: #28a745; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
                📧 Contact Customer
              </a>
            </div>

          </div>

          <!-- Footer -->
          <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #dee2e6;">
            <p style="margin: 0; color: #666; font-size: 12px;">
              This is an automated notification from ShethrivesADHD Store
            </p>
            <p style="margin: 5px 0 0 0; color: #999; font-size: 11px;">
              ${new Date().toLocaleString()}
            </p>
          </div>

        </div>
      </body>
      </html>
    `;
  }

  // VERIFICA CONNESSIONE
  async testEmailConnection(): Promise<boolean> {
    try {
      await transporter.verify();
      console.log("Email service is ready");
      return true;
    } catch (error) {
      console.error("Email service connection failed:", error);
      return false;
    }
  }

  // Metodo privato per generare HTML dell'ordine
  private generateOrderConfirmationHTML(
    order: OrderResponse,
    downloadLinks: Array<{ productName: string; downloadUrl: string }> = []
  ): string {
    const orderItemsHTML = order.orderItems
      .map(
        (item) => `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 12px 8px; font-weight: 500;">${
          item.product?.name || "Product not available"
        }</td>
        <td style="padding: 12px 8px; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px 8px; text-align: right;">€${item.price.toFixed(
          2
        )}</td>
        <td style="padding: 12px 8px; text-align: right;">€${(
          item.price * item.quantity
        ).toFixed(2)}</td>
      </tr>
    `
      )
      .join("");

    // SEZIONE DOWNLOAD
    const downloadSection =
      downloadLinks.length > 0 &&
      (order.status === "COMPLETED" || order.status === "PAID")
        ? `
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; margin: 30px 0; border-radius: 12px; text-align: center;">
            <h2 style="color: white; margin: 0 0 20px 0;">🎉 Your Ebook is Ready!</h2>
            ${downloadLinks
              .map(
                (link) => `
              <div style="background: white; padding: 20px; margin: 15px 0; border-radius: 8px;">
                <h3 style="margin: 0 0 15px 0; color: #333;">📚 ${link.productName}</h3>
                <a href="${process.env.BASE_URL}/api/orders/download/${order.id}" 
                  style="display: inline-block; background: #667eea; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                  Download Now
                </a>
                <p style="color: #666; font-size: 14px; margin: 15px 0 0 0;">
                  ⏰ Valid for <strong>30 days</strong> • Max <strong>4 downloads</strong>
                </p>
              </div>
            `
              )
              .join("")}
            <div style="background: rgba(255,255,255,0.2); padding: 15px; margin-top: 20px; border-radius: 8px;">
              <p style="color: white; margin: 0; font-size: 14px;">
                ⚠️ <strong>Important:</strong> This link expires 30 days after purchase and can be used 4 times. Save your ebook to your device!
              </p>
            </div>
          </div>
        `
        : "";

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Confirmation - Digital Store</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .order-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .table th { background: #f8f9fa; padding: 12px 8px; text-align: left; font-weight: 600; }
          .total-row { background: #4F46E5; color: white; font-weight: bold; }
          .footer { text-align: center; margin: 30px 0; color: #666; font-size: 14px; }
          .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
          .status-pending { background: #FEF3C7; color: #92400E; }
          .status-paid { background: #D1FAE5; color: #065F46; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">Order Confirmation</h1>
            <p style="margin: 10px 0 0 0;">Thank you for your purchase!</p>
          </div>
          
          <div class="content">
            ${downloadSection}
            
            <div class="order-info">
              <h2>Order Details</h2>
              <p><strong>Order Number:</strong> ${order.id}</p>
              <p><strong>Email:</strong> ${order.customerEmail}</p>
              ${
                order.customerFirstName
                  ? `<p><strong>Name:</strong> ${order.customerFirstName} ${
                      order.customerLastName || ""
                    }</p>`
                  : ""
              }
              <p><strong>Date:</strong> ${new Date(
                order.createdAt
              ).toLocaleString("en-US")}</p>
              <p><strong>Status:</strong> 
                <span class="status-badge ${
                  order.status === "COMPLETED"
                    ? "status-paid"
                    : "status-pending"
                }">
                  ${
                    order.status === "PENDING"
                      ? "Pending payment"
                      : order.status === "COMPLETED"
                      ? "Completed"
                      : order.status
                  }
                </span>
              </p>
            </div>

            <h3>Purchased Products</h3>
            <table class="table" style="background: white; border-radius: 8px;">
              <thead>
                <tr>
                  <th>Product</th>
                  <th style="text-align: center;">Quantity</th>
                  <th style="text-align: right;">Unit Price</th>
                  <th style="text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${orderItemsHTML}
                <tr class="total-row">
                  <td colspan="3" style="padding: 15px 8px; text-align: right;"><strong>TOTAL:</strong></td>
                  <td style="padding: 15px 8px; text-align: right;"><strong>€${order.total.toFixed(
                    2
                  )}</strong></td>
                </tr>
              </tbody>
            </table>

            <div class="footer">
              <p>If you have any questions, please contact us with order number: <strong>${
                order.id
              }</strong></p>
              <p>SheThrivesADHD - Your digital wellness platform</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

export default EmailService;
