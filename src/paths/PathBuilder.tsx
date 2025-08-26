import modernCountries from "../modernCountriesEvery5mi.json"

const RAD2DEG = 180 / Math.PI;
const PI_4 = Math.PI / 4;

export interface PathBuilderProps {
    countryCoordinates: number[][]
}

function lat2y(lat: number) {
    return Math.log(Math.tan((lat / 90 + 1) * PI_4 )) * RAD2DEG;
}

export default function PathBuilder(props: Readonly<PathBuilderProps>) {
    const { countryCoordinates } = props
    // const country = modernCountries.Afghanistan.coordinates[0]
    const path = countryCoordinates.map(([long, lat]) => {
        return `${long + 180},${180-lat2y(lat)}`
    })
    return (
        <>
            <path fill='none' stroke='black' strokeWidth={0.1} d={`M ${path.join(' ')} Z`} />
            {/*<rect x="8" y="32" width="10" height="7" fill="none" stroke="black" />*/}
        </>
    )
}
