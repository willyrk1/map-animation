export default function BasePath(props: React.SVGProps<SVGPathElement>) {
  return (
    <path
      // fill="none"
      stroke="black"
      strokeWidth={0.1}
      {...props}
    />
  )
}
