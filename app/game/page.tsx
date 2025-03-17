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
import { Award, Coins, Crown, Home, Info, LogOut, Play, ShoppingBag, Trophy, User, Sparkles } from "lucide-react"
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
      <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-400 to-indigo-500 flex items-center justify-center">
        {/* Animated clouds */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="cloud cloud-1"></div>
          <div className="cloud cloud-2"></div>
          <div className="cloud cloud-3"></div>
          <div className="cloud cloud-4"></div>
        </div>
        
        <Card className="w-[300px] bg-white/90 backdrop-blur border-0 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500"></div>
          <CardContent className="pt-8 pb-6">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="animate-spin h-10 w-10 border-4 border-green-500 rounded-full border-t-transparent"></div>
              <p className="text-xl font-medium text-gray-700">Loading Game...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-400 to-indigo-500 p-4 md:p-8">
      {/* Animated clouds */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="cloud cloud-1"></div>
        <div className="cloud cloud-2"></div>
        <div className="cloud cloud-3"></div>
        <div className="cloud cloud-4"></div>
      </div>
      
      <div className="max-w-6xl mx-auto space-y-6 relative z-10">
        {/* Header */}
        <div className="transition-all duration-300 ease-in-out transform hover:scale-[1.02]">
          <Card className="bg-white/90 backdrop-blur border-0 shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500"></div>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-6">
                  <div className="bg-gradient-to-br from-green-400 to-green-600 p-4 rounded-2xl shadow-lg transform hover:rotate-3 transition-transform duration-200">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">{username}</h1>
                    <div className="flex items-center gap-6 mt-2">
                      <div className="flex items-center gap-2 bg-white/50 px-4 py-2 rounded-full shadow-sm">
                        <Trophy className="h-5 w-5 text-yellow-500" />
                        <span className="text-sm font-medium">
                          Best: <span className="text-green-600 font-bold">{bestScore}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/50 px-4 py-2 rounded-full shadow-sm">
                        <Coins className="h-5 w-5 text-amber-500" />
                        <span className="text-sm font-medium">
                          Coins: <span className="text-amber-600 font-bold">{userCoins}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white hover:bg-gray-50 border border-gray-200 transition-all duration-200 rounded-full px-4"
                    onClick={() => router.push("/")}
                  >
                    <Home className="h-4 w-4 mr-2" />
                    <span>Home</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white text-red-500 hover:bg-red-50 border border-red-100 transition-all duration-200 rounded-full px-4"
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
          <TabsList className="grid grid-cols-3 mb-6 bg-white backdrop-blur shadow-md rounded-full p-1.5 border-0">
            <TabsTrigger 
              value="game"
              className="data-[state=active]:bg-green-500 data-[state=active]:text-white transition-all duration-200 rounded-full"
              onClick={() => setActiveTab("game")}
            >
              <Play className="h-5 w-5 mr-2" />
              Play Game
            </TabsTrigger>
            <TabsTrigger 
              value="shop"
              className="data-[state=active]:bg-purple-500 data-[state=active]:text-white transition-all duration-200 rounded-full"
              onClick={() => setActiveTab("shop")}
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              Shop
            </TabsTrigger>
            <TabsTrigger 
              value="leaderboard"
              className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white transition-all duration-200 rounded-full"
              onClick={() => setActiveTab("leaderboard")}
            >
              <Crown className="h-5 w-5 mr-2" />
              Leaderboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="game">
            <Card className="bg-white/90 backdrop-blur border-0 shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500"></div>
              <CardContent className="p-8">
                {!gameActive ? (
                  <div className="flex flex-col items-center justify-center p-8">
                    {isNewHighScore && currentScore > 0 && (
                      <div className="animate-bounce mb-8 bg-gradient-to-r from-yellow-400 to-yellow-600 p-6 rounded-xl shadow-lg text-white flex items-center gap-4">
                        <Award className="h-8 w-8" />
                        <span className="font-bold text-xl">New High Score: {currentScore}!</span>
                        <Sparkles className="h-6 w-6 text-yellow-100 animate-pulse-slow" />
                      </div>
                    )}

                    <div className="text-center mb-10">
                      <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-600 mb-4">
                        {currentScore > 0 ? "Game Over!" : "Ready to Play?"}
                      </h2>
                      {currentScore > 0 && (
                        <p className="text-2xl text-gray-600">
                          Score: <span className="font-bold text-green-600">{currentScore}</span>
                        </p>
                      )}
                      {coinsEarned > 0 && (
                        <p className="text-xl text-amber-600 mt-3 flex items-center justify-center gap-2">
                          <Coins className="h-5 w-5" />
                          <span>+{coinsEarned} coins earned!</span>
                        </p>
                      )}
                    </div>
                    
                    <Button
                      className="bg-green-500 hover:bg-green-600 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 text-lg px-8 py-3 rounded-full flex items-center gap-2"
                      onClick={() => setGameActive(true)}
                    >
                      <Play className="h-5 w-5" />
                      <span>{currentScore > 0 ? "Play Again" : "Start Game"}</span>
                    </Button>

                    <div className="mt-10 flex items-start gap-4 text-gray-600 bg-white/50 p-6 rounded-xl border border-gray-100 shadow-sm">
                      <Info className="h-6 w-6 flex-shrink-0 mt-0.5 text-green-500" />
                      <p className="text-base">
                        Use spacebar, up arrow, or click/tap to make the bird jump. 
                        Avoid pipes and collect coins to unlock new skins in the shop!
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
            <Card className="bg-white/90 backdrop-blur border-0 shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600"></div>
              <CardContent className="p-0">
                <Shop username={username} onSkinChange={handleSkinChange} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaderboard">
            <Card className="bg-white/90 backdrop-blur border-0 shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600"></div>
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

