// add new file main, and dashboard file also page.jsx

import React from "react";
import CreateAccountDrawer from "@/components/create-account-drawer";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { getDashboardData, getUserAccounts } from "@/actions/dashboard";
import AccountCard from "./_components/account-card";
import { getCurrentBugdet } from "@/actions/budget";
import BudgetProgress from "./_components/budget-progress";
import { DashboardOverview } from "./_components/transaction-overview";

async function DashboardPage() {
  const accounts = await getUserAccounts();

  const defaultAccount = accounts?.find((account) => account.isDefault);

  let budgetData = null;
  if (defaultAccount) {
    budgetData = await getCurrentBugdet(defaultAccount.id);
  }

  const transactions = await getDashboardData();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Budget Progress */}
      {defaultAccount && (
        <BudgetProgress
          initialBudget={budgetData?.budget}
          currentExpenses={budgetData?.currentExpenses || 0}
        />
      )}

      {/* Dashboard Overview */}
        <DashboardOverview
        accounts={accounts}
        transactions={transactions || []}
      />
      {/* Charts Section */}

      {/*Account Create */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <CreateAccountDrawer>
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed">
            <CardContent className="flex flex-col items-center justify-center text-muted-foreground h-full pt-5">
              <Plus className="h-10 w-10 mb-2" />
              <p className="font-medium text-sm">Add New Account</p>
            </CardContent>
          </Card>
        </CreateAccountDrawer>

        {/* render accounts */}
        {accounts.length > 0 &&
          accounts?.map((account) => {
            return <AccountCard key={account.id} account={account} />;
          })}
      </div>
    </div>
  );
}

export default DashboardPage;
