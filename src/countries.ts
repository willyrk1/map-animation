import { FeatureCollection } from "geojson";
import modernGeoJson from "./data/custom.hires.geo.json"
import { geoJson2CountryDetails } from "./utility";

export function getCountriesHighRes() {
  return geoJson2CountryDetails(modernGeoJson as FeatureCollection)
}
