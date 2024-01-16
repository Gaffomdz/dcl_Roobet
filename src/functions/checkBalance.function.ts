export async function checkBalance(publickey: string) {
  const url =
    'https://roobet-leaderboard-and-multiplier-socket-u65qg4m2pa-ew.a.run.app'
  try {
    const lead = url + `/balance?dbName=a435662_e15366_24gt45&pK=${publickey}`
    log('making a call to: ', lead)
    const response = await fetch(lead)
    const json = await response.json()
    const balance = json.balance
    return balance
  } catch (e) {
    log('error fetching scores from server ', e)
  }
}

export async function atmDb(publickey: string | null | undefined) {
  // TODO: Look into this with Ian (hackable endpoint)
  const url =
    'https://roobet-leaderboard-and-multiplier-socket-u65qg4m2pa-ew.a.run.app'
  try {
    const lead =
      url +
      `/increment?dbName=a435662_e15366_24gt45&credits=100&pK=${publickey}`
    log('making a call to: ', lead)
    const response = await fetch(lead)
    const json = await response.json()
    return json
  } catch (e) {
    log('error fetching scores from server ', e)
  }
}
export async function nftbalancedb(publickey: string | undefined) {
  const url =
    'https://roobet-leaderboard-and-multiplier-socket-u65qg4m2pa-ew.a.run.app'
  try {
    const lead =
      url + `/sustract?dbName=a435662_e15366_24gt45&credits=250&pK=${publickey}`
    log('making a call to: ', lead)
    const response = await fetch(lead)
    const json = await response.json()
    return json
  } catch (e) {
    log('error fetching scores from server ', e)
  }
}
