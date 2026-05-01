import React, { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  secondaryfill?: string;
  strokewidth?: number;
  title?: string;
};

function NavAuctionInsightsIcon({ fill = "currentColor", secondaryfill, ...props }: IconProps): React.ReactElement {
  secondaryfill = secondaryfill || fill;
  return (
    <svg height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill={fill}>
        <path d="M10.5 2H14.5Q15.5 2 15.5 3V7Q15.5 8 14.5 8H10.5Q9.5 8 9.5 7V3Q9.5 2 10.5 2Z" fill={secondaryfill} fillOpacity="0.4" />
        <path d="M11 9L3.75 14.25Q3 14.75 2.5 14.25L2 13.75Q1.5 13.25 2 12.5L7.25 5.5ZM12 9.5H15V11H12Z" fill={fill} fillRule="evenodd" />
      </g>
    </svg>
  );
}

export default NavAuctionInsightsIcon;
