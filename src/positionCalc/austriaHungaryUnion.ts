import { Position } from "geojson"
import { SteplessMapState } from "../mapReducer"
import { getCountryByName, union } from "../utility"

let austriaHungaryUnion: Array<Array<Position>>

export default function getAustriaHungaryUnion({ countries }: SteplessMapState) {
  if (austriaHungaryUnion) return austriaHungaryUnion
  const austriaCoordinates = getCountryByName(countries, 'Austria').coordinates
  const hungaryCoordinates = getCountryByName(countries, 'Hungary').coordinates
  return austriaHungaryUnion = union(austriaCoordinates, hungaryCoordinates)
}
