"use server";
// database connect 
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// this is for next js show a error for float number thats why balace amount convert into number before reurn
const serializeTransaction = (obj) => {
    const serialized = {...obj };
    if (obj.balance) {
        serialized.balance = obj.balance.toNumber();
    }
    // letter works
    if (obj.amount) {
        serialized.amount = obj.amount.toNumber();
    }
    return serialized;
}


//server action
export async function createAccount(data) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized")
        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });
        if (!user) {
            throw new Error("user not found");
        }
        // convert balance into float before saving
        const balanceFloat = parseFloat(data.balance)
            // assure that balance is number
        if (isNaN(balanceFloat)) {
            throw new Error("Invalid balance Amount");

        }
        // check this is user first account
        const existingAccounts = await db.account.findMany({
            where: { userId: user.id },
        });

        const shouldBeDefault = existingAccounts.length === 0 ? true : data.isDefault;
        // if default account, then should consider other as a not default, unset other account
        if (shouldBeDefault) {
            await db.account.updateMany({
                where: { userId: user.id, isDefault: true },
                data: { isDefault: false },
            });
        }
        const account = await db.account.create({
            // take user given data
            data: {
                ...data,
                balance: balanceFloat,
                userId: user.id,
                isDefault: shouldBeDefault,

            }
        })
        const serializeAccount = serializeTransaction(account);
        // this is help for refacth tha value
        revalidatePath("/dashboard");
        return { success: true, data: serializeAccount };

    } catch (error) {
        throw new Error(error.message)

    }
}
// new server action 
export async function getUserAccounts(data) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized")
    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });
    if (!user) {
        throw new Error("user not found");
    }

    const accounts = await db.account.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        include: {
            _count: {
                select: {
                    transactions: true,

                },
            },

        },
    });
    const serializeAccount = accounts.map(serializeTransaction);
    return serializeAccount;
}

//server action for dashboard overview
export async function getDashboardData() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) {
        throw new Error("User not found");
    }

    // Get all user transactions
    const transactions = await db.transaction.findMany({
        where: { userId: user.id },
        orderBy: { date: "desc" },
    });

    return transactions.map(serializeTransaction);
}