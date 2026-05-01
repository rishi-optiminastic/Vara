import React, { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  secondaryfill?: string;
  strokewidth?: number;
  title?: string;
};

function NavDashboardsIcon({ fill = "currentColor", secondaryfill, ...props }: IconProps): React.ReactElement {
  secondaryfill = secondaryfill || fill;
  return (
    <svg height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill={fill}>
        <path d="M3.5 2H14.5Q16 2 16 3.5V14.5Q16 16 14.5 16H3.5Q2 16 2 14.5V3.5Q2 2 3.5 2Z" fill={secondaryfill} fillOpacity="0.4" />
        <path d="M3 3H9V10H3ZM10 3H15V7H10ZM10 8H15V15H10ZM3 11H9V15H3Z" fill={fill} fillRule="evenodd" />
      </g>
    </svg>
  );
}

export default NavDashboardsIcon;
