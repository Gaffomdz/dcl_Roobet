import { GameController } from './gameController.class'
import { InstanceController } from './instanceController.class'
import { UI } from './ui.class'

export class StartGameButton extends Entity {
  private shape: BoxShape = new BoxShape()
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public onClick: () => void = () => {}
  private material = new Material()
  private ui: UI
  private gameController: GameController

  constructor(ui: UI, gameController: GameController) {
    super()
    this.ui = ui
    this.gameController = gameController
    this.addComponent(
      new Transform({
        position: new Vector3(9.26, 19.1, 20.74),
        scale: new Vector3(0.7, 0.6, 1.0),
        rotation: new Quaternion().setEuler(0.0, 360.0, 360.0)
      })
    )
    this.addComponent(this.shape)
    this.updateOnPointerDown()
    this.shape.withCollisions = false
    this.material.albedoColor = Color4.FromInts(0, 0, 0, 0)
    this.addComponentOrReplace(this.material)
  }
  private updateOnPointerDown() {
    this.addComponentOrReplace(
      new OnPointerDown(
        () => {
          if (this.gameController.credit === 0) {
            this.ui.update('ranOut')
            this.ui.showUI()
          } else {
            this.ui.update('bet')
            this.ui.showUI()
          }
        },
        {
          hoverText: 'Start Game',
          distance: 10
        }
      )
    )
  }
}

export class cashOutGameButton extends Entity {
  private shape: BoxShape = new BoxShape()
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public onClick: () => void = () => {}
  private material = new Material()
  private ui: UI
  private gameController: GameController
  private instanceController: InstanceController

  constructor(ui: UI, gameController: GameController, instanceController: InstanceController) {
    super()
    this.ui = ui
    this.gameController = gameController
    this.instanceController = instanceController
    this.addComponent(
      new Transform({
        position: new Vector3(42.25, 26.3, 36.99),
        scale: new Vector3(2, 3, 2),
        rotation: new Quaternion().setEuler(0.0, 0.0, 0.0)
      })
    )
    this.addComponent(this.shape)
    this.updateOnPointerDown()
    this.shape.withCollisions = false
    this.material.albedoColor = Color4.FromInts(0, 0, 0, 0)
    this.addComponentOrReplace(this.material)
  }
  private updateOnPointerDown() {
    this.addComponentOrReplace(
      new OnPointerDown(
        () => {
          this.instanceController.interior.redButtonPush(true)
          this.gameController.cashOut()
        },
        {
          hoverText: 'Click to eject',
          distance: 10
        }
      )
    )
  }
}
