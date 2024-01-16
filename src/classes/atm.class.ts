import { UI } from './ui.class'

export class ATMScreen extends Entity {
  public cover = new Texture('images/ui/atm/ATM_SCREENHOLDER.png')
  public myMaterial = new Material()
  private shape: PlaneShape = new PlaneShape()
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public onClick: () => void = () => { }
  private distance = 5
  private message = 'Interact'
  private ui: UI

  constructor(ui:UI) {
    super()
    this.myMaterial.albedoTexture = this.cover
    this.addComponentOrReplace(new Transform({
      position: new Vector3(8.13, 10.68, 42.08),
      scale: new Vector3(0.9, 0.69, 0.21),
      rotation: new Quaternion().setEuler(0.0, 270.0, 180.0)
    }))
    this.addComponentOrReplace(this.myMaterial)
    this.addComponentOrReplace(this.shape)
    this.updateOnPointerDown()
    this.ui = ui
  }

  private updateOnPointerDown() {
    this.addComponentOrReplace(
      new OnPointerDown(
        () => {
          this.ui.update('mainMenu')
          this.ui.showUI()
        },
        {
          hoverText: this.message,
          distance: this.distance
        }
      )
    )
  }

  setMessage(message: string) {
    this.message = message
    this.updateOnPointerDown()
  }

  setDistance(distance: number) {
    this.distance = distance
    this.updateOnPointerDown()
  }
}


