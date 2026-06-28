import { Position } from "geojson"
import getGermanyFranceDenmarkUnion from "./germanyFranceDenmarkUnion"
import getPolandWestNorthUnion from "./polandWestNorthUnion"
import { SteplessMapState } from "../mapReducer"
import { union } from "../utility"

let germanyPolandUnion: Array<Array<Position>>

export default function getGermanyPolandUnion(state: SteplessMapState) {
  if (germanyPolandUnion) return germanyPolandUnion
  return germanyPolandUnion = union(getGermanyFranceDenmarkUnion(state), getPolandWestNorthUnion(state))
}
