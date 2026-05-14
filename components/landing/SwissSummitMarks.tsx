"use client"
import { motion } from "framer-motion"
import type { JSX } from "react"

const C = "#1f40cd"
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]
const VIEWPORT = { once: true, margin: "0px 0px -60px 0px" } as const

function GridDots({ cols, rows, w, h }: { cols: number; rows: number; w: number; h: number }): JSX.Element {
  const cw = w / cols
  const rh = h / rows
  const dots: JSX.Element[] = []
  for (let r = 0; r <= rows; r++) {
    for (let c = 0; c <= cols; c++) {
      dots.push(<circle key={`${r}-${c}`} cx={c * cw} cy={r * rh} r="0.55" fill={C} opacity="0.16" />)
    }
  }
  return <g>{dots}</g>
}

function CornerTicks({ w, h }: { w: number; h: number }): JSX.Element {
  const t = 4
  return (
    <g stroke={C} strokeOpacity="0.45" strokeWidth="0.7" fill="none">
      <path d={`M0 ${t} L0 0 L${t} 0`} />
      <path d={`M${w - t} 0 L${w} 0 L${w} ${t}`} />
      <path d={`M0 ${h - t} L0 ${h} L${t} ${h}`} />
      <path d={`M${w - t} ${h} L${w} ${h} L${w} ${h - t}`} />
    </g>
  )
}

function Label({ x, y, children, anchor }: { x: number; y: number; children: string; anchor?: "start" | "end" }): JSX.Element {
  return (
    <text x={x} y={y} fontSize="5.2" fill={C} fillOpacity="0.65" letterSpacing="0.18em" textAnchor={anchor ?? "start"} style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
      {children}
    </text>
  )
}

export function AuctionMark(): JSX.Element {
  const W = 200, H = 120
  const baseline = 96
  const bars = [
    { x: 12, h: 22, d: 0.05 },
    { x: 30, h: 40, d: 0.10 },
    { x: 48, h: 62, d: 0.15 },
    { x: 66, h: 48, d: 0.20 },
    { x: 84, h: 70, d: 0.25 },
    { x: 102, h: 34, d: 0.30 },
    { x: 120, h: 56, d: 0.35 },
    { x: 138, h: 26, d: 0.40 },
    { x: 156, h: 44, d: 0.45 },
    { x: 174, h: 18, d: 0.50 },
  ]
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-28 w-auto" aria-hidden>
      <GridDots cols={20} rows={10} w={W} h={H} />
      <CornerTicks w={W} h={H} />
      <Label x={6} y={14}>BID · MS</Label>
      <Label x={W - 6} y={14} anchor="end">≤ 100</Label>
      <line x1="0" y1={baseline} x2={W} y2={baseline} stroke={C} strokeOpacity="0.35" strokeWidth="0.8" />
      {Array.from({ length: 11 }).map((_, i) => (
        <line key={i} x1={i * 20} y1={baseline} x2={i * 20} y2={baseline + 3} stroke={C} strokeOpacity="0.4" strokeWidth="0.7" />
      ))}
      {bars.map((b, i) => (
        <motion.rect
          key={i}
          x={b.x}
          width="10"
          fill={C}
          fillOpacity={0.45 + (i % 3) * 0.18}
          initial={{ y: baseline, height: 0 }}
          whileInView={{ y: baseline - b.h, height: b.h }}
          viewport={VIEWPORT}
          transition={{ duration: 0.55, delay: b.d, ease: EASE }}
        />
      ))}
      <motion.circle
        r="2.2"
        fill={C}
        cx={84 + 5}
        cy={baseline - 70}
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.4, delay: 0.7, ease: EASE }}
      />
      <Label x={6} y={H - 4}>RTB · PATH</Label>
    </svg>
  )
}

