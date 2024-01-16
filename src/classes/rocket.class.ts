import { spawnRocket } from '../functions/rocket.functions'
import { Screen } from './screen.class'

@Component('rocketData')
export class rocketData {
  origin: Vector3 = Vector3.Zero()
  target: Vector3 = Vector3.Zero()
  fraction = 0
}

export class rocketShip {
  entity: Entity
  crashEntity = new Entity()
  pause_: boolean
  origin: Vector3
  target: Vector3
  screen: Screen
  loadingInProgress: boolean

  constructor(
    x_origin: number,
    y_origin: number,
    z_origin: number,
    x_target: number,
    y_target: number,
    z_target: number
  ) {
    this.origin = new Vector3(x_origin, y_origin, z_origin)
    this.target = new Vector3(x_target, y_target, z_target)
    this.entity = spawnRocket(x_origin, y_origin, z_origin)
    this.pause_ = false
    this.entity.addComponent(new rocketData())
    this.entity.getComponent(rocketData).origin = this.origin
    this.entity.getComponent(rocketData).target = this.target
    this.screen = new Screen()
    this.loadingInProgress = false
    this.entity.addComponentOrReplace(
      new GLTFShape('models/Crash_game_2d_trace.glb')
    )
    this.crashEntity.addComponent(new GLTFShape('models/rbt_2d_crash.glb'))
    engine.addEntity(this.crashEntity)
  }
  switchPositions(zone: string) {
    this.origin = new Vector3(
      this.screen.screen_Rocket.origin_x,
      this.screen.screen_Rocket.origin_y,
      this.screen.screen_Rocket.origin_z
    )
    this.target = new Vector3(
      this.screen.screen_Rocket.target_x,
      this.screen.screen_Rocket.target_y,
      this.screen.screen_Rocket.target_z
    )
    this.entity.addComponentOrReplace(
      new Transform({
        scale: new Vector3(
          this.screen.screen_Rocket.scale_x,
          this.screen.screen_Rocket.scale_y,
          this.screen.screen_Rocket.scale_z
        ),
        rotation: new Quaternion().setEuler(
          this.screen.screen_Rocket.rotation_x,
          this.screen.screen_Rocket.rotation_y,
          this.screen.screen_Rocket.rotation_z
        )
      })
    )
  }
  pause = () => {
    this.pause_ = true
  }
  resume = (zone: string) => {
    this.pause_ = false
    this.entity.addComponentOrReplace(
      new Transform({
        rotation: new Quaternion().setEuler(
          this.screen.screen_Rocket.rotation_x,
          this.screen.screen_Rocket.rotation_y,
          this.screen.screen_Rocket.rotation_z
        ),
        scale: new Vector3(
          this.screen.screen_Rocket.scale_x,
          this.screen.screen_Rocket.scale_y,
          this.screen.screen_Rocket.scale_z
        )
      })
    )
  }
  restart_rocket = (zone: string) => {
    this.crashEntity.addComponentOrReplace(
      new Transform({ scale: new Vector3(0, 0, 0) })
    )
    this.entity.addComponentOrReplace(new rocketData())
    this.entity.getComponent(rocketData).origin = new Vector3(
      this.screen.screen_Rocket.origin_x,
      this.screen.screen_Rocket.origin_y,
      this.screen.screen_Rocket.origin_z
    )
    this.entity.getComponent(rocketData).target = new Vector3(
      this.screen.screen_Rocket.target_x,
      this.screen.screen_Rocket.target_y,
      this.screen.screen_Rocket.target_z
    )
    this.pause()
  }
  crash = (zone: string) => {
    if (zone === 'Interior') {
      this.crashEntity.addComponentOrReplace(
        new Transform({
          position: this.entity.getComponent(Transform).position,
          scale: new Vector3(1, 1, 1),
          rotation: new Quaternion().setEuler(0, -180, 0)
        })
      )
    } else {
      this.crashEntity.addComponentOrReplace(
        new Transform({
          position: this.entity.getComponent(Transform).position,
          scale: new Vector3(1, 1, 1)
        })
      )
    }
    this.entity.addComponentOrReplace(
      new Transform({ scale: new Vector3(0, 0, 0) })
    )
  }
  loadingRocket = (zone: string) => {
    log('rocket loading in'+ this.screen.zone)
    this.entity.addComponentOrReplace(
      new Transform({
        position: new Vector3(
          this.screen.screen_RocketLoading.origin_x,
          this.screen.screen_RocketLoading.origin_y,
          this.screen.screen_RocketLoading.origin_z
        ),
        rotation: new Quaternion().setEuler(
          this.screen.screen_RocketLoading.rotation_x,
          this.screen.screen_RocketLoading.rotation_y,
          this.screen.screen_RocketLoading.rotation_z
        )
      })
    )
  }
}
