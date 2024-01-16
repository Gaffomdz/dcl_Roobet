export class ExitPlane extends Entity {
  private shape: BoxShape = new BoxShape()
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public onClick: () => void = () => {}
  private distance = 5
  private message = 'Interact'
  private material = new Material()

  constructor() {
    super()
    this.addComponent(new Transform())
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
          this.onClick()
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


