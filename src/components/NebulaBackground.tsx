"use client";

import { useEffect, useRef } from "react";

/**
 * Interactive deep-space nebula — WebGL fragment shader.
 * Ported from the standalone "Nebula Background v2" lab into a React client
 * component. Replaces the old looping <video> background.
 *
 * Interactions:
 *  - pointer move  → "hand in smoke": the dust curls and parts in the wake
 *  - click (empty) → a graceful gravitational swirl / soft black hole
 *  - nav click     → a brief hyperspace "warp" streak
 *
 * Production notes: parameters are fixed (no tweak panel), the render loop
 * pauses when the tab is hidden, auto-scales quality by FPS, and honours
 * prefers-reduced-motion. Pointer mapping uses the canvas bounding rect so it
 * stays correct under the global `html { zoom: 0.8 }`.
 */
export function NebulaBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext("webgl", {
            antialias: false,
            preserveDrawingBuffer: false,
            powerPreference: "high-performance",
            desynchronized: true,
        });
        if (!gl) {
            canvas.style.background = "#04050c";
            return;
        }

        // Fixed scene parameters (Deep Space mood).
        const P = { mood: 0, interact: 1.0, stars: 1.0, speed: 1.0 };
        const TRAIL_N = 20;

        const VERT = "attribute vec2 p; void main(){ gl_Position=vec4(p,0.0,1.0); }";

        const FRAG = `
        precision highp float;
        uniform vec2  u_res;
        uniform float u_time;
        uniform vec2  u_mouse;
        uniform vec2  u_mvel;
        uniform vec2  u_cPos[5];
        uniform float u_cTime[5];
        uniform vec2  u_tPos[${TRAIL_N}];
        uniform vec2  u_tVel[${TRAIL_N}];
        uniform float u_tTime[${TRAIL_N}];
        uniform float u_mood;
        uniform float u_interact;
        uniform float u_stars;
        uniform float u_speed;
        uniform float u_warp;

        float hash21(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }
        float vnoise(vec2 p){
          vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
          float a=hash21(i), b=hash21(i+vec2(1,0)), c=hash21(i+vec2(0,1)), d=hash21(i+vec2(1,1));
          return mix(mix(a,b,f.x), mix(c,d,f.x), f.y);
        }
        float fbm(vec2 p){ float v=0.0,a=0.5; for(int i=0;i<5;i++){ v+=a*vnoise(p); p=p*2.02+vec2(1.7,9.2); a*=0.5; } return v; }
        mat2 rot(float a){ float s=sin(a),c=cos(a); return mat2(c,-s,s,c); }

        vec3 starLayer(vec2 uv, vec2 par, float scale, float thresh, float pxSize, float Ry){
          vec2 g=(uv-par)*scale;
          vec2 id=floor(g);
          float h=hash21(id);
          if(h<thresh) return vec3(0.0);
          vec2 jit=vec2(hash21(id+11.3), hash21(id+27.7))-0.5;
          float d=length(fract(g)-0.5 - jit*0.7);
          float pxR=pxSize*scale/Ry;
          float core=smoothstep(pxR, pxR*0.25, d);
          float mag=pow((h-thresh)/(1.0-thresh), 4.0);
          float twk=0.72+0.28*sin(u_time*(0.5+h*1.7)+h*60.0);
          float ct=hash21(id+5.1);
          vec3 sc=mix(vec3(0.74,0.82,1.0), vec3(1.0,0.87,0.72), ct*ct);
          return sc*core*(0.10+0.90*mag)*twk;
        }
        vec3 brightStars(vec2 uv, float Ry){
          vec2 g=uv*55.0;
          vec2 id=floor(g); float h=hash21(id+3.7);
          if(h<0.984) return vec3(0.0);
          vec2 jit=vec2(hash21(id+8.1),hash21(id+4.4))-0.5;
          vec2 f=fract(g)-0.5 - jit*0.6;
          float pxR=1.7*55.0/Ry;
          float core=smoothstep(pxR,pxR*0.25,length(f));
          float sx=exp(-abs(f.y)*240.0)*exp(-abs(f.x)*6.0);
          float sy=exp(-abs(f.x)*240.0)*exp(-abs(f.y)*6.0);
          float tw=0.7+0.3*sin(u_time*0.8+h*40.0);
          float mag=pow((h-0.984)/0.016,2.0);
          return vec3(0.9,0.94,1.0)*(core*1.2 + (sx+sy)*0.30*mag)*tw*(0.4+0.6*mag);
        }

        vec3 nebPal(float x, float mood){
          vec3 a,b,c,d;
          if(mood<0.5){
            a=vec3(0.14,0.17,0.24); b=vec3(0.34,0.30,0.40); c=vec3(1.0,1.15,1.3); d=vec3(0.55,0.32,0.12);
          } else if(mood<1.5){
            a=vec3(0.18,0.14,0.20); b=vec3(0.52,0.44,0.48); c=vec3(1.0,1.3,0.85); d=vec3(0.00,0.28,0.60);
          } else {
            a=vec3(0.20,0.13,0.15); b=vec3(0.50,0.34,0.34); c=vec3(1.0,0.9,1.25); d=vec3(0.04,0.10,0.34);
          }
          return a + b*cos(6.28318*(c*x + d));
        }

        void main(){
          vec2 R=u_res;
          vec2 uv=(gl_FragCoord.xy*2.0-R)/R.y;
          vec2 m =(u_mouse*2.0-R)/R.y;
          vec2 vel=u_mvel/R.y;
          float vlen=length(vel);
          float t=u_time*0.035*u_speed;

          vec2 luv=uv; float horizon=1.0, eat=0.0;
          for(int i=0;i<5;i++){
            float age=u_time-u_cTime[i];
            if(age>0.0 && age<6.0){
              vec2 cp=(u_cPos[i]*2.0-R)/R.y;
              vec2 d=uv-cp; float rr=length(d);
              float env=smoothstep(0.0,0.9,age)*smoothstep(6.0,1.8,age);
              float rs=0.14*smoothstep(0.0,0.7,age)*smoothstep(6.0,1.6,age);
              vec2 dir=normalize(d+1e-5);
              float prof=exp(-rr*rr*1.05);
              float swirl=env*prof*(2.2 + age*0.7);
              vec2 rd=rot(swirl)*d;
              luv += (rd - d);
              luv += -dir*(rs*rs/(rr*rr+0.004))*1.3*env;
              horizon*=smoothstep(rs*0.92,rs*1.18,rr);
              horizon*=1.0 - 0.45*env*smoothstep(rs*4.5,rs*1.2,rr);
              eat += env*smoothstep(rs*2.2,rs*0.7,rr);
            }
          }
          eat=clamp(eat,0.0,1.0);

          vec2 disturb=vec2(0.0); float wake=0.0;
          for(int i=0;i<${TRAIL_N};i++){
            float age=u_time-u_tTime[i];
            if(age<0.0 || age>1.1) continue;
            vec2 sp=(u_tPos[i]*2.0-R)/R.y;
            vec2 sv=u_tVel[i]/R.y;
            vec2 d=luv-sp; float rr=length(d);
            float rad=0.045+age*0.06;
            float fall=exp(-rr*rr/rad);
            float decay=smoothstep(1.1,0.0,age);
            float w=fall*decay;
            vec2 dir=normalize(d+1e-5);
            vec2 perp=vec2(-sv.y,sv.x);
            disturb += (sv*2.2 + perp*3.2 + dir*0.10) * w * u_interact;
            wake += w;
          }
          wake = clamp(wake*u_interact, 0.0, 1.5);
          { vec2 cd=luv-m; float ci=exp(-dot(cd,cd)*3.0); float sw=0.30+vlen*3.2; disturb += vec2(-cd.y,cd.x)*ci*sw*u_interact; }

          vec2 par=-m*0.07;
          vec2 p=luv*1.35 + par + disturb*1.15;
          p += vel*0.8;

          vec2 q=vec2(fbm(p+t+disturb*0.5), fbm(p+vec2(5.2,1.3)-t));
          vec2 r2=vec2(fbm(p+3.0*q+vec2(1.7,9.2)+t), fbm(p+3.0*q+vec2(8.3,2.8)-t));
          float n=fbm(p+3.0*r2+t);
          float dens=smoothstep(0.34,0.96,n);
          dens *= (1.0 - 0.32*clamp(wake,0.0,1.0));
          dens *= (1.0 - 0.92*eat);

          float hx = n*0.7 + luv.x*0.14 - luv.y*0.11 + u_time*0.013*u_speed;
          float hueVar = q.x*0.6 + r2.y*0.5;
          vec3 neb = nebPal(hx + hueVar, u_mood);
          vec3 deep = (u_mood<0.5)? vec3(0.006,0.010,0.030)
                    : (u_mood<1.5)? vec3(0.010,0.008,0.022)
                                  : vec3(0.014,0.009,0.014);
          vec3 col=mix(deep, neb, dens);
          col=mix(col, neb*1.7, smoothstep(0.78,1.0,n)*0.6);
          col += nebPal(hx+0.5, u_mood) * smoothstep(0.84,1.0,n) * 0.30;

          vec3 starCol=vec3(0.0);
          starCol += starLayer(luv, m*0.012,  90.0, 0.88, 2.0, R.y);
          starCol += starLayer(luv, m*0.030, 150.0, 0.91, 1.7, R.y)*0.9;
          starCol += starLayer(luv, m*0.060, 230.0, 0.94, 1.5, R.y)*0.72;
          starCol += brightStars(luv, R.y);
          col += starCol*u_stars*(0.55+0.45*smoothstep(0.7,0.0,dens));

          if(u_warp>0.001){
            vec2 wd=normalize(uv+1e-5);
            vec3 wsum=vec3(0.0);
            for(int s=0;s<4;s++){ float off=float(s)/4.0*u_warp*0.7; wsum+=starLayer(uv+wd*off, m*0.03, 150.0, 0.88, 1.7, R.y); }
            col += wsum*0.5*u_warp + vec3(0.45,0.58,1.0)*u_warp*0.05*smoothstep(0.0,1.6,length(uv));
            col *= 1.0+u_warp*0.22;
          }

          {
            vec2 b = rot(0.5)*luv;
            float band = exp(-pow(b.y/0.62,2.0));
            float bn = fbm(luv*2.6 + vec2(t*0.5, -t*0.3));
            vec3 bandCol = (u_mood<1.5)? vec3(0.10,0.12,0.20) : vec3(0.16,0.10,0.14);
            col += bandCol*band*bn*0.7;
            col -= vec3(0.05,0.05,0.07)*band*smoothstep(0.5,0.85,bn);
            col += starLayer(luv, m*0.02, 300.0, 0.80, 1.4, R.y)*band*0.9*u_stars;
          }

          if(u_mood>1.5){
            vec2 c2=luv-vec2(0.0,-0.18);
            float rr2=length(c2);
            col += vec3(0.5,0.28,0.12)*smoothstep(1.1,0.2,rr2)*0.10;
          }

          col*=horizon;

          float lum=dot(col,vec3(0.299,0.587,0.114));
          col=mix(vec3(lum), col, 1.45);

          float vig=smoothstep(1.55,0.25,length(uv*vec2(R.y/R.x,1.0)));
          col*=0.55+0.55*vig;
          col*=1.0-0.30*exp(-dot(uv,uv)*0.5);
          gl_FragColor=vec4(col,1.0);
        }`;

        function sh(type: number, src: string) {
            const o = gl!.createShader(type)!;
            gl!.shaderSource(o, src);
            gl!.compileShader(o);
            if (!gl!.getShaderParameter(o, gl!.COMPILE_STATUS)) console.error(gl!.getShaderInfoLog(o));
            return o;
        }
        const prog = gl.createProgram()!;
        gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
        gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
        gl.linkProgram(prog);
        gl.useProgram(prog);

        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
        const loc = gl.getAttribLocation(prog, "p");
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

        const U = (n: string) => gl.getUniformLocation(prog, n);
        const u = {
            res: U("u_res"), time: U("u_time"), mouse: U("u_mouse"), mvel: U("u_mvel"),
            cPos: U("u_cPos[0]"), cTime: U("u_cTime[0]"),
            tPos: U("u_tPos[0]"), tVel: U("u_tVel[0]"), tTime: U("u_tTime[0]"),
            mood: U("u_mood"), interact: U("u_interact"), stars: U("u_stars"), speed: U("u_speed"),
            warp: U("u_warp"),
        };

        const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
        const mvel = { x: 0, y: 0 };
        let pmx = 0, pmy = 0;
        const clicks: { x: number; y: number; t: number }[] = [];
        const cPosArr = new Float32Array(10);
        const cTimeArr = new Float32Array(5).fill(-100);
        const trail: { x: number; y: number; vx: number; vy: number; t: number }[] = [];
        const tPosArr = new Float32Array(TRAIL_N * 2);
        const tVelArr = new Float32Array(TRAIL_N * 2);
        const tTimeArr = new Float32Array(TRAIL_N).fill(-100);
        let lastPush = -1, lastPx = 0, lastPy = 0;
        const start = performance.now();
        let warpVal = 0, warpTarget = 0, qScale = 1.0, dtAvg = 16.7, qCheck = 0, lastT = performance.now();
        let warpTimer = 0;

        function resize() {
            const dpr = Math.min(window.devicePixelRatio || 1, 2) * qScale;
            const vw = canvas!.clientWidth || window.innerWidth || 1;
            const vh = canvas!.clientHeight || window.innerHeight || 1;
            const w = Math.floor(vw * dpr), h = Math.floor(vh * dpr);
            if (canvas!.width !== w || canvas!.height !== h) { canvas!.width = w; canvas!.height = h; }
        }
        window.addEventListener("resize", resize);
        resize();
        mouse.x = mouse.tx = canvas.width * 0.5; mouse.y = mouse.ty = canvas.height * 0.5;
        pmx = mouse.x; pmy = mouse.y; lastPx = mouse.x; lastPy = mouse.y;

        // Map a pointer event into GL pixel space via the canvas rect (zoom-safe).
        function toGL(e: PointerEvent) {
            const rect = canvas!.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * canvas!.width;
            const y = (1 - (e.clientY - rect.top) / rect.height) * canvas!.height;
            return { x, y };
        }
        const onMove = (e: PointerEvent) => { const p = toGL(e); mouse.tx = p.x; mouse.ty = p.y; };
        const onDown = (e: PointerEvent) => {
            // Don't punch a black hole when the user is actually clicking UI.
            const el = e.target as Element | null;
            if (el && el.closest && el.closest("a,button,input,textarea,label,select,[role=button]")) return;
            const p = toGL(e);
            const tn = (performance.now() - start) / 1000;
            clicks.push({ x: p.x, y: p.y, t: tn });
            if (clicks.length > 5) clicks.shift();
        };
        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerdown", onDown);

        function triggerWarp() {
            warpTarget = 1;
            clearTimeout(warpTimer);
            warpTimer = window.setTimeout(() => { warpTarget = 0; }, 220);
        }
        triggerWarp();
        const navLinks = Array.from(document.querySelectorAll("header a")) as HTMLElement[];
        const onNav = () => triggerWarp();
        navLinks.forEach((a) => a.addEventListener("click", onNav));

        const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
        let hidden = false;
        let raf = 0;

        function draw(t: number) {
            gl!.viewport(0, 0, canvas!.width, canvas!.height);
            gl!.uniform2f(u.res, canvas!.width, canvas!.height);
            gl!.uniform1f(u.time, t);
            gl!.uniform2f(u.mouse, mouse.x, mouse.y);
            gl!.uniform2f(u.mvel, mvel.x * 6.0, mvel.y * 6.0);
            gl!.uniform2fv(u.cPos, cPosArr); gl!.uniform1fv(u.cTime, cTimeArr);
            gl!.uniform2fv(u.tPos, tPosArr); gl!.uniform2fv(u.tVel, tVelArr); gl!.uniform1fv(u.tTime, tTimeArr);
            gl!.uniform1f(u.mood, P.mood); gl!.uniform1f(u.interact, P.interact);
            gl!.uniform1f(u.stars, P.stars); gl!.uniform1f(u.speed, P.speed);
            gl!.uniform1f(u.warp, warpVal);
            gl!.drawArrays(gl!.TRIANGLES, 0, 3);
        }

        function frame() {
            if (hidden) return;
            if (canvas!.width === 0 || canvas!.height === 0) resize();
            const t = (performance.now() - start) / 1000;
            mouse.x += (mouse.tx - mouse.x) * 0.30; mouse.y += (mouse.ty - mouse.y) * 0.30;
            mvel.x += ((mouse.x - pmx) - mvel.x) * 0.28; mvel.y += ((mouse.y - pmy) - mvel.y) * 0.28;
            pmx = mouse.x; pmy = mouse.y;
            warpVal += (warpTarget - warpVal) * (warpTarget > warpVal ? 0.28 : 0.045);
            const now = performance.now(); const dt = now - lastT; lastT = now;
            dtAvg += (Math.min(dt, 60) - dtAvg) * 0.1; qCheck++;
            if (qCheck > 45) {
                qCheck = 0;
                if (dtAvg > 23.0 && qScale > 0.6) { qScale = Math.max(0.6, qScale - 0.1); resize(); }
                else if (dtAvg < 14.0 && qScale < 1.0) { qScale = Math.min(1.0, qScale + 0.1); resize(); }
            }
            if (t - lastPush > 0.045) {
                const vx = mouse.x - lastPx, vy = mouse.y - lastPy;
                const moved = Math.hypot(vx, vy);
                if (moved > canvas!.width * 0.0016) {
                    trail.push({ x: mouse.x, y: mouse.y, vx, vy, t });
                    if (trail.length > TRAIL_N) trail.shift();
                }
                lastPx = mouse.x; lastPy = mouse.y; lastPush = t;
            }
            cTimeArr.fill(-100);
            for (let i = 0; i < clicks.length; i++) { cPosArr[i * 2] = clicks[i].x; cPosArr[i * 2 + 1] = clicks[i].y; cTimeArr[i] = clicks[i].t; }
            tTimeArr.fill(-100);
            for (let i = 0; i < trail.length; i++) { tPosArr[i * 2] = trail[i].x; tPosArr[i * 2 + 1] = trail[i].y; tVelArr[i * 2] = trail[i].vx; tVelArr[i * 2 + 1] = trail[i].vy; tTimeArr[i] = trail[i].t; }
            draw(t);
            raf = requestAnimationFrame(frame);
        }

        const onVisibility = () => {
            hidden = document.hidden;
            if (!hidden && !reduce) raf = requestAnimationFrame(frame);
        };
        document.addEventListener("visibilitychange", onVisibility);

        if (reduce) draw(12.0);
        else raf = requestAnimationFrame(frame);

        return () => {
            cancelAnimationFrame(raf);
            clearTimeout(warpTimer);
            window.removeEventListener("resize", resize);
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerdown", onDown);
            document.removeEventListener("visibilitychange", onVisibility);
            navLinks.forEach((a) => a.removeEventListener("click", onNav));
            const ext = gl.getExtension("WEBGL_lose_context");
            if (ext) ext.loseContext();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="fixed inset-0 w-full h-full block pointer-events-none"
            style={{ background: "#04050c" }}
        />
    );
}
