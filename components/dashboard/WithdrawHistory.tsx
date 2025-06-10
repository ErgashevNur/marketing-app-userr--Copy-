import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface WithdrawHistoryItem {
  id: number;
  amount: number;
  status: string;
  date: string;
  card: string;
}

interface WithdrawHistoryProps {
  history: WithdrawHistoryItem[];
  currency: string;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("default", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function WithdrawHistory({ history, currency }: WithdrawHistoryProps) {
  return (
    <Card className="bg-white dark:bg-[#111827] shadow-lg">
      <CardHeader>
        <CardTitle className="text-black dark:text-white">
          Yechish tarixi
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {history.length === 0 && (
            <p className="text-gray-600 dark:text-gray-300">Tarix yo‘q</p>
          )}
          {history.map((item) => (
            <div
              key={item.id}
              className="flex flex-col border-b pb-4 last:border-0 last:pb-0"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-black dark:text-white">
                    {item.amount} {currency}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {formatDate(item.date)}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    {item.card}
                  </p>
                </div>
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                    item.status === "processed"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                  }`}
                >
                  {item.status === "processed" ? "Tasdiqlangan" : "Kutilmoqda"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
