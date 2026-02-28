import { Position } from "geojson"
import { SteplessMapState } from "../mapReducer"
import { getCountryByName, union } from "../utility"
import getRussiaBalticsUnion from "./russiaBalticsUnion"

let russiaBelarusUnion: Array<Array<Position>>

export default function getRussiaBelarusUnion(state: SteplessMapState) {
  if (russiaBelarusUnion) return russiaBelarusUnion
  const { countries } = state
  const belarusCoordinates = getCountryByName(countries, 'Belarus').coordinates
  const russiaBalticsUnion = getRussiaBalticsUnion(state)
  return russiaBelarusUnion = union(russiaBalticsUnion, belarusCoordinates)
}
