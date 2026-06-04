import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import SearchTrigger from './SearchTrigger';
import SearchModal from './SearchModal';
import MobileMenu from './MobileMenu';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm px-6 py-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <Link href="/" className="text-lg font-bold text-gray-900 dark:text-white flex-shrink-0">
          Roadify
        </Link>
        <div className="flex flex-1 items-center justify-center">
          <SearchTrigger />
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex gap-6 text-sm text-gray-500 dark:text-gray-400">
            <Link href="/#software" className="hover:text-gray-900 dark:hover:text-white transition-colors">Software</Link>
            <Link href="/#data" className="hover:text-gray-900 dark:hover:text-white transition-colors">Data</Link>
            <Link href="/#ai" className="hover:text-gray-900 dark:hover:text-white transition-colors">AI & ML</Link>
          </div>
          <ThemeToggle />
          <MobileMenu />
        </div>
      </div>
      <SearchModal />
    </nav>
  );
}
