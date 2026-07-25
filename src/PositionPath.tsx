import {position2CSV} from "./utility"
import React from "react";
import {Position} from "geojson";

export interface PositionPathProps {
    countryName: string
    countryCoordinates: Array<Position>
    opacity?: number
    pathProps?: React.SVGProps<SVGPathElement>
}

export default React.memo(function PositionPath(props: Readonly<PositionPathProps>) {
    const {countryName, countryCoordinates, opacity, pathProps} = props
    const path = countryCoordinates.map(position2CSV)
    return (
        <path name={countryName} fill='none' stroke='black' strokeWidth={0.1}
              d={`M ${path.join(' ')} Z`} opacity={opacity} {...pathProps} />
    )
})
