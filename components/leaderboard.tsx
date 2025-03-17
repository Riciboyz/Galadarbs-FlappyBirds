"use client"

import { useEffect, useState } from "react"
import { getTopScores } from "@/lib/scores"
import { Trophy, Medal, Crown, Star, Search, Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface Score {
  username: string
  score: number
  date: string
}

export default function Leaderboard({ currentUsername }: { currentUsername: string }) {
  const [scores, setScores] = useState<Score[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const topScores = await getTopScores()
        setScores(topScores)
      } catch (error) {
        console.error("Failed to fetch scores:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchScores()

    // Refresh scores every 30 seconds
    const interval = setInterval(fetchScores, 30000)

    return () => clearInterval(interval)
  }, [])

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  // Format time to be more readable
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Filter scores based on search term
  const filteredScores = scores.filter((score) => score.username.toLowerCase().includes(searchTerm.toLowerCase()))

  // Find current user's position in the leaderboard
  const currentUserRank = scores.findIndex((score) => score.username === currentUsername) + 1

  if (loading) {
    return <div className="p-4">Loading leaderboard...</div>
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-center gap-2 mb-6">
        <Crown className="h-6 w-6 text-yellow-500" />
        <h2 className="text-2xl font-bold text-green-600">Global Leaderboard</h2>
      </div>

      {currentUserRank > 0 && (
        <div className="mb-4 bg-green-50 p-3 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-700">Your Rank: {currentUserRank}</span>
            </div>
            {currentUserRank === 1 ? (
              <Badge className="bg-yellow-500">Top Player!</Badge>
            ) : currentUserRank <= 3 ? (
              <Badge className="bg-blue-500">Top 3!</Badge>
            ) : currentUserRank <= 10 ? (
              <Badge className="bg-green-600">Top 10!</Badge>
            ) : null}
          </div>
        </div>
      )}

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search players..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 bg-gray-50 border-gray-200"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center p-12">
          <div className="animate-spin h-8 w-8 border-4 border-green-500 rounded-full border-t-transparent"></div>
          <p className="ml-3 text-gray-600">Loading scores...</p>
        </div>
      ) : scores.length === 0 ? (
        <div className="text-center p-12 bg-green-50 rounded-lg">
          <Star className="h-12 w-12 text-green-500 mx-auto mb-3" />
          <p className="text-lg font-medium text-gray-700">No scores yet</p>
          <p className="text-gray-500 mt-1">Be the first to set a high score!</p>
        </div>
      ) : filteredScores.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No players found matching "{searchTerm}"</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">Rank</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">Player</th>
                <th className="py-3 px-4 text-right font-semibold text-gray-700">Score</th>
                <th className="py-3 px-4 text-right font-semibold text-gray-700 hidden sm:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredScores.map((score, index) => {
                const isCurrentUser = score.username === currentUsername

                return (
                  <tr
                    key={index}
                    className={`hover:bg-gray-50 transition-colors ${isCurrentUser ? "bg-green-50" : ""}`}
                  >
                    <td className="py-3 px-4 font-medium">
                      {index === 0 ? (
                        <div className="flex items-center">
                          <div className="bg-yellow-100 p-1 rounded-full mr-2">
                            <Medal className="h-4 w-4 text-yellow-500" />
                          </div>
                          <span className="text-yellow-600 font-bold">1st</span>
                        </div>
                      ) : index === 1 ? (
                        <div className="flex items-center">
                          <div className="bg-gray-100 p-1 rounded-full mr-2">
                            <Medal className="h-4 w-4 text-gray-400" />
                          </div>
                          <span className="text-gray-500 font-bold">2nd</span>
                        </div>
                      ) : index === 2 ? (
                        <div className="flex items-center">
                          <div className="bg-amber-100 p-1 rounded-full mr-2">
                            <Medal className="h-4 w-4 text-amber-700" />
                          </div>
                          <span className="text-amber-800 font-bold">3rd</span>
                        </div>
                      ) : (
                        <span className="text-gray-500 pl-2">{index + 1}th</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-800">
                      <div className="flex items-center">
                        {score.username}
                        {isCurrentUser && (
                          <Badge variant="outline" className="ml-2 text-xs border-green-500 text-green-600">
                            You
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-green-600">{score.score}</td>
                    <td className="py-3 px-4 text-right text-gray-500 text-sm hidden sm:table-cell">
                      <div className="flex flex-col items-end">
                        <span>{formatDate(score.date)}</span>
                        <span className="text-xs text-gray-400">{formatTime(score.date)}</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
        <Users className="h-4 w-4" />
        <p>Showing highest scores from all players</p>
      </div>
    </div>
  )
}

