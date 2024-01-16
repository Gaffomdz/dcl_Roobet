import { movePlayerToVector3 } from '@/utils/movePlayerToVector3'

export function jailRecord(passport: string | undefined): void {
  const url =
    'https://roobet-leaderboard-and-multiplier-socket-u65qg4m2pa-ew.a.run.app'
  const prison =
    url + `/checkjail?dbName=a435662_e15366_24gt45&prisoner=${passport}`
  log('making a call to: ', prison)
  fetch(prison)
    .then(async (response) => {
      const json = await response.json()
      if (json.exists) {
        // Perform actions when prisoner exists in the jail
        movePlayerToVector3(
          new Vector3(118.01, 1.38, 120.13),
          new Vector3(118.01, 1.38, 120.13)
        )
        log('YOU HAVE BEEN SENT TO PRISON')
      } else {
        // Perform actions when prisoner does not exist in the jail
        log('Player ALLOWED')
      }
    })
    .catch((e) => {
      log('error fetching scores from server ', e)
    })
}
