import { getUserAccounts, getDashboardData } from "@/actions/dashboard";
import SummaryFilters from "./_components/summary-filters";
import { Suspense } from "react";
import { BarLoader } from "react-spinners";


async function SummaryPage() {
  const accounts = await getUserAccounts();
  const transactions = await getDashboardData(); // fetch all transactions

  return (
    <div className="w-full max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
      <h1 className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-6xl font-bold mb-10  gradient-title space-y-8">
        Summary Analysis
      </h1>
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}
      >
        <SummaryFilters accounts={accounts} transactions={transactions} />
        
      </Suspense>
    </div>
  );
}

export default SummaryPage;
