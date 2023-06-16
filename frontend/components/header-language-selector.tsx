import { Separator } from './ui/separator';

export function HeaderLanguageSelector() {
  return (
    <div className="flex h-5 items-center space-x-2">
      <div className="font-bold">EN</div>
      <Separator orientation="vertical" className="h-4" />
      <div>EST</div>
    </div>
  );
}
