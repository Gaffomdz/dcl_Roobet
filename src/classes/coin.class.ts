import { PositionType } from '@decentraland/RestrictedActions'
import { UI } from './ui.class'

export class Coins {
  coins: Array<Entity> = []
  ui: UI
  constructor(ui: UI, coins: Array<Array<PositionType | string>>) {
    this.addAllCoins(coins)
    this.ui = ui
  }

  addAllCoins(coins: Array<Array<PositionType | string>>): void {
    coins.forEach((row) => {
      const position = row[0] as PositionType
      const buttonText = row[1] as string
      this.addCoin(position, buttonText)
    })
  }

  addCoin(position: PositionType, buttonText: string): void {
    const Vector3position = new Vector3(position.x, position.y, position.z)
    const coin = new Entity()
    coin.addComponent(new GLTFShape('models/rbt_hunt_purple_chip.glb'))
    coin.addComponent(new Transform({ position: Vector3position }))
    coin.addComponent(new Animator()).addClip(new AnimationState('Animation', { speed: 1.7 })).getClip('Animation').playing = true
    engine.addEntity(coin)
    coin.addComponent(
      new OnPointerDown(() => {
        this.ui.update(buttonText)
        this.ui.showUI()
      })
    )
    this.coins.push(coin)
  }
}
