'use client';

import { useEffect, useRef } from 'react';

/**
 * Canvas-based star field background with smooth parallax, nebula glow & shooting stars.
 * Shared across About, CV and any page that needs the deep-space aesthetic.
 */
export function StarField() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const starsRef = useRef<{ x: number; y: number; z: number; size: number; twinkleSpeed: number; twinkleOffset: number; hue: number }[]>([]);
    const shootingRef = useRef<{ x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number }[]>([]);
    const nebulaRef = useRef<{ x: number; y: number; r: number; hue: number; alpha: number }[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Dynamic resize handler
        const resize = () => {
            // Add a small timeout to let the DOM settle if necessary, though innerWidth is usually stable
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            // Removed explicit style.width overrides. Let Tailwind w-full h-full handle the actual DOM box sizing.
        };
        resize();
        // Fallback to recalculate if the layout paints late
        setTimeout(resize, 100);
        window.addEventListener('resize', resize);

        /* Generate stars */
        if (starsRef.current.length === 0) {
            for (let i = 0; i < 400; i++) {
                starsRef.current.push({
                    x: Math.random(),
                    y: Math.random(),
                    z: Math.random() * 3 + 0.3,
                    // Reduced max size and minimum size to make them smaller
                    size: Math.random() * 1.1 + 0.15,
                    // Slower twinkle for smoother feel
                    twinkleSpeed: Math.random() * 0.008 + 0.002,
                    twinkleOffset: Math.random() * Math.PI * 2,
                    hue: Math.random() < 0.7 ? 0 : (Math.random() < 0.5 ? 220 : 40),
                });
            }
        }

        /* Generate nebula blobs */
        if (nebulaRef.current.length === 0) {
            for (let i = 0; i < 6; i++) {
                nebulaRef.current.push({
                    // Evenly distribute across width rather than pure random
                    x: (i + Math.random()) / 6,
                    y: Math.random() * 4,
                    r: Math.random() * 250 + 150,
                    hue: [220, 270, 200, 340, 180, 260][i],
                    alpha: Math.random() * 0.015 + 0.008,
                });
            }
        }

        let frame = 0;
        let raf: number;
        const draw = () => {
            frame++;
            const t = frame * 0.016;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const scrollY = window.scrollY;

            /* Stars — smoother twinkle using sinusoidal easing */
            for (const star of starsRef.current) {
                const speed = 1 / star.z;
                const rawY = star.y * canvas.height - scrollY * speed * 0.18;
                // Wrap exactly over the visible canvas bounds to guarantee filling at all scroll depths
                const sy = ((rawY % canvas.height) + canvas.height) % canvas.height;
                const sx = star.x * canvas.width;
                if (sy < -20 || sy > canvas.height + 20) continue;

                // Smooth twinkle: layered sine for organic breathing
                const twinkle = 0.5
                    + 0.3 * Math.sin(t * star.twinkleSpeed * 60 + star.twinkleOffset)
                    + 0.2 * Math.sin(t * star.twinkleSpeed * 30 + star.twinkleOffset * 1.7);
                // Reduced baseline opacity slightly directly answering user request
                const baseAlpha = 0.1 + 0.25 / star.z;
                const alpha = baseAlpha * (0.4 + 0.6 * twinkle);
                const r = star.size / star.z;

                if (r > 0.8 && star.hue === 0) {
                    /* Highly optimized glow using primitive shapes instead of CPU-heavy gradients */
                    ctx.beginPath();
                    ctx.arc(sx, sy, r * 2.5, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255,255,255,${Math.max(0.01, alpha * 0.15)})`;
                    ctx.fill();
                }

                ctx.beginPath();
                ctx.arc(sx, sy, Math.max(0.3, r), 0, Math.PI * 2);
                if (star.hue !== 0) {
                    ctx.fillStyle = `hsla(${star.hue}, 50%, 80%, ${alpha})`;
                } else {
                    ctx.fillStyle = `rgba(255,255,255,${Math.max(0.03, alpha)})`;
                }
                ctx.fill();
            }

            /* Shooting stars */
            if (Math.random() < 0.003) {
                const angle = Math.PI * 0.15 + Math.random() * 0.3;
                shootingRef.current.push({
                    x: Math.random() * canvas.width * 0.8,
                    y: Math.random() * canvas.height * 0.4,
                    vx: Math.cos(angle) * (3 + Math.random() * 4),
                    vy: Math.sin(angle) * (3 + Math.random() * 4),
                    life: 0,
                    maxLife: 40 + Math.random() * 30,
                    size: 0.5 + Math.random() * 1,
                });
            }

            shootingRef.current = shootingRef.current.filter(s => {
                s.x += s.vx;
                s.y += s.vy;
                s.life++;
                const prog = s.life / s.maxLife;
                // Smoother fade curve
                const fade = prog < 0.2 ? prog / 0.2 : Math.pow(1 - (prog - 0.2) / 0.8, 2);
                const a = fade * 0.6;
                ctx.save();
                ctx.globalAlpha = a;
                ctx.strokeStyle = `rgba(255,255,255,${a})`;
                ctx.lineWidth = s.size;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(s.x, s.y);
                ctx.lineTo(s.x - s.vx * 6, s.y - s.vy * 6);
                ctx.stroke();
                ctx.restore();
                return s.life < s.maxLife;
            });

            raf = requestAnimationFrame(draw);
        };
        draw();
        return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
    }, []);

    return (
        <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-[0] block" aria-hidden="true" />
    );
}
