"use client";

import { motion } from "framer-motion";

export function Vignette() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="fixed inset-0 z-40 pointer-events-none mix-blend-multiply"
            style={{
                background: "radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.8) 120%)"
            }}
        />
    );
}
