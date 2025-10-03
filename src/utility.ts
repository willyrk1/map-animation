import { Feature, FeatureCollection, Polygon, Position } from "geojson";
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

export function position2CSV([long, lat]: Position) {
  return `${long + 180},${180 - lat2y(lat)}`
}

export function xy2Position([x, y]: [number, number]): Position {
  return [x - 180, y2lat(180 - y)]
}

export function position2ViewBox(left: number, top: number, right: number, bottom: number) {
  const bottomY = lat2y(bottom)
  const topY = lat2y(top)
  return `${left + 180} ${180 - topY} ${right - left} ${topY - bottomY}`
}

export function viewBoxFromString(viewBoxString: string) {
  const [x, y, width, height] = viewBoxString.split(' ').map(v => +v)
  return { x, y, width, height }
}

export function isPolygonFeature(feature: Feature | undefined): feature is Feature<Polygon> {
  return feature?.geometry.type === "Polygon";
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

export function union(...paths: Array<Array<Array<Position>>>): Array<Array<Position>> {
  const unioned = turf.union(turf.featureCollection(paths.map(p => turf.polygon(p))))
  const polygon = unioned && isPolygonFeature(unioned) ? unioned.geometry.coordinates : []
  return polygon
}

export function intersect(...paths: Array<Array<Array<Position>>>): Array<Array<Position>> {
  const intersected = turf.intersect(turf.featureCollection(paths.map(p => turf.polygon(p))))
  const polygon = intersected && isPolygonFeature(intersected) ? intersected.geometry.coordinates : []
  return polygon
}

export function difference(...paths: Array<Array<Array<Position>>>): Array<Array<Position>> {
  const differenced = turf.difference(turf.featureCollection(paths.map(p => turf.polygon(p))))
  const polygon = differenced && isPolygonFeature(differenced) ? differenced.geometry.coordinates : []
  return polygon
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
