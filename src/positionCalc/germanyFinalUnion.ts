import { Position } from "geojson"
import { SteplessMapState } from "../mapReducer"
import { union } from "../utility"
import getGermanyPolandUnion from "./germanyPolandUnion"
import getKaliningradMemelUnion from "./kaliningradMemelUnion"

let germanyFinalUnion: Array<Array<Position>>

export default function getGermanyFinalUnion(state: SteplessMapState) {
  if (germanyFinalUnion) return germanyFinalUnion
  return germanyFinalUnion = union(getGermanyPolandUnion(state), getKaliningradMemelUnion(state))
}
