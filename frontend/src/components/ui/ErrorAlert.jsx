export default function ErrorAlert({ message, onRetry }) {
  if (!message) return null;
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-red-700">
      <p className="text-sm font-medium">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg bg-red-100 px-3 py-1.5 text-sm font-semibold text-red-800 hover:bg-red-200"
        >
          Retry
        </button>
      )}
    </div>
  );
}
