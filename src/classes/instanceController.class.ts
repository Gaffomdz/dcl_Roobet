import { ExteriorInstance } from '@/enviroment/exterior.instance'
import { InteriorInstance } from '@/enviroment/interior.instance'
import { Timer } from '@/functions/timer.function'

export class InstanceController {
  public exterior = new ExteriorInstance()
  public interior = new InteriorInstance()

  private timer = new Timer()

  constructor() {
    this.interiorPreload()
    engine.addEntity(this.exterior)
  }
  interiorPreload() {
    engine.addEntity(this.interior)
    this.interior.addComponent(
      new Transform({ scale: new Vector3(0.0001, 0.0001, 0.0001) })
    )
    this.timer.setTimeout_(1000, () => {
      engine.removeEntity(this.interior)
      this.interior.removeComponent(Transform)
      this.interior.addComponent(
        new Transform({
          position: new Vector3(0, 0, 0),
          scale: new Vector3(1, 1, 1)
        })
      )
    })
  }
  loadInterior() {
    if (this.exterior.isAddedToEngine()) {
      engine.removeEntity(this.exterior)
      engine.addEntity(this.interior)
    }
  }
  loadExterior() {
    if (this.interior.isAddedToEngine()) {
      engine.removeEntity(this.interior)
      engine.addEntity(this.exterior)
    }
  }
}
