import { PathTransformer } from "./utility"
import React from "react";

export type TransformedPathProps = React.SVGProps<SVGPathElement> & PathTransformer

export default function TransformedPath(props: TransformedPathProps) {
  const {transformFn, ...rest} = props
  return <path {...transformFn ? transformFn(rest) : rest} />
}
