import { nftbalancedb } from '@/functions/checkBalance.function'
import { checkBalance } from '@/functions/leaderBoard.function'
import nftTransfer from '@/functions/nftTransfer.function'
import { getUserAccount } from '@decentraland/EthereumController'
import { getUserData } from '@decentraland/Identity'
import { UI } from './ui.class'
import { GameController } from './gameController.class'

export class WDScreen extends Entity {
  public cover = new Texture('images/ui/atm/WD_SCREENHOLDER.png')
  public myMaterial = new Material()
  private shape: PlaneShape = new PlaneShape()
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public onClick: () => void = () => {}
  private distance = 5
  private message = 'Interact'
  private ui: UI
  private gameController: GameController
  constructor(ui: UI, gameController: GameController) {
    super()
    this.myMaterial.albedoTexture = this.cover
    this.addComponent(
      new Transform({
        position: new Vector3(8.197, 10.68, 44.446),
        scale: new Vector3(0.9, 0.69, 0.21),
        rotation: new Quaternion().setEuler(0.0, 270.0, 180.0)
      })
    )
    this.addComponent(this.myMaterial)
    this.addComponent(this.shape)
    this.updateOnPointerDown()
    this.ui = ui
    this.gameController = gameController
  }

  private updateOnPointerDown() {
    this.addComponentOrReplace(
      new OnPointerDown(
        () => {
          {
            if (this.gameController.credit <= 250) {
              this.ui.update('noTokens')
              this.ui.showUI()
            } else {
              this.ui.update('checkWearable')
              this.ui.showUI()
              // TODO fix to call the game constructor
              this.ui.creditCounter.decrease(250)
              try {
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                executeTask(async () => {
                  const userAddress = await getUserAccount()
                  log('user address: ', userAddress)
                  const balance = await checkBalance(userAddress)
                  log(`balance from db: ${balance}`)
                  if (balance > 250) {
                    const nftTransferStatus = await nftTransfer(userAddress)
                    // eslint-disable-next-line @typescript-eslint/no-floating-promises
                    const data = await getUserData()
                    void nftbalancedb(data?.userId)
                    if (nftTransferStatus === 200) {
                      log('successfully transferred nft!')
                    }
                  }
                })
              } catch (error) {
                log('minting error: ', error)
              }
            }
          }
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
