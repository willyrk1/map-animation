import { Position } from "geojson"
import getAHCzechUnion from "./ahCzechUnion"
import { SteplessMapState } from "../mapReducer"
import { getCountryByName, union } from "../utility"

let ahBalkansUnion: Array<Array<Position>>

export default function getAHBalkansUnion(state: SteplessMapState) {
  if (ahBalkansUnion) return ahBalkansUnion
  const { countries } = state
  const sloveniaCoordinates = getCountryByName(countries, 'Slovenia').coordinates
  const croatiaCoordinates = getCountryByName(countries, 'Croatia').coordinates
  const bosniaCoordinates = getCountryByName(countries, 'Bosnia and Herz.').coordinates
  const ahCzechUnion = getAHCzechUnion(state)
  return ahBalkansUnion = union(ahCzechUnion, sloveniaCoordinates, croatiaCoordinates, bosniaCoordinates)
}
