import Image from "next/image";
import SwitchBtn from "./switch-btn";

type Props = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: Props) {
  return (
    <div className="h-screen flex flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 px-8 lg:px-0">
      <SwitchBtn />
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex bg-zinc-900">
        <div className="flex flex-col items-center m-auto">
          <Image src="/logo.svg" alt="Logo" width={300} height={300} />
          <div className="text-4xl font-black">Moogle Park</div>
        </div>

        <div className="mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              “This library has saved me countless hours of work and helped me
              deliver stunning designs to my clients faster than ever before.”
            </p>
            <footer className="text-sm">Sofia Davis</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          {children}

          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <a
              className="underline underline-offset-4 hover:text-primary"
              href="/terms"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              className="underline underline-offset-4 hover:text-primary"
              href="/privacy"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
