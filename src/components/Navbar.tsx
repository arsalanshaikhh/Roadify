import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import SearchTrigger from './SearchTrigger';
import SearchModal from './SearchModal';

export default function Navbar() {
  return (
    <nav className="border-b border-gray-800 bg-gray-950 px-6 py-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <Link href="/" className="text-lg font-bold text-white flex-shrink-0">
          Roadify
        </Link>
        <div className="flex flex-1 items-center justify-center">
          <SearchTrigger />
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-6 text-sm text-gray-400">
            <Link href="/#software" className="hover:text-white transition-colors">
              Software
            </Link>
            <Link href="/#data" className="hover:text-white transition-colors">
              Data
            </Link>
            <Link href="/#ai" className="hover:text-white transition-colors">
              AI & ML
            </Link>
          </div>
          <ThemeToggle />
        </div>
      </div>
      <SearchModal />
    </nav>
  );
}
