import type { JSX } from "react"

export interface ScheduleRow {
  title: string
  body: string
  owner: string
  time: string
  surface: string
  track: string
  level: string
}

export interface DaySection {
  label: string
  rows: ReadonlyArray<ScheduleRow>
}

export interface SwissScheduleProps {
  heading: string
  body: string
  days: ReadonlyArray<DaySection>
}

export function SwissSchedule({ heading, body, days }: SwissScheduleProps): JSX.Element {
  return (
    <section id="roadmap" className="relative w-full py-12 md:py-20 border-t border-[#37322F]/15">
      <div className="grid grid-cols-12 gap-x-6">
        <div className="col-span-12 lg:col-span-7">
          <h2 className="text-[#1f40cd] uppercase tracking-[-0.01em] text-2xl md:text-3xl font-medium">
            {heading}
          </h2>
          <p className="mt-3 max-w-[520px] text-[13px] text-[#37322F]/70">{body}</p>
        </div>
      </div>

      <div className="mt-12 space-y-12">
        {days.map((d) => (
          <div key={d.label}>
            <div className="bg-[#1f40cd] text-white px-4 py-4 sm:px-6 sm:py-5">
              <div className="text-base font-medium tracking-[0.02em]">{d.label}</div>
              <div className="mt-1 text-[11px] tracking-[0.14em] opacity-80">
                ACCESS UNLOCKS AT THE START OF EACH PHASE
              </div>
            </div>
            <div className="mt-6 space-y-6">
              {d.rows.map((r) => (
                <ScheduleRowView key={r.title} row={r} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function ScheduleRowView({ row }: { row: ScheduleRow }): JSX.Element {
  return (
    <div className="grid grid-cols-12 gap-x-3 sm:gap-x-6 pb-6 border-b border-dashed border-[#37322F]/25">
      <div className="col-span-12 md:col-span-5">
        <div className="text-[#1f40cd] uppercase tracking-[-0.01em] text-lg font-medium">
          {row.title}
        </div>
        <p className="mt-2 max-w-[360px] text-[13px] text-[#37322F]/75">{row.body}</p>
      </div>
      <dl className="col-span-12 md:col-span-5 grid grid-cols-2 gap-x-3 sm:gap-x-6 gap-y-1 text-[12px] mt-4 md:mt-0">
        <Row k="OWNER" v={row.owner} />
        <Row k="TIME" v={row.time} />
        <Row k="SURFACE" v={row.surface} />
        <Row k="TRACK" v={row.track} />
        <Row k="LEVEL" v={row.level} />
      </dl>
      <div className="col-span-12 md:col-span-2 flex md:justify-end items-start mt-4 md:mt-0">
        <a
          href="#"
          className="inline-flex h-9 items-center px-4 text-[11px] tracking-[0.14em] text-[#1f40cd] border border-[#1f40cd]"
        >
          VIEW DETAILS
        </a>
      </div>
    </div>
  )
}

function Row({ k, v }: { k: string; v: string }): JSX.Element {
  return (
    <>
      <dt className="text-[#1f40cd] tracking-[0.12em]">{k}</dt>
      <dd className="text-[#37322F]/85 text-right">{v}</dd>
    </>
  )
}
