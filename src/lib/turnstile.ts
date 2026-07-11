export async function verifyTurnstileToken(args: {
  token: string;
  ip?: string | null;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      return { ok: false, error: "Captcha non configurato" };
    }
    return { ok: true };
  }

  try {
    const body = new URLSearchParams();
    body.set("secret", secret);
    body.set("response", args.token);
    if (args.ip) body.set("remoteip", args.ip);

    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    const data = (await res.json()) as { success?: boolean; ["error-codes"]?: string[] };
    if (!data?.success) {
      const code = data?.["error-codes"]?.[0] ?? "captcha_failed";
      return { ok: false, error: code };
    }

    return { ok: true };
  } catch {
    return { ok: false, error: "captcha_unreachable" };
  }
}

