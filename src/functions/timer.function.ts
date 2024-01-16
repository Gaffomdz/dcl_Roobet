import { setTimeout } from '@dcl/ecs-scene-utils'

// This is a timer function where each timer should can be stopped during its duration
export class Timer {
  private timers: boolean[] = []
  setTimeout_(ms: number, func: any) {
    this.timers.push(true)
    const timer_idx = this.timers.length - 1
    setTimeout(ms, () => {
      if (this.timers[timer_idx]) func()
    })
    return timer_idx
  }
  stopTimer(idx: number) {
    this.timers[idx] = false
  }
}
