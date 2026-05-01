import React, { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  secondaryfill?: string;
  strokewidth?: number;
  title?: string;
};

function ClicksIcon({ fill = "currentColor", secondaryfill, ...props }: IconProps) {
  secondaryfill = secondaryfill || fill;

  return (
    <svg height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill={fill}>
        {/* Cursor shadow / secondary body */}
        <path
          d="M4.25 2.25L4.25 13L7 10.25L9.25 15L11 14.25L8.75 9.5L13.25 9.5L4.25 2.25Z"
          fill={secondaryfill}
          fillOpacity="0.4"
        />
        {/* Cursor primary arrow */}
        <path
          d="M3.5 1C3.5 1 3.5 14 3.5 14L6.5 11L9 15.5L11.5 14.5L9 10H14L3.5 1Z"
          fill={fill}
          fillRule="nonzero"
        />
      </g>
    </svg>
  );
}

export default ClicksIcon;
