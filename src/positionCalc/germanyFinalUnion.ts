import { Position } from "geojson"
import { SteplessMapState } from "../mapReducer"
import { getCountryByName, union } from "../utility"
import memellandJson from '../data/Memelland.json'
import getGermanyPolandUnion from "./germanyPolandUnion"

let germanyFinalUnion: Array<Array<Position>>

export default function getGermanyFinalUnion(state: SteplessMapState) {
  if (germanyFinalUnion) return germanyFinalUnion
  const { countries } = state
  const russiaCoordinates = getCountryByName(countries, 'Russia').coordinates
  return germanyFinalUnion = union(getGermanyPolandUnion(state), memellandJson, russiaCoordinates.slice(-2, -1))
}
