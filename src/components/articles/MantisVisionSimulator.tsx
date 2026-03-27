'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface MantisVisionSimulatorProps {
    standardImage: string;
    mantisImage: string;
    alt: string;
}

export function MantisVisionSimulator({ standardImage, mantisImage, alt }: MantisVisionSimulatorProps) {
    const [sliderPosition, setSliderPosition] = useState(50);
    const containerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);

    const handleMove = (x: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const position = ((x - rect.left) / rect.width) * 100;
        setSliderPosition(Math.max(0, Math.min(100, position)));
    };

    const onMouseDown = () => (isDragging.current = true);
    const onMouseUp = () => (isDragging.current = false);
    const onMouseMove = (e: React.MouseEvent) => {
        if (isDragging.current) handleMove(e.clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        handleMove(e.touches[0].clientX);
    };

    useEffect(() => {
        const handleGlobalMouseUp = () => (isDragging.current = false);
        window.addEventListener('mouseup', handleGlobalMouseUp);
        return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }, []);

    return (
        <div className="my-12 space-y-4">
            <h3 className="font-serif text-2xl text-white mb-4">Interactive Vision Simulator</h3>
            <p className="text-white/60 text-sm mb-6">
                Drag the slider to compare Human Vision (Left) vs. Mantis Shrimp simulated Hyperspectral/Polarized View (Right).
            </p>

            <div
                ref={containerRef}
                className="relative w-full aspect-video rounded-xl overflow-hidden cursor-ew-resize select-none border border-white/10 shadow-2xl"
                onMouseMove={onMouseMove}
                onMouseDown={onMouseDown}
                onTouchMove={onTouchMove}
            >
                {/* Standard Image (Underneath) */}
                <Image
                    src={standardImage}
                    alt={`${alt} - Human Vision`}
                    fill
                    className="object-cover pointer-events-none"
                />

                {/* Mantis Image (Overlay with clip-path) */}
                <div
                    className="absolute inset-0"
                    style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
                >
                    <Image
                        src={mantisImage}
                        alt={`${alt} - Mantis Vision`}
                        fill
                        className="object-cover pointer-events-none filter hue-rotate-[180deg] invert contrast-125 saturate-150"
                    />
                    <div className="absolute inset-0 bg-gold/10 mix-blend-color-burn pointer-events-none" />
                </div>

                {/* Slider Handle */}
                <div
                    className="absolute top-0 bottom-0 w-0.5 bg-white cursor-ew-resize z-10"
                    style={{ left: `${sliderPosition}%` }}
                >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg shadow-gold/20">
                        <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                        </svg>
                    </div>
                </div>

                {/* Labels */}
                <div className="absolute bottom-4 left-4 text-xs font-bold uppercase tracking-widest text-white/50 bg-black/50 px-3 py-1 rounded backdrop-blur-md pointer-events-none">
                    Human Vision (RGB)
                </div>
                <div className="absolute bottom-4 right-4 text-xs font-bold uppercase tracking-widest text-gold bg-black/80 px-3 py-1 rounded backdrop-blur-md pointer-events-none border border-gold/20">
                    Hyperspectral View
                </div>
            </div>
        </div>
    );
}
