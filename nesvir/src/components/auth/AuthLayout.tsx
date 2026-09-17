import Image from "next/image";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 flex-col items-center justify-center bg-navy lg:flex">
        <Image
          src="/logo-completo.png"
          alt="Nesvir"
          width={360}
          height={121}
          priority
        />
      </div>

      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="mb-10 lg:hidden">
          <Image src="/logo-icon.png" alt="Nesvir" width={56} height={51} priority />
        </div>
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
