import { Position } from "geojson"
import { union } from "../utility"
import galiciaJson from "../data/Galicia.json"
import bukovinaJson from "../data/Bukovina.json"

let galiciaBukovinaUnion: Array<Array<Position>>

export default function getGaliciaBukovinaUnion() {
  if (galiciaBukovinaUnion) return galiciaBukovinaUnion
  return galiciaBukovinaUnion = union(galiciaJson, bukovinaJson)
}
