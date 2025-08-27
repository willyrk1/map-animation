
export interface PathTransformer {
  transformFn?: (input: React.SVGProps<SVGPathElement>) => React.SVGProps<SVGPathElement>
}

export type LongLat = [number, number]

export interface CountryDetails {
  name: string
  coordinates: Array<Array<LongLat>>
}

const RAD2DEG = 180 / Math.PI;
const PI_4 = Math.PI / 4;

export function lat2y(lat: number) {
    return Math.log(Math.tan((lat / 90 + 1) * PI_4 )) * RAD2DEG;
}

export function longLat2CSV([long, lat]: LongLat) {
  return `${long + 180},${180 - lat2y(lat)}`
}

export function latLong2ViewBox(left: number, top: number, right: number, bottom: number) {
  const bottomY = lat2y(bottom)
  const topY = lat2y(top)
  return `${left + 180} ${180 - topY} ${right - left} ${topY - lat2y(bottom)}`
}
