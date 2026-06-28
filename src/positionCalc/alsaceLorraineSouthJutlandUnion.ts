import { Position } from "geojson"
import { union } from "../utility"
import alsaceLorraineJson from '../data/AlsaceLorraine.json'
import southJutlandJson from '../data/SouthJutland.json'

let alsaceLorraineSouthJutlandUnion: Array<Array<Position>>

// Just Alsace-Lorraine + South Jutland, unioned together — unlike
// germanyFranceDenmarkUnion (which also includes Germany's existing
// territory, since that's what the actual merge produces), this is for
// previewing the upcoming annexation without implying all of France and
// Denmark (or Germany itself) are also "about to change." Both regions come
// from static data files rather than an existing country's shape, so unlike
// most sibling *Union functions here, this one needs no map state at all.
export default function getAlsaceLorraineSouthJutlandUnion() {
  if (alsaceLorraineSouthJutlandUnion) return alsaceLorraineSouthJutlandUnion
  return alsaceLorraineSouthJutlandUnion = union(alsaceLorraineJson, southJutlandJson)
}
