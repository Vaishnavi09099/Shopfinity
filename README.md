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
- Delivery OTP verification
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

### 💬 Support
- Real-time chat
- AI-powered suggestions
- Active user support

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
| **Email** | Nodemailer |
| **State Management** | Redux Toolkit + React Redux |
| **Other** | Axios, dotenv |

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
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
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
├── lib/                  # Utility functions (DB, Cloudinary, Mailer)
├── models/               # Mongoose models (User, Product, Order)
├── public/               # Static assets
├── redux/                # Redux store & slices
├── auth.ts               # NextAuth configuration
└── package.json
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 📧 Contact

For questions or feedback, please reach out!
