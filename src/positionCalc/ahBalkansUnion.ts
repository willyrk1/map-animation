import { Position } from "geojson"
import getAHCzechUnion from "./ahCzechUnion"
import { SteplessMapState } from "../mapReducer"
import { union } from "../utility"

let ahBalkansUnion: Array<Array<Position>> | undefined

export default function getAHBalkansUnion(state: SteplessMapState) {
  if (ahBalkansUnion) return ahBalkansUnion
  const { countries } = state
  const sloveniaCoordinates = countries.find(({ name }) => name === 'Slovenia')?.coordinates
  const croatiaCoordinates = countries.find(({ name }) => name === 'Croatia')?.coordinates
  const bosniaCoordinates = countries.find(({ name }) => name === 'Bosnia and Herz.')?.coordinates
  const ahCzechUnion = getAHCzechUnion(state)
  if (ahCzechUnion && sloveniaCoordinates && croatiaCoordinates && bosniaCoordinates) {
    return ahBalkansUnion = union(ahCzechUnion, sloveniaCoordinates, croatiaCoordinates, bosniaCoordinates)
  }
}
