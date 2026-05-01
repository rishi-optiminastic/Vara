import React, { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  secondaryfill?: string;
  strokewidth?: number;
  title?: string;
};

function AssetsIcon({ fill = "currentColor", secondaryfill, ...props }: IconProps): React.ReactElement {
  secondaryfill = secondaryfill || fill;

  return (
    <svg height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill={fill}>
        <path
          d="M3 2.5H15C15.5523 2.5 16 2.9477 16 3.5V12.5C16 13.0523 15.5523 13.5 15 13.5H3C2.4477 13.5 2 13.0523 2 12.5V3.5C2 2.9477 2.4477 2.5 3 2.5Z"
          fill={secondaryfill}
          fillOpacity="0.4"
        />
        <path
          d="M2.5 12L6 7.5L9 9.5L12.5 5.5L15 12H2.5Z"
          fill={fill}
        />
        <path
          d="M5 3.25C5.69 3.25 6.25 3.81 6.25 4.5C6.25 5.19 5.69 5.75 5 5.75C4.31 5.75 3.75 5.19 3.75 4.5C3.75 3.81 4.31 3.25 5 3.25Z"
          fill={fill}
        />
      </g>
    </svg>
  );
}

export default AssetsIcon;
