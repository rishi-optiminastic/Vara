import React, { SVGProps } from "react"

type IconProps = SVGProps<SVGSVGElement> & {
  secondaryfill?: string
  strokewidth?: number
  title?: string
}

function BankIcon({ fill = "currentColor", secondaryfill, ...props }: IconProps): React.JSX.Element {
  secondaryfill = secondaryfill || fill

  return (
    <svg height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill={fill}>
        {/* Roof / pediment */}
        <path
          d="M9 1.5C8.84 1.5 8.68 1.55 8.55 1.65L1.55 6.65C1.27 6.85 1.18 7.21 1.34 7.51C1.5 7.81 1.86 7.93 2.16 7.79L2.5 7.62V8.25C2.5 8.66 2.84 9 3.25 9H14.75C15.16 9 15.5 8.66 15.5 8.25V7.62L15.84 7.79C16.14 7.93 16.5 7.81 16.66 7.51C16.82 7.21 16.73 6.85 16.45 6.65L9.45 1.65C9.32 1.55 9.16 1.5 9 1.5Z"
          fill={fill}
        />
        {/* Columns */}
        <path
          d="M3.75 10.25C3.34 10.25 3 10.59 3 11V14.5H4.5V11C4.5 10.59 4.16 10.25 3.75 10.25ZM7.5 10.25C7.09 10.25 6.75 10.59 6.75 11V14.5H8.25V11C8.25 10.59 7.91 10.25 7.5 10.25ZM10.5 10.25C10.09 10.25 9.75 10.59 9.75 11V14.5H11.25V11C11.25 10.59 10.91 10.25 10.5 10.25ZM14.25 10.25C13.84 10.25 13.5 10.59 13.5 11V14.5H15V11C15 10.59 14.66 10.25 14.25 10.25Z"
          fill={secondaryfill}
          fillOpacity="0.4"
        />
        {/* Base */}
        <path
          d="M2 15.75C2 15.34 2.34 15 2.75 15H15.25C15.66 15 16 15.34 16 15.75C16 16.16 15.66 16.5 15.25 16.5H2.75C2.34 16.5 2 16.16 2 15.75Z"
          fill={fill}
        />
      </g>
    </svg>
  )
}

export default BankIcon
