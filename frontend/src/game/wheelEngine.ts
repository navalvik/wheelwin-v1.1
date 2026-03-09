export type WheelState =
  | "idle"
  | "spinning"
  | "braking"
  | "stopped"

export class WheelEngine {

  angle: number = 0
  speed: number = 0
  targetSpeed: number = 0

  maxSpeed: number = 4 * Math.PI   // ~4 оборота/сек
  baseSpeed: number = 2 * Math.PI  // 1 оборот/сек

  state: WheelState = "idle"

  brakingDuration = 3
  brakingTime = 0

  lastTime = 0

  /*
  START SPIN
  */

  startSpin(activePlayers: number) {

    this.state = "spinning"

    this.targetSpeed = this.baseSpeed * activePlayers

    if (this.targetSpeed > this.maxSpeed)
      this.targetSpeed = this.maxSpeed

  }


  /*
  PLAYER PRESS (ускорение)
  */

  pressBoost() {

    if (this.state !== "spinning") return

    this.targetSpeed += 0.5

    if (this.targetSpeed > this.maxSpeed)
      this.targetSpeed = this.maxSpeed

  }


  /*
  START BRAKING
  */

  startBrake() {

    this.state = "braking"
    this.brakingTime = 0

  }


  /*
  UPDATE LOOP
  */

  update(time: number) {

    if (!this.lastTime) {
      this.lastTime = time
      return
    }

    const delta = (time - this.lastTime) / 1000
    this.lastTime = time

    switch (this.state) {

      case "spinning":
        this.updateSpin(delta)
        break

      case "braking":
        this.updateBrake(delta)
        break

    }

    this.angle += this.speed * delta

  }


  /*
  SPIN PHYSICS
  */

  private updateSpin(delta: number) {

    const accel = 3

    this.speed += (this.targetSpeed - this.speed) * accel * delta

  }


  /*
  BRAKE PHYSICS
  */

  private updateBrake(delta: number) {

    this.brakingTime += delta

    const t = this.brakingTime / this.brakingDuration

    if (t >= 1) {

      this.speed = 0
      this.state = "stopped"

      return
    }

    const ease = 1 - Math.pow(t, 3)

    this.speed *= ease

  }


  /*
  SET SERVER ANGLE (SYNC)
  */

  sync(angle: number, speed: number) {

    this.angle = angle
    this.speed = speed

  }


  /*
  GET WINNER INDEX
  */

  getWinner(sectors: number) {

    const normalized =
      (this.angle % (Math.PI * 2) + Math.PI * 2) %
      (Math.PI * 2)

    const sectorAngle =
      (Math.PI * 2) / sectors

    const index =
      Math.floor(
        (Math.PI * 2 - normalized) /
        sectorAngle
      ) % sectors

    return index

  }

}
