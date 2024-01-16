export async function getLeaderBoard(dbname: string) {
  const url =
    'https://roobet-leaderboard-and-multiplier-socket-u65qg4m2pa-ew.a.run.app'
  try {
    const lead = url + `/all-winners?dbName=${dbname}`
    log('making a call to: ', lead)
    const response = await fetch(lead)
    const json = await response.json()
    const result = json.map((item: { name: any; score: any }) => ({
      name: item.name,
      score: item.score
    }))
    log(result)
    return result
  } catch (e) {
    log('error fetching scores from server ', e)
  }
}
export async function checkBalance(publickey: string) {
  const url =
    'https://roobet-leaderboard-and-multiplier-socket-u65qg4m2pa-ew.a.run.app'
  try {
    const lead = url + `/balance?dbName=a435662_e15366_24gt45&pK=${publickey}`
    log('making a call to: ', lead)
    const response = await fetch(lead)
    const json = await response.json()
    log()
    return json
  } catch (e) {
    log('error fetching scores from server ', e)
  }
}
