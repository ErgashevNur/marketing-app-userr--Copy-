export function SkeletonCard() {
  return (
    <div className="animate-pulse w-full flex flex-col bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mx-auto">
      <div className="w-full h-72 bg-gray-200 dark:bg-gray-800 rounded-t-2xl" />
      <div className="flex-1 p-6 flex flex-col gap-3">
        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/3 mt-2" />
        <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-full mt-4" />
      </div>
    </div>
  );
}