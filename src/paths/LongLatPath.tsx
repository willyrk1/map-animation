import { latLong2ViewBox, LongLat, longLat2CSV } from "../utility"

export interface LongLatPathProps {
    countryCoordinates: Array<LongLat>
}

export default function LongLatPath(props: Readonly<LongLatPathProps>) {
    const { countryCoordinates } = props
    const path = countryCoordinates.map(longLat2CSV)
    // const [x, y, width, height] = latLong2ViewBox(9, 49.5, 17.5, 46).split(' ')
    return (
        <>
            <path fill='none' stroke='black' strokeWidth={0.1} d={`M ${path.join(' ')} Z`} />
            {/* <rect {...{x, y, width, height}} fill="none" stroke="black" /> */}
        </>
    )
}
