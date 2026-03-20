import { toAbsoluteUrl } from '@/lib/helpers';

export function SidebarHeader() {
  return (
    <div className="flex shrink-0 justify-center pl-1 pr-3 h-[80px]">
      <img
        src={toAbsoluteUrl('/media/logos/english_quest.svg')}
        className="default-logo object-contain h-[80px]"
        alt="Default Logo"
      />
      <img
        src={toAbsoluteUrl('/media/logos/english_quest.svg')}
        className="small-logo h-[22px] max-w-none"
        alt="Mini Logo"
      />
    </div>
  );
}
