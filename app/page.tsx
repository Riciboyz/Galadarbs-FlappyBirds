import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Bird, Trophy, Users, ArrowRight, Star, Gamepad2 } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-400 to-indigo-500 flex flex-col items-center justify-center p-4 md:p-8">
      {/* Animated clouds */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="cloud cloud-1"></div>
        <div className="cloud cloud-2"></div>
        <div className="cloud cloud-3"></div>
        <div className="cloud cloud-4"></div>
      </div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-white/20 rounded-full flex items-center justify-center animate-pulse-slow">
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-xl">
            <Bird className="h-12 w-12 text-white" />
          </div>
        </div>
        
        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm mt-10 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500"></div>
          
          <CardHeader className="text-center pb-2 pt-6">
            <CardTitle className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Flappy Bird
            </CardTitle>
            <CardDescription className="text-gray-600 text-lg mt-2">
              Login or register to start playing and compete globally!
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8 pt-6">
            <div className="grid grid-cols-1 gap-4">
              <Link href="/login" className="w-full">
                <Button className="w-full h-14 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-lg font-medium shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] rounded-xl">
                  Login
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>

              <Link href="/register" className="w-full">
                <Button
                  variant="outline"
                  className="w-full h-14 border-2 border-green-500 text-green-600 hover:bg-green-50 text-lg font-medium shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.02] rounded-xl"
                >
                  Register
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-5 rounded-xl text-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.03] border border-amber-200">
                <div className="bg-amber-200 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Trophy className="h-6 w-6 text-amber-600" />
                </div>
                <p className="text-sm font-medium text-amber-800">Global Leaderboard</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl text-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.03] border border-blue-200">
                <div className="bg-blue-200 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-sm font-medium text-blue-800">Compete with Friends</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl text-center shadow-md border border-green-200">
              <div className="bg-green-200 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Gamepad2 className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-sm font-medium text-green-800 mb-2">Play Endless Mode</p>
              <p className="text-xs text-green-700">Improve your skills and compete for the highest score!</p>
            </div>
          </CardContent>

          <CardFooter className="pt-2 pb-6 text-center flex justify-center">
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="h-4 w-4 fill-amber-500" />
              <Star className="h-4 w-4 fill-amber-500" />
              <Star className="h-4 w-4 fill-amber-500" />
              <Star className="h-4 w-4 fill-amber-500" />
              <Star className="h-4 w-4 fill-amber-500" />
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

