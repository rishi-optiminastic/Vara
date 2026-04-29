import { Button } from "@/components/ui/button"
export function DashboardPreview() {
  return (
    <section className="relative pb-16">
      <div className="max-w-[1060px] mx-auto px-4">
        {/* Dashboard Interface Mockup */}
        <div className="relative bg-white rounded-lg shadow-lg border border-[#e0dedb] overflow-hidden">
          {/* Dashboard Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#e0dedb]">
            <div className="flex items-center gap-3">
              <div className="text-[#37322f] font-semibold">Varaads Exchange</div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-[#605a57]">Organization</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#37322f] rounded-full"></div>
            </div>
          </div>

          {/* Sidebar and Main Content */}
          <div className="flex">
            {/* Sidebar */}
            <div className="w-48 bg-[#fbfaf9] border-r border-[#e0dedb] p-4">
              <nav className="space-y-2">
                <div className="text-xs font-medium text-[#605a57] uppercase tracking-wide mb-3">Navigation</div>
                {["Overview", "Campaigns", "Placements", "Auction Ops", "Reporting", "Ledger"].map((item) => (
                  <div key={item} className="text-sm text-[#37322f] py-1 hover:text-[#37322f]/80 cursor-pointer">
                    {item}
                  </div>
                ))}
              </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-[#37322f]">Campaigns</h2>
                <Button className="bg-[#37322f] hover:bg-[#37322f]/90 text-white text-sm">Create campaign</Button>
              </div>

              {/* Table Mockup */}
              <div className="bg-white border border-[#e0dedb] rounded-lg overflow-hidden">
                <div className="grid grid-cols-6 gap-4 p-4 bg-[#fbfaf9] border-b border-[#e0dedb] text-sm font-medium text-[#605a57]">
                  <div>Campaign</div>
                  <div>Status</div>
                  <div>Placement</div>
                  <div>Budget</div>
                  <div>Start</div>
                  <div>End</div>
                </div>

                {/* Table Rows */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="grid grid-cols-6 gap-4 p-4 border-b border-[#e0dedb] text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-[#37322f] rounded-full"></div>
                      <span>USDC Growth - Q2</span>
                    </div>
                    <div>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          i % 3 === 0
                            ? "bg-green-100 text-green-700"
                            : i % 3 === 1
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {i % 3 === 0 ? "Completed" : i % 3 === 1 ? "Active" : "Draft"}
                      </span>
                    </div>
                    <div className="text-[#605a57]">homepage_top_970x250</div>
                    <div className="font-medium">$8,000.00</div>
                    <div className="text-[#605a57]">1 Aug 2026</div>
                    <div className="text-[#605a57]">31 Aug 2026</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
