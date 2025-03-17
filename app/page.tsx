import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Bird, Trophy, Users, ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-sky-400 via-sky-300 to-sky-200 p-4">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Bird className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-3xl font-extrabold tracking-tight text-green-600">Flappy Bird</CardTitle>
            <CardDescription className="text-gray-600">
              Login or register to start playing and compete globally!
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pt-4">
            <div className="grid grid-cols-1 gap-4">
              <Link href="/login" className="w-full">
                <Button className="w-full h-12 bg-green-500 hover:bg-green-600 text-lg shadow-md transition-all duration-200 hover:shadow-lg">
                  Login
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              <Link href="/register" className="w-full">
                <Button
                  variant="outline"
                  className="w-full h-12 border-green-500 text-green-600 hover:bg-green-50 text-lg shadow-sm transition-all duration-200"
                >
                  Register
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <Trophy className="h-6 w-6 text-amber-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">Global Leaderboard</p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg text-center">
                <Users className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">Compete with Friends</p>
              </div>
            </div>
          </CardContent>

          <CardFooter className="pt-2 pb-6 text-center flex justify-center">
            <p className="text-sm text-gray-500 max-w-xs">
              Play the endless game, improve your skills, and compete for the highest score!
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

