import { PathTransformer } from "./utility"

export type TransformedPathProps = React.SVGProps<SVGPathElement> & PathTransformer

export default function TransformedPath(props: TransformedPathProps) {
  const {transformFn, ...rest} = props
  return <path {...transformFn(rest)} />
}
