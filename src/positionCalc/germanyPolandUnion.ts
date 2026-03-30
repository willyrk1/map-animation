import { Position } from "geojson"
import getGermanyFranceDenmarkUnion from "./germanyFranceDenmarkUnion"
import getRussiaPolandUnion from "./russiaPolandUnion"
import { SteplessMapState } from "../mapReducer"
import { difference, getCountryByName, union } from "../utility"
import galiciaJson from "../data/Galicia.json"

let germanyPolandUnion: Array<Array<Position>>

export default function getGermanyPolandUnion(state: SteplessMapState) {
  if (germanyPolandUnion) return germanyPolandUnion
  const { countries } = state
  const polandCoordinates = getCountryByName(countries, 'Poland').coordinates
  return germanyPolandUnion = union(getGermanyFranceDenmarkUnion(state), difference(polandCoordinates, getRussiaPolandUnion(state), galiciaJson))
}
