"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ArrowLeft } from "lucide-react";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages: Record<string, { title: string; description: string }> = {
    Configuration: {
      title: "Server Configuration Error",
      description: "There is a problem with the server configuration. Please contact support.",
    },
    AccessDenied: {
      title: "Access Denied",
      description: "You do not have permission to sign in.",
    },
    Verification: {
      title: "Verification Error",
      description: "The verification token has expired or has already been used.",
    },
    OAuthSignin: {
      title: "OAuth Sign In Error",
      description: "Error in constructing an authorization URL. Check Discord OAuth settings.",
    },
    OAuthCallback: {
      title: "OAuth Callback Error",
      description: "Error in handling the response from Discord. Check redirect URI configuration.",
    },
    OAuthCreateAccount: {
      title: "Account Creation Error",
      description: "Could not create OAuth provider user in the database.",
    },
    EmailCreateAccount: {
      title: "Email Account Error",
      description: "Could not create email provider user in the database.",
    },
    Callback: {
      title: "Callback Error",
      description: "Error in the OAuth callback handler route.",
    },
    OAuthAccountNotLinked: {
      title: "Account Not Linked",
      description: "This email is already associated with another account.",
    },
    EmailSignin: {
      title: "Email Sign In Error",
      description: "Check your email address.",
    },
    CredentialsSignin: {
      title: "Sign In Error",
      description: "Sign in failed. Check the details you provided are correct.",
    },
    SessionRequired: {
      title: "Session Required",
      description: "Please sign in to access this page.",
    },
    Default: {
      title: "Authentication Error",
      description: "An error occurred during authentication.",
    },
  };

  const errorInfo = errorMessages[error || "Default"] || errorMessages.Default;

  return (
    <Card className="glass-card relative w-full max-w-[32rem] border-white/10 shadow-2xl">
      <CardHeader className="space-y-2 text-center">
        <div className="mx-auto mb-1 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight sm:text-3xl">{errorInfo.title}</CardTitle>
        <CardDescription className="mx-auto max-w-md text-base leading-relaxed">
          {errorInfo.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {error && (
          <div className="rounded-lg bg-muted/40 p-4">
            <p className="text-sm font-mono text-muted-foreground">
              Error Code: <span className="text-destructive">{error}</span>
            </p>
          </div>
        )}

        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Troubleshooting Steps:</h3>
          <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
            <li>
              Verify Discord OAuth redirect URI is set to:{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">
                http://localhost:3001/api/auth/callback/discord
              </code>
            </li>
            <li>
              Check that database is initialized:{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">npx prisma db push</code>
            </li>
            <li>Ensure all environment variables are set correctly</li>
            <li>Restart the development server</li>
          </ul>
        </div>

        <div className="flex flex-col gap-2">
          <Button variant="cyan" className="w-full" asChild>
            <Link href="/auth/signin">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Try Again
            </Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>

        <div className="text-center text-xs text-muted-foreground">
          Need help? Check <code className="rounded bg-muted px-1 py-0.5">DISCORD_SETUP.md</code> for detailed
          instructions
        </div>
      </CardContent>
    </Card>
  );
}

export default function AuthErrorPage() {
  return (
    <div className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-[var(--bg-primary)] px-4 py-16">
      <div className="pointer-events-none absolute inset-0 bg-[var(--color-accent)]/10 blur-3xl" />
      <Suspense
        fallback={
          <Card className="glass-card relative w-full max-w-[32rem] border-white/10 shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold tracking-tight sm:text-3xl">Loading…</CardTitle>
              <CardDescription className="text-base">Preparing error details</CardDescription>
            </CardHeader>
          </Card>
        }
      >
        <AuthErrorContent />
      </Suspense>
    </div>
  );
}
