"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Gamepad2, RotateCw } from "lucide-react";

type GameStatus = "idle" | "running" | "over";

type Obstacle = {
  x: number;
  width: number;
  height: number;
};

type CoralRunnerGameProps = {
  title: string;
  description: string;
  startLabel: string;
  retryLabel: string;
  scoreLabel: string;
  bestLabel: string;
  gameOverLabel: string;
};

export function CoralRunnerGame({
  title,
  description,
  startLabel,
  retryLabel,
  scoreLabel,
  bestLabel,
  gameOverLabel,
}: CoralRunnerGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number | null>(null);
  const statusRef = useRef<GameStatus>("idle");
  const playerYRef = useRef(0);
  const velocityRef = useRef(0);
  const obstaclesRef = useRef<Obstacle[]>([]);
  const spawnRef = useRef(1.1);
  const scoreRef = useRef(0);
  const bestRef = useRef(0);
  const lastHudRef = useRef(0);
  const [status, setStatus] = useState<GameStatus>("idle");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);

  const setGameStatus = useCallback((next: GameStatus) => {
    statusRef.current = next;
    setStatus(next);
  }, []);

  const startGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ground = canvas.clientHeight - 48;
    playerYRef.current = ground - 34;
    velocityRef.current = 0;
    obstaclesRef.current = [];
    spawnRef.current = 0.95;
    scoreRef.current = 0;
    setScore(0);
    setGameStatus("running");
    canvas.focus();
  }, [setGameStatus]);

  const jump = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || statusRef.current !== "running") return;
    const ground = canvas.clientHeight - 48;
    if (playerYRef.current >= ground - 37) velocityRef.current = -610;
  }, []);

  useEffect(() => {
    try {
      const saved = Number.parseInt(window.localStorage.getItem("coralmc-runner-best:v1") || "0", 10);
      if (Number.isFinite(saved)) {
        bestRef.current = saved;
        setBest(saved);
      }
    } catch {
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * ratio));
      canvas.height = Math.max(1, Math.round(rect.height * ratio));
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      if (statusRef.current !== "running") playerYRef.current = rect.height - 82;
    };

    const draw = (width: number, height: number, elapsed: number) => {
      const ground = height - 48;
      const gradient = context.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "#082c61");
      gradient.addColorStop(1, "#03142e");
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);

      context.fillStyle = "rgba(87,255,255,0.14)";
      for (let x = 18; x < width; x += 28) {
        for (let y = 18; y < ground - 14; y += 28) context.fillRect(x, y, 2, 2);
      }

      const horizon = context.createLinearGradient(0, 0, width, 0);
      horizon.addColorStop(0, "rgba(87,255,255,0)");
      horizon.addColorStop(0.5, "rgba(87,255,255,0.8)");
      horizon.addColorStop(1, "rgba(87,255,255,0)");
      context.fillStyle = horizon;
      context.fillRect(0, ground, width, 2);
      context.fillStyle = "rgba(0,11,30,0.72)";
      context.fillRect(0, ground + 2, width, height - ground);

      const playerX = Math.min(72, width * 0.16);
      const playerY = playerYRef.current;
      const bob = statusRef.current === "idle" ? Math.sin(elapsed * 0.004) * 3 : 0;

      context.save();
      context.translate(playerX, playerY + bob);
      context.shadowColor = "rgba(87,255,255,0.8)";
      context.shadowBlur = 18;
      context.fillStyle = "#57ffff";
      context.fillRect(8, 2, 18, 8);
      context.fillRect(4, 10, 26, 12);
      context.fillRect(10, 22, 18, 10);
      context.fillStyle = "#0bb5ff";
      context.fillRect(0, 14, 9, 7);
      context.fillRect(-7, 18, 8, 5);
      context.fillStyle = "#ffffff";
      context.fillRect(23, 12, 4, 4);
      context.restore();

      obstaclesRef.current.forEach((obstacle) => {
        const y = ground - obstacle.height;
        context.save();
        context.shadowColor = "rgba(255,214,61,0.32)";
        context.shadowBlur = 12;
        context.fillStyle = "#173b6e";
        context.fillRect(obstacle.x, y, obstacle.width, obstacle.height);
        context.strokeStyle = "rgba(255,255,255,0.42)";
        context.lineWidth = 2;
        context.strokeRect(obstacle.x + 1, y + 1, obstacle.width - 2, obstacle.height - 2);
        context.fillStyle = "#ffd63d";
        context.fillRect(obstacle.x + 6, y + 7, obstacle.width - 12, 5);
        context.fillStyle = "rgba(255,255,255,0.32)";
        context.fillRect(obstacle.x + 7, y + 18, 6, 6);
        context.fillRect(obstacle.x + obstacle.width - 13, y + 18, 6, 6);
        context.restore();
      });

      if (statusRef.current !== "running") {
        context.fillStyle = "rgba(1,10,28,0.28)";
        context.fillRect(0, 0, width, height);
      }
    };

    let lastTime = window.performance.now();
    const tick = (now: number) => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const delta = Math.min((now - lastTime) / 1000, 0.035);
      lastTime = now;

      if (statusRef.current === "running" && !document.hidden) {
        const ground = height - 48;
        const speed = Math.min(520, 285 + scoreRef.current * 1.35);
        velocityRef.current += 1580 * delta;
        playerYRef.current += velocityRef.current * delta;
        if (playerYRef.current >= ground - 34) {
          playerYRef.current = ground - 34;
          velocityRef.current = 0;
        }

        spawnRef.current -= delta;
        if (spawnRef.current <= 0) {
          const obstacleHeight = 34 + Math.random() * 32;
          obstaclesRef.current.push({ x: width + 30, width: 30 + Math.random() * 18, height: obstacleHeight });
          spawnRef.current = Math.max(0.72, 1.34 - scoreRef.current * 0.003) + Math.random() * 0.55;
        }
        obstaclesRef.current.forEach((obstacle) => {
          obstacle.x -= speed * delta;
        });
        obstaclesRef.current = obstaclesRef.current.filter((obstacle) => obstacle.x + obstacle.width > -10);

        const playerX = Math.min(72, width * 0.16);
        const playerBox = { x: playerX + 3, y: playerYRef.current + 3, width: 27, height: 29 };
        const collided = obstaclesRef.current.some((obstacle) => {
          const obstacleY = ground - obstacle.height;
          return (
            playerBox.x < obstacle.x + obstacle.width &&
            playerBox.x + playerBox.width > obstacle.x &&
            playerBox.y < obstacleY + obstacle.height &&
            playerBox.y + playerBox.height > obstacleY
          );
        });

        if (collided) {
          const finalScore = Math.floor(scoreRef.current);
          const nextBest = Math.max(bestRef.current, finalScore);
          bestRef.current = nextBest;
          setBest(nextBest);
          setScore(finalScore);
          setGameStatus("over");
          try {
            window.localStorage.setItem("coralmc-runner-best:v1", String(nextBest));
          } catch {
          }
        } else {
          scoreRef.current += delta * 11;
          if (now - lastHudRef.current > 100) {
            lastHudRef.current = now;
            setScore(Math.floor(scoreRef.current));
          }
        }
      }

      draw(width, height, now);
      frameRef.current = window.requestAnimationFrame(tick);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    frameRef.current = window.requestAnimationFrame(tick);

    return () => {
      observer.disconnect();
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
    };
  }, [setGameStatus]);

  const handleCanvasAction = () => {
    if (statusRef.current === "running") jump();
    else startGame();
  };

  return (
    <section className="relative overflow-hidden rounded-[28px] border-2 border-white/20 bg-[#061b3b]/72 p-5 shadow-[0_26px_70px_rgba(0,20,65,0.34)] backdrop-blur-2xl sm:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-[#57ffff]">
            <Gamepad2 className="h-5 w-5" />
            <h2 className="text-xl font-black uppercase tracking-[-0.02em] text-white sm:text-2xl">{title}</h2>
          </div>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/68">{description}</p>
        </div>
        <div className="flex shrink-0 items-center gap-4 rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2 text-sm">
          <span className="text-white/60">{scoreLabel} <strong className="text-white">{score}</strong></span>
          <span className="h-4 w-px bg-white/15" />
          <span className="text-white/60">{bestLabel} <strong className="text-[#ffd63d]">{best}</strong></span>
        </div>
      </div>

      <div className="relative mt-5 overflow-hidden rounded-2xl border-2 border-white/20 bg-[#03142e]">
        <canvas
          ref={canvasRef}
          tabIndex={0}
          role="img"
          aria-label={`${title}. ${description}`}
          className="block h-[280px] w-full touch-none outline-none focus-visible:ring-4 focus-visible:ring-[#57ffff]/55"
          onPointerDown={handleCanvasAction}
          onKeyDown={(event) => {
            if (event.key !== " " && event.key !== "ArrowUp") return;
            event.preventDefault();
            handleCanvasAction();
          }}
        />
        {status !== "running" ? (
          <div className="pointer-events-none absolute inset-0 grid place-items-center p-5 text-center">
            <div>
              {status === "over" ? <p aria-live="polite" className="mb-3 text-xl font-black text-white">{gameOverLabel}</p> : null}
              <p className="text-sm font-semibold text-white/75">Spazio, freccia su oppure tocca per saltare</p>
            </div>
          </div>
        ) : null}
      </div>

      <button
        type="button"
        onClick={startGame}
        className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[14px] border-[4px] border-[#007fda] bg-[#0bb5ff] px-5 text-sm font-black text-[#00152b] shadow-[0_8px_0_rgba(0,66,132,0.45)] transition-transform hover:scale-[1.01]"
      >
        {status === "over" ? <RotateCw className="h-4 w-4" /> : <Gamepad2 className="h-4 w-4" />}
        {status === "over" ? retryLabel : startLabel}
      </button>
    </section>
  );
}
