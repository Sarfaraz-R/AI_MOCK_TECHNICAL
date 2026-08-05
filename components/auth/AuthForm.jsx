"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";

export default function AuthForm({ mode }) {
  const isSignUp = mode === "sign-up";
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectUrl = useMemo(() => searchParams.get("redirect_url") || "/dashboard", [searchParams]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/auth/${isSignUp ? "signup" : "signin"}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          isSignUp
            ? { name, email, password }
            : { email, password }
        ),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      await refreshUser();
      toast(isSignUp ? "Account created successfully." : "Signed in successfully.");
      router.push(redirectUrl);
      router.refresh();
    } catch (error) {
      toast(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="premium-card w-full max-w-[420px] p-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-[#111111]">
          {isSignUp ? "Create your account" : "Sign in to Scribo"}
        </h1>
        <p className="mt-3 text-base text-[#666666]">
          {isSignUp
            ? "Create your account to start practicing."
            : "Welcome back! Please sign in to continue."}
        </p>
      </div>

      <a
        href={`/api/auth/google/start?redirect_url=${encodeURIComponent(redirectUrl)}`}
        className="premium-button-secondary mb-4 w-full px-5 py-4 text-base"
      >
        Continue with Google
      </a>

      <div className="mb-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#666666]">
          Or continue with email
        </span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignUp && (
          <div>
            <label className="mb-2 block text-sm font-medium text-[#111111]">Full name</label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="premium-input"
              placeholder="Enter your full name"
              required
            />
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm font-medium text-[#111111]">Email address</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="premium-input"
            placeholder="Enter your email address"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#111111]">Password</label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="premium-input"
            placeholder={isSignUp ? "At least 8 characters" : "Enter your password"}
            minLength={8}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="premium-button-primary mt-2 w-full px-5 py-4 text-base"
        >
          {loading ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              {isSignUp ? "Creating account..." : "Signing in..."}
            </>
          ) : (
            isSignUp ? "Create Account" : "Continue"
          )}
        </button>
      </form>

      <div className="mt-6 border-t border-white/10 pt-6 text-center text-sm text-[#666666]">
        {isSignUp ? "Already have an account? " : "Don’t have an account? "}
        <Link
          href={isSignUp ? `/sign-in?redirect_url=${encodeURIComponent(redirectUrl)}` : `/sign-up?redirect_url=${encodeURIComponent(redirectUrl)}`}
          className="font-semibold text-[#111111]"
        >
          {isSignUp ? "Sign in" : "Sign up"}
        </Link>
      </div>
    </div>
  );
}
