import { Position } from "geojson"
import { SteplessMapState } from "../mapReducer"
import { difference, union } from "../utility"
import southDobrujaJson from "../data/SouthDobruja.json"
import getRomaniaUnion from "./romaniaUnion"
import getAHFinalUnion from "./ahFinalUnion"

let romaniaBulgariaUnion: Array<Array<Position>>

export default function getRomaniaBulgariaUnion(state: SteplessMapState) {
  if (romaniaBulgariaUnion) return romaniaBulgariaUnion
  const romaniaUnion = getRomaniaUnion(state)
  const ahFinalUnion = getAHFinalUnion(state)
  const smallRomania = difference(romaniaUnion, ahFinalUnion)
  return romaniaBulgariaUnion = union(smallRomania, southDobrujaJson)
}
