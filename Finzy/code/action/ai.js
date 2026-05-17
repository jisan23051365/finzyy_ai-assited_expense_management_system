"use server";

import { db } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGOLE_GEMINI_API_KEY)

export async function askAI(question, accountId) {
    try {
        const user = await currentUser();
        if (!user) throw new Error("Unauthorized");

        if (!process.env.GOOGOLE_GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY is not configured.");
        }

        // Fetch transactions
        const transactions = await db.transaction.findMany({
            where: {
                user: { clerkUserId: user.id },
                ...(accountId && { accountId }),
            },
            include: { account: true },
            orderBy: { date: "desc" },
           
        });

        const formattedTransactions = transactions.map((t) => ({
            amount: Number(t.amount),
            type: t.type,
            category: t.category,
            description: t.description || "",
            date: t.date,
            account: t.account.name,
        }));

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash", 
        });

        const prompt = `
You are Fina, a smart and friendly financial assistant.

User Question:
${question}

Transaction Data (JSON):
${JSON.stringify(formattedTransactions, null, 2)}

Instructions:
- Answer ONLY the user's question using the transaction data above.
- Use plain text only show account name — no markdown, no asterisks, no bullet symbols, no hashtags.
- Be concise, clear, and professional.
- If asked Income then only shows income, if asked expenses then only show expenses,
- If asked about savings: show total income minus total expenses.
- If asked for comparison: show both values and state which is higher.
- If asked for highest/lowest: mention the category or account clearly.
- If no relevant data exists: say "I could not find any data for this request."
- Keep the tone friendly, natural, and professional.
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        if (!text || text.trim() === "") {
            throw new Error("Empty response received from AI.");
        }

        return text;
    } catch (error) {
        console.error("askAI Error:", error.message || error);
        // Friendly quota error message
        if (error.message?.includes("429") || error.message?.includes("quota")) {
            throw new Error("I'm receiving too many requests right now. Please wait a moment and try again.");
        }

        throw new Error(
            error.message || "AI is currently busy. Please try again in a few minutes."
        );
    }
}