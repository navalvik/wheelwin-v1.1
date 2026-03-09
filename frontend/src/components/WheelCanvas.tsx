import React, { useEffect, useRef } from "react"

type Sector = {
  playerId: string
  color: string
  avatar?: string
}

type Props = {
  sectors: Sector[]
  angle: number
}

export default function WheelCanvas({ sectors, angle }: Props) {

  const canvasRef = useRef<HTMLCanvasElement>(null)

  const size = 420
  const center = size / 2
  const radius = 180

  /*
  DRAW LOOP
  */

  useEffect(() => {

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")!

    const draw = () => {

      ctx.clearRect(0, 0, size, size)

      drawWheel(ctx)
      drawMarker(ctx)

      requestAnimationFrame(draw)
    }

    draw()

  }, [sectors, angle])



  /*
  DRAW WHEEL
  */

  const drawWheel = (ctx: CanvasRenderingContext2D) => {

    if (!sectors.length) return

    const sectorAngle = (2 * Math.PI) / sectors.length

    sectors.forEach((sector, i) => {

      const start = angle + i * sectorAngle
      const end = start + sectorAngle

      ctx.beginPath()
      ctx.moveTo(center, center)

      ctx.arc(center, center, radius, start, end)

      ctx.fillStyle = sector.color
      ctx.fill()

      ctx.lineWidth = 4
      ctx.strokeStyle = "#0e0e0e"
      ctx.stroke()

      drawAvatar(ctx, sector, start + sectorAngle / 2)

    })

  }



  /*
  DRAW AVATAR
  */

  const drawAvatar = (
    ctx: CanvasRenderingContext2D,
    sector: Sector,
    angle: number
  ) => {

    if (!sector.avatar) return

    const avatarRadius = 24

    const x =
      center + Math.cos(angle) * (radius * 0.6)

    const y =
      center + Math.sin(angle) * (radius * 0.6)

    const img = new Image()
    img.src = sector.avatar

    img.onload = () => {

      ctx.save()

      ctx.beginPath()
      ctx.arc(x, y, avatarRadius, 0, Math.PI * 2)
      ctx.closePath()
      ctx.clip()

      ctx.drawImage(
        img,
        x - avatarRadius,
        y - avatarRadius,
        avatarRadius * 2,
        avatarRadius * 2
      )

      ctx.restore()

    }

  }



  /*
  DRAW WIN MARKER
  */

  const drawMarker = (ctx: CanvasRenderingContext2D) => {

    const markerSize = 20

    ctx.fillStyle = "white"

    ctx.beginPath()

    ctx.moveTo(center, center - radius - 10)

    ctx.lineTo(center - markerSize, center - radius - 30)

    ctx.lineTo(center + markerSize, center - radius - 30)

    ctx.closePath()

    ctx.fill()

  }



  return (

    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      style={{
        width: size,
        height: size
      }}
    />

  )

}
