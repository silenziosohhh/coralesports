"use client";

import { motion } from "framer-motion";

/**
 * Wraps each route so navigations fade in softly instead of snapping.
 * Only `opacity` is animated (no transform) so pages that rely on
 * `position: fixed` backgrounds are never re-anchored mid-transition.
 * Honors `prefers-reduced-motion` via the app-level MotionConfig.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
