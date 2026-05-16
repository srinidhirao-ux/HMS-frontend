import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 text-center">
      <div className="rounded-lg bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">404</h1>
        <p className="mt-2 text-sm text-gray-500">The page you are looking for does not exist.</p>
        <Link to="/" className="mt-5 inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
