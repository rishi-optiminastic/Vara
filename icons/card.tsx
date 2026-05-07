import React, { SVGProps } from "react"

type IconProps = SVGProps<SVGSVGElement> & {
  secondaryfill?: string
  strokewidth?: number
  title?: string
}

function CardIcon({ fill = "currentColor", secondaryfill, ...props }: IconProps): React.JSX.Element {
  secondaryfill = secondaryfill || fill

  return (
    <svg height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill={fill}>
        {/* Card body */}
        <path
          d="M2 5C2 3.76 3.01 2.75 4.25 2.75H13.75C14.99 2.75 16 3.76 16 5V13C16 14.24 14.99 15.25 13.75 15.25H4.25C3.01 15.25 2 14.24 2 13V5Z"
          fill={secondaryfill}
          fillOpacity="0.4"
        />
        {/* Magnetic stripe */}
        <path
          d="M2 6.5H16V8.5H2V6.5Z"
          fill={fill}
        />
        {/* Chip */}
        <path
          d="M4.25 10.5C4.25 10.09 4.59 9.75 5 9.75H7C7.41 9.75 7.75 10.09 7.75 10.5V11.5C7.75 11.91 7.41 12.25 7 12.25H5C4.59 12.25 4.25 11.91 4.25 11.5V10.5Z"
          fill={fill}
        />
      </g>
    </svg>
  )
}

export default CardIcon
