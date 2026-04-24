import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-6xl font-bold text-teal-200 mb-4">404</p>
      <h1 className="font-display text-2xl font-bold text-stone-800 mb-2">Clinic not found</h1>
      <p className="text-stone-500 text-sm mb-8">This clinic page doesn't exist or may have been removed.</p>
      <Link
        href="/"
        className="px-5 py-2.5 bg-teal-600 text-white rounded-full text-sm font-medium hover:bg-teal-700 transition"
      >
        Back to all clinics
      </Link>
    </div>
  );
}
