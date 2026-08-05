import Link from "next/link";
import AuthForm from "@/components/auth/AuthForm";

export default function Page() {
  return (
    <main className="premium-shell min-h-screen overflow-hidden">
      <div className="relative mx-auto flex min-h-screen w-full max-w-[1180px] flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between">
          <Link href="/" className="brand-logo text-4xl text-[#111111]">
            Scribo
          </Link>
          <nav className="hidden items-center rounded-xl border border-[#E5E5E5] bg-[#F8F8F8] p-1 text-sm font-medium md:flex">
            <Link href="/#features" className="rounded-lg px-4 py-2 text-[#666666] transition-colors hover:bg-white/70 hover:text-[#111111]">
              Features
            </Link>
            <Link href="/#testimonials" className="rounded-lg px-4 py-2 text-[#666666] transition-colors hover:bg-white/70 hover:text-[#111111]">
              Testimonials
            </Link>
            <Link href="/#contact" className="rounded-lg px-4 py-2 text-[#666666] transition-colors hover:bg-white/70 hover:text-[#111111]">
              Contact
            </Link>
          </nav>
          <Link href="/" className="premium-button-primary py-2.5">
            Home
          </Link>
        </header>

        <section className="flex flex-1 items-center justify-center py-10">
          <AuthForm mode="sign-in" />
        </section>
      </div>
    </main>
  );
}
