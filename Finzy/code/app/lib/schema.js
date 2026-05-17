// using zod for create schema
// this schema used me
import * as zod from "zod";
export const accountSchema = zod.z.object({
    name: zod.z.string().min(1, "Name is required"),
    type: zod.z.enum(['CURRENT', 'SAVINGS']),
    balance: zod.z.string().min(1, "Initial Balance is required"),
    isDefault: zod.z.boolean().default(false),
})

// this is for transaction add
export const transactionSchema = zod
    .object({
        type: zod.z.enum(["INCOME", "EXPENSE"]),
        amount: zod.z.string().min(1, "Amount is required"),
        description: zod.z.string().optional(),
        date: zod.z.date({ required_error: "Date is required" }),
        accountId: zod.z.string().min(1, "Account is required"),
        category: zod.z.string().min(1, "Category is required"),
        isRecurring: zod.z.boolean().default(false),
        recurringInterval: zod.z
            .enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"])
            .optional(),
    })
    .superRefine((data, ctx) => {
        if (data.isRecurring && !data.recurringInterval) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Recurring interval is required for recurring transactions",
                path: ["recurringInterval"],
            });
        }
    });