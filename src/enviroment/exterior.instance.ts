import { TriggerZone } from '@/utils/triggerZone'
import { Dash_TriggerZone, Dash_Zone } from 'dcldash'
import { getLeaderBoard } from 'src/functions/leaderBoard.function'

export class ExteriorInstance extends Entity {
  //environment
  private mainGeo = new Entity()
  private assets = new Entity()
  private fountain = new Entity()
  private slots = new Entity()
  private colliders = new Entity()

  //LeaderBoard
  private textholder1 = new Entity()
  private textholder2 = new Entity()
  private textholder3 = new Entity()
  private textholder4 = new Entity()
  private textholder5 = new Entity()
  private textholder6 = new Entity()
  private textholder7 = new Entity()
  private textholder8 = new Entity()
  private rightholder1 = new Entity()
  private rightholder2 = new Entity()
  private rightholder3 = new Entity()
  private rightholder4 = new Entity()
  private rightholder5 = new Entity()
  private rightholder6 = new Entity()
  private rightholder7 = new Entity()
  private rightholder8 = new Entity()

  //Sounds boxes
  private triggerSoundOff1 = new TriggerZone()
  private triggerSoundOff2 = new TriggerZone()
  private triggerSoundOff3 = new TriggerZone()
  private triggerSoundOn1 = new TriggerZone()
  private triggerSoundOn2 = new TriggerZone()
  private triggerSoundOn3 = new TriggerZone()

  private blackjackSoundBox = new Dash_TriggerZone()
  private rouletteSoundBox = new Dash_TriggerZone()
  private slotsSoundBox = new Dash_TriggerZone()
  private pokerSoundBox = new Dash_TriggerZone()

  private blackjackAC = new AudioClip(
    'sounds/blackjack & poker/poker_cards_shuffling.mp3'
  )
  private rouletteAC = new AudioClip('sounds/roulette/roulette_spinball.mp3')
  private slotsAC = new AudioClip('sounds/slots machines/slot_5coins.mp3')
  private pokerAC = new AudioClip(
    'sounds/blackjack & poker/poker_chips_dropping.mp3'
  )

  private blackjackAS = new AudioSource(this.blackjackAC)
  private rouletteAS = new AudioSource(this.rouletteAC)
  private slotsAS = new AudioSource(this.slotsAC)
  private pokerAS = new AudioSource(this.pokerAC)

  constructor() {
    super()
    this.colliders.addComponent(new GLTFShape('models/rbt_colliders_1.gltf'))
    this.mainGeo.addComponent(new GLTFShape('models/rbt_maingeo_1.gltf'))
    this.fountain.addComponent(new GLTFShape('models/rbt_fountain_1.gltf'))
    this.slots.addComponent(new GLTFShape('models/rbt_slots_1.gltf'))
    this.assets.addComponent(new GLTFShape('models/rbt_assets_1.gltf'))

    this.mainGeo.setParent(this)
    this.fountain.setParent(this)
    this.slots.setParent(this)
    this.assets.setParent(this)
    this.colliders.setParent(this)
    
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.displayLeaderboard()
    this.createBoard()
    this.createSoundBoxes()
    this.muteSounds()
    this.createBoxHouse()
  }
  createBoxHouse() {
    const wallThickness = 1
    const houseSize = 30

    const housePosition = new Vector3(7 * 16 + 8, 0, 7 * 16 + 8)

    const jailZone = new Dash_Zone(
      'jailZone',
      new Transform({
        position: housePosition,
        scale: new Vector3(32, 40, 32)
      })
    )

    const transparentMaterial = new Material()
    transparentMaterial.albedoColor = new Color4(1, 1, 1, 0)

    const floor = new Entity()
    floor.addComponent(new BoxShape())
    floor.addComponent(transparentMaterial)
    floor.addComponent(
      new Transform({
        position: housePosition,
        scale: new Vector3(houseSize, wallThickness, houseSize)
      })
    )
    engine.addEntity(floor)

    const leftWall = new Entity()
    leftWall.addComponent(new BoxShape())
    leftWall.addComponent(transparentMaterial)
    leftWall.addComponent(
      new Transform({
        position: new Vector3(
          housePosition.x - houseSize / 2 + wallThickness / 2,
          housePosition.y,
          housePosition.z
        ),
        scale: new Vector3(wallThickness, houseSize, houseSize)
      })
    )
    engine.addEntity(leftWall)

    const rightWall = new Entity()
    rightWall.addComponent(new BoxShape())
    rightWall.addComponent(transparentMaterial)
    rightWall.addComponent(
      new Transform({
        position: new Vector3(
          housePosition.x + houseSize / 2 - wallThickness / 2,
          housePosition.y,
          housePosition.z
        ),
        scale: new Vector3(wallThickness, houseSize, houseSize)
      })
    )
    engine.addEntity(rightWall)

    const frontWall = new Entity()
    frontWall.addComponent(new BoxShape())
    frontWall.addComponent(transparentMaterial)
    frontWall.addComponent(
      new Transform({
        position: new Vector3(
          housePosition.x,
          housePosition.y,
          housePosition.z + houseSize / 2 - wallThickness / 2
        ),
        scale: new Vector3(houseSize, houseSize, wallThickness)
      })
    )
    engine.addEntity(frontWall)

    const backWall = new Entity()
    backWall.addComponent(new BoxShape())
    backWall.addComponent(transparentMaterial)
    backWall.addComponent(
      new Transform({
        position: new Vector3(
          housePosition.x,
          housePosition.y,
          housePosition.z - houseSize / 2 + wallThickness / 2
        ),
        scale: new Vector3(houseSize, houseSize, wallThickness)
      })
    )
    engine.addEntity(backWall)
  }

