import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <Image
        src="/logo.svg"
        alt="Next.js logo"
        width={300}
        height={300}
        priority
      />

      <h1 className="text-4xl font-bold">Moogle Park</h1>
    </main>
  );
}
