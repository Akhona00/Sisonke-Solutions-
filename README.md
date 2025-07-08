Sisonke Solutions - Website Setup Guide
This document provides instructions for setting up and running the Sisonke Solutions website, which includes:

Frontend: HTML, CSS, JavaScript (static pages)

Backend: Node.js + Express (API & database handling)

Database: PostgreSQL (stores customer contacts & orders)

Payment Processing: Stripe (for shop purchases)

📌 Prerequisites
Before running the project, ensure you have the following installed:

1. Software Requirements
Requirement	Installation Guide
Node.js (v18+)	Download Node.js
PostgreSQL (v15+)	Download PostgreSQL
Git (Optional)	Download Git
Stripe Account (for payments)	Sign Up for Stripe
2. Environment Variables
Create a .env file in the project root with the following:

env
# Server & Database
PORT=5000
NODE_ENV=development
DATABASE_URL=postgres://username:password@localhost:5432/sisonke_db

# Stripe Payments
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5000
🚀 Setup & Installation
1. Clone the Repository (if using Git)
bash
git clone https://github.com/Akhona00/sisonke-solutions.git
cd sisonke-solutions
2. Install Node.js Dependencies
bash
npm install
(Installs Express, PostgreSQL, Stripe, etc.)

3. Set Up PostgreSQL Database
Create a new database:

sql
CREATE DATABASE sisonke_db;
Run the server to auto-create tables:

bash
node server.js
(This will create orders and contacts tables if they don’t exist.)

4. Run the Website
Start the server:

bash
node server.js
Frontend: Open http://localhost:5000 in a browser.

API Endpoints:

POST /contact – Saves customer inquiries.

POST /create-payment-intent – Handles Stripe payments.

GET /orders – (Admin) Lists all orders.

GET /api/contacts – (Admin) Lists all contacts.

📂 Project Structure
text
sisonke-solutions/
├── templates/            # Frontend HTML files
│   ├── home.html         # Homepage
│   ├── about.html        # About Us
│   ├── service.html      # Services Offered
│   ├── portfolio.html    # Portfolio/Gallery
│   ├── industry.html     # Industry Solutions
│   ├── contact.html      # Contact Form
│   ├── shop.html         # Product Shop
│   └── static/           # CSS, JS, Images
│       ├── css/
│       ├── js/
│       └── images/
├── server.js             # Backend (Node.js + Express)
├── package.json          # Node.js dependencies
├── .env                  # Environment variables
└── README.md             # This file
🔧 Key Features
1. Contact Form (/contact)
Saves customer inquiries to PostgreSQL (contacts table).

Validates inputs (name, email, service, message).

Success/error popup responses.

2. Shop & Payments (/shop)
Uses Stripe for secure payments.

Saves orders to PostgreSQL (orders table).

Tracks payment status (completed, failed, pending).

3. Admin Access
View all contacts: GET /api/contacts

View all orders: GET /orders

⚠️ Troubleshooting
Issue	Solution
Database connection fails	Check .env DATABASE_URL and ensure PostgreSQL is running.
Stripe payments not working	Verify STRIPE_SECRET_KEY and STRIPE_PUBLISHABLE_KEY in .env.
CORS errors	Ensure FRONTEND_URL in .env matches your dev server (e.g., http://localhost:5000).
Forms not submitting	Check browser console (F12) for errors and validate API endpoints.
📜 License
This project is open-source. Modify and use as needed.


🎉 Ready to Launch!
Run node server.js and visit http://localhost:5000 to see the website in action. 🚀
