"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FlappyBird from "@/components/flappy-bird"
import Leaderboard from "@/components/leaderboard"
import Shop from "@/components/shop"
import { checkAuth, logout, getUserData, updateScore } from "@/lib/auth"
import { getUserHighScore, getTopScores } from "@/lib/scores"
import { Award, Coins, Crown, Home, Info, LogOut, Play, ShoppingBag, Trophy, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function GamePage() {
  const router = useRouter()
  const [username, setUsername] = useState<string | null>(null)
  const [gameActive, setGameActive] = useState(false)
  const [currentScore, setCurrentScore] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  const [isNewHighScore, setIsNewHighScore] = useState(false)
  const [activeTab, setActiveTab] = useState("game")
  const [userCoins, setUserCoins] = useState(0)
  const [coinsEarned, setCoinsEarned] = useState(0)
  const [view, setView] = useState("game")
  const [scores, setScores] = useState([])
  const [selectedSkin, setSelectedSkin] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const user = await checkAuth()
        if (user) {
          setUsername(user.username)
          const highScore = await getUserHighScore(user.username)
          if (highScore) {
            setBestScore(highScore.score)
          }
          const userData = await getUserData(user.username)
          setUserCoins(userData.coins)
          setSelectedSkin(userData.selectedSkin)
        } else {
          router.push("/login")
        }
      } catch (error) {
        router.push("/login")
      }
    }

    checkUserAuth()
  }, [router])

  useEffect(() => {
    loadScores()
  }, [])

  const loadScores = async () => {
    try {
      const topScores = await getTopScores()
      setScores(topScores)
    } catch (error) {
      console.error("Failed to load scores:", error)
      router.push("/login")
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  const handleGameOver = async (score: number, newHighScore: boolean, coins: number) => {
    setCurrentScore(score)
    setIsNewHighScore(newHighScore)
    setCoinsEarned(coins)
    if (newHighScore) {
      setBestScore(score)
    }
    setUserCoins(prev => prev + coins)
    setGameActive(false)
    await handleScoreUpdate(score)
  }

  const handleSkinChange = async () => {
    if (username) {
      const userData = await getUserData(username)
      setUserCoins(userData.coins)
      setSelectedSkin(userData.selectedSkin)
    }
  }

  const handleScoreUpdate = async (score: number) => {
    try {
      await updateScore(username, score)
      await loadScores()
      toast({
        title: "Score Updated!",
        description: `New score: ${score}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update score",
        variant: "destructive",
      })
    }
  }

  if (!username) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-sky-400 via-blue-400 to-indigo-500">
        <Card className="w-[300px] bg-white/90 backdrop-blur border-0 shadow-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-3">
              <div className="animate-spin h-8 w-8 border-4 border-green-500 rounded-full border-t-transparent"></div>
              <p className="text-xl">Loading...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-400 to-indigo-500 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="transition-all duration-300 ease-in-out transform hover:scale-[1.02]">
          <Card className="mb-6 bg-white/90 backdrop-blur border-0 shadow-xl">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-green-400 to-green-600 p-3 rounded-full shadow-lg">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">{username}</h1>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-yellow-500" />
                        <span className="text-sm font-medium">
                          Best: <span className="text-green-600 font-bold">{bestScore}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Coins className="h-5 w-5 text-amber-500" />
                        <span className="text-sm font-medium">
                          Coins: <span className="text-amber-600 font-bold">{userCoins}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white hover:bg-gray-50 transition-all duration-200"
                    onClick={() => router.push("/")}
                  >
                    <Home className="h-4 w-4 mr-2" />
                    <span>Home</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Logout</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="game" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6 bg-white/80 backdrop-blur shadow-lg rounded-lg p-1">
            <TabsTrigger 
              value="game"
              className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-green-400 data-[state=active]:to-green-600 data-[state=active]:text-white transition-all duration-200"
            >
              <Play className="h-4 w-4 mr-2" />
              Play Game
            </TabsTrigger>
            <TabsTrigger 
              value="shop"
              className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-400 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-200"
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Shop
            </TabsTrigger>
            <TabsTrigger 
              value="leaderboard"
              className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-yellow-400 data-[state=active]:to-yellow-600 data-[state=active]:text-white transition-all duration-200"
            >
              <Crown className="h-4 w-4 mr-2" />
              Leaderboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="game">
            <Card className="bg-white/90 backdrop-blur border-0 shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                {!gameActive ? (
                  <div className="flex flex-col items-center justify-center p-8">
                    {isNewHighScore && currentScore > 0 && (
                      <div className="animate-bounce mb-6 bg-gradient-to-r from-yellow-400 to-yellow-600 p-4 rounded-lg shadow-lg text-white flex items-center gap-3">
                        <Award className="h-6 w-6" />
                        <span className="font-bold text-lg">New High Score: {currentScore}!</span>
                      </div>
                    )}

                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 mb-4">
                      Ready to Play?
                    </h2>
                    
                    <Button
                      className="bg-gradient-to-br from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white shadow-lg hover:scale-105 transition-all duration-200 text-lg px-8 py-6"
                      onClick={() => setGameActive(true)}
                    >
                      <Play className="h-5 w-5 mr-2" />
                      Start Game
                    </Button>

                    <div className="mt-8 flex items-start gap-3 text-gray-600 bg-gray-50 p-4 rounded-lg">
                      <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">
                        Use spacebar, up arrow, or click/tap to make the bird jump. 
                        Avoid pipes and collect coins to unlock new skins!
                      </p>
                    </div>
                  </div>
                ) : (
                  <FlappyBird username={username} onGameOver={handleGameOver} selectedSkin={selectedSkin} />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shop">
            <Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
              <CardContent className="p-0">
                <Shop username={username} onSkinChange={handleSkinChange} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaderboard">
            <Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
              <CardContent className="p-0">
                <Leaderboard currentUsername={username} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

