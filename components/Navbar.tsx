import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md w-full p-4 flex justify-between items-center">
      <div className="text-2xl font-bold text-blue-600">
        <Link href="/">شراكة</Link>
      </div>
      <div className="flex gap-4">
        <Link href="/login" className="text-gray-600 hover:text-blue-600 font-medium transition">
          تسجيل الدخول
        </Link>
        <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
          حساب جديد
        </Link>
      </div>
    </nav>
  );
}