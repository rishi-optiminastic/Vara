"use client"
import { motion } from "framer-motion"
import type { JSX, ReactNode } from "react"

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
}

const item = {
  hidden: { opacity: 0, y: -28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.52, ease: EASE } },
}

interface AnimatedGridProps {
  className?: string
  children: ReactNode
}

export function AnimatedGrid({ className, children }: AnimatedGridProps): JSX.Element {
  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedItem({ className, children }: AnimatedGridProps): JSX.Element {
  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  )
}

/** On-load stagger container — triggers immediately (hero / above-the-fold). */
export function AnimatedStack({ className, children }: AnimatedGridProps): JSX.Element {
  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      animate="show"
    >
      {children}
    </motion.div>
  )
}