export function IdentityMark(): JSX.Element {
  const W = 200, H = 120
  const nodes = [
    { x: 26, y: 32, r: 4, d: 0.05 },
    { x: 100, y: 22, r: 5.5, d: 0.10 },
    { x: 174, y: 38, r: 4, d: 0.15 },
    { x: 100, y: 64, r: 7, d: 0.0 },
    { x: 36, y: 88, r: 4.5, d: 0.25 },
    { x: 164, y: 90, r: 4.5, d: 0.30 },
  ]
  const edges = [
    [3, 0], [3, 1], [3, 2], [3, 4], [3, 5],
    [0, 1], [1, 2], [4, 5],
  ] as const
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-28 w-auto" aria-hidden>
      <GridDots cols={20} rows={10} w={W} h={H} />
      <CornerTicks w={W} h={H} />
      <Label x={6} y={14}>WALLET · GRAPH</Label>
      <Label x={W - 6} y={14} anchor="end">N = 6</Label>
      {edges.map(([a, b], i) => {
        const A = nodes[a]
        const B = nodes[b]
        if (!A || !B) return null
        return (
          <motion.line
            key={i}
            x1={A.x} y1={A.y} x2={B.x} y2={B.y}
            stroke={C} strokeOpacity="0.4" strokeWidth="0.9"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.5, delay: 0.15 + i * 0.05, ease: EASE }}
          />
        )
      })}
      {nodes.map((n, i) => (
        <motion.g
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.4, delay: n.d, ease: EASE }}
          style={{ transformOrigin: `${n.x}px ${n.y}px` }}
        >
          <circle cx={n.x} cy={n.y} r={n.r + 3} fill={C} fillOpacity="0.08" />
          <circle cx={n.x} cy={n.y} r={n.r} fill={C} fillOpacity={i === 3 ? 1 : 0.85} />
        </motion.g>
      ))}
      <Label x={6} y={H - 4}>IDENTITY · PLANE</Label>
    </svg>
  )
}

export function SettlementMark(): JSX.Element {
  const W = 200, H = 120
  const blocks = [
    { y: 24, w: 130, h: 14, d: 0.05, op: 0.35, num: "826 411" },
    { y: 44, w: 150, h: 14, d: 0.12, op: 0.55, num: "826 412" },
    { y: 64, w: 168, h: 14, d: 0.19, op: 0.75, num: "826 413" },
    { y: 84, w: 184, h: 14, d: 0.26, op: 1.00, num: "826 414" },
  ]
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-28 w-auto" aria-hidden>
      <GridDots cols={20} rows={10} w={W} h={H} />
      <CornerTicks w={W} h={H} />
      <Label x={6} y={14}>USDC · SETTLE</Label>
      <Label x={W - 6} y={14} anchor="end">ON-CHAIN</Label>
      {blocks.map((b, i) => (
        <motion.g
          key={i}
          initial={{ x: -20, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.5, delay: b.d, ease: EASE }}
        >
          <rect x="6" y={b.y} width={b.w} height={b.h} fill={C} fillOpacity={b.op} />
          {Array.from({ length: 6 }).map((_, j) => (
            <rect key={j} x={10 + j * 5} y={b.y + 4} width="3" height="1" fill="#fff" fillOpacity="0.55" />
          ))}
          <text x={b.w + 12} y={b.y + 10} fontSize="5" fill={C} fillOpacity="0.65" style={{ fontFamily: "ui-monospace, monospace" }} letterSpacing="0.1em">{b.num}</text>
        </motion.g>
      ))}
      <Label x={6} y={H - 4}>LEDGER · APPEND</Label>
    </svg>
  )
}

export function LayersMark(): JSX.Element {
  const W = 200, H = 120
  const tags = ["EXP", "GTW", "CORE", "RTB", "IDN", "SET", "OBS"]
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-28 w-auto" aria-hidden>
      <GridDots cols={20} rows={10} w={W} h={H} />
      <CornerTicks w={W} h={H} />
      <Label x={6} y={14}>7 · LAYERS</Label>
      <Label x={W - 6} y={14} anchor="end">L1 → L7</Label>
      {tags.map((tag, i) => {
        const cx = 100
        const cy = 64
        const baseW = 170
        const baseH = 76
        const w = baseW - i * 24
        const h = baseH - i * 10
        const x = cx - w / 2
        const y = cy - h / 2
        return (
          <motion.g
            key={tag}
            initial={{ opacity: 0, scale: 1.05 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.45, delay: 0.05 + i * 0.07, ease: EASE }}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
          >
            <rect x={x} y={y} width={w} height={h} fill="none" stroke={C} strokeOpacity={0.25 + i * 0.11} strokeWidth="0.9" />
            {i === 6 && (
              <text x={cx} y={cy + 2} fontSize="6" fill={C} textAnchor="middle" letterSpacing="0.18em" style={{ fontFamily: "ui-monospace, monospace" }}>
                {tag}
              </text>
            )}
          </motion.g>
        )
      })}
      <Label x={6} y={H - 4}>STACK · DEPTH</Label>
    </svg>
  )
}

