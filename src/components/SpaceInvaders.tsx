"use client";

import { useEffect, useRef, useCallback, useState } from "react";

interface SpaceInvadersProps {
    onClose: () => void;
}

const BULLET_W = 3;
const BULLET_H = 12;
const PLAYER_W = 44;
const PLAYER_H = 24;
const ALIEN_W = 32;
const ALIEN_H = 24;
const ALIEN_GAP_X = 14;
const ALIEN_GAP_Y = 12;

interface Bullet { x: number; y: number; dy: number; w: number; h: number; isLaser?: boolean; }
interface Particle { x: number; y: number; vx: number; vy: number; life: number; color: string; size: number; }
interface Alien { x: number; y: number; alive: boolean; row: number; hp: number; }
interface PowerUp { x: number; y: number; type: "double" | "laser" | "shield" | "rapid" | "life" | "triple" | "berserker"; vy: number; }
interface Boss { x: number; y: number; hp: number; maxHp: number; phase: number; timer: number; lastShot: number; lastMinion: number; laserAngle: number; laserActive: boolean; laserTimer: number; shakeTimer: number; }

// ─── Retro Sound FX via Web Audio API ───
function createAudioCtx() {
    try { return new (window.AudioContext || (window as any).webkitAudioContext)(); }
    catch { return null; }
}

function playTone(ctx: AudioContext | null, freq: number, duration: number, type: OscillatorType = "square", vol = 0.08) {
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
}

function sfxShoot(ctx: AudioContext | null) { playTone(ctx, 880, 0.08, "square", 0.06); }
function sfxLaser(ctx: AudioContext | null) { playTone(ctx, 220, 0.25, "sawtooth", 0.07); }
function sfxHit(ctx: AudioContext | null) { playTone(ctx, 200, 0.15, "square", 0.08); playTone(ctx, 100, 0.2, "triangle", 0.06); }
function sfxPowerUp(ctx: AudioContext | null) { playTone(ctx, 523, 0.08, "square", 0.06); setTimeout(() => playTone(ctx, 659, 0.08, "square", 0.06), 80); setTimeout(() => playTone(ctx, 784, 0.12, "square", 0.06), 160); }
function sfxLevelUp(ctx: AudioContext | null) { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => playTone(ctx, f, 0.15, "square", 0.07), i * 100)); }
function sfxGameOver(ctx: AudioContext | null) { [400, 350, 300, 200].forEach((f, i) => setTimeout(() => playTone(ctx, f, 0.2, "sawtooth", 0.06), i * 150)); }
function sfxBossHit(ctx: AudioContext | null) { playTone(ctx, 80, 0.15, "sawtooth", 0.1); playTone(ctx, 120, 0.1, "square", 0.08); }
function sfxBossLaser(ctx: AudioContext | null) { playTone(ctx, 60, 0.5, "sawtooth", 0.09); playTone(ctx, 90, 0.4, "square", 0.06); }

// ─── DOOM Music (The Only Thing They Fear Is You) ───
function startDoomMusic(): () => void {
    const audio = new Audio("/doom.mp3");
    audio.loop = true;
    audio.volume = 0.4;
    audio.play().catch(() => {});
    return () => { audio.pause(); audio.currentTime = 0; };
}

// ─── Game Constants ───
const LEVEL_CONFIGS = [
    { cols: 10, rows: 4, speed: 1.2, shootInterval: 900, alienHp: 1, label: "SECTOR 1" },
    { cols: 11, rows: 4, speed: 1.5, shootInterval: 800, alienHp: 1, label: "SECTOR 2" },
    { cols: 12, rows: 5, speed: 1.7, shootInterval: 700, alienHp: 1, label: "SECTOR 3" },
    { cols: 12, rows: 5, speed: 2.0, shootInterval: 600, alienHp: 2, label: "SECTOR 4" },
    { cols: 13, rows: 5, speed: 2.2, shootInterval: 500, alienHp: 2, label: "SECTOR 5" },
    { cols: 14, rows: 6, speed: 2.5, shootInterval: 400, alienHp: 2, label: "FINAL SECTOR" },
];

const POWERUP_COLORS: Record<string, string> = { double: "#00ccff", laser: "#ff3366", shield: "#ffcc00", rapid: "#33ff99", life: "#ff69b4", triple: "#66ffff", berserker: "#ff0000" };
const POWERUP_LABELS: Record<string, string> = { double: "2x", laser: "⚡", shield: "●", rapid: "»", life: "♥", triple: "3", berserker: "☠" };

// Weighted power-up drop table
function rollPowerUp(): PowerUp["type"] {
    const r = Math.random();
    if (r < 0.03) return "berserker";  // 3% - very rare
    if (r < 0.08) return "life";       // 5% - rare
    if (r < 0.18) return "shield";     // 10%
    if (r < 0.28) return "laser";      // 10%
    if (r < 0.40) return "rapid";      // 12%
    if (r < 0.60) return "triple";     // 20% - common
    return "double";                    // 40% - most common
}
const alienColors = ["#ff3366", "#ff6633", "#ffcc00", "#33ff99", "#33ccff", "#cc66ff"];

