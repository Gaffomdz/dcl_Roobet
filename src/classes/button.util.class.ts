import { Button } from './uiButton.class'

export type UIImageType = {
  sourceLeft?: number
  sourceTop?: number
  sourceWidth: number
  sourceHeight: number
  source?: Texture | AvatarTexture
  paddingTop?: number
  paddingRight?: number
  paddingBottom?: number
  paddingLeft?: number
  sizeInPixels?: boolean
  onClick?: OnClick
  name: string | null
  visible: boolean
  opacity: number
  hAlign: string
  vAlign: string
  width: string | number
  height: string | number
  positionX: string | number
  positionY: string | number
  isPointerBlocker: boolean
}

export class UIimageUtil extends UIImage {
  constructor(canvas: UICanvas, texture: Texture, uiObject: UIImageType) {
    super(canvas, texture)

    // this = { ...this, ...uiObject }
    this.name = uiObject.name
    this.width = uiObject.width
    this.height = uiObject.height
    this.positionX = uiObject.positionX
    this.positionY = uiObject.positionY
    this.visible = uiObject.visible
    this.hAlign = uiObject.hAlign
    this.vAlign = uiObject.vAlign
    this.isPointerBlocker = uiObject.isPointerBlocker
    this.sourceWidth = uiObject.sourceWidth
    this.sourceHeight = uiObject.sourceHeight
    this.source = uiObject.source
    if (uiObject.sourceLeft) this.sourceLeft = uiObject.sourceLeft
    if (uiObject.sourceTop) this.sourceTop = uiObject.sourceTop
    if (uiObject.paddingTop) this.paddingTop = uiObject.paddingTop
    if (uiObject.paddingRight) this.paddingRight = uiObject.paddingRight
    if (uiObject.paddingBottom) this.paddingBottom = uiObject.paddingBottom
    if (uiObject.paddingLeft) this.paddingLeft = uiObject.paddingLeft
    if (uiObject.sizeInPixels) this.sizeInPixels = uiObject.sizeInPixels
    if (uiObject.onClick) this.onClick = uiObject.onClick
    return this
  }
}

