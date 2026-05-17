"use client";

import { useEffect, useState, useMemo } from "react";
import { getSummaryData } from "@/actions/summary";
import SummaryCharts from "./summary-charts";
import { Button } from "@/components/ui/button";
import SummaryTransactionTable from "./summary-transaction-table";

import Link from "next/link";
import { ChevronDown, Sparkles } from "lucide-react";

export default function SummaryFilters({
  accounts,
  transactions: initialTransactions,
}) {
  const [account, setAccount] = useState("");
  const [filter, setFilter] = useState("overall");
  const [data, setData] = useState(null);

  // Month dropdown
  const months = [
    { value: "overall", label: "Yearly" },
    { value: "0", label: "January" },
    { value: "1", label: "February" },
    { value: "2", label: "March" },
    { value: "3", label: "April" },
    { value: "4", label: "May" },
    { value: "5", label: "June" },
    { value: "6", label: "July" },
    { value: "7", label: "August" },
    { value: "8", label: "September" },
    { value: "9", label: "October" },
    { value: "10", label: "November" },
    { value: "11", label: "December" },
  ];

  // Fetch summary data for charts
  useEffect(() => {
    async function load() {
      const res = await getSummaryData({
        accounts: account === "all" ? [] : [account],
        filter,
      });
      setData(res);
    }
    load();
  }, [account, filter]);

  const filteredTransactions = useMemo(() => {
    if (!initialTransactions) return [];

    return initialTransactions
      .filter((t) => {
        const accountMatch = account === "all" || t.accountId === account; // <-- same logic for All Account
        const monthMatch =
          filter === "overall"
            ? true
            : new Date(t.date).getMonth().toString() === filter;
        return accountMatch && monthMatch;
      })
      .map((t) => {
        // <-- NEW: append account info when "All Account" is selected
        if (account === "all") {
          const accObj = accounts.find((a) => a.id === t.accountId);
          return {
            ...t,
            description: `${t.description} -${accObj?.name}`, // append id-name
          };
        }
        return t;
      });
  }, [initialTransactions, account, filter, accounts]);

  // CSV export for filtered transaction table
  const exportCSV = () => {
    if (!filteredTransactions || filteredTransactions.length === 0) return;

    const rows = filteredTransactions.map((t) => [
      new Date(t.date).toLocaleDateString(),
      t.description,
      t.category,
      t.type,
      t.amount,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        "Date,Description,Category,Type,Amount",
        ...rows.map((r) => r.join(",")),
      ].join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "transactions.csv";
    link.click();
  };

  return (
    <div className="space-y-9">
      {/* Filters */}
      <div>
        <div className="flex items-center gap-6 text-gray-700 font-semibold border-b border-gray-200 pb-2">
          {/* Wrap with relative */}
          <div className="relative">
            <select
              className="h-11 rounded-xl border bg-white/70 backdrop-blur-md shadow-sm hover:shadow-md transition cursor-pointer px-4 pr-10 appearance-none bg-no-repeat focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              onChange={(e) => setAccount(e.target.value)}
              value={account}
            >
              <option value="all">All Accounts</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>

            {/* Icon now works */}
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
          <Link href={"/ai"}>
        <Button className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white font-semibold px-4 py-2 rounded-xl shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
          <Sparkles className="w-4 h-4" />
          Fina Insights
          </Button>
        </Link>
        </div>
      </div>

      {/* Charts */}
      {data && <SummaryCharts data={data} />}
      <div className="flex gap-4">
        {/* Month Selector */}
        <select
          className="border p-2 rounded text-gray-700 font-semibold"
          onChange={(e) => setFilter(e.target.value)}
          value={filter}
        >
          {months.map((m) => (
            <option
              key={m.value}
              value={m.value}
              className=" text-gray-700 font-semibold"
            >
              {m.label}
            </option>
          ))}
        </select>

        <Button
          onClick={exportCSV}
          variant="outline"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all hover:text-white duration-200 flex items-center gap-2"
        >
          Export CSV
        </Button>
      </div>

      {/* Transaction Table */}
      <SummaryTransactionTable transactions={filteredTransactions} />
    </div>
  );
}