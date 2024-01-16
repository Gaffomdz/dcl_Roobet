export class Button extends UIImage {
  constructor(
    canvas: UICanvas,
    url: string,
    width: string,
    height: string,
    sourceHeight: number,
    sourceWidth: number,
    positionX: string,
    positionY: string,
    hAlign: string,
    vAlign: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onClick: any
  ) {
    super(canvas, new Texture(url))

    this.width = width
    this.height = height
    this.sourceHeight = sourceHeight
    this.sourceWidth = sourceWidth
    this.positionX = positionX
    this.positionY = positionY
    this.hAlign = hAlign
    this.vAlign = vAlign
    this.onClick = new OnPointerDown(onClick)

    this.isPointerBlocker = true
    this.visible = false
  }
}
