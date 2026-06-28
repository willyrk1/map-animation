import { Position } from "geojson"
import { SteplessMapState } from "../mapReducer"
import { getCountryByName, union } from "../utility"

let czechSlovakiaUnion: Array<Array<Position>>

export default function getCzechSlovakiaUnion(state: SteplessMapState) {
  if (czechSlovakiaUnion) return czechSlovakiaUnion
  const { countries } = state
  const czechiaCoordinates = getCountryByName(countries, 'Czechia').coordinates
  const slovakiaCoordinates = getCountryByName(countries, 'Slovakia').coordinates
  return czechSlovakiaUnion = union(czechiaCoordinates, slovakiaCoordinates)
}
