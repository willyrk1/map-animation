import { Position } from "geojson"
import { SteplessMapState } from "../mapReducer"
import { union } from "../utility"
import getRussiaBalticsUnion from "./russiaBalticsUnion"

let russiaBelarusUnion: Array<Array<Position>> | undefined

export default function getRussiaBelarusUnion(state: SteplessMapState) {
  if (russiaBelarusUnion) return russiaBelarusUnion
  const { countries } = state
  const belarusCoordinates = countries.find(({ name }) => name === 'Belarus')?.coordinates
  const russiaBalticsUnion = getRussiaBalticsUnion(state)
  if (russiaBalticsUnion && belarusCoordinates) {
    return russiaBelarusUnion = union(russiaBalticsUnion, belarusCoordinates)
  }
}
