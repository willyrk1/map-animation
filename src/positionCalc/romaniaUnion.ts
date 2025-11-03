import { Position } from "geojson"
import { SteplessMapState } from "../mapReducer"
import { union } from "../utility"
import neRomaniaJson from "../data/neRomania.json"

let romaniaUnion: Array<Array<Position>> | undefined

export default function getRomaniaUnion({ countries }: SteplessMapState) {
  if (romaniaUnion) return romaniaUnion
  const romaniaCoordinates = countries.find(({ name }) => name === 'Romania')?.coordinates
  if (romaniaCoordinates) {
    return romaniaUnion = union(romaniaCoordinates, neRomaniaJson)
  }
}
