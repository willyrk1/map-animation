import { Position } from "geojson"
import { SteplessMapState } from "../mapReducer"
import { union } from "../utility"
import memellandJson from '../data/Memelland.json'
import getGermanyPolandUnion from "./germanyPolandUnion"

let germanyFinalUnion: Array<Array<Position>> | undefined

export default function getGermanyFinalUnion(state: SteplessMapState) {
  if (germanyFinalUnion) return germanyFinalUnion
  const { countries } = state
  const russiaCoordinates = countries.find(({ name }) => name === 'Russia')?.coordinates
  const germanyPolandUnion = getGermanyPolandUnion(state)
  if (germanyPolandUnion && russiaCoordinates) {
    return germanyFinalUnion = union(germanyPolandUnion, memellandJson, russiaCoordinates.slice(1, 2))
  }
}
