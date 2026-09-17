"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login } from "@/lib/actions/auth";
import { SubmitButton } from "./SubmitButton";

export function LoginForm() {
  const [state, formAction] = useActionState(login, { error: null });

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Iniciá sesión</h1>
        <p className="mt-1 text-sm text-foreground/60">
          Accedé al conocimiento operativo de tu empresa.
        </p>
      </div>

      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-lg border border-black/10 px-3 py-2 outline-none focus:border-accent"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="password" className="text-sm font-medium text-foreground">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-lg border border-black/10 px-3 py-2 outline-none focus:border-accent"
        />
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <SubmitButton>Iniciar sesión</SubmitButton>

      <p className="text-center text-sm text-foreground/60">
        ¿No tenés cuenta?{" "}
        <Link href="/registro" className="font-medium text-accent hover:underline">
          Creá tu empresa
        </Link>
      </p>
    </form>
  );
}
