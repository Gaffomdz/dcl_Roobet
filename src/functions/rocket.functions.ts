import { Timer } from './timer.function'
const timer = new Timer()
function setUVs(
  plane: PlaneShape,
  start_rows: number,
  start_cols: number,
  rows: number,
  cols: number
) {
  plane.uvs = [
    // North side of unrortated plane
    start_cols + cols, //lower-right corner (inverted)
    start_rows,
    start_cols, //lower-left corner (inverted)
    start_rows,
    start_cols, //upper-left corner (inverted)
    start_rows + rows,
    start_cols + cols, //upper-right corner (inverted)
    start_rows + rows,
    // South side of unrortated plane
    start_cols, // lower-left corner (inverted)
    start_rows,
    start_cols + cols, // lower-right corner (inverted)
    start_rows,
    start_cols + cols, // upper-right corner (inverted)
    start_rows + rows,
    start_cols, // upper-left corner (inverted)
    start_rows + rows
  ]
}
function spawnRocket(x: number, y: number, z: number) {
  const rocketShape = new Entity()

  rocketShape.addComponent(
    new Transform({
      position: new Vector3(x, y, z),
      scale: new Vector3(1, 1, 1),
      rotation: new Quaternion().setEuler(0, -90, 0)
    })
  )

  rocketShape.addComponent(new GLTFShape('models/Crash_game_2d_trace.glb'))

  engine.addEntity(rocketShape)
  return rocketShape
}

export {
  setUVs,
  spawnRocket,
}
