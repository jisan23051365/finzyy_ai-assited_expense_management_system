"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getSummaryData({ accounts, filter }) {
  const { userId: clerkUserId } = await auth();

  const user = await db.user.findUnique({
    where: {
      clerkUserId,
    },
  });

  const where = {
    userId: user.id,
    status: "COMPLETED",
  };

  // account filter

  if (accounts?.length) {
    where.accountId = {
      in: accounts,
    };
  }

  // monthly filter

  if (filter === "monthly") {
    const start = new Date();
    start.setDate(1);

    where.date = {
      gte: start,
    };
  }

  // fetch transactions

  const transactions = await db.transaction.findMany({
    where,
  });

  // totals

  const income = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((a, b) => a + Number(b.amount), 0);

  const expense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((a, b) => a + Number(b.amount), 0);

  const balance = income - expense;

  // expense category

  const expenseCategory = {};

  transactions.forEach((t) => {
    if (t.type === "EXPENSE") {
      expenseCategory[t.category] =
        (expenseCategory[t.category] || 0) + Number(t.amount);
    }
  });

  // income category

  const incomeCategory = {};

  transactions.forEach((t) => {
    if (t.type === "INCOME") {
      incomeCategory[t.category] =
        (incomeCategory[t.category] || 0) + Number(t.amount);
    }
  });

  // monthly trend

  const monthly = {};

  transactions.forEach((t) => {
    const month = new Date(t.date).toLocaleString("default", {
      month: "short",
    });

    monthly[month] =
      (monthly[month] || 0) +
      (t.type === "INCOME" ? Number(t.amount) : -Number(t.amount));
  });

  return {
    income,
    expense,
    balance,

    expenseCategory,
    incomeCategory,
    monthly,
  };
}