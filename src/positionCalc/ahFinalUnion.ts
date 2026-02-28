import { Position } from "geojson"
import { SteplessMapState } from "../mapReducer"
import { union } from "../utility"
import getAHRomaniaUnion from "./ahRomaniaUnion"
import galiciaJson from "../data/Galicia.json"
import bukovinaJson from "../data/Bukovina.json"

let ahFinalUnion: Array<Array<Position>>

export default function getAHFinalUnion(state: SteplessMapState) {
  if (ahFinalUnion) return ahFinalUnion
  const ahRomaniaUnion = getAHRomaniaUnion(state)
  return ahFinalUnion = union(ahRomaniaUnion, galiciaJson, bukovinaJson)
}
