import { movePlayerToVector3 } from 'src/utils/movePlayerToVector3'
import { Button } from './uiButton.class'
import {
  ui_NPC1,
  ui_aroothang,
  ui_badBehavior,
  ui_bet,
  ui_betonroooo,
  ui_checkWallet,
  ui_checkWearable,
  ui_collectedCredits,
  ui_congratulations,
  ui_crash,
  ui_howieisonvacation,
  ui_leaderboard,
  ui_letsgoletsroo,
  ui_mainMenu,
  ui_metaroolaunch,
  ui_noTokens,
  ui_ranOut,
  ui_relaunch,
  ui_roocup2023,
  ui_rooistheparty,
  ui_roolercoaster,
  ui_roooolly,
  ui_roundOver,
  ui_sevenismyluckynumber,
  ui_todayistherooday,
  ui_whattharoo
} from 'src/database/ui.database'
import { rocketShip } from './rocket.class'
import { yellowR } from 'src/database/colors.database'
import { UserData, getUserData } from '@decentraland/Identity'
import { isPreviewMode } from '@decentraland/EnvironmentAPI'
import { movePlayerTo } from '@decentraland/RestrictedActions'
import { CornerLabel, OkPrompt, UICounter } from '@dcl/ui-scene-utils'
import { GameController } from './gameController.class'
import { Timer } from '@/functions/timer.function'
import { canvas } from '@dcl/ui-scene-utils'
import { Coins } from './coin.class'
import { UIimageUtil } from './button.util.class'
import { InstanceController } from './instanceController.class'
import { signedFetch } from '@decentraland/SignedFetch'

