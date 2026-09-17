import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { RegistroForm } from "@/components/auth/RegistroForm";

export const metadata: Metadata = { title: "Crear cuenta — Nesvir" };

export default function RegistroPage() {
  return (
    <AuthLayout>
      <RegistroForm />
    </AuthLayout>
  );
}
