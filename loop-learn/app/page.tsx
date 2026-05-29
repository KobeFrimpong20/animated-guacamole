import Image from "next/image";
import SessionReportForm from "./components/SessionReportForm";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black p-4">
      <main className="flex flex-1 w-full max-w-4xl flex-col items-center justify-between py-12 px-8 bg-white dark:bg-black sm:items-start rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-900">
        <Image
          className="dark:invert mb-8"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left w-full">
          <h1 className="text-4xl font-bold tracking-tight text-black dark:text-zinc-50">
            Loop-Learn Reports
          </h1>
          <p className="max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            Complete the form below to send a comprehensive session report to the student&apos;s parents.
          </p>

          <SessionReportForm />
        </div>
      </main>
    </div>
  );
}
