export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const Dash_SampleArray = (arr: any[]) => {
  // eslint-disable-next-line eqeqeq
  const len = arr == null ? 0 : arr.length
  return len ? arr[Math.floor(Math.random() * len)] : undefined
}
