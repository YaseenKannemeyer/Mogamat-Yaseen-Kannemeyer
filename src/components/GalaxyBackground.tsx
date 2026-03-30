"use client";

import { Renderer, Program, Mesh, Color, Triangle } from "ogl";
import { useEffect, useRef, useState } from "react";

// ─── Shaders are module-level constants — never recreated ───────────────────
const vertexShader = `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`;

const fragmentShader = `
precision mediump float;

uniform float uTime;
uniform vec3 uResolution;
uniform vec2 uFocal;
uniform vec2 uRotation;
uniform float uStarSpeed;
uniform float uDensity;
uniform float uHueShift;
uniform float uSpeed;
uniform vec2 uMouse;
uniform float uGlowIntensity;
uniform float uSaturation;
uniform bool uMouseRepulsion;
uniform float uTwinkleIntensity;
uniform float uRotationSpeed;
uniform float uRepulsionStrength;
uniform float uMouseActiveFactor;
uniform float uAutoCenterRepulsion;
uniform bool uTransparent;

varying vec2 vUv;

#define NUM_LAYER 4.0
#define STAR_COLOR_CUTOFF 0.2
#define MAT45 mat2(0.7071,-0.7071,0.7071,0.7071)
#define PERIOD 3.0

float Hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float tri(float x) { return abs(fract(x) * 2.0 - 1.0); }

float tris(float x) {
  return 1.0 - smoothstep(0.0, 1.0, abs(2.0 * fract(x) - 1.0));
}

float trisn(float x) {
  return 2.0 * (1.0 - smoothstep(0.0, 1.0, abs(2.0 * fract(x) - 1.0))) - 1.0;
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float Star(vec2 uv, float flare) {
  float d = length(uv);
  float m = (0.05 * uGlowIntensity) / d;
  float rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * flare * uGlowIntensity;
  uv *= MAT45;
  rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * 0.3 * flare * uGlowIntensity;
  m *= smoothstep(1.0, 0.2, d);
  return m;
}

vec3 StarLayer(vec2 uv) {
  vec3 col = vec3(0.0);
  vec2 gv = fract(uv) - 0.5;
  vec2 id = floor(uv);

  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 offset = vec2(float(x), float(y));
      vec2 si = id + offset;
      float seed = Hash21(si);
      float size = fract(seed * 345.32);
      float glossLocal = tri(uStarSpeed / (PERIOD * seed + 1.0));
      float flareSize = smoothstep(0.9, 1.0, size) * glossLocal;

      float red = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 1.0)) + STAR_COLOR_CUTOFF;
      float blu = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 3.0)) + STAR_COLOR_CUTOFF;
      float grn = min(red, blu) * seed;
      vec3 base = vec3(red, grn, blu);

      float hue = atan(base.g - base.r, base.b - base.r) / (2.0 * 3.14159) + 0.5;
      hue = fract(hue + uHueShift / 360.0);
      float sat = length(base - vec3(dot(base, vec3(0.299, 0.587, 0.114)))) * uSaturation;
      float val = max(max(base.r, base.g), base.b);
      base = hsv2rgb(vec3(hue, sat, val));

      vec2 pad = vec2(
        tris(seed * 34.0 + uTime * uSpeed / 10.0),
        tris(seed * 38.0 + uTime * uSpeed / 30.0)
      ) - 0.5;

      float star = Star(gv - offset - pad, flareSize);
      float twinkle = trisn(uTime * uSpeed + seed * 6.2831) * 0.5 + 1.0;
      star *= mix(1.0, twinkle, uTwinkleIntensity);
      col += star * size * base;
    }
  }
  return col;
}

void main() {
  vec2 focalPx = uFocal * uResolution.xy;
  vec2 uv = (vUv * uResolution.xy - focalPx) / uResolution.y;

  if (uAutoCenterRepulsion > 0.0) {
    float centerDist = length(uv);
    uv += normalize(uv) * (uAutoCenterRepulsion / (centerDist + 0.1)) * 0.05;
  } else if (uMouseRepulsion) {
    vec2 mousePosUV = (uMouse * uResolution.xy - focalPx) / uResolution.y;
    float mouseDist = length(uv - mousePosUV);
    uv += normalize(uv - mousePosUV) * (uRepulsionStrength / (mouseDist + 0.1)) * 0.05 * uMouseActiveFactor;
  } else {
    uv += (uMouse - vec2(0.5)) * 0.1 * uMouseActiveFactor;
  }

  float a = uTime * uRotationSpeed;
  uv = mat2(cos(a), -sin(a), sin(a), cos(a)) * uv;
  uv = mat2(uRotation.x, -uRotation.y, uRotation.y, uRotation.x) * uv;

  vec3 col = vec3(0.0);
  for (float i = 0.0; i < 1.0; i += 1.0 / NUM_LAYER) {
    float depth = fract(i + uStarSpeed * uSpeed);
    float scale = mix(20.0 * uDensity, 0.5 * uDensity, depth);
    float fade = depth * smoothstep(1.0, 0.9, depth);
    col += StarLayer(uv * scale + i * 453.32) * fade;
  }

  if (uTransparent) {
    float alpha = smoothstep(0.0, 0.3, length(col));
    gl_FragColor = vec4(col, min(alpha, 1.0));
  } else {
    gl_FragColor = vec4(col, 1.0);
  }
}
`;

