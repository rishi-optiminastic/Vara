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

export default function SecuritySection() {
  return (
    <div className="w-full border-b border-[rgba(55,50,47,0.12)] flex flex-col justify-center items-center">
      {/* Header */}
      <div className="self-stretch px-6 md:px-24 py-12 md:py-16 border-b border-[rgba(55,50,47,0.12)] flex justify-center items-center gap-6">
        <div className="w-full max-w-[586px] px-6 py-5 shadow-[0px_2px_4px_rgba(50,45,43,0.06)] overflow-hidden rounded-lg flex flex-col justify-start items-center gap-4 shadow-none">
          <Badge
            icon={<svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 1L3 5v6c0 5 4 9 9 9s9-4 9-9V5l-9-4z" stroke="#37322F" strokeWidth="1.2" fill="none"/></svg>}
            text="Security & Trust"
          />
          <div className="self-stretch text-center flex justify-center flex-col text-[#49423D] text-3xl md:text-5xl font-semibold leading-tight md:leading-[60px] font-sans tracking-tight">
            Security-first by design
          </div>
          <div className="self-stretch text-center text-[#605A57] text-base font-normal leading-7 font-sans">
            Append-only ledgers, encryption, role-based controls and auditable proofs for finance and compliance teams.
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="self-stretch px-4 md:px-9 overflow-hidden flex justify-start items-center">
        <div className="flex-1 py-8 md:py-11 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-lg p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.04)]">
            <h4 className="text-[#37322F] text-lg font-semibold mb-2">Auditable ledger + proofs</h4>
            <p className="text-[#605A57] text-sm leading-relaxed">Keep settlement proofs and append-only ledgers off the auction path while allowing verifiable on-chain proofs for audits and reconciliations.</p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h5 className="text-[#37322F] font-medium">Encryption</h5>
                <div className="text-[#605A57] text-sm">TLS everywhere, and encryption at rest for sensitive datasets.</div>
              </div>
              <div>
                <h5 className="text-[#37322F] font-medium">RBAC & Audit</h5>
                <div className="text-[#605A57] text-sm">Role-based access controls, audit trails, and least-privilege defaults.</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.04)] flex flex-col justify-center">
            <h5 className="text-[#37322F] font-semibold">Compliance-ready</h5>
            <div className="text-[#605A57] text-sm mt-2">SOC-ready controls, exportable audit logs, and configurable retention policies to meet finance and regulatory needs.</div>
            <div className="mt-4 flex gap-2">
              <div className="px-3 py-1 rounded-full bg-[#FFFFFF] text-sm text-[#37322F]">SOC</div>
              <div className="px-3 py-1 rounded-full bg-[#FFFFFF] text-sm text-[#37322F]">PCI</div>
              <div className="px-3 py-1 rounded-full bg-[#FFFFFF] text-sm text-[#37322F]">Audit</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
