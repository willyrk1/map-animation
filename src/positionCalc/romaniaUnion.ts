import { Position } from "geojson"
import { SteplessMapState } from "../mapReducer"
import { getCountryByName, union } from "../utility"
import neRomaniaJson from "../data/neRomania.json"

let romaniaUnion: Array<Array<Position>>

export default function getRomaniaUnion({ countries }: SteplessMapState) {
  if (romaniaUnion) return romaniaUnion
  const romaniaCoordinates = getCountryByName(countries, 'Romania').coordinates
  return romaniaUnion = union(romaniaCoordinates, neRomaniaJson)
}
