"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function FluidStars({ count = 800 }) {
    const points = useRef<THREE.Points>(null!);

    // Initial positions
    const [positions, originalPositions] = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const orig = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            const r = 30 + Math.random() * 40; // Wide spread
            const theta = 2 * Math.PI * Math.random();
            const phi = Math.acos(2 * Math.random() - 1);

            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = (Math.random() - 0.5) * 20; // Flattened depth

            pos[i * 3] = x;
            pos[i * 3 + 1] = y;
            pos[i * 3 + 2] = z;

            orig[i * 3] = x;
            orig[i * 3 + 1] = y;
            orig[i * 3 + 2] = z;
        }
        return [pos, orig];
    }, [count]);

    const mouse = useRef(new THREE.Vector3(0, 0, 0));

    useFrame((state) => {
        if (!points.current) return;

        const viewport = state.viewport;
        mouse.current.x = (state.pointer.x * viewport.width) / 2;
        mouse.current.y = (state.pointer.y * viewport.height) / 2;
        mouse.current.z = 0;

        const positionsArray = points.current.geometry.attributes.position.array as Float32Array;

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            let x = positionsArray[i3];
            let y = positionsArray[i3 + 1];
            const z = positionsArray[i3 + 2];

            // Standard Fluid Drift
            x += Math.sin(state.clock.elapsedTime * 0.1 + i) * 0.005;
            y += Math.cos(state.clock.elapsedTime * 0.1 + i) * 0.005;

            // Mouse Interaction
            const dx = mouse.current.x - x;
            const dy = mouse.current.y - y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 8) {
                const force = (8 - dist) / 8;
                const angle = Math.atan2(dy, dx);
                x -= Math.cos(angle) * force * 0.2;
                y -= Math.sin(angle) * force * 0.2;
            }

            // Elasticity
            const ox = originalPositions[i3];
            const oy = originalPositions[i3 + 1];

            x += (ox - x) * 0.005;
            y += (oy - y) * 0.005;

            positionsArray[i3] = x;
            positionsArray[i3 + 1] = y;
            positionsArray[i3 + 2] = z;
        }

        points.current.geometry.attributes.position.needsUpdate = true;

        // Slow Rotation
        points.current.rotation.y += 0.001;
    });

    return (
        <Points ref={points} positions={positions} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color="#ffffff"
                size={0.04}
                sizeAttenuation={true}
                depthWrite={false}
                opacity={0.7}
                blending={THREE.AdditiveBlending}
            />
        </Points>
    );
}

export function Stardust() {
    return (
        <div className="absolute inset-0 z-0 bg-[#050505]">
            {/* Noise Grain */}
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none z-10 mix-blend-overlay"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />

            <Canvas camera={{ position: [0, 0, 20], fov: 75 }}>
                <FluidStars />
            </Canvas>
        </div>
    );
}
