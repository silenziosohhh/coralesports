"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type RevealDirection = "up" | "down" | "left" | "right" | "none";

const EASE = [0.16, 1, 0.3, 1] as const;

const MOTION_TAGS = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  li: motion.li,
  span: motion.span,
  header: motion.header,
} as const;

type RevealTag = keyof typeof MOTION_TAGS;

function offsetFor(direction: RevealDirection, distance: number) {
  switch (direction) {
    case "up":
      return { y: distance };
    case "down":
      return { y: -distance };
    case "left":
      return { x: -distance };
    case "right":
      return { x: distance };
    default:
      return {};
  }
}

export function useStillAfterHydration() {
  const reduceMotion = useReducedMotion();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  return hydrated && Boolean(reduceMotion);
}

type RevealProps = {
  children: ReactNode;
  className?: string;
  direction?: RevealDirection;
  distance?: number;
  delay?: number;
  duration?: number;
  scale?: number;
  blur?: boolean;
  once?: boolean;
  margin?: string;
  as?: RevealTag;
};

export function Reveal({
  children,
  className,
  direction = "up",
  distance = 32,
  delay = 0,
  duration = 0.7,
  scale,
  blur = false,
  once = true,
  margin = "-100px",
  as = "div",
}: RevealProps) {
  const still = useStillAfterHydration();
  const MotionTag = MOTION_TAGS[as] as typeof motion.div;

  const visible = {
    opacity: 1,
    x: 0,
    y: 0,
    ...(scale ? { scale: 1 } : {}),
    ...(blur ? { filter: "blur(0px)" } : {}),
  };

  return (
    <MotionTag
      initial={{
        opacity: 0,
        ...offsetFor(direction, distance),
        ...(scale ? { scale } : {}),
        ...(blur ? { filter: "blur(10px)" } : {}),
      }}
      whileInView={visible}
      animate={still ? visible : undefined}
      viewport={{ once, margin }}
      transition={still ? { duration: 0 } : { duration, ease: EASE, delay }}
      className={cn(className)}
    >
      {children}
    </MotionTag>
  );
}

type RevealGroupProps = {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  once?: boolean;
  margin?: string;
  as?: RevealTag;
};

export function RevealGroup({
  children,
  className,
  stagger = 0.08,
  delay = 0,
  once = true,
  margin = "-80px",
  as = "div",
}: RevealGroupProps) {
  const still = useStillAfterHydration();
  const MotionTag = MOTION_TAGS[as] as typeof motion.div;

  const variants: Variants = {
    hidden: {},
    visible: {
      transition: still
        ? { staggerChildren: 0, delayChildren: 0 }
        : { staggerChildren: stagger, delayChildren: delay },
    },
  };

  return (
    <MotionTag
      initial="hidden"
      whileInView="visible"
      animate={still ? "visible" : undefined}
      viewport={{ once, margin }}
      variants={variants}
      className={cn(className)}
    >
      {children}
    </MotionTag>
  );
}

type RevealItemProps = {
  children: ReactNode;
  className?: string;
  direction?: RevealDirection;
  distance?: number;
  duration?: number;
  scale?: number;
  as?: RevealTag;
};

export function RevealItem({
  children,
  className,
  direction = "up",
  distance = 26,
  duration = 0.6,
  scale,
  as = "div",
}: RevealItemProps) {
  const still = useStillAfterHydration();
  const MotionTag = MOTION_TAGS[as] as typeof motion.div;

  const variants: Variants = {
    hidden: {
      opacity: 0,
      ...offsetFor(direction, distance),
      ...(scale ? { scale } : {}),
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      ...(scale ? { scale: 1 } : {}),
      transition: still ? { duration: 0 } : { duration, ease: EASE },
    },
  };

  return (
    <MotionTag variants={variants} className={cn(className)}>
      {children}
    </MotionTag>
  );
}
