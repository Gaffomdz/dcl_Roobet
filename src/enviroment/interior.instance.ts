import { Timer } from '@/utils/timer'
import { TriggerZone } from '@/utils/triggerZone'
import { Dash_Zone } from 'dcldash'
import { movePlayerToVector3 } from 'src/utils/movePlayerToVector3'

export class InteriorInstance extends Entity {
  //environment
  private mainGeo = new Entity()
  private collider = new Entity()
  private screen = new Entity()
  private skyWall = new Entity()
  private spaceSpinSatellite = new Entity()
  private floatingAssets = new Entity()
  private redButton = new Entity()
  //Trampoline Matress
  private trampoline = new TriggerZone()
  private timer = new Timer()
  constructor() {
    super()
    this.collider.addComponent(
      new GLTFShape('models/rbt_interior_colliders_1.gltf')
    )
    this.mainGeo.addComponent(
      new GLTFShape('models/rbt_interior_animated_maingeo.glb')
    )
    this.screen.addComponent(new GLTFShape('models/rbt_interior_screen_1.gltf'))
    this.skyWall.addComponent(
      new GLTFShape('models/rbt_interior_skywall.glb')
    )
    this.redButton.addComponent(
      new GLTFShape('models/rbt_interior_red_button.glb')
    )
    this.spaceSpinSatellite.addComponent(
      new GLTFShape('models/rbt_interior_spin_satelite.glb')
    )
    this.floatingAssets.addComponent(
      new GLTFShape('models/rbt_interior_floating_assets.glb')
    )
    this.skyWall.addComponent(
      new Transform({
        position: new Vector3(0, 13, 0)
      })
    )


    this.mainGeo.setParent(this)
    this.collider.setParent(this)
    this.screen.setParent(this)
    this.skyWall.setParent(this)
    this.floatingAssets.setParent(this)
    this.spaceSpinSatellite.setParent(this)
    this.redButton.setParent(this)

    this.flipSpaceship()
    this.spaceZone()
    this.skyWallAnimations()
    this.trampolineCreator()
    this.redButtonAnimation()
  }
  skyWallAnimations() {
    this.skyWall.addComponent(new Animator())
    this.floatingAssets.addComponent(new Animator())
    this.spaceSpinSatellite.addComponent(new Animator())
    this.skyWall
      .getComponent(Animator)
      .addClip(new AnimationState('idle', { layer: 0, weight: 0.02 }))
    this.skyWall
      .getComponent(Animator)
      .addClip(
        new AnimationState('movement', { layer: 1, weight: 0.02, speed: 3.5 })
      )
    this.skyWall
      .getComponent(Animator)
      .addClip(new AnimationState('Sky_wall', { layer: 2, weight: 0.02 }))

    this.floatingAssets
      .getComponent(Animator)
      .addClip(
        new AnimationState('Animation', { layer: 0, weight: 0.02, speed: 0.5 })
      )
    this.spaceSpinSatellite
      .getComponent(Animator)
      .addClip(
        new AnimationState('Animation', { layer: 0, weight: 0.02, speed: 0.5 })
      )
  }
  skyWallMovement() {
      this.skyWall.getComponent(Animator).getClip('movement').play(true)
      this.timer.setTimeout_(15000,()=>{
        this.skyWall.getComponent(Animator).getClip('movement').pause()
      })
      this.timer.setTimeout_(4000,()=>{
        this.floatingAssets.getComponent(Animator).getClip('Animation').play(true)
        this.spaceSpinSatellite
          .getComponent(Animator)
          .getClip('Animation')
          .play(true)
      })
  }
  resetSkyWall() {
    this.skyWall.getComponent(Animator).getClip('movement').stop()
    this.floatingAssets.getComponent(Animator).getClip('Animation').stop()
    this.spaceSpinSatellite.getComponent(Animator).getClip('Animation').stop()
  }
  redButtonAnimation() {
    this.redButton.addComponent(new Animator())
    this.redButton
      .getComponent(Animator)
      .addClip(
        new AnimationState('red_button_idle', { layer: 0, weight: 0.02 })
      )
    this.redButton
      .getComponent(Animator)
      .addClip(
        new AnimationState('red_button_push_action', { layer: 1, weight: 0.02 })
      )
  }
  redButtonPush(push: boolean) {
    if (push) {
      this.redButton
        .getComponent(Animator)
        .getClip('red_button_push_action').looping = false
      this.redButton
        .getComponent(Animator)
        .getClip('red_button_push_action')
        .play(true)
    } else {
      this.redButton.getComponent(Animator).getClip('red_button_push_action')
        .stop
      this.redButton.getComponent(Animator).getClip('red_button_idle').playing =
        true
    }
  }
  spaceZone() {
    const spaceShipZone = new Dash_Zone(
      'spaceShipZone',
      new Transform({
        position: new Vector3(42.03, 25.9, 37.39),
        scale: new Vector3(18, 6, 20)
      })
    )
    spaceShipZone.enable()
  }
  trampolineCreator() {
    this.trampoline.setParent(this)
    this.trampoline.addComponentOrReplace(
      new Transform({
        position: new Vector3(46.21, 1, 37.13),
        scale: new Vector3(5, 5, 5),
        rotation: new Quaternion().setEuler(0.0, 90.0, 0.0)
      })
    )
    this.trampoline.onCameraEnter = () =>
      this.enterRocket(
        new Vector3(41.03, 30, 45.96),
        new Vector3(53.72, 21.98, 44.81)
      )
  }
  flipSpaceship() {
    ;[this.mainGeo, this.screen, this.collider, this.redButton].forEach(
      (spaceShip) => {
        spaceShip.addComponent(
          new Transform({
            position: new Vector3(0.0, 0.0, 77.0),
            scale: new Vector3(1.0, 1.0, 1.0),
            rotation: new Quaternion().setEuler(0.0, 90.0, 0.0)
          })
        )
      }
    )
  }
  enterRocket(position: Vector3, direction: Vector3) {
    movePlayerToVector3(position, direction)
  }
}
