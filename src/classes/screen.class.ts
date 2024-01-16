import { yellowR2 } from '@/database/colors.database'
import {
  extScreen_multiplierHistory,
  extScreen_showNewGame,
  extScreen_starRain,
  intScreen_multiplierHistory,
  intScreen_rocket,
  intScreen_rocketLoading,
  intScreen_showNewGame,
  intScreen_starRain
} from '@/database/screenPositions.database'
import { extScreen_rocketLoading } from '@/database/screenPositions.database'
import {
  extScreen_multiplier,
  extScreen_rocket,
  intScreen_multiplier
} from '@/database/screenPositions.database'
import { Timer } from '@/functions/timer.function'
import { Dash_AnimationQueue, Dash_Ease, Dash_Tweaker } from 'dcldash'

export class Screen extends Entity {
  public starRain: Entity
  public starRainShape: PlaneShape
  private starRainMaterial: Material
  private starRainTexture: Texture
  private multiplierNumber: Entity
  private multiplierText: Entity
  private showNewGame: Entity
  private gameHistory: Entity
  private multiplierTextShape: TextShape
  private showNewGameText: TextShape
  private gameHistoryText: TextShape
  // Screen set to exterior
  private screen_Multiplier = extScreen_multiplier
  private screen_ShowNewGame = extScreen_showNewGame
  private screen_GameHistory = extScreen_multiplierHistory
  public screen_RocketLoading = extScreen_rocket
  public screen_Rocket = extScreen_rocketLoading
  public screen_StarRain = extScreen_starRain
  private timer: Timer
  private counter: number
  private font = new Font('fonts/RobotoMono-VariableFont_wght.ttf')
  public zone: string
  constructor() {
    super()
    this.timer = new Timer()

    this.multiplierNumber = new Entity()
    this.multiplierText = new Entity()
    this.gameHistory = new Entity()
    this.showNewGame = new Entity()

    this.starRain = new Entity()
    this.starRainTexture = new Texture('images/screen/star-rain.screen.png', {
      wrap: 1,
      samplingMode: 0
    })
    this.starRainShape = new PlaneShape()
    this.starRainMaterial = new Material()
    this.starRainMaterial.roughness = 1
    this.starRainMaterial.alphaTest = 0.1
    this.starRainMaterial.alphaTexture = this.starRainTexture
    this.starRainMaterial.albedoTexture = this.starRainTexture
    this.starRain.addComponent(this.starRainMaterial)
    this.starRain.addComponent(this.starRainShape)

    this.multiplierTextShape = new TextShape('\n \n \n \n \nCurrent Payout')
    this.showNewGameText = new TextShape(`Preparing Round \nPlace your bets`)
    this.gameHistoryText = new TextShape()

    this.multiplierText.addComponentOrReplace(this.multiplierTextShape)
    this.showNewGame.addComponent(this.font)

    this.zone = 'Exterior'
    this.counter = 0

    this.selectZone(this.zone)
  }
  selectZone(zone: string) {
    switch (zone) {
      default:
      case 'Exterior':
        this.screen_Multiplier = extScreen_multiplier
        this.screen_ShowNewGame = extScreen_showNewGame
        this.screen_GameHistory = extScreen_multiplierHistory
        this.screen_Rocket = extScreen_rocket
        this.screen_RocketLoading = extScreen_rocketLoading
        this.screen_StarRain = extScreen_starRain
        break
      case 'Interior':
        this.screen_Multiplier = intScreen_multiplier
        this.screen_ShowNewGame = intScreen_showNewGame
        this.screen_GameHistory = intScreen_multiplierHistory
        this.screen_Rocket = intScreen_rocket
        this.screen_RocketLoading = intScreen_rocketLoading
        this.screen_StarRain = intScreen_starRain
        break
    }
    this.spawnStarRain()
    this.switchGameHistoryPosition()
    this.switchNewGameScreenPosition()
  }
  spawnMultiplierText = (multiplier: string) => {
    this.multiplierNumber.addComponentOrReplace(
      new Transform({
        position: new Vector3(
          this.screen_Multiplier.position_x,
          this.screen_Multiplier.position_y,
          this.screen_Multiplier.position_z
        ),
        scale: new Vector3(
          this.screen_Multiplier.scale_x,
          this.screen_Multiplier.scale_y,
          this.screen_Multiplier.scale_z
        ),
        rotation: new Quaternion().setEuler(
          this.screen_Multiplier.rotation_x,
          this.screen_Multiplier.rotation_y,
          this.screen_Multiplier.rotation_z
        )
      })
    )
    this.multiplierText.addComponentOrReplace(
      new Transform({
        position: new Vector3(
          this.screen_Multiplier.position_x,
          this.screen_Multiplier.position_y - 0.2,
          this.screen_Multiplier.position_z
        ),
        scale: new Vector3(0.2, 0.2, 0.2),
        rotation: new Quaternion().setEuler(
          this.screen_Multiplier.rotation_x,
          this.screen_Multiplier.rotation_y,
          this.screen_Multiplier.rotation_z
        )
      })
    )
    this.multiplierNumber.addComponentOrReplace(new TextShape(multiplier))
    this.multiplierNumber.getComponent(TextShape).color = yellowR2
    this.multiplierText.getComponent(TextShape).color = yellowR2
    engine.addEntity(this.multiplierText)
    engine.addEntity(this.multiplierNumber)
    const startScale = 1
    const endScale = 1.3
    Dash_AnimationQueue.add({
      duration: 1,
      data: { someval: 'foo' },
      onFrame: (progress) => {
        const transform = this.multiplierNumber.getComponent(Transform)
        const easeValue = Scalar.Lerp(
          startScale,
          endScale,
          Dash_Ease.easeOutBounce(progress)
        )
        transform.scale.setAll(easeValue)
      }
    })

    if (this.counter === 0) {
      this.counter = 1
    }
    if (this.counter === 1) {
      this.timer.setTimeout_(300, () => {
        engine.removeEntity(this.multiplierNumber)
        engine.removeEntity(this.multiplierText)
        this.counter = 0
      })
    }
    return this.multiplierNumber
  }
  switchNewGameScreenPosition = () => {
    this.showNewGame.addComponentOrReplace(
      new Transform({
        position: new Vector3(
          this.screen_ShowNewGame.position_x,
          this.screen_ShowNewGame.position_y,
          this.screen_ShowNewGame.position_z
        ),
        scale: new Vector3(
          this.screen_ShowNewGame.scale_x,
          this.screen_ShowNewGame.scale_y,
          this.screen_ShowNewGame.scale_z
        ),
        rotation: new Quaternion().setEuler(
          this.screen_ShowNewGame.rotation_x,
          this.screen_ShowNewGame.rotation_y,
          this.screen_ShowNewGame.rotation_z
        )
      })
    )
  }
  showNewGameScreen = () => {
    this.showNewGame.addComponentOrReplace(this.showNewGameText)
    this.showNewGame.getComponent(TextShape).color = yellowR2
    engine.addEntity(this.showNewGame)
    this.timer.setTimeout_(9500, () => {
      this.showNewGame.addComponentOrReplace(new TextShape(''))
      engine.removeEntity(this.showNewGame)
    })
  }
  switchGameHistoryPosition = () => {
    this.gameHistory.addComponentOrReplace(
      new Transform({
        position: new Vector3(
          this.screen_GameHistory.position_x,
          this.screen_GameHistory.position_y,
          this.screen_GameHistory.position_z
        ),
        scale: new Vector3(
          this.screen_GameHistory.scale_x,
          this.screen_GameHistory.scale_y,
          this.screen_GameHistory.scale_z
        ),
        rotation: new Quaternion().setEuler(
          this.screen_GameHistory.rotation_x,
          this.screen_GameHistory.rotation_y,
          this.screen_GameHistory.rotation_z
        )
      })
    )
  }
  showGameHistory = (multiplierNumber: number[]) => {
    if (this.gameHistory) {
      engine.removeEntity(this.gameHistory)
    }
    const text = multiplierNumber
      .map((num) => {
        if (num >= 2) {
          return `<color=#00ff00>${num} x</color>`
        } else {
          return `<color=#ff0000>${num} x</color>`
        }
      })
      .join(' ')
    this.gameHistoryText.value = text
    this.gameHistory.addComponentOrReplace(this.gameHistoryText)
    engine.addEntity(this.gameHistory)
    return this.gameHistory
  }
  spawnStarRain = () => {
    this.starRain.addComponentOrReplace(
      new Transform({
        position: new Vector3(
          this.screen_StarRain.position_x,
          this.screen_StarRain.position_y,
          this.screen_StarRain.position_z
        ),
        scale: new Vector3(
          this.screen_StarRain.scale_x,
          this.screen_StarRain.scale_y,
          this.screen_StarRain.scale_z
        ),
        rotation: new Quaternion().setEuler(
          this.screen_StarRain.rotation_x,
          this.screen_StarRain.rotation_y,
          this.screen_StarRain.rotation_z
        )
      })
    )
    engine.addEntity(this.starRain)
    return this.starRain
  }
}