export function ModulesMark(): JSX.Element {
  const W = 200, H = 120
  const cell = 28
  const gap = 6
  const gridW = 3 * cell + 2 * gap
  const gridH = 3 * cell + 2 * gap
  const ox = (W - gridW) / 2
  const oy = (H - gridH) / 2 + 4
  const labels = [["CMP", "PUB", "SDK"], ["AUC", "RPT", "LDG"], ["ATR", "FRD", "TRS"]]
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-28 w-auto" aria-hidden>
      <GridDots cols={20} rows={10} w={W} h={H} />
      <CornerTicks w={W} h={H} />
      <Label x={6} y={14}>9 · MODULES</Label>
      <Label x={W - 6} y={14} anchor="end">3 × 3</Label>
      {labels.map((row, r) =>
        row.map((tag, c) => {
          const i = r * 3 + c
          const isAccent = r === 1 && c === 1
          const x = ox + c * (cell + gap)
          const y = oy + r * (cell + gap)
          return (
            <motion.g
              key={`${r}-${c}`}
              initial={{ opacity: 0, y: -6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.4, delay: 0.05 + i * 0.05, ease: EASE }}
            >
              <rect x={x} y={y} width={cell} height={cell} fill={C} fillOpacity={isAccent ? 1 : 0.18 + ((i * 7) % 5) * 0.08} />
              <text
                x={x + cell / 2}
                y={y + cell / 2 + 2}
                fontSize="5.5"
                fill={isAccent ? "#fff" : C}
                fillOpacity={isAccent ? 1 : 0.75}
                textAnchor="middle"
                letterSpacing="0.1em"
                style={{ fontFamily: "ui-monospace, monospace" }}
              >
                {tag}
              </text>
            </motion.g>
          )
        })
      )}
      <Label x={6} y={H - 4}>MODULE · MAP</Label>
    </svg>
  )
}

export function ServicesMark(): JSX.Element {
  const W = 200, H = 120
  const cx = W / 2
  const cy = H / 2 + 4
  const R = 38
  const nodes = Array.from({ length: 6 }).map((_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 2
    return { x: cx + R * Math.cos(a), y: cy + R * Math.sin(a) }
  })
  const tags = ["BID", "EXC", "IDN", "SET", "BUS", "OBS"]
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-28 w-auto" aria-hidden>
      <GridDots cols={20} rows={10} w={W} h={H} />
      <CornerTicks w={W} h={H} />
      <Label x={6} y={14}>6 · SERVICES</Label>
      <Label x={W - 6} y={14} anchor="end">MESH</Label>
      {nodes.map((n, i) =>
        nodes.slice(i + 1).map((m, j) => (
          <motion.line
            key={`${i}-${j}`}
            x1={n.x} y1={n.y} x2={m.x} y2={m.y}
            stroke={C} strokeOpacity="0.22" strokeWidth="0.7"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.55, delay: 0.1 + (i + j) * 0.04, ease: EASE }}
          />
        ))
      )}
      <motion.circle
        cx={cx} cy={cy} r="6" fill={C} fillOpacity="0.12"
        initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={VIEWPORT}
        transition={{ duration: 0.5, delay: 0.35, ease: EASE }}
      />
      <motion.circle
        cx={cx} cy={cy} r="2.4" fill={C}
        initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={VIEWPORT}
        transition={{ duration: 0.4, delay: 0.4, ease: EASE }}
      />
      {nodes.map((n, i) => (
        <motion.g
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.4, delay: 0.5 + i * 0.05, ease: EASE }}
          style={{ transformOrigin: `${n.x}px ${n.y}px` }}
        >
          <circle cx={n.x} cy={n.y} r="9" fill={C} fillOpacity="0.08" />
          <circle cx={n.x} cy={n.y} r="6" fill={C} />
          <text x={n.x} y={n.y + 2} fontSize="4.5" fill="#fff" textAnchor="middle" letterSpacing="0.1em" style={{ fontFamily: "ui-monospace, monospace" }}>
            {tags[i]}
          </text>
        </motion.g>
      ))}
      <Label x={6} y={H - 4}>SERVICE · MESH</Label>
    </svg>
  )
}
