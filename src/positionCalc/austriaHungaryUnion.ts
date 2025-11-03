import { Position } from "geojson"
import { SteplessMapState } from "../mapReducer"
import { union } from "../utility"

let austriaHungaryUnion: Array<Array<Position>> | undefined

export default function getAustriaHungaryUnion({ countries }: SteplessMapState) {
  if (austriaHungaryUnion) return austriaHungaryUnion
  const austriaCoordinates = countries.find(({ name }) => name === 'Austria')?.coordinates
  const hungaryCoordinates = countries.find(({ name }) => name === 'Hungary')?.coordinates
  if (austriaCoordinates && hungaryCoordinates) {
    return austriaHungaryUnion = union(austriaCoordinates, hungaryCoordinates)
  }
}
