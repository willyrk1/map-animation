import { Position } from "geojson"
import { SteplessMapState } from "../mapReducer"
import { getCountryByName, union } from "../utility"

let balkanTrioUnion: Array<Array<Position>>

export default function getBalkanTrioUnion(state: SteplessMapState) {
  if (balkanTrioUnion) return balkanTrioUnion
  const { countries } = state
  const sloveniaCoordinates = getCountryByName(countries, 'Slovenia').coordinates
  const croatiaCoordinates = getCountryByName(countries, 'Croatia').coordinates
  const bosniaCoordinates = getCountryByName(countries, 'Bosnia and Herz.').coordinates
  return balkanTrioUnion = union(sloveniaCoordinates, croatiaCoordinates, bosniaCoordinates)
}
