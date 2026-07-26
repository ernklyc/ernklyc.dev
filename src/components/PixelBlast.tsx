"use client";

import { useEffect, useRef } from "react";

interface PixelBlastProps {
  variant?: "square" | "circle";
  pixelSize?: number;
  color?: string;
  patternScale?: number;
  patternDensity?: number;
  pixelSizeJitter?: number;
  enableRipples?: boolean;
  rippleSpeed?: number;
  rippleThickness?: number;
  rippleIntensityScale?: number;
  liquid?: boolean;
  liquidStrength?: number;
  liquidRadius?: number;
  liquidWobbleSpeed?: number;
  speed?: number;
  edgeFade?: number;
  transparent?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

const VS = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FS = `
precision mediump float;

uniform vec2 u_res;
uniform float u_time;
uniform vec3 u_color;
uniform float u_pixelSize;
uniform float u_patternScale;
uniform float u_patternDensity;
uniform float u_edgeFade;
uniform int u_isCircle;
uniform int u_enableRipples;
uniform float u_rippleSpeed;
uniform float u_rippleThickness;
uniform float u_rippleIntensityScale;

float hash(vec2 p) {
  p = fract(p * vec2(127.1, 311.7));
  p += dot(p, p + 43.21);
  return fract(p.x * p.y);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float v = vnoise(p) * 0.5;
  v += vnoise(p * 2.0 + vec2(31.7, 17.3)) * 0.3;
  v += vnoise(p * 4.0 + vec2(63.1, 52.7)) * 0.2;
  return v;
}

float bayer(vec2 p) {
  vec2 q = mod(floor(p), 4.0);
  float x = q.x;
  float y = q.y;
  float r0 = (x < 1.0) ?  0.0 : (x < 2.0) ?  8.0 : (x < 3.0) ?  2.0 : 10.0;
  float r1 = (x < 1.0) ? 12.0 : (x < 2.0) ?  4.0 : (x < 3.0) ? 14.0 :  6.0;
  float r2 = (x < 1.0) ?  3.0 : (x < 2.0) ? 11.0 : (x < 3.0) ?  1.0 :  9.0;
  float r3 = (x < 1.0) ? 15.0 : (x < 2.0) ?  7.0 : (x < 3.0) ? 13.0 :  5.0;
  float v  = (y < 1.0) ? r0 : (y < 2.0) ? r1 : (y < 3.0) ? r2 : r3;
  return v / 16.0;
}

void main() {
  vec2 frag = gl_FragCoord.xy;

  // Cell and its center
  vec2 cell = floor(frag / u_pixelSize);
  vec2 cellCenter = (cell + 0.5) * u_pixelSize;

  // Circle variant
  if (u_isCircle == 1) {
    float r = length(frag - cellCenter);
    if (r > u_pixelSize * 0.42) {
      gl_FragColor = vec4(0.0);
      return;
    }
  }

  // Bayer threshold
  float threshold = bayer(cell);

  // NDC of cell center (-1 to 1)
  vec2 ndc = (cellCenter / u_res) * 2.0 - 1.0;

  // Animated noise (pixel-locked)
  float t = u_time;
  vec2 np = cell / (u_res / u_pixelSize) * u_patternScale * 6.0;
  float n = fbm(np + vec2(t * 0.35, t * 0.22));

  float intensity = n * u_patternDensity;

  // Ripples from center
  if (u_enableRipples == 1) {
    float dist = length(ndc);
    float phase = dist * 11.0 - t * u_rippleSpeed * 12.0;
    float ring = exp(-abs(sin(phase)) / max(u_rippleThickness, 0.01));
    intensity += ring * u_rippleIntensityScale * 0.32;
  }

  // Edge fade
  float edgeDist = max(abs(ndc.x), abs(ndc.y));
  float fadeStart = max(0.0, 1.0 - u_edgeFade * 2.2);
  float te = clamp((edgeDist - fadeStart) / (1.0 - fadeStart + 0.001), 0.0, 1.0);
  float fade = 1.0 - te * te * (3.0 - 2.0 * te);
  intensity *= fade;

  // Dithering
  float visible = step(threshold, clamp(intensity, 0.0, 1.0));

  if (visible < 0.5) {
    gl_FragColor = vec4(0.0);
    return;
  }

  gl_FragColor = vec4(u_color, 1.0);
}
`;

function parseColor(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return [r, g, b];
}

export default function PixelBlast({
  variant = "square",
  pixelSize = 4,
  color = "#B497CF",
  patternScale = 2,
  patternDensity = 1,
  enableRipples = false,
  rippleSpeed = 0.4,
  rippleThickness = 0.12,
  rippleIntensityScale = 1.5,
  speed = 0.5,
  edgeFade = 0.25,
  style,
  className,
}: PixelBlastProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = (
      canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false }) ||
      canvas.getContext("experimental-webgl", { alpha: true, premultipliedAlpha: false })
    ) as WebGLRenderingContext | null;
    if (!gl) return;

    function compileShader(type: number, src: string) {
      const shader = gl!.createShader(type)!;
      gl!.shaderSource(shader, src);
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        console.error("Shader error:", gl!.getShaderInfoLog(shader));
        return null;
      }
      return shader;
    }

    const vs = compileShader(gl.VERTEX_SHADER, VS);
    const fs = compileShader(gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("Link error:", gl.getProgramInfoLog(prog));
      return;
    }

    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uColor = gl.getUniformLocation(prog, "u_color");
    const uPixelSize = gl.getUniformLocation(prog, "u_pixelSize");
    const uPatternScale = gl.getUniformLocation(prog, "u_patternScale");
    const uPatternDensity = gl.getUniformLocation(prog, "u_patternDensity");
    const uEdgeFade = gl.getUniformLocation(prog, "u_edgeFade");
    const uIsCircle = gl.getUniformLocation(prog, "u_isCircle");
    const uEnableRipples = gl.getUniformLocation(prog, "u_enableRipples");
    const uRippleSpeed = gl.getUniformLocation(prog, "u_rippleSpeed");
    const uRippleThickness = gl.getUniformLocation(prog, "u_rippleThickness");
    const uRippleIntensityScale = gl.getUniformLocation(prog, "u_rippleIntensityScale");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    const [r, g, b] = parseColor(color);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      const parent = canvas!.parentElement;
      if (!parent) return;
      const w = parent.offsetWidth;
      const h = parent.offsetHeight;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement || document.body);

    let animId: number;
    let startTime: number | null = null;

    function draw(ts: number) {
      if (startTime === null) startTime = ts;
      const t = ((ts - startTime) / 1000) * speed;

      gl!.clear(gl!.COLOR_BUFFER_BIT);
      gl!.uniform2f(uRes, canvas!.width, canvas!.height);
      gl!.uniform1f(uTime, t);
      gl!.uniform3f(uColor, r, g, b);
      gl!.uniform1f(uPixelSize, pixelSize * dpr);
      gl!.uniform1f(uPatternScale, patternScale);
      gl!.uniform1f(uPatternDensity, patternDensity);
      gl!.uniform1f(uEdgeFade, edgeFade);
      gl!.uniform1i(uIsCircle, variant === "circle" ? 1 : 0);
      gl!.uniform1i(uEnableRipples, enableRipples ? 1 : 0);
      gl!.uniform1f(uRippleSpeed, rippleSpeed);
      gl!.uniform1f(uRippleThickness, rippleThickness);
      gl!.uniform1f(uRippleIntensityScale, rippleIntensityScale);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);

      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, [variant, pixelSize, color, patternScale, patternDensity, enableRipples, rippleSpeed, rippleThickness, rippleIntensityScale, speed, edgeFade]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "block",
        ...style,
      }}
      className={className}
    />
  );
}
