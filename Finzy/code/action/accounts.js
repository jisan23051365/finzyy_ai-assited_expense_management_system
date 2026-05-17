// this is for server action likeswith account, switch account 
"use server";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
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

export async function updateDefaultAccount(accountId) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });

        if (!user) {
            throw new Error("User not found");
        }
        // First, unset any existing default account
        await db.account.updateMany({
            where: {
                userId: user.id,
                isDefault: true,
            },
            data: { isDefault: false },
        });

        // set the new default account
        const account = await db.account.update({
            where: {
                id: accountId,
                userId: user.id,
            },
            data: { isDefault: true },
        });
        revalidatePath("/dashboard");
        return { success: true, data: serializeTransaction(account) };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// for account

export async function getAccountWithTransactions(accountId) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) {
        throw new Error("User not found");
    }

    const account = await db.account.findFirst({
        where: { id: accountId, userId: user.id },
        include: {
            transactions: {
                orderBy: { date: "desc" }
            },
            _count: {
                select: { transactions: true }
            }
        },

    });
    if (!account) return null;

    return {
        ...serializeTransaction(account),
        transactions: account.transactions.map(serializeTransaction)

    };
}

// for bulk delete
export async function bulkDeleteTransactions(transactionIds) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });

        if (!user) {
            throw new Error("User not found");
        }

        const transactions = await db.transaction.findMany({
            where: {
                id: { in: transactionIds },
                userId: user.id,
            },
        });

        const accountBalanceChanges = transactions.reduce((acc, transaction) => {
            const change =
                transaction.type === "EXPENSE" ? transaction.amount : -transaction.amount;

            acc[transaction.accountId] = (acc[transaction.accountId] || 0) + change;

            return acc;
        }, {});
        // delete transaction and update account balance 
        await db.$transaction(async(tx) => {
            // delete transactions
            await tx.transaction.deleteMany({
                where: {
                    id: { in: transactionIds },
                    userId: user.id,
                }
            });

            // update account balance
            for (const [accountId, balanceChange] of Object.entries(
                    accountBalanceChanges
                )) {
                await tx.account.update({
                    where: { id: accountId },
                    data: {
                        balance: {
                            increment: balanceChange,
                        }

                    }
                })
            }


        });
        revalidatePath("/dashboard");
        revalidatePath("/account/[id]");
        return { success: true };

    } catch (error) {
        return { success: false, error: error.message };

    }

}