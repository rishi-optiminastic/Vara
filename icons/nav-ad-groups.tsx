import React, { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  secondaryfill?: string;
  strokewidth?: number;
  title?: string;
};

function NavAdGroupsIcon({ fill = "currentColor", secondaryfill, ...props }: IconProps): React.ReactElement {
  secondaryfill = secondaryfill || fill;
  return (
    <svg height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill={fill}>
        <path d="M3 13H15Q16 13 16 14V15Q16 16 15 16H3Q2 16 2 15V14Q2 13 3 13Z" fill={secondaryfill} fillOpacity="0.4" />
        <path d="M4 9H14Q15 9 15 10V11Q15 12 14 12H4Q3 12 3 11V10Q3 9 4 9ZM5 5H13Q14 5 14 6V7Q14 8 13 8H5Q4 8 4 7V6Q4 5 5 5Z" fill={fill} fillRule="evenodd" />
      </g>
    </svg>
  );
}

export default NavAdGroupsIcon;
