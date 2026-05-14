"use client"
import { motion } from "framer-motion"
import type { JSX } from "react"

// Logo: 5 rounded squares matching VaraAd.png exactly
// 4-col × 3-row grid — black at (0,0), blue at (2,0), black at (1,1), (3,1), (2,2)
const BOXES = [
  { col: 0, row: 0, blue: false, delay: 0.0 },  // top-left
  { col: 2, row: 0, blue: true,  delay: 0.5 },  // top-middle (BLUE — lands last as accent)
  { col: 1, row: 1, blue: false, delay: 0.15 }, // middle-left
  { col: 3, row: 1, blue: false, delay: 0.3 },  // middle-right
  { col: 2, row: 2, blue: false, delay: 0.45 }, // bottom-center
]

const SIZE = 20
const GAP = 0
const COLS = 4
const ROWS = 3

export function LoadingScreen(): JSX.Element {
  const W = COLS * SIZE + (COLS - 1) * GAP
  const H = ROWS * SIZE + (ROWS - 1) * GAP

  return (
    <div className="fixed inset-0 z-50 w-full h-full bg-background flex items-center justify-center">
      <div className="relative" style={{ width: W, height: H }}>
        {BOXES.map((box, i) => (
          <motion.div
            key={i}
            style={{
              position: "absolute",
              left: box.col * (SIZE + GAP),
              top: box.row * (SIZE + GAP),
              width: SIZE,
              height: SIZE,
              borderRadius: SIZE * 0.010,
              backgroundColor: box.blue ? "#1f40cd" : "#0a0a0a",
            }}
            initial={{ opacity: 0.18, scale: 0.7 }}
            animate={{
              opacity: [0.18, 1, 1, 0.18],
              scale: [0.7, 1, 1, 0.7],
            }}
            transition={{
              duration: 1.6,
              delay: box.delay,
              repeat: Infinity,
              ease: [0.22, 1, 0.36, 1],
              times: [0, 0.25, 0.65, 1],
            }}
          />
        ))}
      </div>
    </div>
  )
}