export function SpaceInvaders({ onClose }: SpaceInvadersProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const gameRef = useRef<any>(null);
    const audioRef = useRef<AudioContext | null>(null);
    const doomMusicRef = useRef<(() => void) | null>(null);
    const gameMusicRef = useRef<HTMLAudioElement | null>(null);
    const [showDoomButton, setShowDoomButton] = useState(false);
    const [nowPlaying, setNowPlaying] = useState<string | null>(null);

    const buildAliens = useCallback((W: number, level: number) => {
        const cfg = LEVEL_CONFIGS[Math.min(level, LEVEL_CONFIGS.length - 1)];
        const aliens: Alien[] = [];
        const startX = (W - (cfg.cols * (ALIEN_W + ALIEN_GAP_X) - ALIEN_GAP_X)) / 2;
        for (let r = 0; r < cfg.rows; r++) {
            for (let c = 0; c < cfg.cols; c++) {
                aliens.push({ x: startX + c * (ALIEN_W + ALIEN_GAP_X), y: 100 + r * (ALIEN_H + ALIEN_GAP_Y), alive: true, row: r, hp: cfg.alienHp });
            }
        }
        return aliens;
    }, []);

    const spawnExplosion = useCallback((g: any, x: number, y: number, color: string, count = 10) => {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 / count) * i + Math.random() * 0.4;
            const speed = 1.5 + Math.random() * 3;
            g.particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 1, color, size: 2 + Math.random() * 3 });
        }
    }, []);

    useEffect(() => {
        // Hide UI elements
        window.dispatchEvent(new Event("game:start"));

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        audioRef.current = createAudioCtx();
        const audio = audioRef.current;

        const actualW = window.innerWidth;
        const actualH = window.innerHeight;
        // Logical width minimum 600. If screen is smaller (mobile), we scale down.
        const logicalW = Math.max(600, actualW);
        const touchScale = actualW / logicalW;
        const logicalH = actualH / touchScale;

        canvas.width = actualW;
        canvas.height = actualH;

        const W = logicalW;
        const H = logicalH;

        const g: any = {
            W, H, touchScale,
            player: { x: W / 2 - PLAYER_W / 2 },
            bullets: [] as Bullet[],
            alienBullets: [] as Bullet[],
            aliens: [] as Alien[],
            particles: [] as Particle[],
            powerUps: [] as PowerUp[],
            dirX: LEVEL_CONFIGS[0].speed,
            score: 0, lives: 5, level: 0,
            gameOver: false, won: false,
            keys: new Set<string>(),
            lastShot: 0, lastAlienShot: 0, animFrame: 0,
            weapon: "normal" as "normal" | "double" | "laser" | "triple" | "berserker",
            weaponTimer: 0,
            shieldActive: false, shieldTimer: 0,
            rapidFire: false, rapidTimer: 0,
            berserkerMode: false, berserkerTimer: 0,
            levelTransition: false, levelTransitionTimer: 0,
            countdown: 3, countdownTimer: 0, countdownPhase: "intro" as "intro" | "playing",
            // Boss state
            bossMode: false,
            boss: null as Boss | null,
            bossMinions: [] as Alien[],
            bossDead: false,
        };
        g.aliens = buildAliens(W, 0);
        gameRef.current = g;

        // Start game music (Hail To The King)
        const gameMusic = new Audio("/game-music.mp3");
        gameMusic.loop = true;
        gameMusic.volume = 0.35;
        gameMusicRef.current = gameMusic;
        // Try to play immediately (may need user gesture)
        gameMusic.play().catch(() => {});
        setNowPlaying("Avenged Sevenfold — Hail To The King (8 bit)");

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") { onClose(); return; }
            g.keys.add(e.key);
            if ([" ", "ArrowLeft", "ArrowRight"].includes(e.key)) e.preventDefault();
            // Unlock audio on first user interaction
            if (gameMusicRef.current && gameMusicRef.current.paused && !g.bossMode) {
                gameMusicRef.current.play().catch(() => {});
            }
        };
        const onKeyUp = (e: KeyboardEvent) => g.keys.delete(e.key);
        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("keyup", onKeyUp);

        // ─── Mobile Touch Controls ───
        let touchStartX = 0;
        let playerStartX = 0;
        let isTouching = false;

        const onTouchStart = (e: TouchEvent) => {
            const g = gameRef.current;
            if (!g || g.gameOver || g.won) return;
            if (e.cancelable) e.preventDefault(); // Prevent scrolling
            
            if (gameMusicRef.current && gameMusicRef.current.paused && !g.bossMode) {
                gameMusicRef.current.play().catch(() => {});
            }

            isTouching = true;
            touchStartX = e.touches[0].clientX / g.touchScale;
            playerStartX = g.player.x;
            g.keys.add(" "); // Auto-fire while touching
        };

        const onTouchMove = (e: TouchEvent) => {
            const g = gameRef.current;
            if (!g || !isTouching || g.gameOver || g.won) return;
            if (e.cancelable) e.preventDefault();
            
            const currentX = e.touches[0].clientX / g.touchScale;
            const deltaX = currentX - touchStartX;
            g.player.x = Math.max(0, Math.min(g.W - PLAYER_W, playerStartX + deltaX));
        };

        const onTouchEnd = (e: TouchEvent) => {
            const g = gameRef.current;
            isTouching = false;
            if (g) g.keys.delete(" ");
        };

        window.addEventListener("touchstart", onTouchStart, { passive: false });
        window.addEventListener("touchmove", onTouchMove, { passive: false });
        window.addEventListener("touchend", onTouchEnd);
        window.addEventListener("touchcancel", onTouchEnd);

        // ─── Drawing helpers ───
        const drawShip = (x: number, y: number) => {
            if (g.shieldActive) {
                ctx.strokeStyle = "#ffcc0066";
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.ellipse(x + PLAYER_W / 2, y + PLAYER_H / 2, PLAYER_W / 2 + 8, PLAYER_H / 2 + 8, 0, 0, Math.PI * 2);
                ctx.stroke();
            }
            ctx.fillStyle = "#00ff88";
            ctx.fillRect(x + 18, y, 8, 4); ctx.fillRect(x + 12, y + 4, 20, 4);
            ctx.fillRect(x + 6, y + 8, 32, 4); ctx.fillRect(x + 0, y + 12, 44, 12);
            ctx.fillStyle = "#00cc66";
            ctx.fillRect(x + 0, y + 20, 8, 4); ctx.fillRect(x + 36, y + 20, 8, 4);
            ctx.fillStyle = "#00ffaa44";
            ctx.fillRect(x + 16, y + 24, 12, 4);
        };

        const drawAlien = (x: number, y: number, row: number, frame: number, hp: number) => {
            const baseColor = alienColors[row % alienColors.length];
            ctx.fillStyle = baseColor;
            const f = frame % 2 === 0;
            if (row % 2 === 0) {
                ctx.fillRect(x + 12, y, 8, 4); ctx.fillRect(x + 4, y + 4, 24, 4); ctx.fillRect(x + 0, y + 8, 32, 4);
                ctx.fillRect(x + 4, y + 12, 8, 4); ctx.fillRect(x + 20, y + 12, 8, 4);
                if (f) { ctx.fillRect(x + 0, y + 12, 4, 12); ctx.fillRect(x + 28, y + 12, 4, 12); }
                else { ctx.fillRect(x + 4, y + 16, 4, 8); ctx.fillRect(x + 24, y + 16, 4, 8); }
            } else {
                ctx.fillRect(x + 8, y, 16, 4); ctx.fillRect(x + 4, y + 4, 24, 4); ctx.fillRect(x + 0, y + 8, 32, 8);
                if (f) { ctx.fillRect(x + 2, y + 16, 8, 8); ctx.fillRect(x + 22, y + 16, 8, 8); }
                else { ctx.fillRect(x + 8, y + 16, 8, 8); ctx.fillRect(x + 16, y + 16, 8, 8); }
            }
            ctx.fillStyle = "#000";
            ctx.fillRect(x + 10, y + 8, 4, 4); ctx.fillRect(x + 18, y + 8, 4, 4);
            // HP indicator for tough aliens
            if (hp > 1) {
                ctx.fillStyle = "#ffffff88";
                ctx.fillRect(x + 12, y - 4, 8, 2);
            }
        };

        const drawPowerUp = (p: PowerUp) => {
            const color = POWERUP_COLORS[p.type];
            ctx.shadowColor = color;
            ctx.shadowBlur = 10;
            ctx.fillStyle = color;
            ctx.fillRect(p.x - 8, p.y - 8, 16, 16);
            ctx.shadowBlur = 0;
            ctx.fillStyle = "#000";
            ctx.font = "bold 10px monospace";
            ctx.textAlign = "center";
            ctx.fillText(POWERUP_LABELS[p.type], p.x, p.y + 4);
        };

        let frameCount = 0;

        const startLevel = (level: number) => {
            const cfg = LEVEL_CONFIGS[Math.min(level, LEVEL_CONFIGS.length - 1)];
            g.aliens = buildAliens(W, level);
            g.alienBullets = [];
            g.bullets = [];
            g.powerUps = [];
            g.dirX = cfg.speed;
            g.lastAlienShot = Date.now();
            g.levelTransition = true;
            g.levelTransitionTimer = 120; // 2s at 60fps
            sfxLevelUp(audio);
        };

        // Countdown sound
        function sfxCountdown(ctx: AudioContext | null, num: number) {
            playTone(ctx, num === 0 ? 880 : 440, num === 0 ? 0.3 : 0.15, "square", 0.07);
        }
        sfxCountdown(audio, 3); // Play first beep

        const loop = () => {
            frameCount++;
            const now = Date.now();
            const cfg = LEVEL_CONFIGS[Math.min(g.level, LEVEL_CONFIGS.length - 1)];

            // Countdown intro
            if (g.countdownPhase === "intro") {
                g.countdownTimer++;
                if (g.countdownTimer >= 60) { // ~1s per step
                    g.countdownTimer = 0;
                    g.countdown--;
                    if (g.countdown < 0) {
                        g.countdownPhase = "playing";
                        // Start game music on GO!
                        if (gameMusicRef.current && !g.bossMode) {
                            gameMusicRef.current.currentTime = 0;
                            gameMusicRef.current.play().catch(() => {});
                            setNowPlaying("Avenged Sevenfold — Hail To The King (8 bit)");
                        }
                    } else {
                        sfxCountdown(audio, g.countdown);
                    }
                }
            }

            // Level transition
            if (g.levelTransition) {
                g.levelTransitionTimer--;
                if (g.levelTransitionTimer <= 0) g.levelTransition = false;
            }

            if (!g.gameOver && !g.won && !g.levelTransition && g.countdownPhase === "playing") {
                // Player
                const speed = 6;
                if (g.keys.has("ArrowLeft")) g.player.x = Math.max(0, g.player.x - speed);
                if (g.keys.has("ArrowRight")) g.player.x = Math.min(W - PLAYER_W, g.player.x + speed);

                // Shoot
                const shootCooldown = (g.rapidFire || g.berserkerMode) ? 80 : 200;
                if (g.keys.has(" ") && now - g.lastShot > shootCooldown) {
                    const cx = g.player.x + PLAYER_W / 2;
                    const by = H - 50;
                    if (g.berserkerMode) {
                        // BERSERKER: spread of 5 bullets + 2 lasers
                        g.bullets.push({ x: cx - 1, y: by, dy: -10, w: BULLET_W, h: BULLET_H });
                        g.bullets.push({ x: cx - 12, y: by, dy: -9, w: BULLET_W, h: BULLET_H });
                        g.bullets.push({ x: cx + 10, y: by, dy: -9, w: BULLET_W, h: BULLET_H });
                        g.bullets.push({ x: cx - 20, y: by + 5, dy: -7, w: BULLET_W, h: BULLET_H });
                        g.bullets.push({ x: cx + 18, y: by + 5, dy: -7, w: BULLET_W, h: BULLET_H });
                        g.bullets.push({ x: cx - 6, y: by - 5, dy: -12, w: 4, h: 16, isLaser: true });
                        g.bullets.push({ x: cx + 4, y: by - 5, dy: -12, w: 4, h: 16, isLaser: true });
                        sfxLaser(audio);
                    } else if (g.weapon === "triple") {
                        g.bullets.push({ x: cx - 1, y: by, dy: -8, w: BULLET_W, h: BULLET_H });
                        g.bullets.push({ x: cx - 8, y: by + 4, dy: -7, w: BULLET_W, h: BULLET_H });
                        g.bullets.push({ x: cx + 6, y: by + 4, dy: -7, w: BULLET_W, h: BULLET_H });
                        sfxShoot(audio);
                    } else if (g.weapon === "double") {
                        g.bullets.push({ x: cx - 10, y: by, dy: -8, w: BULLET_W, h: BULLET_H });
                        g.bullets.push({ x: cx + 8, y: by, dy: -8, w: BULLET_W, h: BULLET_H });
                        sfxShoot(audio);
                    } else if (g.weapon === "laser") {
                        g.bullets.push({ x: cx - 2, y: by, dy: -12, w: 5, h: 20, isLaser: true });
                        sfxLaser(audio);
                    } else {
                        g.bullets.push({ x: cx - 1, y: by, dy: -8, w: BULLET_W, h: BULLET_H });
                        sfxShoot(audio);
                    }
                    g.lastShot = now;
                }

                // Decay timers
                if (g.weaponTimer > 0) { g.weaponTimer--; if (g.weaponTimer <= 0 && !g.berserkerMode) g.weapon = "normal"; }
                if (g.shieldTimer > 0) { g.shieldTimer--; if (g.shieldTimer <= 0) g.shieldActive = false; }
                if (g.rapidTimer > 0) { g.rapidTimer--; if (g.rapidTimer <= 0) g.rapidFire = false; }
                if (g.berserkerTimer > 0) { g.berserkerTimer--; if (g.berserkerTimer <= 0) { g.berserkerMode = false; g.weapon = "normal"; g.rapidFire = false; } }

                // Bullets
                g.bullets = g.bullets.filter((b: Bullet) => { b.y += b.dy; return b.y > -20; });
                g.alienBullets = g.alienBullets.filter((b: Bullet) => { b.y += b.dy; return b.y < H + 10; });

                // Alien movement
                let shouldDrop = false;
                for (const a of g.aliens as Alien[]) {
                    if (!a.alive) continue;
                    if ((a.x + ALIEN_W >= W - 10 && g.dirX > 0) || (a.x <= 10 && g.dirX < 0)) { shouldDrop = true; break; }
                }
                if (shouldDrop) { g.dirX *= -1; for (const a of g.aliens as Alien[]) if (a.alive) a.y += 14; }
                for (const a of g.aliens as Alien[]) if (a.alive) a.x += g.dirX;

                // Alien shoot
                if (now - g.lastAlienShot > cfg.shootInterval) {
                    const alive = (g.aliens as Alien[]).filter(a => a.alive);
                    if (alive.length > 0) {
                        const shooter = alive[Math.floor(Math.random() * alive.length)];
                        g.alienBullets.push({ x: shooter.x + ALIEN_W / 2, y: shooter.y + ALIEN_H, dy: 4.5, w: BULLET_W, h: BULLET_H });
                        g.lastAlienShot = now;
                    }
                }

                // Collision: bullets → aliens
                for (const b of g.bullets as Bullet[]) {
                    for (const a of g.aliens as Alien[]) {
                        if (!a.alive) continue;
                        if (b.x + b.w >= a.x && b.x <= a.x + ALIEN_W && b.y >= a.y && b.y <= a.y + ALIEN_H) {
                            a.hp--;
                            if (a.hp <= 0) {
                                a.alive = false;
                                g.score += (10 + g.level * 5) * (6 - a.row);
                                spawnExplosion(g, a.x + ALIEN_W / 2, a.y + ALIEN_H / 2, alienColors[a.row % alienColors.length], 12);
                                sfxHit(audio);
                                // Weighted power-up drop (18% chance)
                                if (Math.random() < 0.18) {
                                    g.powerUps.push({ x: a.x + ALIEN_W / 2, y: a.y + ALIEN_H / 2, type: rollPowerUp(), vy: 2 });
                                }
                            }
                            b.y = -200;
                        }
                    }
                }

                // Power-ups movement + collection
                g.powerUps = (g.powerUps as PowerUp[]).filter(p => {
                    p.y += p.vy;
                    // Collect
                    if (p.x >= g.player.x - 8 && p.x <= g.player.x + PLAYER_W + 8 && p.y >= H - 55 && p.y <= H - 20) {
                        sfxPowerUp(audio);
                        if (p.type === "berserker") {
                            g.berserkerMode = true; g.berserkerTimer = 480; g.weapon = "berserker"; g.rapidFire = true; g.rapidTimer = 480;
                            spawnExplosion(g, g.player.x + PLAYER_W / 2, H - 40, "#ff0000", 20);
                            spawnExplosion(g, g.player.x + PLAYER_W / 2, H - 60, "#ffcc00", 15);
                        }
                        else if (p.type === "life") { g.lives = Math.min(g.lives + 1, 9); }
                        else if (p.type === "triple") { g.weapon = "triple"; g.weaponTimer = 600; }
                        else if (p.type === "double") { g.weapon = "double"; g.weaponTimer = 600; }
                        else if (p.type === "laser") { g.weapon = "laser"; g.weaponTimer = 400; }
                        else if (p.type === "shield") { g.shieldActive = true; g.shieldTimer = 500; }
                        else if (p.type === "rapid") { g.rapidFire = true; g.rapidTimer = 500; }
                        return false;
                    }
                    return p.y < H + 20;
                });

                // Collision: alien bullets → player
                for (const b of g.alienBullets as Bullet[]) {
                    if (b.x >= g.player.x && b.x <= g.player.x + PLAYER_W && b.y >= H - PLAYER_H - 30 && b.y <= H - 30) {
                        b.y = H + 100;
                        if (g.shieldActive) { g.shieldActive = false; g.shieldTimer = 0; spawnExplosion(g, g.player.x + PLAYER_W / 2, H - 40, "#ffcc00", 6); }
                        else {
                            g.lives--;
                            spawnExplosion(g, g.player.x + PLAYER_W / 2, H - 40, "#00ff88", 15);
                            if (g.lives <= 0) { g.gameOver = true; sfxGameOver(audio); }
                        }
                    }
                }

                // Aliens reach bottom
                for (const a of g.aliens as Alien[]) {
                    if (a.alive && a.y + ALIEN_H >= H - 60) { g.gameOver = true; sfxGameOver(audio); }
                }

                // Level complete
                if (!g.bossMode && (g.aliens as Alien[]).every(a => !a.alive)) {
                    if (g.level >= LEVEL_CONFIGS.length - 1) {
                        g.won = true;
                        setShowDoomButton(true);
                    } else { g.level++; startLevel(g.level); }
                }
            }

            // ─── BOSS MODE LOGIC ───
            if (g.bossMode && g.boss && !g.bossDead && !g.gameOver) {
                const boss = g.boss as Boss;
                const now = Date.now();
                boss.timer++;

                // Boss movement (sinusoidal sweep)
                boss.x = W / 2 - 100 + Math.sin(boss.timer * 0.01) * (W / 2 - 120);
                boss.y = 40 + Math.sin(boss.timer * 0.008) * 20;

                // Player movement during boss
                if (g.keys.has("ArrowLeft")) g.player.x = Math.max(0, g.player.x - 6);
                if (g.keys.has("ArrowRight")) g.player.x = Math.min(W - PLAYER_W, g.player.x + 6);

                // Player shooting during boss
                const shootCd = g.rapidFire ? 100 : 200;
                if (g.keys.has(" ") && now - g.lastShot > shootCd) {
                    const cx = g.player.x + PLAYER_W / 2;
                    const by = H - 50;
                    if (g.weapon === "double") {
                        g.bullets.push({ x: cx - 10, y: by, dy: -8, w: BULLET_W, h: BULLET_H });
                        g.bullets.push({ x: cx + 8, y: by, dy: -8, w: BULLET_W, h: BULLET_H });
                    } else if (g.weapon === "laser") {
                        g.bullets.push({ x: cx - 2, y: by, dy: -12, w: 5, h: 20, isLaser: true });
                    } else {
                        g.bullets.push({ x: cx - 1, y: by, dy: -8, w: BULLET_W, h: BULLET_H });
                    }
                    g.lastShot = now;
                }

                // Decay power-up timers
                if (g.weaponTimer > 0) { g.weaponTimer--; if (g.weaponTimer <= 0) g.weapon = "normal"; }
                if (g.shieldTimer > 0) { g.shieldTimer--; if (g.shieldTimer <= 0) g.shieldActive = false; }
                if (g.rapidTimer > 0) { g.rapidTimer--; if (g.rapidTimer <= 0) g.rapidFire = false; }

                // Bullets move
                g.bullets = g.bullets.filter((b: Bullet) => { b.y += b.dy; return b.y > -20; });
                g.alienBullets = g.alienBullets.filter((b: Bullet) => { b.y += b.dy; return b.y < H + 10; });

                // Boss attacks
                // 1. Bullet spread every 1.2s
                if (now - boss.lastShot > 1200) {
                    for (let i = -2; i <= 2; i++) {
                        g.alienBullets.push({ x: boss.x + 100 + i * 30, y: boss.y + 70, dy: 4, w: 4, h: 10 });
                    }
                    boss.lastShot = now;
                    sfxBossLaser(audio);
                }

                // 2. Sweeping laser beam every 8s for 2s
                if (boss.timer % 480 < 120) {
                    boss.laserActive = true;
                    boss.laserAngle = Math.sin(boss.timer * 0.04) * 0.6;
                } else {
                    boss.laserActive = false;
                }

                // 3. Spawn minions every 3s
                if (now - boss.lastMinion > 3000) {
                    const mx = boss.x + 80 + Math.random() * 40;
                    g.bossMinions.push({ x: mx, y: boss.y + 60, alive: true, row: Math.floor(Math.random() * 4), hp: 1 });
                    boss.lastMinion = now;
                }

                // Move minions down
                for (const m of g.bossMinions as Alien[]) {
                    if (m.alive) {
                        m.y += 1.5;
                        m.x += Math.sin(m.y * 0.03) * 1;
                        if (m.y > H) m.alive = false;
                    }
                }
                // Minions shoot occasionally
                for (const m of g.bossMinions as Alien[]) {
                    if (m.alive && Math.random() < 0.005) {
                        g.alienBullets.push({ x: m.x + ALIEN_W / 2, y: m.y + ALIEN_H, dy: 4, w: BULLET_W, h: BULLET_H });
                    }
                }

                // Collision: player bullets → boss
                for (const b of g.bullets as Bullet[]) {
                    if (b.x >= boss.x && b.x <= boss.x + 200 && b.y >= boss.y && b.y <= boss.y + 70) {
                        boss.hp--;
                        b.y = -200;
                        g.score += 5;
                        spawnExplosion(g, b.x, b.y + 10, "#ff6633", 4);
                        sfxBossHit(audio);
                        boss.shakeTimer = 8;
                        if (boss.hp <= 0) {
                            g.bossDead = true;
                            g.score += 5000;
                            // Massive explosion
                            for (let i = 0; i < 40; i++) {
                                setTimeout(() => spawnExplosion(g, boss.x + Math.random() * 200, boss.y + Math.random() * 70, alienColors[Math.floor(Math.random() * 6)], 8), i * 50);
                            }
                            if (doomMusicRef.current) { doomMusicRef.current(); doomMusicRef.current = null; }
                        }
                    }
                }

                // Collision: player bullets → minions
                for (const b of g.bullets as Bullet[]) {
                    for (const m of g.bossMinions as Alien[]) {
                        if (!m.alive) continue;
                        if (b.x >= m.x && b.x <= m.x + ALIEN_W && b.y >= m.y && b.y <= m.y + ALIEN_H) {
                            m.alive = false;
                            b.y = -200;
                            g.score += 25;
                            spawnExplosion(g, m.x + ALIEN_W / 2, m.y + ALIEN_H / 2, alienColors[m.row % alienColors.length], 8);
                            sfxHit(audio);
                            if (Math.random() < 0.25) {
                                g.powerUps.push({ x: m.x + ALIEN_W / 2, y: m.y + ALIEN_H / 2, type: rollPowerUp(), vy: 2 });
                            }
                        }
                    }
                }

                // Collision: alien bullets → player (boss mode)
                for (const b of g.alienBullets as Bullet[]) {
                    if (b.x >= g.player.x && b.x <= g.player.x + PLAYER_W && b.y >= H - PLAYER_H - 30 && b.y <= H - 30) {
                        b.y = H + 100;
                        if (g.shieldActive) { g.shieldActive = false; g.shieldTimer = 0; }
                        else { g.lives--; spawnExplosion(g, g.player.x + PLAYER_W / 2, H - 40, "#00ff88", 15); if (g.lives <= 0) { g.gameOver = true; sfxGameOver(audio); if (doomMusicRef.current) { doomMusicRef.current(); doomMusicRef.current = null; } } }
                    }
                }

                // Laser collision with player
                if (boss.laserActive) {
                    const laserEndX = boss.x + 100 + Math.sin(boss.laserAngle) * H;
                    const playerCX = g.player.x + PLAYER_W / 2;
                    if (Math.abs(playerCX - laserEndX) < 30 && !g.shieldActive) {
                        if (frameCount % 20 === 0) { g.lives--; spawnExplosion(g, g.player.x + PLAYER_W / 2, H - 40, "#ff3366", 8); if (g.lives <= 0) { g.gameOver = true; sfxGameOver(audio); if (doomMusicRef.current) { doomMusicRef.current(); doomMusicRef.current = null; } } }
                    }
                }

                // Power-ups collection
                g.powerUps = (g.powerUps as PowerUp[]).filter(p => {
                    p.y += p.vy;
                    if (p.x >= g.player.x - 8 && p.x <= g.player.x + PLAYER_W + 8 && p.y >= H - 55 && p.y <= H - 20) {
                        sfxPowerUp(audio);
                        if (p.type === "berserker") {
                            g.berserkerMode = true; g.berserkerTimer = 480; g.weapon = "berserker"; g.rapidFire = true; g.rapidTimer = 480;
                            spawnExplosion(g, g.player.x + PLAYER_W / 2, H - 40, "#ff0000", 20);
                            spawnExplosion(g, g.player.x + PLAYER_W / 2, H - 60, "#ffcc00", 15);
                        }
                        else if (p.type === "life") { g.lives = Math.min(g.lives + 1, 9); }
                        else if (p.type === "triple") { g.weapon = "triple"; g.weaponTimer = 600; }
                        else if (p.type === "double") { g.weapon = "double"; g.weaponTimer = 600; }
                        else if (p.type === "laser") { g.weapon = "laser"; g.weaponTimer = 400; }
                        else if (p.type === "shield") { g.shieldActive = true; g.shieldTimer = 500; }
                        else if (p.type === "rapid") { g.rapidFire = true; g.rapidTimer = 500; }
                        return false;
                    }
                    return p.y < H + 20;
                });

                g.bossMinions = (g.bossMinions as Alien[]).filter(m => m.alive || false);
            }

            // Particles
            g.particles = (g.particles as Particle[]).filter(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.03; p.life -= 0.02; return p.life > 0; });

            // === DRAW ===
            ctx.save();
            ctx.scale(g.touchScale, g.touchScale);

            ctx.clearRect(0, 0, W, H);
            ctx.fillStyle = "rgba(0,0,0,0.4)";
            ctx.fillRect(0, 0, W, H);

            // Scanlines
            ctx.fillStyle = "rgba(255,255,255,0.008)";
            for (let y = 0; y < H; y += 3) ctx.fillRect(0, y, W, 1);

            // Aliens
            const animFrame = Math.floor(frameCount / 25);
            if (!g.bossMode) {
                for (const a of g.aliens as Alien[]) {
                    if (a.alive) drawAlien(a.x, a.y, a.row, animFrame, a.hp);
                }
            }

            // Power-ups
            for (const p of g.powerUps as PowerUp[]) drawPowerUp(p);

            // ─── BOSS DRAWING ───
            if (g.bossMode && g.boss && !g.bossDead) {
                const boss = g.boss as Boss;
                const shakeX = boss.shakeTimer > 0 ? (Math.random() - 0.5) * 6 : 0;
                const shakeY = boss.shakeTimer > 0 ? (Math.random() - 0.5) * 6 : 0;
                if (boss.shakeTimer > 0) boss.shakeTimer--;
                const bx = boss.x + shakeX;
                const by = boss.y + shakeY;

                // Boss body
                ctx.fillStyle = "#cc0000";
                ctx.fillRect(bx + 60, by, 80, 10);
                ctx.fillRect(bx + 30, by + 10, 140, 15);
                ctx.fillRect(bx + 10, by + 25, 180, 20);
                ctx.fillRect(bx + 0, by + 45, 200, 15);
                ctx.fillRect(bx + 20, by + 60, 160, 10);
                // Wings
                ctx.fillStyle = "#990000";
                ctx.fillRect(bx + 0, by + 40, 30, 20);
                ctx.fillRect(bx + 170, by + 40, 30, 20);
                // Engines
                ctx.fillStyle = "#ff660088";
                ctx.fillRect(bx + 50, by + 65, 15, 8 + Math.sin(frameCount * 0.3) * 4);
                ctx.fillRect(bx + 135, by + 65, 15, 8 + Math.sin(frameCount * 0.3 + 1) * 4);
                // Eyes
                ctx.fillStyle = "#ff0000";
                ctx.shadowColor = "#ff0000"; ctx.shadowBlur = 10;
                ctx.fillRect(bx + 70, by + 30, 12, 8);
                ctx.fillRect(bx + 118, by + 30, 12, 8);
                ctx.shadowBlur = 0;
                // Cannon
                ctx.fillStyle = "#ff3333";
                ctx.fillRect(bx + 92, by + 55, 16, 15);

                // Sweeping laser beam
                if (boss.laserActive) {
                    ctx.save();
                    ctx.strokeStyle = "#ff000088";
                    ctx.lineWidth = 6;
                    ctx.shadowColor = "#ff0000"; ctx.shadowBlur = 20;
                    ctx.beginPath();
                    ctx.moveTo(bx + 100, by + 70);
                    ctx.lineTo(bx + 100 + Math.sin(boss.laserAngle) * H, H);
                    ctx.stroke();
                    ctx.strokeStyle = "#ff6666aa";
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    ctx.shadowBlur = 0;
                    ctx.restore();
                }

                // HP Bar — positioned below HUD
                const hpPct = boss.hp / boss.maxHp;
                const hpBarW = 300;
                ctx.fillStyle = "#333";
                ctx.fillRect(W / 2 - hpBarW / 2, 48, hpBarW, 14);
                const hpColor = hpPct > 0.5 ? "#ff3333" : hpPct > 0.25 ? "#ff6600" : "#ff0000";
                ctx.fillStyle = hpColor;
                ctx.shadowColor = hpColor; ctx.shadowBlur = 8;
                ctx.fillRect(W / 2 - hpBarW / 2, 48, hpBarW * hpPct, 14);
                ctx.shadowBlur = 0;
                ctx.fillStyle = "#fff"; ctx.font = "bold 11px monospace"; ctx.textAlign = "center";
                ctx.fillText("MOTHERSHIP", W / 2, 60);
            }

            // Boss minions
            if (g.bossMode) {
                for (const m of g.bossMinions as Alien[]) {
                    if (m.alive) drawAlien(m.x, m.y, m.row, animFrame, m.hp);
                }
            }

            // Player
            drawShip(g.player.x, H - PLAYER_H - 30);

            // Player bullets
            for (const b of g.bullets as Bullet[]) {
                if (b.isLaser) { ctx.shadowColor = "#ff3366"; ctx.shadowBlur = 12; ctx.fillStyle = "#ff6688"; }
                else { ctx.shadowColor = "#00ff88"; ctx.shadowBlur = 8; ctx.fillStyle = "#00ff88"; }
                ctx.fillRect(b.x, b.y, b.w, b.h);
                ctx.shadowBlur = 0;
            }

            // Alien bullets
            for (const b of g.alienBullets as Bullet[]) {
                ctx.shadowColor = "#ff3366"; ctx.shadowBlur = 6; ctx.fillStyle = "#ff3366";
                ctx.fillRect(b.x, b.y, b.w, b.h); ctx.shadowBlur = 0;
            }

            // Particles
            for (const p of g.particles as Particle[]) {
                ctx.globalAlpha = p.life;
                ctx.shadowColor = p.color; ctx.shadowBlur = 4; ctx.fillStyle = p.color;
                ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
                ctx.shadowBlur = 0; ctx.globalAlpha = 1;
            }

            // ─── HUD ───
            ctx.fillStyle = "#fff"; ctx.font = "16px monospace"; ctx.textAlign = "left";
            ctx.fillText(`SCORE  ${g.score}`, 24, 36);
            
            // Draw pixelated hearts for lives
            const heartScale = 3;
            const heartW = 7 * heartScale;
            const heartSpacing = 16;
            const numLives = Math.max(0, g.lives);
            const heartPixels = [
                "0110110",
                "1111111",
                "1111111",
                "0111110",
                "0011100",
                "0001000"
            ];
            for (let i = 0; i < numLives; i++) {
                const startX = W - 24 - heartW - (numLives - 1 - i) * (heartW + heartSpacing);
                ctx.fillStyle = "#ff3366";
                ctx.shadowColor = "#ff3366"; ctx.shadowBlur = 6;
                for (let r = 0; r < heartPixels.length; r++) {
                    for (let c = 0; c < heartPixels[r].length; c++) {
                        if (heartPixels[r][c] === '1') {
                            ctx.fillRect(startX + c * heartScale, 22 + r * heartScale, heartScale, heartScale);
                        }
                    }
                }
                ctx.shadowBlur = 0;
            }
            // Level / mode indicator
            ctx.textAlign = "center"; ctx.fillStyle = "rgba(255,255,255,0.4)"; ctx.font = "12px monospace";
            ctx.fillText(g.bossMode ? "DOOM MODE  •  ESC TO EXIT" : `${cfg.label}  •  ESC TO EXIT`, W / 2, 36);

            // Active power-up indicator
            if (g.weapon !== "normal" || g.shieldActive || g.rapidFire || g.berserkerMode) {
                const indicators: string[] = [];
                if (g.berserkerMode) indicators.push(`☠ BERSERKER [${Math.ceil(g.berserkerTimer / 60)}s] ☠`);
                else if (g.weapon === "triple") indicators.push(`TRIPLE SHOT [${Math.ceil(g.weaponTimer / 60)}s]`);
                else if (g.weapon === "double") indicators.push(`DOUBLE SHOT [${Math.ceil(g.weaponTimer / 60)}s]`);
                else if (g.weapon === "laser") indicators.push(`LASER [${Math.ceil(g.weaponTimer / 60)}s]`);
                if (g.shieldActive) indicators.push(`SHIELD [${Math.ceil(g.shieldTimer / 60)}s]`);
                if (g.rapidFire && !g.berserkerMode) indicators.push(`RAPID FIRE [${Math.ceil(g.rapidTimer / 60)}s]`);
                ctx.fillStyle = g.berserkerMode ? "#ff0000" : "#ffcc00"; ctx.font = g.berserkerMode ? "bold 13px monospace" : "11px monospace"; ctx.textAlign = "center";
                ctx.fillText(indicators.join("  •  "), W / 2, H - 8);
            }

            // Countdown intro overlay
            if (g.countdownPhase === "intro") {
                const progress = g.countdownTimer / 60;
                const scale = 1 + (1 - progress) * 0.5;
                const alpha = progress < 0.2 ? progress / 0.2 : progress > 0.8 ? (1 - progress) / 0.2 : 1;
                const label = g.countdown === 0 ? "GO!" : `${g.countdown}`;
                const color = g.countdown === 0 ? "#00ff88" : "#33ccff";

                ctx.save();
                ctx.globalAlpha = Math.min(1, alpha);
                ctx.translate(W / 2, H / 2);
                ctx.scale(scale, scale);
                ctx.shadowColor = color;
                ctx.shadowBlur = 30;
                ctx.fillStyle = color;
                ctx.font = "bold 120px monospace";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(label, 0, 0);
                ctx.shadowBlur = 0;
                ctx.restore();
            }

            // Level transition
            if (g.levelTransition && g.countdownPhase === "playing") {
                const alpha = g.levelTransitionTimer > 90 ? (120 - g.levelTransitionTimer) / 30 : g.levelTransitionTimer > 30 ? 1 : g.levelTransitionTimer / 30;
                ctx.fillStyle = `rgba(0,0,0,${0.4 * alpha})`;
                ctx.fillRect(0, H / 2 - 50, W, 100);
                ctx.globalAlpha = alpha;
                ctx.fillStyle = "#33ccff"; ctx.font = "bold 36px monospace"; ctx.textAlign = "center";
                ctx.fillText(cfg.label, W / 2, H / 2 + 5);
                ctx.fillStyle = "#ffffff80"; ctx.font = "14px monospace";
                ctx.fillText("GET READY", W / 2, H / 2 + 30);
                ctx.globalAlpha = 1;
            }

            // Game Over / Win / Boss Dead
            if (g.gameOver || (g.won && !g.bossMode) || g.bossDead) {
                // Stop music on end state
                if (gameMusicRef.current && !gameMusicRef.current.paused) { gameMusicRef.current.pause(); setNowPlaying(null); }
                if (g.bossDead && doomMusicRef.current) { doomMusicRef.current(); doomMusicRef.current = null; setNowPlaying(null); }
                ctx.fillStyle = "rgba(0,0,0,0.5)";
                ctx.fillRect(0, H / 2 - 70, W, 140);
                const isVictory = g.bossDead;
                const label = isVictory ? "DOOM CONQUERED" : g.won ? "ALL SECTORS CLEARED" : "GAME OVER";
                ctx.shadowColor = isVictory ? "#ffcc00" : g.won ? "#00ff88" : "#ff3366"; ctx.shadowBlur = 20;
                ctx.fillStyle = isVictory ? "#ffcc00" : g.won ? "#00ff88" : "#ff3366";
                ctx.font = "bold 48px monospace"; ctx.textAlign = "center";
                ctx.fillText(label, W / 2, H / 2);
                ctx.shadowBlur = 0;
                ctx.fillStyle = "#ffffff80"; ctx.font = "16px monospace";
                ctx.fillText(`Score: ${g.score}`, W / 2, H / 2 + 35);
                ctx.fillStyle = "#ffffff50"; ctx.font = "13px monospace";
                ctx.fillText(g.gameOver ? "Press ESC to exit  •  Press R to restart" : isVictory ? "Press ESC to exit  •  You are the DOOM SLAYER" : "Press ESC or click ACTIVATE DOOM MODE", W / 2, H / 2 + 60);
            }

            // Restart on R
            if ((g.gameOver || g.bossDead) && g.keys.has("r")) {
                g.score = 0; g.lives = 5; g.level = 0; g.gameOver = false; g.won = false;
                g.weapon = "normal"; g.weaponTimer = 0; g.shieldActive = false; g.shieldTimer = 0;
                g.rapidFire = false; g.rapidTimer = 0; g.berserkerMode = false; g.berserkerTimer = 0; g.particles = []; g.powerUps = [];
                g.player.x = W / 2 - PLAYER_W / 2;
                g.bossMode = false; g.boss = null; g.bossMinions = []; g.bossDead = false;
                setShowDoomButton(false);
                if (doomMusicRef.current) { doomMusicRef.current(); doomMusicRef.current = null; }
                // Restart game music
                if (gameMusicRef.current) { gameMusicRef.current.currentTime = 0; gameMusicRef.current.play().catch(() => {}); }
                setNowPlaying("Avenged Sevenfold — Hail To The King (8 bit)");
                startLevel(0);
            }

            ctx.restore();
            g.animFrame = requestAnimationFrame(loop);
        };

        g.animFrame = requestAnimationFrame(loop);

        return () => {
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("keyup", onKeyUp);
            window.removeEventListener("touchstart", onTouchStart);
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("touchend", onTouchEnd);
            window.removeEventListener("touchcancel", onTouchEnd);
            if (gameRef.current) cancelAnimationFrame(gameRef.current.animFrame);
            if (audioRef.current) audioRef.current.close();
            if (doomMusicRef.current) { doomMusicRef.current(); doomMusicRef.current = null; }
            if (gameMusicRef.current) { gameMusicRef.current.pause(); gameMusicRef.current = null; }
            
            // Show UI elements again
            window.dispatchEvent(new Event("game:stop"));
        };
    }, [onClose, spawnExplosion, buildAliens]);

    const activateDoomMode = () => {
        const g = gameRef.current;
        if (!g) return;
        setShowDoomButton(false);
        g.won = false;
        g.gameOver = false;
        g.bossMode = true;
        g.boss = { x: g.W / 2 - 100, y: 130, hp: 200, maxHp: 200, phase: 0, timer: 0, lastShot: Date.now(), lastMinion: Date.now(), laserAngle: 0, laserActive: false, laserTimer: 0, shakeTimer: 0 } as Boss;
        g.bossMinions = [];
        g.alienBullets = [];
        g.bullets = [];
        g.lives = Math.max(g.lives, 5); // Give extra lives for boss
        g.weapon = "double"; g.weaponTimer = 99999; // Permanent double shot for boss
        g.levelTransition = true; g.levelTransitionTimer = 120;
        // Stop game music, start DOOM music
        if (gameMusicRef.current) { gameMusicRef.current.pause(); }
        doomMusicRef.current = startDoomMusic();
        setNowPlaying("Mick Gordon — The Only Thing They Fear Is You");
    };

    return (
        <div className="fixed inset-0 z-[99999] animate-fade-in">
            <canvas ref={canvasRef} className="w-full h-full" style={{ imageRendering: "pixelated" }} />
            {/* Now Playing card */}
            {nowPlaying && (
                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm border border-white/10 rounded-md px-3 py-2 flex items-center gap-2 animate-fade-in" style={{ zIndex: 10000 }}>
                    <span className="text-white/50 text-xs">♫</span>
                    <div className="flex flex-col">
                        <span className="text-white/40 text-[9px] font-mono uppercase tracking-wider">Now Playing</span>
                        <span className="text-white/80 text-[11px] font-mono">{nowPlaying}</span>
                    </div>
                </div>
            )}
            {showDoomButton && (
                <div className="absolute inset-0 flex items-center justify-center" style={{ top: '65%' }}>
                    <button
                        onClick={activateDoomMode}
                        className="px-4 sm:px-8 py-3 sm:py-4 bg-red-700 hover:bg-red-600 text-white font-mono font-bold text-sm sm:text-xl tracking-wider uppercase rounded-sm border-2 border-red-500 shadow-lg shadow-red-500/50 hover:shadow-red-400/70 transition-all duration-300 hover:scale-105 animate-pulse"
                        style={{ textShadow: "0 0 10px rgba(255,0,0,0.5)" }}
                    >
                        ☠ ACTIVATE DOOM MODE ☠
                    </button>
                </div>
            )}
        </div>
    );
}
