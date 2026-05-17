"use client";

export default function SummaryTransactionTable({ transactions }) {
  return (
    <div className="border rounded-lg overflow-x-auto">
      <table className="w-full">
        <thead className="border-b bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="p-2 text-left">Date</th>
            <th className="p-2 text-left">Description</th>
            <th className="p-2 text-left">Category</th>
            <th className="p-2 text-left">Type</th>
            <th className="p-2 text-left">Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions.map((t) => (
              <tr key={t.id} className="border-b">
                <td className="p-2">{new Date(t.date).toLocaleDateString()}</td>
                <td className="p-2">{t.description}</td>
                <td className="p-2">{t.category}</td>
                <td className="p-2">{t.type}</td>
                <td className="p-2">{t.amount.toFixed(2)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center p-4 text-gray-500">
                No transactions found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}