import { Position } from "geojson"
import { SteplessMapState } from "../mapReducer"
import getAustriaHungaryUnion from "./austriaHungaryUnion"
import { union } from "../utility"

let ahCzechUnion: Array<Array<Position>> | undefined

export default function getAHCzechUnion(state: SteplessMapState) {
  if (ahCzechUnion) return ahCzechUnion
  const { countries } = state
  const czechiaCoordinates = countries.find(({ name }) => name === 'Czechia')?.coordinates
  const slovakiaCoordinates = countries.find(({ name }) => name === 'Slovakia')?.coordinates
  const austriaHungaryUnion = getAustriaHungaryUnion(state)
  if (austriaHungaryUnion && czechiaCoordinates && slovakiaCoordinates) {
    return ahCzechUnion = union(austriaHungaryUnion, czechiaCoordinates, slovakiaCoordinates)
  }
}
