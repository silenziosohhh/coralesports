"use client";

import { useEffect, useRef } from "react";

interface VictoryPoseSceneProps {
  winnerSkinUrl: string;
  loserSkinUrl: string;
  className?: string;
}

async function loadSkinTexture(
  skinUrl: string,
  three: typeof import("three"),
  skinviewUtils: typeof import("skinview-utils"),
) {
  const image = new Image();
  image.crossOrigin = "anonymous";
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error(`Failed to load skin: ${skinUrl}`));
    image.src = skinUrl;
  });

  const canvas = document.createElement("canvas");
  skinviewUtils.loadSkinToCanvas(canvas, image);

  const texture = new three.CanvasTexture(canvas);
  texture.magFilter = three.NearestFilter;
  texture.minFilter = three.NearestFilter;

  return { texture, modelType: skinviewUtils.inferModelType(canvas) };
}

export function VictoryPoseScene({ winnerSkinUrl, loserSkinUrl, className }: VictoryPoseSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let disposed = false;
    let viewer: import("skinview3d").SkinViewer | undefined;
    let observer: ResizeObserver | undefined;

    (async () => {
      const [skinview3d, three, skinviewUtils] = await Promise.all([
        import("skinview3d"),
        import("three"),
        import("skinview-utils"),
      ]);
      if (disposed || !canvasRef.current || !containerRef.current) return;

      const { clientWidth, clientHeight } = containerRef.current;

      viewer = new skinview3d.SkinViewer({
        canvas: canvasRef.current,
        width: clientWidth,
        height: clientHeight,
        enableControls: true,
      });
      viewer.controls.enableZoom = false;
      viewer.controls.enablePan = false;
      viewer.playerObject.visible = false;
      viewer.globalLight.intensity = 2.3;
      viewer.cameraLight.intensity = 1.1;

      const [winnerSkin, loserSkin] = await Promise.all([
        loadSkinTexture(winnerSkinUrl, three, skinviewUtils),
        loadSkinTexture(loserSkinUrl, three, skinviewUtils),
      ]);
      if (disposed || !viewer) return;

      const winner = new skinview3d.PlayerObject();
      winner.skin.map = winnerSkin.texture;
      winner.skin.modelType = winnerSkin.modelType;
      winner.skin.visible = true;

      const loser = new skinview3d.PlayerObject();
      loser.skin.map = loserSkin.texture;
      loser.skin.modelType = loserSkin.modelType;
      loser.skin.visible = true;

      // Loser: knocked flat on the ground.
      loser.rotation.z = Math.PI / 2 + 0.12;
      loser.rotation.x = 0.2;
      loser.skin.leftArm.rotation.x = -0.4;
      loser.skin.rightArm.rotation.x = 0.55;
      loser.skin.leftLeg.rotation.x = 0.3;
      loser.skin.rightLeg.rotation.x = -0.2;
      loser.skin.head.rotation.x = -0.2;
      loser.position.set(2.2, -15.7, -1.5);

      // Winner: standing over the loser, one foot planted on the fallen body,
      // sword raised overhead.
      winner.position.set(-1.2, -8.2, 1.5);
      winner.rotation.y = -0.4;
      winner.skin.rightLeg.rotation.x = -1.2;
      winner.skin.rightLeg.position.y -= 2.2;
      winner.skin.leftLeg.rotation.x = 0.2;
      winner.skin.rightArm.rotation.x = -2.85;
      winner.skin.rightArm.rotation.z = 0.2;
      winner.skin.leftArm.rotation.x = 0.35;
      winner.skin.leftArm.rotation.z = -0.25;
      winner.skin.head.rotation.x = 0.3;
      winner.skin.body.rotation.x = 0.08;

      // Sword prop parented to the raised arm so it inherits its rotation.
      const sword = new three.Group();
      const blade = new three.Mesh(
        new three.BoxGeometry(0.8, 11, 0.4),
        new three.MeshStandardMaterial({ color: 0xd8dee9, metalness: 0.65, roughness: 0.2 }),
      );
      blade.position.set(0, 5.5, 0);
      const guard = new three.Mesh(
        new three.BoxGeometry(3, 0.7, 0.7),
        new three.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.7, roughness: 0.3 }),
      );
      guard.position.set(0, 0.2, 0);
      const hilt = new three.Mesh(
        new three.BoxGeometry(0.7, 2, 0.7),
        new three.MeshStandardMaterial({ color: 0x3b2a1a, roughness: 0.6 }),
      );
      hilt.position.set(0, -1, 0);
      sword.add(blade, guard, hilt);
      sword.position.set(0, -11.5, 0);
      winner.skin.rightArm.add(sword);

      viewer.playerWrapper.add(loser, winner);

      viewer.camera.position.set(0, -2, 58);
      viewer.controls.target.set(0, -4, 0);

      viewer.autoRotate = true;
      viewer.autoRotateSpeed = 0.3;

      const resize = () => {
        if (!containerRef.current || !viewer) return;
        viewer.width = containerRef.current.clientWidth;
        viewer.height = containerRef.current.clientHeight;
      };
      observer = new ResizeObserver(resize);
      observer.observe(containerRef.current);
    })();

    return () => {
      disposed = true;
      observer?.disconnect();
      viewer?.dispose();
    };
  }, [winnerSkinUrl, loserSkinUrl]);

  return (
    <div ref={containerRef} className={className}>
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
