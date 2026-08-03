"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { Globe2, Lock, Shield, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { WavyPanel } from "@/components/ui/wavy-panel";
import { minecraftHeadUrl } from "@/lib/team-avatar";
import { cn } from "@/lib/utils";

const FIELD_CLASS =
  "w-full rounded-xl border-2 border-white/15 bg-[#03142b]/70 px-4 py-2.5 text-sm font-semibold text-white outline-none transition-colors placeholder:font-medium placeholder:text-white/25 focus:border-[#57ffff]/70 focus:shadow-[0_0_0_3px_rgba(87,255,255,0.12)]";

const LABEL_CLASS =
  "mb-2 block text-[11px] font-black uppercase tracking-[0.14em] text-white/55";

function HeaderWave() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 600 40"
      preserveAspectRatio="none"
      className="absolute inset-x-0 bottom-[-1px] h-8 w-full"
    >
      <path
        d="M0 24 C 50 6 100 6 150 24 C 200 42 250 42 300 24 C 350 6 400 6 450 24 C 500 42 550 42 600 24 L 600 40 L 0 40 Z"
        fill="#061b3b"
      />
      <path
        d="M0 24 C 50 6 100 6 150 24 C 200 42 250 42 300 24 C 350 6 400 6 450 24 C 500 42 550 42 600 24"
        fill="none"
        stroke="rgba(87,255,255,0.45)"
        strokeWidth={2}
      />
    </svg>
  );
}

function TeamLogoPreview({ logo, tag }: { logo: string; tag: string }) {
  const { data: session } = useSession();
  const [logoBroken, setLogoBroken] = useState(false);
  useEffect(() => setLogoBroken(false), [logo]);
  const leaderName = session?.user?.minecraftUsername ?? null;
  const showLogo = Boolean(logo) && !logoBroken;
  const fallbackSrc = leaderName ? minecraftHeadUrl(leaderName, 128) : null;

  return (
    <div className="shrink-0 text-center">
      <WavyPanel
        className="h-[86px] w-[86px]"
        contentClassName="grid h-[86px] w-[86px] place-items-center p-3"
        fillGradient={["rgba(10,32,64,0.94)", "rgba(3,18,42,0.96)"]}
        stroke="rgba(87,255,255,0.5)"
        strokeWidth={2}
        amplitude={4}
        wavelength={24}
        glow="rgba(87,255,255,0.18)"
      >
        <div className="h-14 w-14 overflow-hidden rounded-xl bg-[#03142b]">
          {showLogo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logo}
              alt=""
              className="h-full w-full object-cover"
              onError={() => setLogoBroken(true)}
            />
          ) : fallbackSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={fallbackSrc}
              alt=""
              className="h-full w-full object-cover [image-rendering:pixelated]"
            />
          ) : (
            <span className="grid h-full w-full place-items-center text-sm font-black text-[#57ffff]">
              {tag ? tag.slice(0, 2).toUpperCase() : "?"}
            </span>
          )}
        </div>
      </WavyPanel>
      <p className="mt-1.5 text-[9px] font-black uppercase tracking-[0.14em] text-white/40">
        {showLogo ? "Logo" : leaderName ? "Leader" : "Tag"}
      </p>
    </div>
  );
}

