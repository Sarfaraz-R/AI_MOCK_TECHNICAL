import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

const clerkAppearance = {
  elements: {
    rootBox: "w-full",
    card: "w-full max-w-[380px] rounded-[22px] border border-[#EAEAEA] bg-white/95 p-6 shadow-[0_24px_80px_rgba(17,17,17,0.08)]",
    headerTitle: "text-2xl font-bold tracking-normal text-[#111111]",
    headerSubtitle: "text-sm text-[#666666]",
    socialButtonsBlockButton: "rounded-xl border-[#EAEAEA] text-sm",
    formButtonPrimary: "rounded-xl bg-[#111111] text-sm font-semibold hover:bg-[#222222]",
    formFieldInput: "rounded-xl border-[#EAEAEA] text-sm",
    footerActionText: "text-sm text-[#666666]",
    footerActionLink: "text-sm font-semibold text-[#111111]",
  },
};

export default function Page() {
  return (
    <main className="min-h-screen overflow-hidden bg-white">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(211,198,174,0.34)_1px,transparent_1px),linear-gradient(90deg,rgba(211,198,174,0.34)_1px,transparent_1px)] bg-[size:48px_48px]" />
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
          <div className="w-full max-w-[380px]">
            <SignUp appearance={clerkAppearance} />
          </div>
        </section>
      </div>
    </main>
  );
}
