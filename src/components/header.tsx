import React from 'react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-sky-500 shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Website Name */}
        <Link href="/" className="text-2xl font-bold text-white">
          Mejor Precio
        </Link>

        {/* Search Bar */}
        <div className="flex items-center ml-4 w-full md:w-1/2">
          <input
            type="text"
            placeholder="Search..."
            className="border rounded-md p-2 w-full bg-white"
          />
        </div>
      </div>
    </header>
  );
}
