"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registro } from "@/lib/actions/auth";
import { SubmitButton } from "./SubmitButton";

export function RegistroForm() {
  const [state, formAction] = useActionState(registro, { error: null });

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Creá tu empresa</h1>
        <p className="mt-1 text-sm text-foreground/60">
          Empezá a centralizar tus procesos en menos de 5 minutos.
        </p>
      </div>

      <div className="space-y-1">
        <label htmlFor="nombre_empresa" className="text-sm font-medium text-foreground">
          Nombre de la empresa
        </label>
        <input
          id="nombre_empresa"
          name="nombre_empresa"
          type="text"
          required
          className="w-full rounded-lg border border-black/10 px-3 py-2 outline-none focus:border-accent"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="nombre_usuario" className="text-sm font-medium text-foreground">
          Tu nombre
        </label>
        <input
          id="nombre_usuario"
          name="nombre_usuario"
          type="text"
          required
          className="w-full rounded-lg border border-black/10 px-3 py-2 outline-none focus:border-accent"
        />
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
          minLength={6}
          autoComplete="new-password"
          className="w-full rounded-lg border border-black/10 px-3 py-2 outline-none focus:border-accent"
        />
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <SubmitButton>Crear cuenta</SubmitButton>

      <p className="text-center text-sm text-foreground/60">
        ¿Ya tenés cuenta?{" "}
        <Link href="/login" className="font-medium text-accent hover:underline">
          Iniciá sesión
        </Link>
      </p>
    </form>
  );
}
