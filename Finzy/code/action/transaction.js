"use server";

import aj from "@/lib/arcjet";
import { db } from "@/lib/prisma";
import { request } from "@arcjet/next";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";
import { Buffer } from "buffer";
import sharp from "sharp";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_RECEIPT_API_KEY);


const serializeAmount = (obj) => ({
    ...obj,
    amount: obj.amount.toNumber(),
});

// this is for transaction form
export async function createTransaction(data) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        // add arject api for limit transaction
        // get request
        const req = await request();
        // check rate limit
        const decision = await aj.protect(req, {
            userId,
            requested: 1,
        });

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                const { remaining, reset } = decision.reason;
                console.error({
                    code: "RATE_LIMIT_EXCEEDED",
                    details: {
                        remaining,
                        resetInSeconds: reset,
                    },
                });

                throw new Error("Too many requests. Please try again later.");
            }

            throw new Error("Request blocked");
        };

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });
        if (!userId) {
            throw new Error("User Not Found");
        }

        const account = await db.account.findUnique({
            where: {
                id: data.accountId,
                userId: user.id,
            },
        });
        if (!account) {
            throw new Error("Account Not Faound");
        }

        const balanceChange = data.type === "EXPENSE" ? -data.amount : data.amount;
        const newBalance = account.balance.toNumber() + balanceChange;

        // create Transaction
        const transaction = await db.$transaction(async(tx) => {
            const newTransaction = await tx.transaction.create({
                data: {
                    ...data,
                    userId: user.id,
                    nextRecurringDate: data.isRecurring && data.recurringInterval ?
                        calculateNextRecurringDate(data.date, data.recurringInterval) : null,
                },
            });
            // Update account balance
            await tx.account.update({
                where: { id: data.accountId },
                data: {
                    balance: newBalance,
                },
            });

            return newTransaction;
        });
        revalidatePath("/dashboard");
        revalidatePath(`/account/${transaction.accountId}`);

        return { success: true, data: serializeAmount(transaction) }
    } catch (error) {
        throw new Error(error.message);
    }
}

// this is for Help Calculate Reccuring Date
function calculateNextRecurringDate(startDate, interval) {
    const date = new Date(startDate);

    switch (interval) {
        case "DAILY":
            date.setDate(date.getDate() + 1);
            break;
        case "WEEKLY":
            date.setDate(date.getDate() + 7);
            break;
        case "MONTHLY":
            date.setMonth(date.getMonth() + 1);
            break;
        case "YEARLY":
            date.setFullYear(date.getFullYear() + 1);
            break;
    }

    return date;
}

//Receipts Scanning part, must update mb in next.config


// 🔁 Retry handler for 429
async function retryGenerate(model, payload, retries = 3) {
    try {
        return await model.generateContent(payload);
    } catch (error) {
        if (error ? .status === 429 && retries > 0) {
            console.warn("⚠️ Rate limit hit. Retrying...");
            await new Promise((res) => setTimeout(res, 2000));
            return retryGenerate(model, payload, retries - 1);
        }
        throw error;
    }
}

// ⏳ Throttle control (global)
let lastCall = 0;
async function throttle() {
    const now = Date.now();
    if (now - lastCall < 1500) {
        await new Promise((res) => setTimeout(res, 1500));
    }
    lastCall = Date.now();
}
export async function scanReceipt(file) {

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Convert File to ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();

        const fileBuffer = Buffer.from(arrayBuffer);

        // ✅ Compress image (CRITICAL)
        const compressedBuffer = await sharp(fileBuffer)
            .resize({ width: 800 }) // reduce size
            .jpeg({ quality: 60 })
            .toBuffer();
        // Convert ArrayBuffer to Base64
        const base64String = compressedBuffer.toString("base64");
        const prompt = `Analyze this receipt image and extract the following information in JSON format:
      - Total amount (just the number)
      - Date (in ISO format)
      - Description or items purchased (brief summary)
      - Merchant/store name
      - Suggested category (one of: housing,transportation,groceries,utilities,entertainment,food,shopping,healthcare,education,personal,travel,insurance,gifts,bills,other-expense )
      
      Only respond with valid JSON in this exact format:
      {
        "amount": number,
        "date": "ISO date string",
        "description": "string",
        "merchantName": "string",
        "category": "string"
      }

      If its not a recipt, return an empty object
        `;

        // ✅ Throttle request
        await throttle();

        // ✅ Safe API call
        const result = await retryGenerate(model, [{
                inlineData: {
                    data: base64String,
                    mimeType: "image/jpeg",
                },
            },
            { text: prompt },
        ]);


        const response = await result.response;
        const text = response.text();
        // this is for clean text 

        const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

        let data;
        try {
            data = JSON.parse(cleanedText);
        } catch (err) {
            console.error("❌ JSON Parse Error:", cleanedText);
            throw new Error("Invalid JSON from Gemini");
        }
        // ✅ Edge case handling
        if (!data || Object.keys(data).length === 0) {
            return null;
        }
        return {
            amount: parseFloat(data.amount) || 0,
            date: data.date ? new Date(data.date) : new Date(),
            description: data.description || "",
            category: data.category || "other-expense",
            merchantName: data.merchantName || "",
        };
    } catch (error) {
        console.error("Error scanning receipt:", error);
        throw new Error("Failed to scan receipt");
    }
}


// need perticular transaction
export async function getTransaction(id) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    const transaction = await db.transaction.findUnique({
        where: {
            id,
            userId: user.id,
        },
    });

    if (!transaction) throw new Error("Transaction not found");

    return serializeAmount(transaction);
}
// Update Transaction part

export async function updateTransaction(id, data) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });
        if (!user) throw new Error("User not found");

        // Get original transaction to calculate balance change
        const originalTransaction = await db.transaction.findUnique({
            where: {
                id,
                userId: user.id,
            },
            include: {
                account: true,
            },
        });

        if (!originalTransaction) throw new Error("Transaction not found");

        // Calculate balance changes
        const oldBalanceChange =
            originalTransaction.type === "EXPENSE" ?
            -originalTransaction.amount.toNumber() :
            originalTransaction.amount.toNumber();


        const newBalanceChange =
            data.type === "EXPENSE" ? -data.amount : data.amount;

        const netBalanceChange = newBalanceChange - oldBalanceChange;

        // Update transaction and account balance in a transaction
        const transaction = await db.$transaction(async(tx) => {
            const updated = await tx.transaction.update({
                where: {
                    id,
                    userId: user.id,
                },
                data: {
                    ...data,
                    nextRecurringDate: data.isRecurring && data.recurringInterval ?
                        calculateNextRecurringDate(data.date, data.recurringInterval) : null,
                },

            })

            // update account balacne
            await tx.account.update({
                where: { id: data.accountId },
                data: {
                    balance: {
                        increment: netBalanceChange,
                    },
                }
            })
            return updated;
        })
        revalidatePath("/dashboard");
        revalidatePath(`/account/${data.accountId}`);

        return { success: true, data: serializeAmount(transaction) };

    } catch (error) {
        throw new Error(error.message);
    }
}