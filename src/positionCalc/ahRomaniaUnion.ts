import { Position } from "geojson"
import { SteplessMapState } from "../mapReducer"
import { union } from "../utility"
import getAHSerbiaUnion from "./ahSerbiaUnion"
import exRomaniaJson from "../data/exRomania.json"

let ahRomaniaUnion: Array<Array<Position>>

export default function getAHRomaniaUnion(state: SteplessMapState) {
  if (ahRomaniaUnion) return ahRomaniaUnion
  const ahSerbiaUnion = getAHSerbiaUnion(state)
  return ahRomaniaUnion = union(ahSerbiaUnion, exRomaniaJson)
}
