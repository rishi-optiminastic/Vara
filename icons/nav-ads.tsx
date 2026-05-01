import React, { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  secondaryfill?: string;
  strokewidth?: number;
  title?: string;
};

function NavAdsIcon({ fill = "currentColor", secondaryfill, ...props }: IconProps): React.ReactElement {
  secondaryfill = secondaryfill || fill;
  return (
    <svg height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill={fill}>
        <path d="M3 3H15Q16 3 16 4V14Q16 15 15 15H3Q2 15 2 14V4Q2 3 3 3Z" fill={secondaryfill} fillOpacity="0.4" />
        <path d="M3 4H15V14H3ZM4.5 12.5L7.5 8L10 11L12 9L13.5 12.5ZM11 6A1 1 0 1 1 11.001 6Z" fill={fill} fillRule="evenodd" />
      </g>
    </svg>
  );
}

export default NavAdsIcon;
