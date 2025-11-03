import { Position } from "geojson"
import getGermanyFranceDenmarkUnion from "./germanyFranceDenmarkUnion"
import getRussiaPolandUnion from "./russiaPolandUnion"
import { SteplessMapState } from "../mapReducer"
import { difference, union } from "../utility"
import galiciaJson from "../data/Galicia.json"

let germanyPolandUnion: Array<Array<Position>> | undefined

export default function getGermanyPolandUnion(state: SteplessMapState) {
  if (germanyPolandUnion) return germanyPolandUnion
  const { countries } = state
  const polandCoordinates = countries.find(({ name }) => name === 'Poland')?.coordinates
  const germanyFranceDenmarkUnion = getGermanyFranceDenmarkUnion(state)
  const russiaPolandUnion = getRussiaPolandUnion(state)
  if (germanyFranceDenmarkUnion && russiaPolandUnion && polandCoordinates) {
    return germanyPolandUnion = union(germanyFranceDenmarkUnion, difference(polandCoordinates, russiaPolandUnion, galiciaJson))
  }
}
