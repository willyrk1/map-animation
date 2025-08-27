import {LongLat, longLat2CSV, PathTransformer} from "../utility"
import {SVGProps} from "react";
import TransformedPath from "../TransformedPath.tsx";

export interface LongLatPathProps extends SVGProps<SVGPathElement>, PathTransformer {
    countryName: string
    countryCoordinates: Array<LongLat>
}

export default function LongLatPath(props: Readonly<LongLatPathProps>) {
    const {countryName, countryCoordinates, ...rest} = props
    const path = countryCoordinates.map(longLat2CSV)
    return (
        <TransformedPath name={countryName} fill='none' stroke='black' strokeWidth={0.1} d={`M ${path.join(' ')} Z`} {...rest} />
    )
}