interface GalaxyProps {
  className?: string;
  focal?: [number, number];
  rotation?: [number, number];
  starSpeed?: number;
  density?: number;
  hueShift?: number;
  disableAnimation?: boolean;
  speed?: number;
  mouseInteraction?: boolean;
  glowIntensity?: number;
  saturation?: number;
  mouseRepulsion?: boolean;
  twinkleIntensity?: number;
  rotationSpeed?: number;
  repulsionStrength?: number;
  autoCenterRepulsion?: number;
  transparent?: boolean;
}

// Reusable shared Float32Arrays — avoids per-frame heap allocations
const MOUSE_BUF = new Float32Array([0.5, 0.5]);
const FOCAL_DEFAULT = new Float32Array([0.5, 0.5]);
const ROT_DEFAULT = new Float32Array([1.0, 0.0]);

export default function Galaxy({
  className,
  focal = [0.5, 0.5],
  rotation = [1.0, 0.0],
  starSpeed = 0.5,
  density = 1,
  hueShift = 140,
  disableAnimation = false,
  speed = 1.0,
  mouseInteraction = true,
  glowIntensity = 0.3,
  saturation = 0.0,
  mouseRepulsion = true,
  repulsionStrength = 2,
  twinkleIntensity = 0.3,
  rotationSpeed = 0.1,
  autoCenterRepulsion = 0,
  transparent = true,
}: GalaxyProps) {
  const [isMobile, setIsMobile] = useState(false);
  const ctnRef = useRef<HTMLDivElement>(null);
  const targetMouse = useRef({ x: 0.5, y: 0.5 });
  const smoothMouse = useRef({ x: 0.5, y: 0.5 });
  const targetActive = useRef(0.0);
  const smoothActive = useRef(0.0);

  // Stable prop refs — avoids restarting the WebGL context when props change
  const propsRef = useRef({
    starSpeed,
    density,
    hueShift,
    speed,
    glowIntensity,
    saturation,
    mouseRepulsion,
    twinkleIntensity,
    rotationSpeed,
    repulsionStrength,
    autoCenterRepulsion,
    transparent,
    disableAnimation,
    mouseInteraction,
    focal,
    rotation,
  });
  useEffect(() => {
    propsRef.current = {
      starSpeed,
      density,
      hueShift,
      speed,
      glowIntensity,
      saturation,
      mouseRepulsion,
      twinkleIntensity,
      rotationSpeed,
      repulsionStrength,
      autoCenterRepulsion,
      transparent,
      disableAnimation,
      mouseInteraction,
      focal,
      rotation,
    };
  });

  // Mobile detection
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const h = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  useEffect(() => {
    if (isMobile || !ctnRef.current) return;
    const ctn = ctnRef.current;

    let cleanup: (() => void) | null = null;

    // Don't spin up WebGL until the section is actually on screen.
    // threshold:0 fires as soon as 1px is visible; rootMargin pre-loads
    // 200px before the section enters the viewport so there's no cold-start flash.
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries[0].isIntersecting;
        if (visible && !cleanup) {
          cleanup = startGL(ctn);
        } else if (!visible && cleanup) {
          cleanup();
          cleanup = null;
        }
      },
      { rootMargin: "200px 0px", threshold: 0 },
    );
    io.observe(ctn);

    return () => {
      io.disconnect();
      cleanup?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, transparent]);

  // All WebGL setup extracted into a plain function so IntersectionObserver
  // can call it lazily and the cleanup returned from useEffect stays simple.
  function startGL(ctn: HTMLDivElement) {
    const renderer = new Renderer({
      alpha: transparent,
      premultipliedAlpha: false,
      // Cap to 1x pixel ratio — 2x doubles fragment shader invocations for no visible gain
      dpr: Math.min(window.devicePixelRatio, 1),
    });
    const gl = renderer.gl;

    if (transparent) {
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.clearColor(0, 0, 0, 0);
    } else {
      gl.clearColor(0, 0, 0, 1);
    }

    const focalArr = new Float32Array(focal);
    const rotArr = new Float32Array(rotation);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: {
          value: new Color(
            gl.canvas.width,
            gl.canvas.height,
            gl.canvas.width / gl.canvas.height,
          ),
        },
        uFocal: { value: focalArr },
        uRotation: { value: rotArr },
        uStarSpeed: { value: starSpeed },
        uDensity: { value: density },
        uHueShift: { value: hueShift },
        uSpeed: { value: speed },
        uMouse: { value: MOUSE_BUF },
        uGlowIntensity: { value: glowIntensity },
        uSaturation: { value: saturation },
        uMouseRepulsion: { value: mouseRepulsion },
        uTwinkleIntensity: { value: twinkleIntensity },
        uRotationSpeed: { value: rotationSpeed },
        uRepulsionStrength: { value: repulsionStrength },
        uMouseActiveFactor: { value: 0.0 },
        uAutoCenterRepulsion: { value: autoCenterRepulsion },
        uTransparent: { value: transparent },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    ctn.appendChild(gl.canvas);
    gl.canvas.style.cssText =
      "position:absolute;inset:0;width:100%;height:100%;";

    // Throttle resize with ResizeObserver (fires less than window resize)
    let resizeRaf = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        renderer.setSize(ctn.offsetWidth, ctn.offsetHeight);
        program.uniforms.uResolution.value = new Color(
          gl.canvas.width,
          gl.canvas.height,
          gl.canvas.width / gl.canvas.height,
        );
      });
    });
    ro.observe(ctn);

    // Visibility API — pause rAF when tab is hidden
    let animId = 0;
    let running = true;

    const LERP = 0.05;

    function update(t: number) {
      if (!running) return;
      animId = requestAnimationFrame(update);

      const p = propsRef.current;

      if (!p.disableAnimation) {
        program.uniforms.uTime.value = t * 0.001;
        program.uniforms.uStarSpeed.value = (t * 0.001 * p.starSpeed) / 10.0;
      }

      // Lerp mouse in rAF — no GSAP, no extra allocations
      smoothMouse.current.x +=
        (targetMouse.current.x - smoothMouse.current.x) * LERP;
      smoothMouse.current.y +=
        (targetMouse.current.y - smoothMouse.current.y) * LERP;
      smoothActive.current +=
        (targetActive.current - smoothActive.current) * LERP;

      // Mutate the shared buffer in-place — zero GC pressure
      MOUSE_BUF[0] = smoothMouse.current.x;
      MOUSE_BUF[1] = smoothMouse.current.y;
      program.uniforms.uMouseActiveFactor.value = smoothActive.current;

      renderer.render({ scene: mesh });
    }
    animId = requestAnimationFrame(update);

    const onVisibilityChange = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(animId);
      } else {
        running = true;
        animId = requestAnimationFrame(update);
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    // Mouse — passive listener, only updates refs (zero work in handler)
    const onMouseMove = (e: MouseEvent) => {
      const rect = ctn.getBoundingClientRect();
      targetMouse.current.x = (e.clientX - rect.left) / rect.width;
      targetMouse.current.y = 1.0 - (e.clientY - rect.top) / rect.height;
      targetActive.current = 1.0;
    };
    const onMouseLeave = () => {
      targetActive.current = 0.0;
    };

    if (mouseInteraction) {
      ctn.addEventListener("mousemove", onMouseMove, { passive: true });
      ctn.addEventListener("mouseleave", onMouseLeave);
    }

    return () => {
      running = false;
      cancelAnimationFrame(animId);
      cancelAnimationFrame(resizeRaf);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (mouseInteraction) {
        ctn.removeEventListener("mousemove", onMouseMove);
        ctn.removeEventListener("mouseleave", onMouseLeave);
      }
      if (ctn.contains(gl.canvas)) ctn.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }

  return (
    <div
      ref={ctnRef}
      className={className ?? "absolute inset-0"}
      aria-hidden="true"
    />
  );
}
