import QRCode from "qrcode";

type CustomQrOptions = {
  text: string;
  size?: number;
  margin?: number;
  foreground?: string;
  background?: string;
  logoUrl?: string | null;
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

export async function buildCustomQrDataUrl({
  text,
  size = 280,
  margin = 1,
  foreground = "#06b6d4",
  background = "#ffffff",
  logoUrl = "/logo.png",
}: CustomQrOptions): Promise<string> {
  if (typeof window === "undefined") return "";
  const canvas = document.createElement("canvas");

  await QRCode.toCanvas(canvas, text, {
    width: size,
    margin,
    color: { dark: foreground, light: background },
  });

  if (!logoUrl) return canvas.toDataURL("image/png");

  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas.toDataURL("image/png");

  try {
    const logo = await loadImage(logoUrl);
    const padding = Math.round(size * 0.035);
    const logoSize = Math.round(size * 0.22);
    const x = Math.round((size - logoSize) / 2);
    const y = Math.round((size - logoSize) / 2);

    ctx.save();
    drawRoundedRect(ctx, x - padding, y - padding, logoSize + padding * 2, logoSize + padding * 2, 16);
    ctx.fillStyle = background;
    ctx.fill();
    ctx.restore();

    ctx.drawImage(logo, x, y, logoSize, logoSize);
  } catch {}

  return canvas.toDataURL("image/png");
}
