import {position2CSV} from "./utility"
import React from "react";
import {Position} from "geojson";

export interface PositionPathProps {
    countryName: string
    countryCoordinates: Array<Position>
    pathProps?: React.SVGProps<SVGPathElement>
}

export default React.memo(function PositionPath(props: Readonly<PositionPathProps>) {
    const {countryName, countryCoordinates, pathProps} = props
    const path = countryCoordinates.map(position2CSV)
    return (
        <path name={countryName} fill='none' stroke='black' strokeWidth={0.1}
              d={`M ${path.join(' ')} Z`} {...pathProps} />
    )
})