type Buttons = { [key: string]: Button }
declare let setInterval: any
declare let clearInterval: any
let userData: UserData
// FIXME This list shouldin't be here this should be hidden in the server
const allowListedIds = [
  'SceneAdmin',
  'ToonPunk',
  'chratem#f32a',
  'agustin#4a5d',
  'AndyRoo#eff5',
  'JustRoo#a6cc',
  'IsaacRoo#5a51',
  'FeliRoo#25c7',
  'MartuRoo#8df0',
  'MattRoo#73db',
  'unknwnjon#e428',
  'meta#f32a',
  'innovation',
  'Rooland',
  'JonRoo#c1df'
]
export class UI {
  private timer__: Timer = new Timer()
  private timer: number
  public cornerLabelTimer: number
  public hideGainLossTimeout: number
  private timerManager: any
  private name: any
  private bet: any
  public canvas: UICanvas
  public lossCounter: UICounter
  public gainCounter: UICounter
  public creditCounter: UICounter
  private uiPlaceholder: UIImage
  private uiKickerIcon: UIImage
  public coinsCounter: UIImage
  private betInput: UIInputText
  private nameInput: UIInputText
  private textInput: UIInputText
  private timerText: UIText
  private submitEnter: UIText
  private text:UIText
  private rect: UIContainerRect
  private buttons!: Buttons
  private rocket: rocketShip
  private sceneMessageBus: MessageBus
  private instanceController: InstanceController
  public cornerLabel: CornerLabel
  // TODO make a timer class that handles all timers
  private gameController: GameController
  public notConnectedPrompt: OkPrompt
  constructor(
    rocket: rocketShip,
    gameController: GameController,
    instanceController: InstanceController
  ) {
    this.canvas = new UICanvas()
    this.rect = new UIContainerRect(this.canvas)
    this.textInput = new UIInputText(this.canvas)
    this.submitEnter = new UIText(this.canvas)
    this.text = new UIText(this.canvas)
    this.gameController = gameController
    this.rocket = rocket
    this.instanceController = instanceController
    ////////////////////////////////
    // UIImages
    ////////////////////////////////
    this.textInput.visible = false
    this.rect.visible = false
    this.submitEnter.visible = false
    this.text.visible = false
    // Coin counter backdrop image for the UI
    this.coinsCounter = new UIimageUtil(
      this.canvas,
      new Texture('images/coincounter/coincounter2-01.png'),
      {
        name: 'Coins Counter',
        width: '15%',
        height: '7%',
        sourceWidth: 2353,
        sourceHeight: 438,
        hAlign: 'right',
        vAlign: 'bottom',
        positionX: -17,
        positionY: 25,
        visible: true,
        opacity: 1,
        isPointerBlocker: false
      }
    )

    // Button to open the UI for kicking players
    this.uiKickerIcon = new UIimageUtil(
      canvas,
      new Texture('images/icons/kick_icon.png'),
      {
        name: 'Kick Icon',
        width: '54px',
        height: '54px',
        sourceWidth: 198,
        sourceHeight: 198,
        hAlign: 'top',
        vAlign: 'left',
        positionX: '-46.8%',
        positionY: '25%',
        visible: false,
        opacity: 1,
        isPointerBlocker: true,
        onClick: new OnClick(() => {
          this.update('badBehavior')
          this.showUI()
        })
      }
    )

    // FIXME: UI Placeholder (no image)
    this.uiPlaceholder = new UIimageUtil(this.canvas, new Texture(''), {
      name: 'UI Placeholder',
      width: '100%',
      height: '140%',
      sourceWidth: 1440,
      sourceHeight: 1024,
      hAlign: 'center',
      vAlign: 'center',
      positionX: '0%',
      positionY: '0%',
      visible: false,
      opacity: 1,
      isPointerBlocker: true
    })

    new Coins(this, [
      [{ x: 34.6, y: 9.55, z: 30.62 }, 'AROOTHANG'],
      [{ x: 71.57, y: 9.55, z: 47.32 }, 'BETONROOOO'],
      [{ x: 37.23, y: 10.8, z: 57.42 }, 'HOWIEISONVACATION'],
      [{ x: 59.99, y: 0.98, z: 66.26 }, 'LETSGOLETSROO'],
      [{ x: 17.26, y: 0.88, z: 51.08 }, 'METAROOLAUNCH'],
      [{ x: 50.8, y: 9.25, z: 28.89 }, 'ROOCUP2023'],
      [{ x: 23.44, y: 9.89, z: 58.03 }, 'ROOISTHEPARTY'],
      [{ x: 18.2, y: 18.5, z: 44.91 }, 'ROOLLERCOASTER'],
      [{ x: 20.91, y: 18.5, z: 34.4 }, 'ROOOOLLY'],
      [{ x: 57.35, y: 18.5, z: 38.48 }, 'SEVENISMYLUCKYNUMBER'],
      [{ x: 70.81, y: 0.88, z: 12.06 }, 'TODAYISTHEROODAY'],
      [{ x: 23.96, y: 9.61, z: 26.76 }, 'WHATTHAROO']
    ])

    this.notConnectedPrompt = new OkPrompt(
      "Not Connected yet. Don't close this prompt. Let it close by it's self",
      () => {
        log(
          `Not Connected yet. Don't close this prompt. Let it close by it's self >> accepted`
        )
      },
      'Ok',
      true
    )
    this.cornerLabelTimer = -1
    this.hideGainLossTimeout = -1

    this.lossCounter = new UICounter(0, 0, 60, Color4.Red(), 30, true)
    this.lossCounter.hide()

    this.gainCounter = new UICounter(0, 0, 60, Color4.Green(), 30, true)
    this.gainCounter.hide()
    this.creditCounter = new UICounter(
      Math.round(this.gameController.credit),
      -84,
      22,
      Color4.Black(),
      30,
      true
    )
    this.cornerLabel = new CornerLabel('', -640, 10)

    this.sceneMessageBus = new MessageBus()

    this.betInput = new UIInputText(this.canvas)
    this.nameInput = new UIInputText(this.canvas)
    this.rocket = rocket
    this.setButtons(gameController)
    this.timer = 10

    this.betInput.width = '27%'
    this.betInput.height = '25%'
    this.betInput.vAlign = 'right'
    this.betInput.hAlign = 'bottom'
    this.betInput.fontSize = 15
    this.betInput.positionY = '-3.4%'
    this.betInput.positionX = '1%'
    this.betInput.isPointerBlocker = true
    this.betInput.textWrapping = true
    this.betInput.hTextAlign = 'left'
    this.betInput.vTextAlign = 'center'
    this.betInput.paddingLeft = 140
    this.betInput.visible = false
    this.betInput.focusedBackground = new Color4(0, 0, 1, 0)
    this.betInput.onChanged = new OnChanged((e) => {
      const inputText = this.betInput.value.trim()
      if (!/^\d+$/.test(inputText)) {
        this.betInput.value = ''
      } else {
        this.bet = parseInt(inputText)
        this.betInput.placeholder = this.bet
      }
    })

    this.nameInput.width = '27%'
    this.nameInput.height = '50px'
    this.nameInput.vAlign = 'center'
    this.nameInput.hAlign = 'bottom'
    this.nameInput.fontSize = 15
    this.nameInput.positionY = '-90px'
    this.nameInput.positionX = 100
    this.nameInput.isPointerBlocker = true
    this.nameInput.textWrapping = true
    this.nameInput.hTextAlign = 'left'
    this.nameInput.vTextAlign = 'left'
    this.nameInput.paddingLeft = 70
    this.nameInput.visible = false
    this.nameInput.focusedBackground = new Color4(0, 0, 1, 0)
    this.nameInput.onChanged = new OnChanged((e) => {
      this.nameInput.placeholder = this.name
    })

    // FIXME make timerText as a class with states (functions that change the states)
    this.timerText = new UIText(this.canvas)
    this.timerText.value = 'Game Running'
    this.timerText.fontSize = 60
    this.timerText.color = yellowR
    this.timerText.hAlign = 'top'
    this.timerText.vAlign = 'center'
    this.timerText.positionY = '44%'
    this.timerText.positionX = '-10%'
    const font = new Font('fonts/RobotoMono-VariableFont_wght.ttf')
    this.timerText.font = font
    this.timerText.visible = false

    this.sceneMessageBus.on('kick', async (e) => {
      if (!userData) {
        await this.setUserData()
      }
      if (e.player === userData.displayName) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        movePlayerTo({ x: 118.01, y: 1.38, z: 120.13 })
      }
    })
    this.initiateVJUI().catch((error) => log(error))
  }

  //Moderator Tool - Get user data from the player
  async fetchUserData() {
    const data = await getUserData()
    if (data) {
      log(data.displayName)
    }
    return data
  }
  //Moderator Tool - Set user data from the player
  async setUserData() {
    const data = await getUserData()
    if (data) {
      log(data.displayName)
      userData = data
    }
  }
  //Moderator Tool - Open the tool for allowed players
  async initiateVJUI() {
    if (!userData) {
      await this.setUserData()
    }
    let authorized = false
    if (await isPreviewMode()) {
      authorized = true
    } else {
      for (const id of allowListedIds) {
        if (userData && id === userData.displayName) {
          authorized = true
          break
        }
      }
    }
    if (authorized) {
      Input.instance.subscribe(
        'BUTTON_DOWN',
        ActionButton.SECONDARY,
        false,
        (e) => {
          this.uiKickerIcon.visible = true
        }
      )
    }
  }
  startTimer = (time: number) => {
    this.timer = time
    this.timerManager = setInterval(() => {
      this.timer -= 1
      this.timerText.value = '00:00:' + this.timer.toString()
      if (this.timer <= 3) {
        this.timerText.color = Color4.Red()
      }
      if (this.timer > 0) {
        this.timerText.positionX = '-2%'
      }
      if (this.timer <= 0) {
        clearInterval(this.timerManager)
        this.timerText.color = yellowR
        this.timerText.value = 'Game Running'
        this.timerText.fontSize = 60
        this.timerText.hAlign = 'top'
        this.timerText.vAlign = 'center'
        this.timerText.positionY = '44%'
        this.timerText.positionX = '-10%'
      }
    }, 1000)
    return this.timer
  }
  // Rocket Functions Wrapper
  public crashRocket = () => {
    this.rocket.crash(this.rocket.screen.zone)
    this.startTimer(10)
  }
  public restartRocket = (zone: string) => {
    this.rocket.restart_rocket(zone)
  }
  public resumeRocket = (zone: string) => {
    this.rocket.resume(zone)
  }
  private setButtons(gameController: any) {
    this.buttons = {
      multiplier_mid: new Button(
        this.canvas,
        'images/ui/buttons/1.2.png',
        '7%',
        '16%',
        94,
        94,
        '7%',
        '-4.5%',
        'center',
        'right',
        () => {
          this.bet = +this.betInput.value
          this.bet = Math.round(this.bet / 2)
          this.betInput.placeholder = this.bet
        }
      ),
      multiplier_2x: new Button(
        this.canvas,
        'images/ui/buttons/x2.png',
        '7%',
        '16%',
        94,
        94,
        '12%',
        '-4.5%',
        'center',
        'right',
        () => {
          this.bet = +this.betInput.value
          this.bet = Math.round(this.bet * 2)
          this.betInput.placeholder = this.bet
        }
      ),
      multiplier_max: new Button(
        this.canvas,
        'images/ui/buttons/max.png',
        '7%',
        '16%',
        94,
        94,
        '17%',
        '-4.5%',
        'center',
        'center',
        () => {
          this.bet = +this.betInput.value
          this.bet = Math.round(gameController.credit)
          this.betInput.placeholder = this.bet
        }
      ),
      yes: new Button(
        this.canvas,
        'images/ui/buttons/yes.png',
        '10%',
        '16.8%',
        104,
        147,
        '-4%',
        '-30.9%',
        'bottom',
        'center',
        () => {
          if (this.bet > this.gameController.credit || this.bet < 1) {
            this.showMessage(`Bet Rejected - You don´t have enough credits`)
          } else {
            this.bet = +this.betInput.value
            this.gameController.sendBet(this.bet)
            if (gameController.onGame === false) {
              this.closeUI()
              this.timerText.visible = true
              this.instanceController.loadInterior()
              movePlayerToVector3(
                new Vector3(46.21, 25.9, 37.13),
                new Vector3(34.98, 25.9, 38.02)
              ),
                (this.rocket.screen.zone = 'Interior'),
                this.rocket.screen.selectZone('Interior'),
                this.rocket.screen.spawnStarRain(),
                this.rocket.screen.switchNewGameScreenPosition(),
                this.rocket.screen.showNewGameScreen(),
                this.rocket.screen.switchGameHistoryPosition(),
                this.rocket.switchPositions('Interior'),
                this.rocket.restart_rocket('Interior'),
                this.rocket.loadingRocket('Interior')
                this.timer__.setTimeout_(this.timer * 1000,()=>{
                  this.timerText.visible = false
                })
            }
          }
        }
      ),
      no: new Button(
        this.canvas,
        'images/ui/buttons/no.png',
        '10%',
        '16.8%',
        104,
        139,
        '5%',
        '-30.9%',
        'bottom',
        'center',
        () => {
          this.closeUI()
        }
      ),
      yesInGame: new Button(
        this.canvas,
        'images/ui/buttons/yes.png',
        '10%',
        '16.8%',
        104,
        147,
        '-4%',
        '-30.9%',
        'bottom',
        'center',
        () => {
          if (this.bet > this.gameController.credit || this.bet < 1) {
            this.showMessage(`Bet Rejected - You don´t have enough credits`)
          } else {
            this.bet = +this.betInput.value
            gameController.sendBet(this.bet)
            if (gameController.onGame === false) {
              this.closeUI()
            }
          }
        }
      ),
      noInGame: new Button(
        this.canvas,
        'images/ui/buttons/no.png',
        '10%',
        '16.8%',
        104,
        139,
        '5%',
        '-30.9%',
        'bottom',
        'center',
        () => {
          this.closeUI()
          this.instanceController.loadExterior(),
            movePlayerToVector3(
              new Vector3(55.59, 21.24, 41.53),
              new Vector3(53.72, 21.98, 44.81)
            ),
            (this.rocket.screen.zone = 'Exterior'),
            this.rocket.screen.selectZone('Exterior'),
            this.rocket.screen.spawnStarRain(),
            this.rocket.screen.switchNewGameScreenPosition(),
            this.rocket.screen.showNewGameScreen(),
            this.rocket.screen.switchGameHistoryPosition(),
            this.rocket.switchPositions('Exterior'),
            this.rocket.restart_rocket('Exterior'),
            this.rocket.loadingRocket('Exterior')
        }
      ),
      collectCoins: new Button(
        this.canvas,
        'images/ui/buttons/collectcoins.png',
        '17%',
        '20%',
        126,
        298,
        '-8.5%',
        '-44.1%',
        'bottom',
        'center',
        async () => {
          if (this.gameController.credit < 1) {
            this.gameController.collectCredits()
            this.update('collectedCredits')
            this.gameController.credit = 100 // --
            this.creditCounter.set(Math.round(this.gameController.credit))
          } else {
            this.buttons.remainingCreditsMessage.visible = true
            this.timer__.setTimeout_(3000, () => {
              this.buttons.remainingCreditsMessage.visible = false
            })
          }
        }
      ),
      exitRightBig: new Button(
        this.canvas,
        'images/ui/buttons/exit-right-big.png',
        '17%',
        '20%',
        126,
        298,
        '10%',
        '-44.1%',
        'bottom',
        'center',
        () => {
          this.closeUI()
        }
      ),
      relaunch: new Button(
        this.canvas,
        'images/ui/buttons/relaunch.png',
        '15%',
        '16.2%',
        104,
        203,
        '-5%',
        '-36%',
        'center',
        'center',
        () => {
          this.update('betInGame')
        }
      ),
      exitRight: new Button(
        this.canvas,
        'images/ui/buttons/exit-right.png',
        '10%',
        '16.5%',
        104,
        152,
        '6.5%',
        '-36%',
        'center',
        'center',
        () => {
          this.closeUI()
          this.instanceController.loadExterior(),
            movePlayerToVector3(
              new Vector3(55.59, 21.24, 41.53),
              new Vector3(53.72, 21.98, 44.81)
            ),
            (this.rocket.screen.zone= 'Exterior'),
            this.rocket.screen.selectZone('Exterior'),
            this.rocket.screen.spawnStarRain(),
            this.rocket.screen.switchNewGameScreenPosition(),
            this.rocket.screen.switchGameHistoryPosition(),
            this.rocket.switchPositions('Exterior'),
            this.rocket.restart_rocket('Exterior'),
            this.rocket.loadingRocket('Exterior')
        }
      ),
      exit: new Button(
        this.canvas,
        'images/ui/buttons/exit.png',
        '10%',
        '12%',
        64,
        125,
        '0%',
        '-38%',
        'center',
        'center',
        () => {
          this.closeUI()
        }
      ),
      remainingCreditsMessage: new Button(
        this.canvas,
        'images/ui/messages/REMAININGCREDITS-MESSAGE.png',
        '329',
        '56',
        56,
        329,
        '17',
        '86',
        'center',
        'center',
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        () => {}
      ),
      kickButton: new Button(
        this.canvas,
        'images/ui/buttons/kick.png',
        '10%',
        '12%',
        64,
        166,
        '-8%',
        '-38%',
        'bottom',
        'center',
        () => {
          this.sceneMessageBus.emit('kick', {
            player: this.nameInput.value
          })
          this.uiPlaceholder.visible = false
          this.nameInput.visible = false
          this.closeUI()
          gameController.goToJail(this.nameInput.value)
        }
      ),
      collectNowButton: new Button(
        this.canvas,
        'images/ui/buttons/collect-now.png',
        '20%',
        '20%',
        126,
        298,
        '-9%',
        '-44.1%',
        'bottom',
        'center',
        () => {
          this.update('checkWallet')
        }
      ),
      redeem: new Button(
        this.canvas,
        'images/ui/buttons/redeem-button.png',
        '14.2%',
        '15%',
        126,
        298,
        '-4%',
        '-44.1%',
        'bottom',
        'center',
        () => {
          this.closeUI()
          openExternalURL('https://www.roobet.com/') //Redeem Treasure Link
        }
      ),
      exitRightJackpot: new Button(
        this.canvas,
        'images/ui/buttons/exit-right.png',
        '10%',
        '16.5%',
        104,
        152,
        '6.5%',
        '-44.1%',
        'center',
        'center',
        () => {
          this.closeUI()
        }
      ),
      registerEmail: new Button(
        this.canvas,
        'images/ui/buttons/register_button.png',
        '14.2%',
        '15%',
        126,
        298,
        '-4%',
        '-44.1%',
        'bottom',
        'center',
        () => {
          this.closeUI()
          this.textInputSet('NPC1')
        }
      ),
      registerLeaderboard: new Button(
        this.canvas,
        'images/ui/buttons/register_button.png',
        '14.2%',
        '15%',
        126,
        298,
        '-4%',
        '-44.1%',
        'bottom',
        'center',
        () => {
          this.closeUI()
          this.textInputSet('leaderboard')
        }
      )
    }
  }
  public update(id: string) {
    switch (id) {
      case 'bet':
        this.uiPlaceholder.source = ui_bet.uiSrc
        this.buttons.yes.visible = true
        this.buttons.no.visible = true
        this.buttons.multiplier_mid.visible = true
        this.buttons.multiplier_2x.visible = true
        this.buttons.multiplier_max.visible = true
        this.betInput.visible = true
        this.timerText.visible = true
        break
      case 'betInGame':
        this.uiPlaceholder.source = ui_bet.uiSrc
        this.buttons.relaunch.visible = false
        this.buttons.exitRight.visible = false
        this.buttons.yesInGame.visible = true
        this.buttons.noInGame.visible = true
        this.buttons.multiplier_mid.visible = true
        this.buttons.multiplier_2x.visible = true
        this.buttons.multiplier_max.visible = true
        this.betInput.visible = true
        this.timerText.visible = true
        break
      case 'collectedCredits':
        this.uiPlaceholder.source = ui_collectedCredits.uiSrc
        this.buttons.collectCoins.visible = false
        this.buttons.exitRightBig.visible = false
        this.buttons.exit.visible = true
        this.buttons.exit.positionX = '0%'
        this.timerText.visible = false
        break
      case 'crash':
        this.uiPlaceholder.source = ui_crash.uiSrc
        this.uiPlaceholder.isPointerBlocker = true
        this.timerText.visible = false
        this.timer__.setTimeout_(2000, () => {
          this.uiPlaceholder.isPointerBlocker = false
          this.uiPlaceholder.source = ui_roundOver.uiSrc
          this.buttons.relaunch.visible = true
          this.buttons.exitRight.visible = true
        })
        break
      case 'mainMenu':
        this.uiPlaceholder.source = ui_mainMenu.uiSrc
        this.buttons.collectCoins.visible = true
        this.buttons.exitRightBig.visible = true
        this.timerText.visible = false
        break
      case 'ranOut':
        this.uiPlaceholder.source = ui_ranOut.uiSrc
        this.buttons.exit.visible = true
        this.buttons.exit.positionX = '1.2%'
        this.timerText.visible = false
        break
      case 'roundOver':
        this.uiPlaceholder.source = ui_roundOver.uiSrc
        this.buttons.relaunch.visible = true
        this.buttons.exitRight.visible = true
        this.timerText.visible = false
        break
      case 'badBehavior':
        this.uiPlaceholder.source = ui_badBehavior.uiSrc
        this.buttons.kickButton.visible = true
        this.timerText.visible = false
        this.nameInput.visible = true
        this.buttons.exit.visible = true
        this.buttons.exit.positionX = '10%'

        break
      case 'congratulations':
        this.uiPlaceholder.source = ui_congratulations.uiSrc
        this.timerText.visible = false
        this.buttons.exit.visible = true
        this.buttons.exit.positionX = '0%'
        break
      case 'relaunch':
        this.uiPlaceholder.source = ui_relaunch.uiSrc
        this.timerText.visible = false
        break
      case 'checkWallet':
        this.uiPlaceholder.source = ui_checkWallet.uiSrc
        this.timerText.visible = false
        this.buttons.exit.visible = true
        this.buttons.exit.positionY = '-43%'
        this.buttons.collectNowButton.visible = false
        this.buttons.exitRightBig.visible = false
        break
      case 'checkWearable':
        this.uiPlaceholder.source = ui_checkWearable.uiSrc
        this.timerText.visible = false
        this.buttons.collectNowButton.visible = true
        this.buttons.exitRightBig.visible = true
        break
      case 'leaderboard':
        this.timerText.visible = false
        this.uiPlaceholder.source = ui_leaderboard.uiSrc
        this.buttons.registerLeaderboard.visible = true
        this.buttons.exitRightJackpot.visible = true
        break
      case 'noTokens':
        this.uiPlaceholder.source = ui_noTokens.uiSrc
        this.buttons.exit.visible = true
        this.buttons.exit.positionY = '-42%'
        break
      case 'NPC1':
        this.uiPlaceholder.source = ui_NPC1.uiSrc
        this.buttons.registerEmail.visible = true
        this.buttons.exitRightJackpot.visible = true
        break
      case 'AROOTHANG':
        this.uiPlaceholder.source = ui_aroothang.uiSrc
        this.buttons.exitRightJackpot.visible = true
        this.buttons.redeem.visible = true
        break
      case 'BETONROOOO':
        this.uiPlaceholder.source = ui_betonroooo.uiSrc
        this.buttons.exitRightJackpot.visible = true
        this.buttons.redeem.visible = true
        break
      case 'HOWIEISONVACATION':
        this.uiPlaceholder.source = ui_howieisonvacation.uiSrc
        this.buttons.exitRightJackpot.visible = true
        this.buttons.redeem.visible = true
        break
      case 'LETSGOLETSROO':
        this.uiPlaceholder.source = ui_letsgoletsroo.uiSrc
        this.buttons.exitRightJackpot.visible = true
        this.buttons.redeem.visible = true
        break
      case 'ROOCUP2023':
        this.uiPlaceholder.source = ui_roocup2023.uiSrc
        this.buttons.exitRightJackpot.visible = true
        this.buttons.redeem.visible = true
        break
      case 'SEVENISMYLUCKYNUMBER':
        this.uiPlaceholder.source = ui_sevenismyluckynumber.uiSrc
        this.buttons.exitRightJackpot.visible = true
        this.buttons.redeem.visible = true
        break
      case 'TODAYISTHEROODAY':
        this.uiPlaceholder.source = ui_todayistherooday.uiSrc
        this.buttons.exitRightJackpot.visible = true
        this.buttons.redeem.visible = true
        break
      case 'METAROOLAUNCH':
        this.uiPlaceholder.source = ui_metaroolaunch.uiSrc
        this.buttons.exitRightJackpot.visible = true
        this.buttons.redeem.visible = true
        break
      case 'ROOISTHEPARTY':
        this.uiPlaceholder.source = ui_rooistheparty.uiSrc
        this.buttons.exitRightJackpot.visible = true
        this.buttons.redeem.visible = true
        break
      case 'ROOOOLLY':
        this.uiPlaceholder.source = ui_roooolly.uiSrc
        this.buttons.exitRightJackpot.visible = true
        this.buttons.redeem.visible = true
        break
      case 'WHATTHAROO':
        this.uiPlaceholder.source = ui_whattharoo.uiSrc
        this.buttons.exitRightJackpot.visible = true
        this.buttons.redeem.visible = true
        break
      case 'ROOLLERCOASTER':
        this.uiPlaceholder.source = ui_roolercoaster.uiSrc
        this.buttons.exitRightJackpot.visible = true
        this.buttons.redeem.visible = true
        break
    }
  }
  public showUI() {
    this.uiPlaceholder.visible = true
  }
  public closeUI() {
    this.uiPlaceholder.visible = false
    this.buttons.multiplier_mid.visible = false
    this.buttons.multiplier_2x.visible = false
    this.buttons.multiplier_max.visible = false
    this.buttons.yes.visible = false
    this.buttons.no.visible = false
    this.buttons.collectCoins.visible = false
    this.buttons.exitRightBig.visible = false
    this.buttons.relaunch.visible = false
    this.buttons.exitRight.visible = false
    this.buttons.exit.visible = false
    this.buttons.yesInGame.visible = false
    this.buttons.noInGame.visible = false
    this.buttons.remainingCreditsMessage.visible = false
    this.buttons.kickButton.visible = false
    this.betInput.visible = false
    this.timerText.visible = false
    this.buttons.collectNowButton.visible = false
    this.nameInput.visible = false
    this.buttons.redeem.visible = false
    this.buttons.exitRightJackpot.visible = false
    this.buttons.registerEmail.visible = false
    this.buttons.registerLeaderboard.visible = false
  }
  public hideGainLoss = () => {
    this.timer__.stopTimer(this.hideGainLossTimeout)
    this.hideGainLossTimeout = this.timer__.setTimeout_(2500, () => {
      this.lossCounter.hide()
      this.gainCounter.hide()
    })
  }
  public showLoss = (amount_lost: number) => {
    // making sure that the number is always negative
    this.creditCounter.set(Math.round(this.gameController.credit * 100) / 100)
    const amount_lost_ = Math.abs(amount_lost) * -1
    this.lossCounter.set(Math.round(amount_lost_))
    this.lossCounter.show()
    this.gainCounter.hide()
    this.hideGainLoss()
  }
  public showGain = (amount_gain: number) => {
    // making sure that the number is always positive
    const amount_gain_ = Math.abs(amount_gain)
    this.gainCounter.set(Math.round(amount_gain_))
    this.gainCounter.show()
    this.lossCounter.hide()
    this.hideGainLoss()
  }
  public applyGain = (amount_gain: number) => {
    this.showGain(amount_gain)
    this.creditCounter.increase(amount_gain)
  }
  public showMessage = (message: string) => {
    this.cornerLabel.set(message)
    this.cornerLabel.show()

    this.timer__.stopTimer(this.cornerLabelTimer)
    this.cornerLabelTimer = this.timer__.setTimeout_(1000, () => {
      this.cornerLabel.hide()
    })
  }
  textInputSet(id:string) {
    this.textInput.value = ''
    this.textInput.width = '80%'
    this.textInput.height = '260px'
    this.textInput.vAlign = 'bottom'
    this.textInput.hAlign = 'center'
    this.textInput.fontSize = 24
    this.textInput.placeholder = 'Click here to Enter your Email'
    this.textInput.hTextAlign = 'center'
    this.textInput.vTextAlign = 'center'
    this.textInput.color = Color4.Black()
    this.textInput.outlineColor = Color4.Yellow()
    this.textInput.shadowColor = Color4.Gray()
    this.textInput.shadowOffsetX = 30
    this.textInput.focusedBackground = Color4.Black()
    this.textInput.opacity = 0.85
    this.textInput.shadowBlur = 100
    this.textInput.positionY = '225px'
    this.textInput.isPointerBlocker = true
    this.textInput.textWrapping = true

    this.textInput.paddingLeft = 20
    this.textInput.paddingRight = 20
    this.textInput.paddingBottom = 20
    this.textInput.paddingTop = 20
    this.textInput.visible = true
    this.textInput.onFocus = new OnFocus(() => {
      this.submitEnter.value =
        "Press 'Enter' to submit your email to the Kangaroos."
      this.submitEnter.color = Color4.White()
      this.submitEnter.vAlign = 'top'
      this.submitEnter.hAlign = 'center'
      this.submitEnter.adaptWidth = true
      this.submitEnter.positionY = '-120'
      this.submitEnter.fontSize = 21
      this.submitEnter.visible = true

      this.rect.visible = true
      this.rect.width = '200%'
      this.rect.height = '200%'
      this.rect.color = Color4.Yellow()
      this.rect.opacity = 0.25
    })

    this.textInput.onBlur = new OnBlur(() => {
      this.rect.visible = false
      this.submitEnter.visible = false
    })
    if(id = 'NPC1') {
      this.textInput.onTextSubmit = new OnTextSubmit((x) => {
        this.submitEnter.value = 'Email Submitted to Mr.Roo!'
        this.rect.visible = false
        this.text.value = x.text
        this.textInput.visible = false
        this.textInput.value = ''
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.sendEmail(this.text.value,'NPC')
        this.text.value = ''
      })
    }
    if(id = 'leaderboard') {
      this.textInput.onTextSubmit = new OnTextSubmit((x) => {
        this.submitEnter.value = 'Email Submitted!'
        this.rect.visible = false
        this.text.value = x.text
        this.textInput.visible = false
        this.textInput.value = ''
        //Insert execute task for leaderboard database
        this.sendEmail(this.text.value,'leaderboard')
        this.textInput.value = ''
      })
    }
  }
  sendEmail = async (content: string, origin: string) => {
    try {
      const response = await signedFetch(
        'https://roobet-leaderboard-and-multiplier-socket-u65qg4m2pa-ew.a.run.app/receive',
        {
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
          body: JSON.stringify({ text: content, origin: origin }) // using the provided content here
        }
      )
      if (!response.text) {
        throw new Error('Invalid response')
      }

      const json = await JSON.parse(response.text)

    } catch {
      log('failed to reach URL')
    }
  }
}

