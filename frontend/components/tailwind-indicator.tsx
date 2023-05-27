export function TailwindIndicator() {
  if (process.env.NODE_ENV === 'production') return null;

  return (
    <div className="w-100 fixed bottom-1 left-1 z-50 flex h-6 items-center justify-center rounded-full bg-gray-800 p-3 font-mono text-xs text-white">
      <div className="block sm:hidden">xs: max: 768px </div>
      <div className="hidden sm:block md:hidden lg:hidden xl:hidden 2xl:hidden">
        sm: min: 769px, max: 1024px
      </div>
      <div className="hidden md:block lg:hidden xl:hidden 2xl:hidden">
        md: min: 1025px, max: 1366px
      </div>
      <div className="hidden lg:block xl:hidden 2xl:hidden">
        lg: min: 1367px
      </div>
      <div className="hidden xl:block 2xl:hidden">xl</div>
      <div className="hidden 2xl:block">2xl</div>
    </div>
  );
}
