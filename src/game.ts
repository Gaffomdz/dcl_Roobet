import { GameController } from './classes/gameController.class'

const ws: WebSocket = new WebSocket('wss://roobet.dcl.guru/')
new GameController(ws)