import { Position } from "geojson"
import { SteplessMapState } from "../mapReducer"
import { difference, getCountryByName } from "../utility"
import getRussiaPolandUnion from "./russiaPolandUnion"
import galiciaJson from "../data/Galicia.json"

let polandWestNorthUnion: Array<Array<Position>>

// The slice of Poland that goes to Germany: all of Poland minus whatever
// Russia already holds (russiaPolandUnion) and minus Galicia (which goes to
// Austria-Hungary later). Used both for the actual merge (germanyPolandUnion)
// and to preview just this slice, without implying all of Poland is German.
export default function getPolandWestNorthUnion(state: SteplessMapState) {
  if (polandWestNorthUnion) return polandWestNorthUnion
  const { countries } = state
  const polandCoordinates = getCountryByName(countries, 'Poland').coordinates
  return polandWestNorthUnion = difference(polandCoordinates, getRussiaPolandUnion(state), galiciaJson)
}
