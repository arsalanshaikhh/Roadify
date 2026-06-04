import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import SearchTrigger from './SearchTrigger';
import SearchModal from './SearchModal';
import MobileMenu from './MobileMenu';
import MobileSearchButton from './MobileSearchButton';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm px-6 py-3">
      <div className="mx-auto flex max-w-6xl items-center gap-4 md:grid md:grid-cols-3">

        {/* Left — Logo */}
        <div className="flex items-center">
          <Link href="/" className="group flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white text-sm font-bold shadow-sm group-hover:bg-indigo-500 transition-colors">
              R
            </div>
            <span className="text-base font-bold text-gray-900 dark:text-white">
              Roadify
            </span>
          </Link>
        </div>

        {/* Center — Search (desktop only, truly centered in grid) */}
        <div className="hidden md:flex items-center justify-center">
          <SearchTrigger />
        </div>

        {/* Right — Nav links + icons */}
        <div className="ml-auto flex items-center gap-2 md:ml-0 md:justify-end">
          <div className="hidden md:flex gap-5 text-sm text-gray-500 dark:text-gray-400">
            <Link href="/#software" className="hover:text-gray-900 dark:hover:text-white transition-colors">Software</Link>
            <Link href="/#data" className="hover:text-gray-900 dark:hover:text-white transition-colors">Data</Link>
            <Link href="/#ai" className="hover:text-gray-900 dark:hover:text-white transition-colors">AI & ML</Link>
          </div>
          <MobileSearchButton />
          <ThemeToggle />
          <MobileMenu />
        </div>

      </div>
      <SearchModal />
    </nav>
  );
}
