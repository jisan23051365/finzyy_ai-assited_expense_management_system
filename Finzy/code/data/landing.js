// 1st module dashboard
import {
    BarChart3,
    Receipt,
    PieChart,
    CreditCard,
    Globe,
    Zap,
} from "lucide-react";

// Stats Data
export const statsData = [{
        value: "75K+",
        label: "People Managing Money",
    },
    {
        value: "$3.5B+",
        label: "Expenses Monitored",
    },
    {
        value: "99.95%",
        label: "System Reliability",
    },
    {
        value: "4.8/5",
        label: "Customer Satisfaction",
    },
];

// Features Data
export const featuresData = [{
        icon: < BarChart3 className = "h-8 w-8 text-blue-600" / > ,
        title: "Deep Financial Insights",
        description: "Understand your spending behavior with smart analytics and visual reports.",
    },
    {
        icon: < Receipt className = "h-8 w-8 text-blue-600" / > ,
        title: "AI Receipt Capture",
        description: "Snap receipts and let AI extract and organize the data instantly.",
    },
    {
        icon: < PieChart className = "h-8 w-8 text-blue-600" / > ,
        title: "Smart Budget Control",
        description: "Plan your budget efficiently with intelligent suggestions tailored to you.",
    },
    {
        icon: < CreditCard className = "h-8 w-8 text-blue-600" / > ,
        title: "All Accounts in One Place",
        description: "Link bank accounts and cards to manage everything from a single dashboard.",
    },
    {
        icon: < Globe className = "h-8 w-8 text-blue-600" / > ,
        title: "Global Currency Support",
        description: "Track finances across currencies with automatic real-time conversion.",
    },
    {
        icon: < Zap className = "h-8 w-8 text-blue-600" / > ,
        title: "Instant Smart Suggestions",
        description: "Receive proactive tips to improve savings and optimize your spending.",
    },
]; { /*  How It Works Data */ }
export const howItWorksData = [{
        icon: < CreditCard className = "h-8 w-8 text-blue-600" / > ,
        title: "1. Sign Up Securely",
        description: "Create your account in seconds with a safe and simple registration process.",
    },
    {
        icon: < BarChart3 className = "h-8 w-8 text-blue-600" / > ,
        title: "2. Monitor Transactions",
        description: "Automatically track and categorize your expenses as they happen.",
    },
    {
        icon: < PieChart className = "h-8 w-8 text-blue-600" / > ,
        title: "3. Improve Your Finances",
        description: "Use AI-driven insights to make smarter financial decisions every day.",
    },
];

// Testimonials Data
export const testimonialsData = [{
        name: "sameeul jisanasanka",
        role: "Online Store Owner",
        image: "https://randomuser.me/api/portraits/men/65.jpg",
        quote: "“Finzy transformed how I manage business expenses. The insights helped me reduce costs and grow smarter.”",
    },
    {
        name: "JBB Bushra Morgan",
        role: "Freelancer",
        image: "https://randomuser.me/api/portraits/women/64.jpg",
        quote: "“Expense tracking is now effortless. Automation saves me time and keeps my finances organized.”",
    },
    {
        name: "Siyam Brooks",
        role: "University Student",
        image: "https://randomuser.me/api/portraits/men/68.jpg",
        quote: "“As a student, budgeting felt overwhelming. Finzy makes it simple, clear and stress-free.”",
    },
];