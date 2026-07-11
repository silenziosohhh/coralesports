"use client";

import { useEffect, useMemo, useRef } from "react";
import { Mesh, Program, Renderer, Triangle } from "ogl";

type RippleGridBackgroundProps = {
  className?: string;
  enableRainbow?: boolean;
  gridColor?: string;
  rippleIntensity?: number;
  gridSize?: number;
  gridThickness?: number;
  fadeDistance?: number;
  vignetteStrength?: number;
  glowIntensity?: number;
  opacity?: number;
  gridRotation?: number;
  mouseInteraction?: boolean;
  mouseInteractionRadius?: number;
};

type Vec2 = { x: number; y: number };

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function hexToRgb01(hex: string): [number, number, number] {
  const normalized = hex.trim();
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(normalized);
  if (!match) return [1, 1, 1];
  return [parseInt(match[1], 16) / 255, parseInt(match[2], 16) / 255, parseInt(match[3], 16) / 255];
}

export function RippleGridBackground({
  className,
  enableRainbow = false,
  gridColor = "#ffffff",
  rippleIntensity = 0.05,
  gridSize = 10.0,
  gridThickness = 15.0,
  fadeDistance = 1.5,
  vignetteStrength = 2.0,
  glowIntensity = 0.1,
  opacity = 1.0,
  gridRotation = 0,
  mouseInteraction = true,
  mouseInteractionRadius = 1,
}: RippleGridBackgroundProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const uniformsRef = useRef<null | {
    iTime: { value: number };
    iResolution: { value: [number, number] };
    enableRainbow: { value: boolean };
    gridColor: { value: [number, number, number] };
    rippleIntensity: { value: number };
    gridSize: { value: number };
    gridThickness: { value: number };
    fadeDistance: { value: number };
    vignetteStrength: { value: number };
    glowIntensity: { value: number };
    opacity: { value: number };
    gridRotation: { value: number };
    mouseInteraction: { value: boolean };
    mousePosition: { value: [number, number] };
    mouseInfluence: { value: number };
    mouseInteractionRadius: { value: number };
  }>(null);

  const shader = useMemo(() => {
    const vertex = `
      attribute vec2 position;
      varying vec2 vUv;
      void main() {
        vUv = position * 0.5 + 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fragment = `
      precision highp float;

      uniform float iTime;
      uniform vec2 iResolution;

      uniform bool enableRainbow;
      uniform vec3 gridColor;
      uniform float rippleIntensity;
      uniform float gridSize;
      uniform float gridThickness;
      uniform float fadeDistance;
      uniform float vignetteStrength;
      uniform float glowIntensity;
      uniform float opacity;
      uniform float gridRotation;

      uniform bool mouseInteraction;
      uniform vec2 mousePosition;
      uniform float mouseInfluence;
      uniform float mouseInteractionRadius;

      varying vec2 vUv;

      float pi = 3.141592;

      mat2 rotate(float angle) {
        float s = sin(angle);
        float c = cos(angle);
        return mat2(c, -s, s, c);
      }

      void main() {
        vec2 uv = vUv * 2.0 - 1.0;
        uv.x *= iResolution.x / iResolution.y;

        if (gridRotation != 0.0) {
          uv = rotate(gridRotation * pi / 180.0) * uv;
        }

        float dist = length(uv);
        float func = sin(pi * (iTime - dist));
        vec2 rippleUv = uv + uv * func * rippleIntensity;

        if (mouseInteraction && mouseInfluence > 0.0) {
          vec2 mouseUv = (mousePosition * 2.0 - 1.0);
          mouseUv.x *= iResolution.x / iResolution.y;

          float mouseDist = length(uv - mouseUv);
          float influence = mouseInfluence * exp(-mouseDist * mouseDist / (mouseInteractionRadius * mouseInteractionRadius));
          float mouseWave = sin(pi * (iTime * 2.0 - mouseDist * 3.0)) * influence;
          rippleUv += normalize(uv - mouseUv) * mouseWave * rippleIntensity * 0.3;
        }

        vec2 a = sin(gridSize * 0.5 * pi * rippleUv - pi / 2.0);
        vec2 b = abs(a);

        float aaWidth = 0.5;
        vec2 smoothB = vec2(
          smoothstep(0.0, aaWidth, b.x),
          smoothstep(0.0, aaWidth, b.y)
        );

        vec3 color = vec3(0.0);
        color += exp(-gridThickness * smoothB.x * (0.8 + 0.5 * sin(pi * iTime)));
        color += exp(-gridThickness * smoothB.y);
        color += 0.5 * exp(-(gridThickness / 4.0) * sin(smoothB.x));
        color += 0.5 * exp(-(gridThickness / 3.0) * smoothB.y);

        if (glowIntensity > 0.0) {
          color += glowIntensity * exp(-gridThickness * 0.5 * smoothB.x);
          color += glowIntensity * exp(-gridThickness * 0.5 * smoothB.y);
        }

        float radialFade = exp(-2.0 * clamp(pow(dist, fadeDistance), 0.0, 1.0));

        vec2 vignetteCoords = vUv - 0.5;
        float vignetteDistance = length(vignetteCoords);
        float vignette = 1.0 - pow(vignetteDistance * 2.0, vignetteStrength);
        vignette = clamp(vignette, 0.0, 1.0);

        vec3 tint;
        if (enableRainbow) {
          tint = vec3(
            uv.x * 0.5 + 0.5 * sin(iTime),
            uv.y * 0.5 + 0.5 * cos(iTime),
            pow(cos(iTime), 4.0)
          ) + 0.5;
        } else {
          tint = gridColor;
        }

        float finalFade = radialFade * vignette;
        float alpha = length(color) * finalFade * opacity;
        gl_FragColor = vec4(color * tint * finalFade * opacity, alpha);
      }
    `;

    return { vertex, fragment };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio, 2), alpha: true });
    const gl = renderer.gl;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.canvas.style.width = "100%";
    gl.canvas.style.height = "100%";
    gl.canvas.style.display = "block";
    container.appendChild(gl.canvas);

    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: [1, 1] as [number, number] },
      enableRainbow: { value: false },
      gridColor: { value: hexToRgb01("#ffffff") },
      rippleIntensity: { value: 0.05 },
      gridSize: { value: 10.0 },
      gridThickness: { value: 15.0 },
      fadeDistance: { value: 1.5 },
      vignetteStrength: { value: 2.0 },
      glowIntensity: { value: 0.1 },
      opacity: { value: 1.0 },
      gridRotation: { value: 0 },
      mouseInteraction: { value: true },
      mousePosition: { value: [0.5, 0.5] as [number, number] },
      mouseInfluence: { value: 0 },
      mouseInteractionRadius: { value: 1 },
    };
    uniformsRef.current = uniforms;

    const geometry = new Triangle(gl);
    const program = new Program(gl, { vertex: shader.vertex, fragment: shader.fragment, uniforms });
    const mesh = new Mesh(gl, { geometry, program });

    const mousePosition: Vec2 = { x: 0.5, y: 0.5 };
    const targetMouse: Vec2 = { x: 0.5, y: 0.5 };
    let targetInfluence = 0;

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = container;
      renderer.setSize(w, h);
      uniforms.iResolution.value = [w, h];
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!uniformsRef.current?.mouseInteraction.value) return;
      const rect = container.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      targetMouse.x = clamp01((e.clientX - rect.left) / rect.width);
      targetMouse.y = clamp01(1.0 - (e.clientY - rect.top) / rect.height);
    };

    const handleMouseEnter = () => {
      if (!uniformsRef.current?.mouseInteraction.value) return;
      targetInfluence = 1;
    };

    const handleMouseLeave = () => {
      if (!uniformsRef.current?.mouseInteraction.value) return;
      targetInfluence = 0;
    };

    window.addEventListener("resize", resize);
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    resize();

    const render = (t: number) => {
      uniforms.iTime.value = t * 0.001;

      const lerpFactor = 0.1;
      mousePosition.x += (targetMouse.x - mousePosition.x) * lerpFactor;
      mousePosition.y += (targetMouse.y - mousePosition.y) * lerpFactor;

      const influenceLerp = 0.05;
      uniforms.mouseInfluence.value += (targetInfluence - uniforms.mouseInfluence.value) * influenceLerp;
      uniforms.mousePosition.value = [mousePosition.x, mousePosition.y];

      renderer.render({ scene: mesh });
      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

      return () => {
      window.removeEventListener("resize", resize);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);

      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      renderer.gl.getExtension("WEBGL_lose_context")?.loseContext();
      container.removeChild(gl.canvas);
      uniformsRef.current = null;
    };
  }, [shader.fragment, shader.vertex]);

  useEffect(() => {
    const uniforms = uniformsRef.current;
    if (!uniforms) return;

    uniforms.enableRainbow.value = enableRainbow;
    uniforms.gridColor.value = hexToRgb01(gridColor);
    uniforms.rippleIntensity.value = rippleIntensity;
    uniforms.gridSize.value = gridSize;
    uniforms.gridThickness.value = gridThickness;
    uniforms.fadeDistance.value = fadeDistance;
    uniforms.vignetteStrength.value = vignetteStrength;
    uniforms.glowIntensity.value = glowIntensity;
    uniforms.opacity.value = opacity;
    uniforms.gridRotation.value = gridRotation;
    uniforms.mouseInteraction.value = mouseInteraction;
    uniforms.mouseInteractionRadius.value = mouseInteractionRadius;
  }, [
    enableRainbow,
    fadeDistance,
    glowIntensity,
    gridColor,
    gridRotation,
    gridSize,
    gridThickness,
    mouseInteraction,
    mouseInteractionRadius,
    opacity,
    rippleIntensity,
    vignetteStrength,
  ]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ backgroundColor: "var(--bg-secondary)" }}
      aria-hidden
    />
  );
}
