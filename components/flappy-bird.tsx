"use client"

import { useEffect, useRef, useState } from "react"
import { saveScore } from "@/lib/scores"
import { getUserData } from "@/lib/auth"

interface FlappyBirdProps {
  username: string
  onGameOver: (score: number, newHighScore: boolean, coinsEarned: number) => void
}

export default function FlappyBird({ username, onGameOver }: FlappyBirdProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const birdImageRef = useRef<HTMLImageElement>()
  const [skinLoaded, setSkinLoaded] = useState(false)
  const gameRef = useRef({
    score: 0,
    gameOver: false,
    bird: {
      y: 0,
      velocity: 0
    },
    pipes: [] as { x: number; y: number }[]
  })

  useEffect(() => {
    const loadSelectedSkin = async () => {
      try {
        // Iegūstam lietotāja izvēlēto skin
        const userData = await getUserData(username)
        const skinId = userData.selectedSkin || "default"

        // Iegūstam skin datus
        const response = await fetch("/api/skins")
        const skins = await response.json()
        const skin = skins.find((s: any) => s.id === skinId)

        if (skin) {
          // Izveidojam jaunu attēla objektu
          const img = new Image()
          img.crossOrigin = "anonymous"
          
          // Gaidām, līdz attēls ielādējas
          await new Promise((resolve, reject) => {
            img.onload = resolve
            img.onerror = reject
            img.src = skin.image
          })

          birdImageRef.current = img
          setSkinLoaded(true)
        }
      } catch (error) {
        console.error("Failed to load skin:", error)
        // Ja neizdevās ielādēt skin, izmantojam noklusējuma dzelteno putnu
        setSkinLoaded(true)
      }
    }

    loadSelectedSkin()
  }, [username])

  useEffect(() => {
    if (!skinLoaded) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 320
    canvas.height = 480

    const game = gameRef.current
    game.bird.y = canvas.height / 2

    const GRAVITY = 0.5
    const JUMP = -8
    const PIPE_SPEED = 2
    const PIPE_WIDTH = 52
    const PIPE_GAP = 150
    const BIRD_SIZE = 20

    function drawBird() {
      if (birdImageRef.current) {
        // Zīmējam attēlu
        ctx.save()
        ctx.translate(100, game.bird.y)
        const size = BIRD_SIZE * 2
        ctx.drawImage(
          birdImageRef.current,
          -size/2,
          -size/2,
          size,
          size
        )
        ctx.restore()
      } else {
        // Fallback uz vienkāršu apli, ja attēls nav pieejams
        ctx.fillStyle = "#FFD700"
        ctx.beginPath()
        ctx.arc(100, game.bird.y, BIRD_SIZE, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    function drawPipes() {
      ctx.fillStyle = "#73C020"
      game.pipes.forEach(pipe => {
        // Top pipe
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.y)
        // Bottom pipe
        ctx.fillRect(
          pipe.x,
          pipe.y + PIPE_GAP,
          PIPE_WIDTH,
          canvas.height - pipe.y - PIPE_GAP
        )
      })
    }

    function updateGame() {
      // Bird physics
      game.bird.velocity += GRAVITY
      game.bird.y += game.bird.velocity

      // Move pipes
      game.pipes.forEach(pipe => {
        pipe.x -= PIPE_SPEED
      })

      // Remove off-screen pipes
      game.pipes = game.pipes.filter(pipe => pipe.x > -PIPE_WIDTH)

      // Add new pipe
      if (game.pipes.length === 0 || game.pipes[game.pipes.length - 1].x < canvas.width - 200) {
        game.pipes.push({
            x: canvas.width,
          y: Math.floor(Math.random() * (canvas.height - PIPE_GAP - 100)) + 50
        })
      }

      // Check collisions
      game.pipes.forEach(pipe => {
        if (
          100 + BIRD_SIZE > pipe.x &&
          100 - BIRD_SIZE < pipe.x + PIPE_WIDTH &&
          (game.bird.y - BIRD_SIZE < pipe.y ||
            game.bird.y + BIRD_SIZE > pipe.y + PIPE_GAP)
        ) {
              handleGameOver()
            }
      })

      // Check boundaries
      if (game.bird.y + BIRD_SIZE > canvas.height || game.bird.y - BIRD_SIZE < 0) {
        handleGameOver()
      }

      // Update score
      if (game.pipes[0]?.x + PIPE_WIDTH < 100 && !game.pipes[0].passed) {
        game.pipes[0].passed = true
        game.score++
      }
    }

    function drawScore() {
      ctx.fillStyle = "white"
      ctx.font = "24px Arial"
      ctx.fillText(game.score.toString(), canvas.width / 2, 50)
    }

    let animationFrame: number

    function gameLoop() {
      if (game.gameOver) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Draw background
      ctx.fillStyle = "#70C5CE"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      updateGame()
      drawPipes()
      drawBird()
      drawScore()

      animationFrame = requestAnimationFrame(gameLoop)
    }

    async function handleGameOver() {
      if (game.gameOver) return
      
      game.gameOver = true
      cancelAnimationFrame(animationFrame)

      try {
        const result = await saveScore(username, game.score)
        onGameOver(game.score, result.newHighScore, game.score)
      } catch (error) {
        console.error("Failed to save score:", error)
        onGameOver(game.score, false, game.score)
      }
    }

    function handleJump() {
      if (!game.gameOver) {
        game.bird.velocity = JUMP
      }
    }

    canvas.addEventListener("click", handleJump)
    window.addEventListener("keydown", (e) => {
      if (e.code === "Space") handleJump()
    })

      gameLoop()

    return () => {
      canvas.removeEventListener("click", handleJump)
      window.removeEventListener("keydown", handleJump)
      cancelAnimationFrame(animationFrame)
    }
  }, [username, onGameOver, skinLoaded])

  return (
    <div className="relative w-full max-w-[320px] mx-auto">
      <canvas
        ref={canvasRef}
        className="w-full h-full border-4 border-green-500 rounded-xl shadow-2xl bg-gradient-to-b from-sky-400 to-sky-300"
      />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-4 left-4 w-16 h-16 bg-white/30 rounded-full"></div>
        <div className="absolute top-8 right-8 w-20 h-20 bg-white/30 rounded-full"></div>
        <div className="absolute bottom-12 left-12 w-24 h-24 bg-white/30 rounded-full"></div>
      </div>
    </div>
  )
}

