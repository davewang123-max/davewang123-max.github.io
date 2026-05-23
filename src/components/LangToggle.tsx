import { useLanguage } from '../hooks/useLanguage';

export default function LangToggle() {
  const { isEnglish, toggle } = useLanguage();

  return (
    <button
      onClick={toggle}
      className="relative inline-flex items-center h-8 w-14 rounded-full bg-slate-100 p-0.5 transition-colors hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
      aria-label={isEnglish ? 'Switch to Chinese' : '切换到英文'}
    >
      <span
        className={`inline-flex items-center justify-center h-7 w-7 rounded-full bg-white text-xs font-medium shadow-sm transition-transform duration-200 ${
          isEnglish ? 'translate-x-0' : 'translate-x-6'
        }`}
      >
        {isEnglish ? 'EN' : '中'}
      </span>
    </button>
  );
}
