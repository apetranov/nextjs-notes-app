import Image from "next/image";
import { auth } from '@clerk/nextjs/server'
import Link from "next/link";

export default async function Home() {
  const { isAuthenticated, redirectToSignIn } = await auth()

  return (
    <div className="text-white flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1>Next.js Notes</h1>
      <h2>by apetranov</h2>
      {
        isAuthenticated 
          && 
        <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
          <Link href={'/notes'}>View/Create Notes</Link>
        </button> 
      }
    </div>
  );
}
