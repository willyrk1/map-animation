import {LongLat, longLat2CSV} from "../utility"
import React from "react";

export interface LongLatPathProps {
    countryName: string
    countryCoordinates: Array<LongLat>
    pathProps?: React.SVGProps<SVGPathElement>
}

export default React.memo(function LongLatPath(props: Readonly<LongLatPathProps>) {
    const {countryName, countryCoordinates, pathProps} = props
    const path = countryCoordinates.map(longLat2CSV)
    return (
        <path name={countryName} fill='none' stroke='black' strokeWidth={0.1}
              d={`M ${path.join(' ')} Z`} {...pathProps} />
    )
})
