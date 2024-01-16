export interface MusicInterface {
  [key: string]: {
    list: string[]
  }
}

export const MusicSystem: MusicInterface = {
  ['ambience']: {
    list: [
      //Casino Ambience
      'sounds/casino ambience/Large Casino Ambience Amongst Slot Machines, Gambling - QuickSounds.com.mp3'
    ]
  },
  ['poker']: {
    list: [
      //Poker & Blackjack
      'sounds/blackjack & poker/poker_cards_shuffling.mp3',
      'sounds/blackjack & poker/poker_chips_dropping.mp3',
      'sounds/blackjack & poker/poker-room.mp3'
    ]
  },
  ['slots']: {
    list: [
      //slots Machines
      'sounds/slots machines/slot_5coins.mp3',
      'sounds/slots machines/slots.mp3',
      'sounds/slots machines/win.mp3'
    ]
  },
  ['roulette']: {
    list: [
      //Roullette
      'sounds/roulette/roulette_spinball.mp3'
    ]
  }
}