export function CreateTeamDialog({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    tag: "",
    logo: "",
    description: "",
    visibility: "PUBLIC",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Errore nella creazione del team");
      }

      toast.success("Team creato con successo!");
      setOpen(false);
      setFormData({
        name: "",
        tag: "",
        logo: "",
        description: "",
        visibility: "PUBLIC",
      });
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[92vh] gap-0 overflow-y-auto border-2 border-[#57ffff]/25 bg-[#061b3b] p-0 text-white shadow-[0_34px_90px_rgba(0,15,45,0.7)] sm:max-w-[560px] sm:rounded-[28px]">
        <div className="relative h-[132px] overflow-hidden bg-[linear-gradient(118deg,#2f6fd8_0%,#2563eb_54%,#1748a8_100%)]">
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(circle_at_28%_0%,rgba(87,255,255,0.35),transparent_58%)]"
          />
          <div
            aria-hidden
            className="absolute -right-10 -top-16 h-44 w-44 rounded-full bg-[#57ffff]/25 blur-3xl"
          />
          <HeaderWave />
        </div>

        <div className="relative -mt-9 px-6 sm:px-7">
          <div className="grid h-16 w-16 place-items-center rounded-2xl border-2 border-[#57ffff]/45 bg-[#03142b] shadow-[0_14px_36px_rgba(87,255,255,0.22)]">
            <Shield className="h-8 w-8 text-[#57ffff]" />
          </div>

          <DialogHeader className="mt-4 space-y-1.5 text-left">
            <DialogTitle className="text-3xl font-black tracking-[-0.04em] text-white">
              Crea il tuo <span className="text-[#57ffff]">team</span>
            </DialogTitle>
            <DialogDescription className="text-sm leading-relaxed text-white/55">
              Dai un nome alla tua squadra, scegli il tag e preparati a iscriverti ai tornei
              ufficiali CoralMC.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5 px-6 pb-7 sm:px-7">
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_150px]">
            <div>
              <label className={LABEL_CLASS} htmlFor="team-name">
                Nome team *
              </label>
              <input
                id="team-name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={FIELD_CLASS}
                placeholder="Es: Coral Kings"
              />
            </div>

            <div>
              <label className={LABEL_CLASS} htmlFor="team-tag">
                Tag *
              </label>
              <input
                id="team-tag"
                type="text"
                required
                value={formData.tag}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value.toUpperCase() })}
                className={cn(FIELD_CLASS, "uppercase tracking-[0.2em]")}
                placeholder="CRL"
                maxLength={5}
              />
              <p className="mt-1.5 text-[11px] font-semibold text-white/35">
                {formData.tag.length}/5 caratteri
              </p>
            </div>
          </div>

          <div>
            <label className={LABEL_CLASS} htmlFor="team-logo">
              Stemma del team
            </label>
            <div className="flex items-start gap-4">
              <TeamLogoPreview logo={formData.logo} tag={formData.tag} />
              <div className="min-w-0 flex-1">
                <input
                  id="team-logo"
                  type="url"
                  value={formData.logo}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  className={FIELD_CLASS}
                  placeholder="https://esempio.com/logo.png"
                />
                <p className="mt-2 text-[11px] leading-relaxed text-white/35">
                  Facoltativo: se lo lasci vuoto usiamo la testa Minecraft del leader del team.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className={LABEL_CLASS} htmlFor="team-description">
              Descrizione
            </label>
            <textarea
              id="team-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={cn(FIELD_CLASS, "min-h-[104px] resize-y leading-relaxed")}
              placeholder="Racconta chi siete, come giocate e cosa cercate…"
            />
          </div>

          <div>
            <span className={LABEL_CLASS}>Visibilità</span>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  value: "PUBLIC",
                  label: "Pubblico",
                  hint: "Visibile a tutti",
                  icon: Globe2,
                },
                {
                  value: "PRIVATE",
                  label: "Privato",
                  hint: "Solo su invito",
                  icon: Lock,
                },
              ].map((option) => {
                const active = formData.visibility === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, visibility: option.value })}
                    aria-pressed={active}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all duration-200",
                      active
                        ? "border-[#57ffff]/60 bg-[#57ffff]/[0.09] shadow-[0_10px_26px_rgba(87,255,255,0.14)]"
                        : "border-white/15 bg-white/[0.03] hover:border-white/30 hover:bg-white/[0.07]",
                    )}
                  >
                    <option.icon
                      className={cn("h-4 w-4 shrink-0", active ? "text-[#57ffff]" : "text-white/45")}
                    />
                    <span className="min-w-0">
                      <span className="block text-sm font-black text-white">{option.label}</span>
                      <span className="block text-[11px] font-semibold text-white/35">
                        {option.hint}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-1 sm:flex-row">
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="inline-flex min-h-[3.2rem] items-center justify-center rounded-[14px] border-2 border-white/25 bg-white/[0.06] px-5 text-sm font-black text-white transition-colors hover:border-white/45 disabled:opacity-45 sm:w-40"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex min-h-[3.2rem] flex-1 items-center justify-center gap-2.5 rounded-[14px] border-[5px] border-[#007fda] bg-[#0bb5ff] px-5 text-base font-black text-[#00152b] shadow-[0_9px_0_rgba(0,66,132,0.45),0_18px_30px_rgba(0,20,65,0.24)] transition-transform hover:scale-[1.015] active:translate-y-0.5 disabled:scale-100 disabled:opacity-60"
            >
              <Users className="h-5 w-5" />
              {loading ? "Creazione…" : "Crea team"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
