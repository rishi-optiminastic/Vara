"use client"

import type React from "react"

// Badge component for consistency
function Badge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="px-[14px] py-[6px] bg-white shadow-[0px_0px_0px_4px_rgba(55,50,47,0.05)] overflow-hidden rounded-[90px] flex justify-start items-center gap-[8px] border border-[rgba(2,6,23,0.08)] shadow-xs">
      <div className="w-[14px] h-[14px] relative overflow-hidden flex items-center justify-center">{icon}</div>
      <div className="text-center flex justify-center flex-col text-[#37322F] text-xs font-medium leading-3 font-sans">
        {text}
      </div>
    </div>
  )
}

export default function IntegrationsSection() {
  return (
    <div className="w-full border-b border-[rgba(55,50,47,0.12)] flex flex-col justify-center items-center">
      {/* Header Section */}
      <div className="self-stretch px-6 md:px-24 py-12 md:py-16 border-b border-[rgba(55,50,47,0.12)] flex justify-center items-center gap-6">
        <div className="w-full max-w-[586px] px-6 py-5 shadow-[0px_2px_4px_rgba(50,45,43,0.06)] overflow-hidden rounded-lg flex flex-col justify-start items-center gap-4 shadow-none">
          <Badge
            icon={<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="3" height="3" stroke="#37322F" strokeWidth="1" fill="none"/><rect x="6" y="1" width="3" height="3" stroke="#37322F" strokeWidth="1" fill="none"/></svg>}
            text="Integrations"
          />
          <div className="self-stretch text-center flex justify-center flex-col text-[#49423D] text-3xl md:text-5xl font-semibold leading-tight md:leading-[60px] font-sans tracking-tight">
            Plug in everywhere, ship faster
          </div>
          <div className="self-stretch text-center text-[#605A57] text-base font-normal leading-7 font-sans">
            SDKs, publisher adapters, server-side connectors, and standard APIs to reduce integration work.
          </div>
        </div>
      </div>

      {/* Logos / SDK Grid */}
      <div className="self-stretch px-4 md:px-9 overflow-hidden flex justify-start items-center">
        <div className="flex-1 py-8 md:py-11 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center gap-2 p-4 bg-white rounded-lg shadow-[0px_1px_2px_rgba(0,0,0,0.04)]"
            >
              <div className="w-10 h-10 rounded-full bg-[#F7F5F3] flex items-center justify-center">
                <img src="/horizon-icon.svg" alt="integration" className="w-6 h-6 object-contain" />
              </div>
              <div className="text-sm text-[#37322F] font-medium">SDK {index + 1}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
