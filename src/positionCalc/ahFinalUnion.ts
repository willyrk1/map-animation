import { Position } from "geojson"
import { SteplessMapState } from "../mapReducer"
import { union } from "../utility"
import getAHRomaniaUnion from "./ahRomaniaUnion"
import getGaliciaBukovinaUnion from "./galiciaBukovinaUnion"

let ahFinalUnion: Array<Array<Position>>

export default function getAHFinalUnion(state: SteplessMapState) {
  if (ahFinalUnion) return ahFinalUnion
  return ahFinalUnion = union(getAHRomaniaUnion(state), getGaliciaBukovinaUnion())
}
