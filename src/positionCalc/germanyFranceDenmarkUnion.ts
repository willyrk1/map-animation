import { Position } from "geojson"
import { SteplessMapState } from "../mapReducer"
import { getCountryByName, union } from "../utility"
import getAlsaceLorraineSouthJutlandUnion from "./alsaceLorraineSouthJutlandUnion"

let germanyFranceDenmarkUnion: Array<Array<Position>>

export default function getGermanyFranceDenmarkUnion({ countries }: SteplessMapState) {
  if (germanyFranceDenmarkUnion) return germanyFranceDenmarkUnion
  const germanyCoordinates = getCountryByName(countries, 'Germany').coordinates
  return germanyFranceDenmarkUnion = union(germanyCoordinates, getAlsaceLorraineSouthJutlandUnion())
}
