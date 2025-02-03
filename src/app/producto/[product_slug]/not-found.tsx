import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="px-4 py-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Category Not Found</h2>
        <p className="text-gray-600 mb-4">
          The category you&apos;re looking for doesn&apos;t exist or has no products.
        </p>
        <Link href="/" className="text-blue-500 hover:text-blue-700 underline">
          Return Home
        </Link>
      </div>
    </div>
  );
}