  createSoundBoxes() {
    ;[
      this.blackjackSoundBox,
      this.rouletteSoundBox,
      this.slotsSoundBox,
      this.pokerSoundBox
    ].forEach((soundBoxes) => {
      soundBoxes.setParent(this)
      soundBoxes.enable()
      soundBoxes.onEnter = () => {
        this.blackjackAS.volume = 0.5
        this.rouletteAS.volume = 0.5
        this.slotsAS.volume = 0.4
        this.pokerAS.volume = 0.5
      }
      soundBoxes.onExit = () => {
        this.blackjackAS.volume = 0.05
        this.rouletteAS.volume = 0.05
        this.rouletteAS.volume = 0.05
        this.pokerAS.volume = 0.05
      }
    })

    this.blackjackSoundBox.addComponentOrReplace(
      new Transform({
        position: new Vector3(15.5, 9.7, 44.0),
        scale: new Vector3(5.0, 2.0, 6.0),
        rotation: new Quaternion().setEuler(0.0, 0.0, 0.0)
      })
    )
    this.rouletteSoundBox.addComponentOrReplace(
      new Transform({
        position: new Vector3(25.55, 10.46, 43.59),
        scale: new Vector3(5.0, 2.0, 6.0),
        rotation: new Quaternion().setEuler(0.0, 0.0, 0.0)
      })
    )
    this.slotsSoundBox.addComponentOrReplace(
      new Transform({
        position: new Vector3(27.92, 9.55, 29.16),
        scale: new Vector3(5.0, 2.0, 6.0),
        rotation: new Quaternion().setEuler(0.0, 0.0, 0.0)
      })
    )
    this.pokerSoundBox.addComponentOrReplace(
      new Transform({
        position: new Vector3(58.82, 9.55, 41.26),
        scale: new Vector3(5.0, 2.0, 6.0),
        rotation: new Quaternion().setEuler(0.0, 0.0, 0.0)
      })
    )

    this.blackjackAS.playing = false
    this.rouletteAS.playing = false
    this.slotsAS.playing = false
    this.pokerAS.playing = false

    this.blackjackAS.loop = true
    this.rouletteAS.loop = true
    this.slotsAS.loop = true
    this.pokerAS.loop = true

    this.blackjackSoundBox.addComponentOrReplace(this.blackjackAS)
    this.rouletteSoundBox.addComponentOrReplace(this.rouletteAS)
    this.slotsSoundBox.addComponentOrReplace(this.slotsAS)
    this.pokerSoundBox.addComponentOrReplace(this.pokerAS)
  }
  muteSounds() {
    ;[
      this.triggerSoundOff1,
      this.triggerSoundOff2,
      this.triggerSoundOff3
    ].forEach((boxes) => {
      boxes.setParent(this)
      boxes.onCameraEnter = () => {
        ;[
          this.blackjackAS,
          this.rouletteAS,
          this.slotsAS,
          this.pokerAS
        ].forEach((soundOff) => {
          soundOff.playing = false
        })
      }
    })
    ;[this.triggerSoundOn1, this.triggerSoundOn2, this.triggerSoundOn3].forEach(
      (boxes) => {
        boxes.setParent(this)
        boxes.onCameraEnter = () => {
          ;[
            this.blackjackAS,
            this.rouletteAS,
            this.slotsAS,
            this.pokerAS
          ].forEach((soundOn) => {
            soundOn.playing = true
          })
        }
      }
    )

    this.triggerSoundOff1.addComponentOrReplace(
      new Transform({
        position: new Vector3(40.63, 18.51, 39.43),
        scale: new Vector3(1.0, 2.0, 3.0),
        rotation: new Quaternion().setEuler(360.0, 10.0, 0.0)
      })
    )
    this.triggerSoundOff2.addComponentOrReplace(
      new Transform({
        position: new Vector3(48.06, 2.32, 73.64),
        scale: new Vector3(1.0, 4.12, 4.3),
        rotation: new Quaternion().setEuler(360.0, 360.0, 360.0)
      })
    )
    this.triggerSoundOff3.addComponentOrReplace(
      new Transform({
        position: new Vector3(32.57, 2.23, 73.67),
        scale: new Vector3(1.0, 4.12, 4.3),
        rotation: new Quaternion().setEuler(360.0, 360.0, 360.0)
      })
    )

    this.triggerSoundOn1.addComponentOrReplace(
      new Transform({
        position: new Vector3(41.67, 10.8, 40.5),
        scale: new Vector3(1.0, 2.0, 3.0),
        rotation: new Quaternion().setEuler(360.0, 10.0, 0.0)
      })
    )
    this.triggerSoundOn2.addComponentOrReplace(
      new Transform({
        position: new Vector3(63.61, 10.69, 55.94),
        scale: new Vector3(1.0, 4.2, 4.4),
        rotation: new Quaternion().setEuler(360.0, 270.0, 360.0)
      })
    )
    this.triggerSoundOn3.addComponentOrReplace(
      new Transform({
        position: new Vector3(16.38, 9.44, 55.91),
        scale: new Vector3(1.0, 4.2, 4.4),
        rotation: new Quaternion().setEuler(360.0, 270.0, 360.0)
      })
    )
  }
  async displayLeaderboard() {
    const list = await getLeaderBoard('a435662_e15366_24gt45')
    if (list && list.length > 0) {
      this.createText(list)
    }
  }
  createBoard() {
    this.textholder1.setParent(this)
    this.textholder1.addComponent(new TextShape('--null'))
    this.textholder1.addComponent(
      new Transform({
        position: new Vector3(20.48, 27.5, 11.38),
        scale: new Vector3(0.5, 0.5, 0.5),
        rotation: new Quaternion(0, 180, 1)
      })
    )

    this.textholder2.setParent(this)
    this.textholder2.addComponent(new TextShape('--null'))
    this.textholder2.addComponent(
      new Transform({
        position: new Vector3(20.48, 26.5, 11.38),
        scale: new Vector3(0.5, 0.5, 0.5),
        rotation: new Quaternion(0, 180, 1)
      })
    )

    this.textholder3.setParent(this)
    this.textholder3.addComponent(new TextShape('--null'))
    this.textholder3.addComponent(
      new Transform({
        position: new Vector3(20.48, 25.5, 11.38),
        scale: new Vector3(0.5, 0.5, 0.5),
        rotation: new Quaternion(0, 180, 1)
      })
    )

    this.textholder4.setParent(this)
    this.textholder4.addComponent(new TextShape('--null'))
    this.textholder4.addComponent(
      new Transform({
        position: new Vector3(20.48, 24.5, 11.38),
        scale: new Vector3(0.5, 0.5, 0.5),
        rotation: new Quaternion(0, 180, 1)
      })
    )
    this.textholder5.setParent(this)
    this.textholder5.addComponent(new TextShape('--null'))
    this.textholder5.addComponent(
      new Transform({
        position: new Vector3(20.48, 23.5, 11.38),
        scale: new Vector3(0.5, 0.5, 0.5),
        rotation: new Quaternion(0, 180, 1)
      })
    )

    this.textholder6.setParent(this)
    this.textholder6.addComponent(new TextShape('--null'))
    this.textholder6.addComponent(
      new Transform({
        position: new Vector3(20.48, 22.5, 11.38),
        scale: new Vector3(0.5, 0.5, 0.5),
        rotation: new Quaternion(0, 180, 1)
      })
    )

    this.textholder7.setParent(this)
    this.textholder7.addComponent(new TextShape('--null'))
    this.textholder7.addComponent(
      new Transform({
        position: new Vector3(20.48, 21.5, 11.38),
        scale: new Vector3(0.5, 0.5, 0.5),
        rotation: new Quaternion(0, 180, 1)
      })
    )

    this.textholder8.setParent(this)
    this.textholder8.addComponent(new TextShape('--null'))
    this.textholder8.addComponent(
      new Transform({
        position: new Vector3(20.48, 20.5, 11.38),
        scale: new Vector3(0.5, 0.5, 0.5),
        rotation: new Quaternion(0, 180, 1)
      })
    )
    this.rightholder1.setParent(this)
    this.rightholder1.addComponent(new TextShape('2.4x'))
    this.rightholder1.addComponent(
      new Transform({
        position: new Vector3(16.88, 27.5, 11.38),
        scale: new Vector3(0.5, 0.5, 0.5),
        rotation: new Quaternion(0, 180, 1)
      })
    )
    this.rightholder2.setParent(this)
    this.rightholder2.addComponent(new TextShape('2.4x'))
    this.rightholder2.addComponent(
      new Transform({
        position: new Vector3(16.88, 26.5, 11.38),
        scale: new Vector3(0.5, 0.5, 0.5),
        rotation: new Quaternion(0, 180, 1)
      })
    )
    this.rightholder3.setParent(this)
    this.rightholder3.addComponent(new TextShape('2.4x'))
    this.rightholder3.addComponent(
      new Transform({
        position: new Vector3(16.88, 25.5, 11.38),
        scale: new Vector3(0.5, 0.5, 0.5),
        rotation: new Quaternion(0, 180, 1)
      })
    )
    this.rightholder4.setParent(this)
    this.rightholder4.addComponent(new TextShape('2.4x'))
    this.rightholder4.addComponent(
      new Transform({
        position: new Vector3(16.88, 24.5, 11.38),
        scale: new Vector3(0.5, 0.5, 0.5),
        rotation: new Quaternion(0, 180, 1)
      })
    )
    this.rightholder5.setParent(this)
    this.rightholder5.addComponent(new TextShape('2.4x'))
    this.rightholder5.addComponent(
      new Transform({
        position: new Vector3(16.88, 23.5, 11.38),
        scale: new Vector3(0.5, 0.5, 0.5),
        rotation: new Quaternion(0, 180, 1)
      })
    )
    this.rightholder6.setParent(this)
    this.rightholder6.addComponent(new TextShape('2.4x'))
    this.rightholder6.addComponent(
      new Transform({
        position: new Vector3(16.88, 22.5, 11.38),
        scale: new Vector3(0.5, 0.5, 0.5),
        rotation: new Quaternion(0, 180, 1)
      })
    )
    this.rightholder7.setParent(this)
    this.rightholder7.addComponent(new TextShape('2.4x'))
    this.rightholder7.addComponent(
      new Transform({
        position: new Vector3(16.88, 21.5, 11.38),
        scale: new Vector3(0.5, 0.5, 0.5),
        rotation: new Quaternion(0, 180, 1)
      })
    )
    this.rightholder8.setParent(this)
    this.rightholder8.addComponent(new TextShape('2.4x'))
    this.rightholder8.addComponent(
      new Transform({
        position: new Vector3(16.88, 20.5, 11.38),
        scale: new Vector3(0.5, 0.5, 0.5),
        rotation: new Quaternion(0, 180, 1)
      })
    )
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createText(newtext: any[]) {
    const text1 = new TextShape(`${newtext[0].name}`)
    text1.hTextAlign = 'left'
    this.textholder1.addComponentOrReplace(text1)
    this.textholder1.getComponent(TextShape).color = Color3.FromInts(
      222,
      178,
      74
    )
    const text2 = new TextShape(`${newtext[1].name}`)
    text2.hTextAlign = 'left'
    this.textholder2.addComponentOrReplace(text2)
    this.textholder2.getComponent(TextShape).color = Color3.FromInts(
      222,
      178,
      74
    )
    const text3 = new TextShape(`${newtext[2].name}`)
    text3.hTextAlign = 'left'
    this.textholder3.addComponentOrReplace(text3)
    this.textholder3.getComponent(TextShape).color = Color3.FromInts(
      222,
      178,
      74
    )
    const text4 = new TextShape(`${newtext[3].name}`)
    text4.hTextAlign = 'left'
    this.textholder4.addComponentOrReplace(text4)
    this.textholder4.getComponent(TextShape).color = Color3.FromInts(
      222,
      178,
      74
    )
    const text5 = new TextShape(`${newtext[4].name}`)
    text5.hTextAlign = 'left'
    this.textholder5.addComponentOrReplace(text5)
    this.textholder5.getComponent(TextShape).color = Color3.FromInts(
      222,
      178,
      74
    )
    const text6 = new TextShape(`${newtext[5].name}`)
    text6.hTextAlign = 'left'
    this.textholder6.addComponentOrReplace(text6)
    this.textholder6.getComponent(TextShape).color = Color3.FromInts(
      222,
      178,
      74
    )
    const text7 = new TextShape(`${newtext[6].name}`)
    text7.hTextAlign = 'left'
    this.textholder7.addComponentOrReplace(text7)
    this.textholder7.getComponent(TextShape).color = Color3.FromInts(
      222,
      178,
      74
    )
    const text8 = new TextShape(`${newtext[7].name}`)
    text8.hTextAlign = 'left'
    this.textholder8.addComponentOrReplace(text8)

    this.textholder8.getComponent(TextShape).color = Color3.FromInts(
      222,
      178,
      74
    )
    const right1 = new TextShape(`${newtext[0].score}x`)
    right1.hTextAlign = 'left'
    this.rightholder1.addComponentOrReplace(right1)
    this.rightholder1.getComponent(TextShape).color = Color3.FromInts(
      222,
      178,
      74
    )
    const right2 = new TextShape(`${newtext[1].score}x`)
    right2.hTextAlign = 'left'
    this.rightholder2.addComponentOrReplace(right2)
    this.rightholder2.getComponent(TextShape).color = Color3.FromInts(
      222,
      178,
      74
    )
    const right3 = new TextShape(`${newtext[2].score}x`)
    right3.hTextAlign = 'left'
    this.rightholder3.addComponentOrReplace(right3)
    this.rightholder3.getComponent(TextShape).color = Color3.FromInts(
      222,
      178,
      74
    )
    const right4 = new TextShape(`${newtext[3].score}x`)
    right4.hTextAlign = 'left'
    this.rightholder4.addComponentOrReplace(right4)
    this.rightholder4.getComponent(TextShape).color = Color3.FromInts(
      222,
      178,
      74
    )
    const right5 = new TextShape(`${newtext[4].score}x`)
    right5.hTextAlign = 'left'
    this.rightholder5.addComponentOrReplace(right5)
    this.rightholder5.getComponent(TextShape).color = Color3.FromInts(
      222,
      178,
      74
    )
    const right6 = new TextShape(`${newtext[5].score}x`)
    right6.hTextAlign = 'left'
    this.rightholder6.addComponentOrReplace(right6)
    this.rightholder6.getComponent(TextShape).color = Color3.FromInts(
      222,
      178,
      74
    )
    const right7 = new TextShape(`${newtext[6].score}x`)
    right7.hTextAlign = 'left'
    this.rightholder7.addComponentOrReplace(right7)
    this.rightholder7.getComponent(TextShape).color = Color3.FromInts(
      222,
      178,
      74
    )
    const right8 = new TextShape(`${newtext[7].score}x`)
    right8.hTextAlign = 'left'
    this.rightholder8.addComponentOrReplace(right8)
    this.rightholder8.getComponent(TextShape).color = Color3.FromInts(
      222,
      178,
      74
    )
  }
}
