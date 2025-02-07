# Backend for Nimble Wear

This is the backend server for **[Nimble Wear](https://nimble-clothing-next-js.vercel.app)**, an e-commerce platform that supports functionalities like user authentication, order management, payment integration, and more. The backend is built with **Node.js**, **Express**, and connects to a **MongoDB** database.

## 🛠️ Technologies & Packages Used

- **@upstash/redis** — A Redis client used for caching and session management.
- **bcrypt** — For hashing and comparing passwords securely.
- **cookie-parser** — Parses cookies for the application.
- **cors** — Provides Cross-Origin Resource Sharing (CORS) support.
- **dotenv** — Loads environment variables from a `.env` file into `process.env`.
- **express** — Web framework used to build the API.
- **jsonwebtoken** — For issuing and verifying JSON Web Tokens (JWT) for user authentication.
- **mongoose** — MongoDB object modeling for Node.js.
- **nodemailer** — Used for sending email notifications.
- **nodemon** — Automatically restarts the server during development when files change.
- **stripe** — Integration for handling payments securely through Stripe.

## 🚀 Features

- **User Authentication**: JWT-based authentication for user login, registration, and protected routes.
- **Order Management**: Handle order creation, updates, and order status tracking.
- **Email Notifications**: Send emails to users regarding their orders, payments, and promotions.
- **Payment Integration**: Stripe integration for processing payments securely.
- **Session Management**: Utilizes Redis for session management to enhance performance.

## ⚙️ Installation & Setup

1. Clone the repository:

```bash
# Clone the repository
git clone https://github.com/Rjk-Jami/Nimble-Clothing-Next.js-backend

# Navigate to project directory
cd nimble-wear-backend

# Install dependencies
npm install

# Create a .env file in the root of your project
- **SERVER_PORT** = "your-SERVER_PORT"
- **SERVER_Database** = "your-mongodb-connection-string"
- **JWT_SECRET_ACCESS** = "your-jwt-secret"
- **JWT_SECRET_REFRESH** = "your-jwt-secret"
- **JWT_SECRET_SETPASS** = "your-jwt-secret"
- **ACCESS_TOKEN_EXPIRES_IN** = "minute"
- **REFRESH_TOKEN_EXPIRES_IN** = "day"
- **SMTP_USER** = "smtp-user-name"
- **SMTP_PASSWORD** = "smtp-password"
- **SMTP_Gmail** = "author-gmail"
- **STRIPE_SECRET_KEY** = "your-stripe-secret-key"
- **BDT_TO_USD** = "amount"
- **FRONTEND_URL** = "your-frontendURL = http://localhost:3000"

# Run the development server
npm start