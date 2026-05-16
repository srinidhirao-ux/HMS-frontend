function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-lg bg-white p-6 shadow-sm">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
      <p className="text-sm text-gray-500">{text}</p>
    </div>
  );
}

export default LoadingSpinner;
