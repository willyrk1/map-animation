import { Feature, FeatureCollection, MultiPolygon, Polygon, Position } from "geojson";
import React from "react";
import * as turf from '@turf/turf'

export interface CountryDetails {
  name: string
  coordinates: Array<Array<Position>>
  pathProps?: React.SVGProps<SVGPathElement>
}

const RAD2DEG = 180 / Math.PI;
const PI_4 = Math.PI / 4;

export function lat2y(lat: number) {
  return Math.log(Math.tan((lat / 90 + 1) * PI_4)) * RAD2DEG;
}

export function y2lat(y: number) {
  return 90 * (4 * Math.atan(Math.exp(y * Math.PI / 180)) / Math.PI - 1)
}

export function position2XY([long, lat]: Position) {
  return [long + 180, 180 - lat2y(lat)]
}

export function position2CSV(coordinates: Position) {
  return position2XY(coordinates).join(',')
}

export function position2Spaced(coordinates: Position) {
  return position2XY(coordinates).join(' ')
}

export function xy2Position([x, y]: [number, number]): Position {
  return [x - 180, y2lat(180 - y)]
}

export function isPolygonFeature(feature: Feature | undefined): feature is Feature<Polygon> {
  return feature?.geometry.type === "Polygon";
}

export function isMultiPolygonFeature(feature: Feature | undefined): feature is Feature<MultiPolygon> {
  return feature?.geometry.type === "MultiPolygon";
}

export function geoJson2CountryDetails(geoJson: FeatureCollection) {
  return geoJson.features.map(toCountryDetails)
}

export function toCountryDetails(feature: Feature): CountryDetails {
  const p = feature.properties
  const name: string = p?.name
  const geometry = feature.geometry
  let coordinates: Array<Array<Position>> | undefined = undefined
  if (geometry.type === "Polygon") {
    coordinates = geometry.coordinates
  }
  else if (geometry.type === "MultiPolygon") {
    coordinates = geometry.coordinates.flat()
  }
  else {
    coordinates = []
  }

  return { name, coordinates }
}

function paths2FeatureCollection(paths: Array<Array<Array<Position>>>) {
  return turf.featureCollection(paths.map(p => turf.multiPolygon(p.map(x => [x]))))
}

function feature2Positions(feature: Feature | null): Array<Array<Position>> {
  if (feature) {
    if (isPolygonFeature(feature))
      return feature.geometry.coordinates
    if (isMultiPolygonFeature(feature))
      return feature.geometry.coordinates.flat()
  }
  return []
}

export function union(...paths: Array<Array<Array<Position>>>): Array<Array<Position>> {
  return feature2Positions(turf.union(paths2FeatureCollection(paths))).filter(path => getArea(path) > 20)
}

export function intersect(...paths: Array<Array<Array<Position>>>): Array<Array<Position>> {
  return feature2Positions(turf.intersect(paths2FeatureCollection(paths)))
}

export function difference(...paths: Array<Array<Array<Position>>>): Array<Array<Position>> {
  return feature2Positions(turf.difference(paths2FeatureCollection(paths)))
}

interface PathArea {
  path: Array<Position>
  area: number
}

function byAreaDescending(pa1: PathArea, pa2: PathArea): number {
  return pa2.area - pa1.area
}

export function getArea(path: Array<Position>) {
  return turf.area(turf.polygon([path]))
}

export function addArea(coordinates: Array<Array<Position>>): Array<PathArea> {
  return coordinates
    .map(path => ({ path, area: getArea(path) }))
}

export function sortByArea(coordinates: Array<Array<Position>>): Array<Array<Position>> {
  return addArea(coordinates).sort(byAreaDescending).map(({ path }) => path)
}

export function getDistanceFromPositionInMiles([lon1, lat1]: Position, [lon2, lat2]: Position) {
  const R = 3958.8; // Radius of the Earth in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

export function safeGet<T>(ary: Array<T>, index: number) {
  return ary[((index % ary.length) + ary.length) % ary.length]
}

export function getCountryByName(countries: CountryDetails[], searchName: string) {
  return countries.find(({ name }) => name === searchName)!
}
