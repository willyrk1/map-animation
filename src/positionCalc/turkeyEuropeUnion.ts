import { Position } from "geojson"
import { SteplessMapState } from "../mapReducer"
import { union } from "../utility"
import ottomanWestThraceJson from '../data/OttomanWestThrace.json'

let turkeyEuropeUnion: Array<Array<Position>> | undefined

export default function getTurkeyEuropeUnion({ countries }: SteplessMapState) {
  if (turkeyEuropeUnion) return turkeyEuropeUnion
  const turkeyCoordinates = countries.find(({ name }) => name === 'Turkey')?.coordinates
  if (turkeyCoordinates) {
    return turkeyEuropeUnion = union(turkeyCoordinates, ottomanWestThraceJson)
  }
}
