"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LandingFeature } from "@/components/landing/landingFeatures";

type LandingFeatureCardProps = {
  feature: LandingFeature;
  className?: string;
};

export function LandingFeatureCard({ feature, className }: LandingFeatureCardProps) {
  const Icon = feature.icon;

  return (
    <Card
      className={cn(
        "group relative overflow-hidden border border-gray-800 transition-all duration-300 md:hover:scale-105 md:hover:border-[var(--color-accent)]/50 md:hover:shadow-2xl md:hover:shadow-[var(--color-accent)]/20",
        className,
      )}
    >
      <div className="absolute inset-0 bg-[var(--color-accent)]/5 opacity-0 transition-opacity group-hover:opacity-100" />
      <CardHeader className="relative">
        <div className="mb-4 h-14 w-14 rounded-xl p-3 shadow-lg" style={{ backgroundColor: feature.color }}>
          <Icon className="h-full w-full text-white" />
        </div>
        <CardTitle className="text-xl text-white transition-colors group-hover:text-[var(--color-accent)]">
          {feature.title}
        </CardTitle>
        <CardDescription className="text-gray-400 leading-relaxed">{feature.description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
