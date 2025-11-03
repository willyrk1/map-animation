import { Position } from "geojson"
import { SteplessMapState } from "../mapReducer"
import { union } from "../utility"
import alsaceLorraineJson from '../data/AlsaceLorraine.json'
import southJutlandJson from '../data/SouthJutland.json'

let germanyFranceDenmarkUnion: Array<Array<Position>> | undefined

export default function getGermanyFranceDenmarkUnion({ countries }: SteplessMapState) {
  if (germanyFranceDenmarkUnion) return germanyFranceDenmarkUnion
  const germanyCoordinates = countries.find(({ name }) => name === 'Germany')?.coordinates
  if (germanyCoordinates) {
    return germanyFranceDenmarkUnion = union(germanyCoordinates, alsaceLorraineJson, southJutlandJson)
  }
}
