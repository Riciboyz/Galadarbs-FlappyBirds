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
    try {
      const date = new Date(dateString)
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Recent"
      }
      
      // Calculate time difference in milliseconds
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffMinutes = Math.floor(diffMs / (1000 * 60))
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
      
      // Show relative time for recent scores
      if (diffMinutes < 60) {
        return diffMinutes <= 1 ? "Just now" : `${diffMinutes} minutes ago`
      } else if (diffHours < 24) {
        return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`
      } else if (diffDays < 7) {
        return diffDays === 1 ? "Yesterday" : `${diffDays} days ago`
      }
      
      // For older scores, show the date
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    } catch (error) {
      return "Recent"
    }
  }

  // Format time to be more readable
  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString)
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return ""
      }
      
      return date.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (error) {
      return ""
    }
  }

  // Filter scores based on search term
  const filteredScores = scores.filter((score) => score.username.toLowerCase().includes(searchTerm.toLowerCase()))

  // Find current user's position in the leaderboard
  const currentUserRank = scores.findIndex((score) => score.username === currentUsername) + 1

  if (loading) {
    return <div className="p-4">Loading leaderboard...</div>
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-3 rounded-xl shadow-lg">
          <Crown className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-800">Global Leaderboard</h2>
      </div>

      {currentUserRank > 0 && (
        <div className="mb-6 bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <Trophy className="h-6 w-6 text-green-600" />
              </div>
              <span className="font-medium text-green-700 text-lg">Your Rank: {currentUserRank}</span>
            </div>
            {currentUserRank === 1 ? (
              <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-1.5 text-sm">Top Player!</Badge>
            ) : currentUserRank <= 3 ? (
              <Badge className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-4 py-1.5 text-sm">Top 3!</Badge>
            ) : currentUserRank <= 10 ? (
              <Badge className="bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-1.5 text-sm">Top 10!</Badge>
            ) : null}
          </div>
        </div>
      )}

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          placeholder="Search players..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-12 bg-white/80 border-gray-200 rounded-xl h-12 text-base shadow-sm"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center p-12">
          <div className="animate-spin h-10 w-10 border-4 border-green-500 rounded-full border-t-transparent"></div>
          <p className="ml-4 text-gray-600 text-lg">Loading scores...</p>
        </div>
      ) : scores.length === 0 ? (
        <div className="text-center p-12 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
          <Star className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <p className="text-xl font-medium text-gray-700">No scores yet</p>
          <p className="text-gray-500 mt-2">Be the first to set a high score!</p>
        </div>
      ) : filteredScores.length === 0 ? (
        <div className="text-center p-8 bg-white/80 rounded-xl border border-gray-200">
          <p className="text-gray-600 text-lg">No players found matching "{searchTerm}"</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 shadow-lg bg-white/80 backdrop-blur">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-green-50 to-green-100">
              <tr>
                <th className="py-5 px-6 text-left font-semibold text-gray-700 text-base">Rank</th>
                <th className="py-5 px-6 text-left font-semibold text-gray-700 text-base">Player</th>
                <th className="py-5 px-6 text-right font-semibold text-gray-700 text-base">Score</th>
                <th className="py-5 px-6 text-right font-semibold text-gray-700 text-base hidden sm:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredScores.map((score, index) => {
                const isCurrentUser = score.username === currentUsername
                const isTopThree = index < 3

                return (
                  <tr 
                    key={score.username}
                    className={`transition-all duration-200 ${
                      isCurrentUser ? 'bg-green-50/50' : 'hover:bg-gray-50/50'
                    }`}
                  >
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-3">
                        {isTopThree ? (
                          <span className={`text-2xl ${
                            index === 0 ? 'text-yellow-500' :
                            index === 1 ? 'text-gray-400' :
                            'text-amber-700'
                          }`}>
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                          </span>
                        ) : (
                          <span className="font-medium text-gray-600 text-lg">#{index + 1}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-3">
                        <span className={`font-medium text-lg ${isCurrentUser ? 'text-green-600' : 'text-gray-700'}`}>
                          {score.username}
                        </span>
                        {isCurrentUser && (
                          <span className="text-sm bg-green-100 text-green-600 px-3 py-1 rounded-full font-medium">
                            You
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-5 px-6 text-right">
                      <span className="font-bold text-green-600 text-lg">{score.score}</span>
                    </td>
                    <td className="py-5 px-6 text-right text-base text-gray-500 hidden sm:table-cell">
                      <div className="flex flex-col items-end group relative">
                        <span className="font-medium">{formatDate(score.date)}</span>
                        {formatTime(score.date) && (
                          <span className="text-xs text-gray-400">{formatTime(score.date)}</span>
                        )}
                        <div className="absolute right-0 mt-2 -top-1 transform translate-y-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-800 text-white text-xs rounded-lg py-2 px-3 pointer-events-none z-10">
                          {new Date(score.date).toLocaleString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                          })}
                          <div className="absolute right-2 -top-1 transform rotate-45 w-2 h-2 bg-gray-800"></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-8 flex items-center justify-center gap-3 text-base text-gray-500 bg-white/50 p-4 rounded-xl border border-gray-200">
        <Users className="h-5 w-5" />
        <p>Showing highest scores from all players</p>
      </div>
    </div>
  )
}

