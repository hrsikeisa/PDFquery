import { UserButton, auth } from "@clerk/nextjs"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import FileUpload from "@/components/FileUpload"
import { checkSubscription } from "@/lib/subscription"
import SubscriptionButton from "@/components/SubscriptionButton"
import { db } from "@/lib/db"
import { chats } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export default async function Home() {
  const { userId } = await auth()
  const isAuth = !!userId
  const isPro = await checkSubscription()
  let firstChat
  if (userId) {
    firstChat = await db.select().from(chats).where(eq(chats.userId, userId))
    if (firstChat) {
      firstChat = firstChat[0]
    }
  }
  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-rose-100 to-teal-100">
      <div className="space-y-2 flex flex-col items-center justify-around pt-4">
        <div className="flex flex-col items-center">
          <Image alt="logo" src="/logo.png" width={100} height={100} />
          <p className="pl-6 font-semibold">PDF Query</p>
        </div>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center">
            <h1 className="mr-3 text-5xl font-semibold">Chat with any PDF</h1>
            <UserButton afterSignOutUrl="/" />
          </div>

          <div className="flex mt-4">
            {isAuth && firstChat && (
              <Link href={`/chat/${firstChat.id}`}>
                <Button>
                  Go to Chats <ArrowRight className="ml-2" />
                </Button>
              </Link>
            )}
            <div className="ml-3">
              <SubscriptionButton isPro={isPro} />
            </div>
          </div>

          <p className="max-w-xl mt-8 text-lg text-slate-600">
            Join millions of students, researchers and professinals to instantly
            anwer questions and understand research with AI
          </p>

          <div className="w-full mt-4">
            {isAuth ? (
              <FileUpload />
            ) : (
              <Link href="/sign-in">
                <Button>
                  Login to get Started!
                  <LogIn className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
