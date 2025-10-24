'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/hello')
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">
        Koneksi Next.js ↔ Laravel 🚀
      </h1>
      <p className="text-lg bg-white p-4 rounded shadow">
        {data ? data.message : 'Mengambil data dari backend...'}
      </p>
    </main>
  );
}
