import { Position } from "geojson"
import getAHItalyUnion from "./ahItalyUnion"
import { SteplessMapState } from "../mapReducer"
import { union } from "../utility"
import vojvodinaJson from "../data/Vojvodina.json"

let ahSerbiaUnion: Array<Array<Position>>

export default function getAHSerbiaUnion(state: SteplessMapState) {
  if (ahSerbiaUnion) return ahSerbiaUnion
  const ahItalyUnion = getAHItalyUnion(state)
  return ahSerbiaUnion = union(ahItalyUnion, vojvodinaJson)
}
