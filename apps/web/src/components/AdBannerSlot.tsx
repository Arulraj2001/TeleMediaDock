import React from 'react';

export const AdBannerSlot: React.FC = () => {
  return (
    <div className="w-full my-8 p-4 rounded-[12px] bg-[#111827] border border-[#243047] text-center space-y-2 select-none">
      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Advertisement</span>
      <div className="p-4 rounded-[8px] bg-[#172033] border border-[#243047] flex items-center justify-between text-xs text-slate-300">
        <div>
          <p className="font-semibold text-[#F8FAFC]">Privacy-First Web Hosting & Tools</p>
          <p className="text-[11px] text-slate-400">High-speed, encrypted cloud infrastructure for modern web applications.</p>
        </div>
        <a
          href="https://mediadock.app"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 rounded-[6px] bg-[#4F46E5] text-white font-medium hover:bg-[#4338CA] transition-colors"
        >
          Learn More
        </a>
      </div>
    </div>
  );
};
