import { UI } from "./ui.class"

export class NPC extends Entity {
    private ui:UI
    constructor(ui:UI){
        super()
        this.ui = ui
        this.addComponent(new GLTFShape('models/rbt_mrroo_1.glb'))
        this.addComponent(
            new Transform({
              position: new Vector3(40.06, 10.56, 53.44),
              rotation: Quaternion.Euler(0, 0, 0),
              scale: new Vector3(1, 1, 1)
            })
          )
      
          this.addComponentOrReplace(
            new OnPointerDown(() => {
              this.ui.update('leaderboard')
              this.ui.showUI()
            })
          )
    }
}
