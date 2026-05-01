import React, { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  secondaryfill?: string;
  strokewidth?: number;
  title?: string;
};

function NavChannelPerformanceIcon({ fill = "currentColor", secondaryfill, ...props }: IconProps): React.ReactElement {
  secondaryfill = secondaryfill || fill;
  return (
    <svg height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill={fill}>
        <path d="M3.5 2H14.5Q16 2 16 3.5V14.5Q16 16 14.5 16H3.5Q2 16 2 14.5V3.5Q2 2 3.5 2Z" fill={secondaryfill} fillOpacity="0.4" />
        <path d="M2 9.5H4.5L6.5 5.5L9 12.5L11.5 7L13 9.5H16V10.5H12.5L11.5 8.5L9 14.5L6.5 7.5L5 10.5H2Z" fill={fill} />
      </g>
    </svg>
  );
}

export default NavChannelPerformanceIcon;
