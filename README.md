# 💰 Finzy — AI Powered Personal Finance Management System


**Finzy** is a modern, intelligent personal finance management application that helps you track expenses, manage budgets, and gain deep financial insights — all powered by **Google Gemini AI**.

Built with **Next.js**, **Prisma**, **Supabase**, and **Gemini AI**, Finzy delivers a complete industry-level experience with automation, beautiful visualizations, and smart recommendations.

## ✨ Key Features

### 💳 Multi-Account Expense Management
- Track expenses across **Cash**, **Bank Accounts**, **Digital Wallets** and more
- Clear separation for better financial visibility

### 🧾 Smart Receipt Scanning (AI-Powered)
- Upload receipt images → AI automatically extracts:
  - Amount
  - Category
  - Date
  - Merchant Name
- Powered by **Google Gemini AI**

### 🔍 Advanced Filtering & Search
- Filter by date, category, amount range
- Powerful search across all transactions

### 📊 Rich Visualizations
- **Pie Charts** – Category-wise spending
- **Bar Charts** – Comparison views
- **Line Charts** – monthly spending trends

### 🎯 Budget Planning & Alerts
- Set monthly budgets by category
- Real-time budget utilization tracking
- **Budget exceed alerts** via email + in-app notifications

### 📄 Monthly Reports
- Automatically generated reports including:
  - Total Income
  - Total Expense
  - Net Savings
  - Category breakdown

### 🤖 Intelligent AI Insights
- Automatic expense categorization
- Personalized spending suggestions  
  *Example: "You're spending too much on dining out. Reducing 20% could save you ₹8,400 this year."*

### 🛠️ Additional Features
- Bulk delete transactions
- Expense summary dashboard
- Secure and protected routes

## 🚀 Tech Stack

| Layer              | Technology                          |
|--------------------|-------------------------------------|
| **Frontend**       | Next.js (App Router), React, Tailwind CSS, Shadcn UI |
| **Backend**        | Next.js API Routes                  |
| **ORM**            | Prisma ORM (v6)                     |
| **Database**       | PostgreSQL (Supabase)               |
| **AI**             | Google Gemini AI                    |
| **Background Jobs**| Inngest                             |
| **Email**          | React Email + Inngest               |
| **Security**       | Arcjet (Rate Limiting), Input Validation |

## 🏗️ System Architecture

Frontend (Next.js + React)
↓
Next.js API Routes
↓
Prisma ORM
↓
PostgreSQL (Supabase)
↓
Google Gemini AI + Inngest Jobs


## 📁 Project Structure

```bash
Finzy/
├── app/                  # Next.js App Router pages
│   ├── dashboard/
│   ├── transactions/
│   ├── budget/
│   └── summary/
├── components/           # Reusable UI components
├── actions/              # Server Actions
├── lib/                  # Utilities & configurations
├── prisma/               # Prisma schema & migrations
├── emails/               # React Email templates
├── inngest/              # Background job functions
├── public/               # Static assets
└── README.md

⚙️ Installation & Setup
1. Clone the repository

git clone https://github.com/jeorb08/Finzyy_AI-assited_Expense_management_system.git
cd Finzyy_AI-assited_Expense_management_system

2. Install dependencies
npm install

3. Environment Variables
Create a .env file in the root directory:
# Database
DATABASE_URL="postgresql://..."

# Authentication
NEXTAUTH_SECRET="your-super-secret-key"

# AI
GEMINI_API_KEY="your-gemini-api-key"

# Supabase
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"

# Security
ARCJET_KEY="your-arcjet-key"

# Inngest
INNGEST_EVENT_KEY="your-inngest-key"

4. Database Migration
npx prisma migrate dev
npx prisma generate

5. Run the development server
npm run dev

🔐 Security Features

API rate limiting with Arcjet
Protected routes & authentication
Input validation & sanitization
Secure database queries with Prisma
# finzyy_ai-assited_expense_management_system-main
