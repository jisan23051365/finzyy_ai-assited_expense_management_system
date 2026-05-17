import { seedTransactions } from "@/actions/seed";
// new added in day 4
export async function GET() {
    const result = await seedTransactions();
    return Response.json(result);
}