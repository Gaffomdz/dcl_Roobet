import { setUVs} from '@/functions/rocket.functions'
import { rocketData, rocketShip } from '../classes/rocket.class'
import { GameController } from '../classes/gameController.class'

export class RocketMove implements ISystem {
  rocket: rocketShip
  gameController: GameController
  private starRainShape: PlaneShape
  private itsFirst: boolean

  private UV_size_x: number
  private UV_size_y: number
  constructor(rocket: rocketShip, gameController: GameController) {
    this.rocket = rocket
    this.gameController = gameController
    this.starRainShape = this.rocket.screen.starRainShape
    this.itsFirst = true
    this.UV_size_x = 1.5 / 2
    this.UV_size_y = 1 / 2
  }
  movementFunc = (x: number) => {
    const cal = Math.log(x + 0.1000001) / Math.log(10) + 1
    return cal > 0 ? cal : 0
  }
  update(dt: number) {
    const transform = this.rocket.entity.getComponent(Transform)
    const lerp = this.rocket.entity.getComponent(rocketData)
    if (lerp.fraction < 1) {
      if (this.rocket.pause_) {
        if (!this.rocket.loadingInProgress) {
          this.rocket.loadingRocket(this.rocket.screen.zone)
          this.rocket.loadingInProgress = true
        }
      } else {
        this.rocket.loadingInProgress = false
      }
      
      if (this.rocket.pause_) return
      const origin = lerp.origin.asArray()
      const target = lerp.target.asArray()

      const y_dis = (target[1] - origin[1]) * this.movementFunc(lerp.fraction)
      const y = origin[1] + y_dis

      const z_dis = (target[2] - origin[2]) * this.movementFunc(lerp.fraction)
      const z = origin[2] + z_dis

      const x_dis = (target[0] - origin[0]) * this.movementFunc(lerp.fraction)
      const x = origin[0] + x_dis

      const UV_pos_y = y / target[1]
      const UV_pos_z = z / target[2]
      const UV_pos_x = (x / target[0]) * -1

      setUVs(
        this.starRainShape,
        UV_pos_y,
        UV_pos_z,
        this.UV_size_x,
        this.UV_size_y
      )

      if (this.itsFirst) {
        this.itsFirst = false
      }

      transform.position = new Vector3(x, y, z)
      lerp.fraction += dt / 30
    }
  }
}
