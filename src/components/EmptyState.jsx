import { Inbox } from 'lucide-react';

function EmptyState({ title, message }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg bg-white p-10 text-center shadow-sm">
      <Inbox className="mb-3 h-10 w-10 text-gray-400" />
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-gray-500">{message}</p>
    </div>
  );
}

export default EmptyState;
