import * as utils from '@dcl/ecs-scene-utils'

export class TriggerZone extends Entity {
    private shape: BoxShape = new BoxShape()
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public onClick: () => void = () => {}
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public onCameraEnter: () => void = () => {}
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public onCameraExit: () => void = () => {}
    private triggerBox = new utils.TriggerBoxShape()
  
    constructor() {
      super()
      this.addComponent(new Transform())
      this.addComponent(this.shape)
      this.shape.visible = false
      this.shape.withCollisions = false
      this.updateOnTrigger()
    }
  
    private updateOnTrigger() {
      this.addComponentOrReplace(
        new utils.TriggerComponent(
          this.triggerBox, //shape
          {
            onCameraEnter: () => {
              this.onCameraEnter()
            },
            onCameraExit: () => {
              this.onCameraExit()
            }
          }
        )
      )
    }
  }