import { db } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AiChat from "./_components/ai-chat";
import { Bot, ShieldCheck, Clock, DollarSign } from "lucide-react";

export const metadata = {
  title: "Fina AI | Your Financial Assistant",
};

export default async function AIPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const accounts = await db.account.findMany({
    where: {
      user: {
        clerkUserId: user.id,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Convert Decimal to plain number for client component
  const formattedAccounts = accounts.map((acc) => ({
    id: acc.id,
    name: acc.name,
    type: acc.type,
    balance: Number(acc.balance),
    isDefault: acc.isDefault,
  }));

  return (
    <div className="min-h-screen space-y-6 pb-10">
      {/* Header */}
      <div className="px-5">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          {/* Title row */}
          <div className="flex items-center gap-3 mb-2">
            {/* Bot avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-md">
              <Bot className="w-5 h-5 text-white" />
            </div>

            <div className="flex items-center gap-2">
              <h1 className="text-4xl font-bold gradient-title leading-none">
                Fina
              </h1>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 tracking-wide">
                AI
              </span>
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-muted-foreground text-sm mb-4 pl-[52px]">
            Your personal financial assistant
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-2 pl-[52px]">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground px-3 py-1.5 rounded-full border bg-muted/40">
              <ShieldCheck className="w-3 h-3" />
              Your data only
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground px-3 py-1.5 rounded-full border bg-muted/40">
              <Clock className="w-3 h-3" />
              Real-time insights
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground px-3 py-1.5 rounded-full border bg-muted/40">
              <DollarSign className="w-3 h-3" />
              Selected Accounts
            </span>
          </div>
        </div>
      </div>

      <AiChat accounts={formattedAccounts} />
    </div>
  );
}