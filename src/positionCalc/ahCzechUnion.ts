import { Position } from "geojson"
import { SteplessMapState } from "../mapReducer"
import getAustriaHungaryUnion from "./austriaHungaryUnion"
import { getCountryByName, union } from "../utility"

let ahCzechUnion: Array<Array<Position>>

export default function getAHCzechUnion(state: SteplessMapState) {
  if (ahCzechUnion) return ahCzechUnion
  const { countries } = state
  const czechiaCoordinates = getCountryByName(countries, 'Czechia').coordinates
  const slovakiaCoordinates = getCountryByName(countries, 'Slovakia').coordinates
  const austriaHungaryUnion = getAustriaHungaryUnion(state)
  return ahCzechUnion = union(austriaHungaryUnion, czechiaCoordinates, slovakiaCoordinates)
}
