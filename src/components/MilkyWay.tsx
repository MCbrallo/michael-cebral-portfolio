"use client";

export function MilkyWay() {
    return (
        <div className="absolute inset-0 overflow-hidden">
            {/* Deep space base */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e27] via-[#1a1633] to-[#050505]" />

            {/* Milky Way band with realistic nebula colors */}
            <div
                className="absolute inset-0 opacity-60"
                style={{
                    background: `
                        radial-gradient(ellipse 120% 50% at 60% 50%, 
                            rgba(147, 112, 219, 0.15) 0%,
                            rgba(138, 43, 226, 0.1) 20%,
                            rgba(75, 0, 130, 0.05) 40%,
                            transparent 70%
                        ),
                        radial-gradient(ellipse 100% 40% at 50% 55%, 
                            rgba(219, 112, 147, 0.12) 0%,
                            rgba(255, 105, 180, 0.08) 25%,
                            rgba(186, 85, 211, 0.05) 50%,
                            transparent 80%
                        ),
                        radial-gradient(ellipse 80% 35% at 45% 48%, 
                            rgba(100, 149, 237, 0.08) 0%,
                            rgba(70, 130, 180, 0.05) 30%,
                            transparent 60%
                        )
                    `
                }}
            />

            {/* Bright nebula core */}
            <div
                className="absolute inset-0 opacity-40"
                style={{
                    background: `
                        radial-gradient(ellipse 60% 25% at 55% 50%, 
                            rgba(255, 182, 193, 0.2) 0%,
                            rgba(255, 192, 203, 0.15) 20%,
                            rgba(221, 160, 221, 0.1) 40%,
                            transparent 70%
                        )
                    `
                }}
            />

            {/* Dust lanes (darker streaks) */}
            <div
                className="absolute inset-0 opacity-30"
                style={{
                    background: `
                        linear-gradient(135deg, 
                            transparent 0%,
                            rgba(10, 10, 30, 0.4) 30%,
                            rgba(15, 10, 35, 0.5) 50%,
                            rgba(10, 10, 30, 0.4) 70%,
                            transparent 100%
                        )
                    `
                }}
            />

            {/* Scattered light effect */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    background: `
                        radial-gradient(circle at 30% 40%, rgba(200, 200, 255, 0.1) 0%, transparent 15%),
                        radial-gradient(circle at 70% 35%, rgba(255, 180, 200, 0.08) 0%, transparent 12%),
                        radial-gradient(circle at 50% 60%, rgba(180, 150, 255, 0.06) 0%, transparent 18%),
                        radial-gradient(circle at 80% 55%, rgba(200, 180, 255, 0.05) 0%, transparent 10%)
                    `
                }}
            />
        </div>
    );
}
