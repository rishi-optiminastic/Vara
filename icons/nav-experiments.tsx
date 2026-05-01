import React, { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  secondaryfill?: string;
  strokewidth?: number;
  title?: string;
};

function NavExperimentsIcon({ fill = "currentColor", secondaryfill, ...props }: IconProps): React.ReactElement {
  secondaryfill = secondaryfill || fill;
  return (
    <svg height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill={fill}>
        <path d="M6.5 10.5L3.5 15Q3 16 4 16H14Q15 16 14.5 15L11.5 10.5V3H6.5Z" fill={secondaryfill} fillOpacity="0.4" />
        <path d="M7 2H11V3H7ZM6.5 10.5H11.5L14.5 15Q15 16 14 16H4Q3 16 3.5 15ZM8 12H10V13H8ZM6 13.5H7.5V14.5H6Z" fill={fill} fillRule="evenodd" />
      </g>
    </svg>
  );
}

export default NavExperimentsIcon;
