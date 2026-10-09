import Link from 'next/link';
import Logo from '../components/Logo';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 text-center">
      <div className="max-w-md w-full space-y-6 bg-white p-10 rounded-3xl border border-slate-200/80 shadow-xl">
        <Logo variant="compact" size="lg" className="justify-center mx-auto" />
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-[#132238]">404 - Page Not Found</h2>
          <p className="text-xs text-slate-500">
            The monument or route you are looking for is not located on our map.
          </p>
        </div>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-[#F58220] hover:bg-[#DC6E10] text-white font-bold rounded-2xl text-xs shadow-md transition-all"
        >
          Return to ExploreBharat Home
        </Link>
      </div>
    </div>
  );
}
