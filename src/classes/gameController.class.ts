import { getUserData } from '@decentraland/Identity'
import { UI } from './ui.class'
import { rocketShip } from './rocket.class'
import { jailRecord } from '@/functions/jailRecord.function'
import { StartGameButton, cashOutGameButton } from './gameButtons'
import { WDScreen } from './wearableDispenser.class'
import { ATMScreen } from './atm.class'
import { RocketMove } from '../systems/rocketMovement.system'
import { Timer } from '@/functions/timer.function'
import { atmDb } from '@/functions/checkBalance.function'
import { InstanceController } from './instanceController.class'
import { NPC } from './npc.class'

export class GameController {
  public credit: number
  private game_index: number | undefined
  private multipliers: number[] = []
  public higherMultipliers: number[] = []
  private crash: boolean
  private maxNumber: number
  public hyperSpace: boolean
  public ui: UI
  public instanceController: InstanceController = new InstanceController()
  private rocket: rocketShip = new rocketShip(26, 22.1, 26, 26, 29.5, 12.89)
  private ws: WebSocket
  private timer: Timer
  public onGame: boolean

  constructor(ws: WebSocket) {
    this.ws = ws
    // FIXME: this need to be set on connection
    // when user connect get the real amount
    this.credit = 100
    this.crash = false
    this.maxNumber = 0
    this.hyperSpace = false
    this.timer = new Timer()
    this.onGame = false

    this.ui = new UI(this.rocket, this, this.instanceController)

    const startGameButton = new StartGameButton(this.ui, this)
    const cashOutButton = new cashOutGameButton(
      this.ui,
      this,
      this.instanceController
    )
    const screenHolderWD = new WDScreen(this.ui, this)
    const screenHolder = new ATMScreen(this.ui)
    const mrRoo = new NPC(this.ui)

    engine.addEntity(startGameButton)
    engine.addEntity(screenHolder)
    engine.addEntity(screenHolderWD)
    engine.addEntity(cashOutButton)
    engine.addEntity(mrRoo)

    engine.addSystem(new RocketMove(this.rocket, this))

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if ('type' in data) this.setConnected(data['idx'])
      if (data['gameAction']) {
        switch (data['gameAction']) {
          case 'leader':
            this.ui.update('leaderboard')
            this.ui.showUI()
            break
          case 'balance':
            this.setCredits(data['balanceAmount'])
            break
          case 'ping':
            this.ping()
            break
          case 'end':
            this.ui.crashRocket()
            this.instanceController.interior.redButtonPush(false)
            this.timer.setTimeout_(1000, () => {
              this.ui.restartRocket(this.rocket.screen.zone)
              this.instanceController.interior.resetSkyWall()
              this.onGame = false
              if (data['outcome']) {
                if (data['outcome'] === 'loss') {
                  this.showLossOfRound()
                }
              } else {
                this.showNewGame()
                if (this.rocket.screen.zone === 'Interior') {
                  this.ui.update('betInGame')
                  this.ui.showUI()
                }
              }
            })
            break
          case 'start':
            this.onGame = true
            this.ui.resumeRocket(this.rocket.screen.zone)
            if (this.rocket.screen.zone === 'Interior') {
              this.instanceController.interior.skyWallMovement()
            }
            break
          case 'update_credits_on_screen':
            this.applyGain(data['award'])
            break
          case 'higher_multiplier':
            this.showMultiplier(data['multiplier'])
            this.store(data['multiplier'])
            this.rocket.screen.showGameHistory(this.higherMultipliers)
            if (this.hyperSpace === true) {
              this.ui.update('congratulations')
              this.ui.showUI()
            }
            break
          case 'betReceived':
            this.applyLoss(data['betAmount'])
            break
          case 'betRejectedRunning':
          case 'betRejected':
            this.ui.showMessage(data['message'])
            break
          default:
            break
        }
      }
    }

    ws.onopen = async () => {
      this.joinGame()
    }
  }
  setConnected = (game_index: number) => {
    this.game_index = game_index
    this.ui.notConnectedPrompt.hide()
  }
  setCredits = (credits: number) => {
    // FIXME: this will confuse other developers. If credits is undefined then the function should not work. If you need 100, you pass 100.
    if (credits === undefined) {
      this.credit = 100
      this.ui.creditCounter.set(this.credit)
    } else {
      this.credit = credits
      this.ui.creditCounter.set(this.credit)
    }
  }
  applyLoss = (amount: number) => {
    const lost = Math.abs(amount) * -1
    this.credit += lost
    this.credit = parseFloat(this.credit.toFixed(2))
    this.ui.showLoss(lost)
  }
  applyGain = (amount: number) => {
    const gained = Math.abs(amount)
    this.credit += gained
    this.credit = parseFloat(this.credit.toFixed(2))

    this.ui.applyGain(gained)
  }
  sendBet = (bet_: number) => {
    this.send({
      idx: this.game_index,
      bet: bet_,
      action: 'bet'
    })
  }
  setBet = (bet_: number) => {
    this.applyLoss(bet_)
  }
  // send signal to get out of the game
  cashOut = () => {
    this.send({
      idx: this.game_index,
      action: 'cash_out'
    })
  }
  goToJail = (prisoner: string) => {
    this.send({
      idx: this.game_index,
      prisoner: prisoner,
      action: 'jail'
    })
  }
  showLossOfRound = () => {
    this.ui.update('crash')
    this.ui.showUI()
  }
  showMultiplier = (amount: number) => {
    this.rocket.screen.spawnMultiplierText(`${amount}x`)
  }
  showNewGame = () => {
    this.crash = true
    this.rocket.screen.showNewGameScreen()
  }
  joinGame = () => {
    getUserData()
      .then(async (data) => {
        jailRecord(data?.userId)

        this.send({
          isNew: true,
          id: data?.userId,
          name: data?.displayName
        })
      })
      .catch((err) => {
        log(err)
      })
  }
  send = (obj: object) => {
    this.ws.send(JSON.stringify(obj))
  }
  ping = () => {
    this.send({ idx: this.game_index, action: 'ping' })
  }
  store = (amount: number) => {
    if (
      typeof this.multipliers === 'undefined' ||
      !Array.isArray(this.multipliers)
    ) {
      return
    }

    if (this.crash === false) {
      this.multipliers.push(amount)
      this.maxNumber = Math.max(...this.multipliers)
    }
    if (this.crash === true) {
      this.higherMultipliers?.push(this.maxNumber)
      this.multipliers.splice(0, this.multipliers.length)
      this.crash = false
      if (this.higherMultipliers?.length > 10) {
        this.higherMultipliers?.shift()
      }
    }
  }
  action = (action: string) => {
    switch (action) {
      case 'bet':
    }
  }
  // TODO: look into how this function is used (zak)
  collectCredits = async () => {
    const data = await getUserData()
    const userId = data?.userId
    await atmDb(userId)
  }
  reachHyperSpace() {
    if (this.maxNumber === 100) {
      this.hyperSpace = true
    }
  }
}
