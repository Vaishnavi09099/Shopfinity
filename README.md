# Shopfinity

A modern, full-stack multi-vendor e-commerce platform built with Next.js 16, React 19, TypeScript, and MongoDB.

---

## 🚀 Features

### 👥 User Roles
- **Shopper**: Browse products, manage cart, checkout, track orders, leave reviews
- **Vendor**: Add products, manage inventory, track orders, view dashboard
- **Admin**: Approve vendors/products, manage orders, oversee platform

### 🔐 Authentication & Security
- Secure login/registration with NextAuth.js
- Password hashing with bcryptjs
- Role-based access control

### 🛍️ Shopping Experience
- Product categories & browsing
- Add to cart with quantity management
- Checkout with COD & Stripe payment options
- Order tracking with status updates
- Delivery OTP verification with Redis caching
- Return & cancel order functionality

### 📦 Product Management
- Vendor product submission
- Admin approval workflow
- Multiple product images (Cloudinary)
- Product reviews & ratings
- Sizes for wearable products
- Policies: replacement, warranty, free delivery, COD

### 📊 Dashboards
- **Admin Dashboard**: Overview, vendor requests, product requests, all orders
- **Vendor Dashboard**: Products, orders, performance metrics
- **Shopper Dashboard**: Browse, cart, orders, profile

### 💬 AI-Powered Support
- Real-time AI chatbot powered by LangChain & Langraph
- Gemini 2.5 Flash LLM integration
- Order status lookup
- Product search across vendors
- Cart cost estimation
- Conversational, user-friendly assistance

### 📧 Asynchronous Email Service
- BullMQ-based job queue for reliable email delivery
- Order status update emails (pending, confirmed, shipped, delivered, etc.)
- Vendor approval/rejection emails
- Product approval/rejection emails
- Fallback to direct email if queue fails
- Worker-based email processing with job monitoring

### 📍 OTP & Security
- Redis-based OTP caching for delivery verification
- Configurable OTP expiry (default 10 minutes)
- Secure OTP validation flow
- Redis persistence for reliability

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|--------------|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS, Lucide React, Recharts, Framer Motion |
| **Backend** | Next.js API Routes, Mongoose ODM |
| **Database** | MongoDB |
| **Auth** | NextAuth.js 5 |
| **Payments** | Stripe |
| **File Storage** | Cloudinary |
| **Email Service** | Nodemailer with BullMQ queue |
| **Job Queue** | BullMQ (with Redis backend) |
| **Caching & OTP** | Redis (ioredis) |
| **AI Chatbot** | LangChain, Langraph, Google Generative AI (Gemini) |
| **State Management** | Redux Toolkit + React Redux |
| **Other** | Axios, Zod, dotenv |

---

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/shopfinity.git
   cd shopfinity
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the root directory with the following:
   ```env
   # Next.js
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret

   # MongoDB
   MONGODB_URI=your_mongodb_connection_string

   # Stripe
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret

   # Nodemailer
   MAILER_EMAIL=your_email
   MAILER_PASSWORD=your_email_password

   # Resend
   RESEND_API_KEY=your_resend_api_key
   RESEND_FROM_EMAIL=you@yourdomain.com

   # Redis (for BullMQ queue, OTP caching, and chatbot sessions)
   REDIS_URL=redis://127.0.0.1:6379

   # Google Generative AI (for AI Chatbot)
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Start Redis server** (if running locally)
   ```bash
   redis-server
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
shopfinity/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── (pages)/           # Page components
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── Admin/            # Admin components
│   ├── User/             # Shopper components
│   └── Vendor/           # Vendor components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
│   ├── ai/              # AI agent & tools (LangChain)
│   │   ├── agent.ts     # Shopfinity AI agent setup
│   │   └── tools.ts     # LangChain tools (order status, search, cart)
│   ├── queue.ts         # BullMQ queue setup & enqueueing functions
│   ├── worker.ts        # BullMQ workers for async email processing
│   ├── redis.ts         # Redis connection (OTP caching & queue)
│   ├── mailer.ts        # Email templates & Nodemailer config
│   ├── connectDb.ts     # MongoDB connection
│   └── cloudinary.ts    # Cloudinary upload utilities
├── models/              # Mongoose models (User, Product, Order)
├── public/              # Static assets
├── redux/               # Redux store & slices
├── auth.ts              # NextAuth configuration
└── package.json
```

---

## 🤖 AI Chatbot Details

The AI chatbot (`Shopfinity AI`) is powered by **LangChain** with **Google Generative AI (Gemini 2.5 Flash)**.

### Capabilities:
- **Order Status Lookup**: Get current order status, payment info, and items
- **Product Search**: Search products across vendors by name or category
- **Cart Estimation**: Calculate total cost for items before checkout
- **User-Friendly**: Conversational responses, never reveals other users' data

### Architecture:
- Agent-based system using LangChain's `createAgent()` function
- Equipped with three specialized tools: `get_order_status`, `search_products`, `calculate_cart_total`
- Runs per-user session with Gemini model at 0.3 temperature for consistency

---

## 📧 Email Queue System (BullMQ)

Shopfinity uses **BullMQ** (Redis-backed) for reliable, asynchronous email delivery.

### Three Email Queues:
1. **Vendor Approval Queue**: Sends emails when vendors are approved/rejected
2. **Product Approval Queue**: Sends emails when products are approved/rejected
3. **Order Status Queue**: Sends order updates (pending, confirmed, shipped, delivered, returned, etc.)

### How It Works:
1. When an event occurs (e.g., order shipped), the system enqueues a job
2. BullMQ workers process jobs asynchronously from Redis
3. Emails are sent via Nodemailer with HTML templates
4. Jobs are automatically removed on success or retry on failure
5. Fallback: If queue fails, emails are sent directly

### Worker Monitoring:
- Logs job processing with detailed job IDs
- Tracks job completion, failures, and skipped emails
- Automatic retry mechanisms for failed jobs

---

## 🔐 OTP & Redis Caching

Delivery OTP verification uses **Redis** for fast, secure temporary storage.

### Flow:
1. Admin marks order as "shipped"
2. OTP is generated (4-digit random number)
3. OTP is stored in Redis with 10-minute expiry: `otp:{orderId} → {otp}`
4. Buyer receives OTP via email
5. Buyer enters OTP for delivery confirmation
6. OTP is validated and deleted from Redis
7. Order marked as "delivered"

### Benefits:
- Sub-millisecond lookups
- Automatic expiry (no manual cleanup)
- Secure, temporary storage (not in database)
- Works seamlessly with BullMQ for email delivery

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 📧 Contact

For questions or feedback, please reach out!
