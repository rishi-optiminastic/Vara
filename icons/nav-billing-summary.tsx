import React, { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  secondaryfill?: string;
  strokewidth?: number;
  title?: string;
};

function NavBillingSummaryIcon({ fill = "currentColor", secondaryfill, ...props }: IconProps): React.ReactElement {
  secondaryfill = secondaryfill || fill;
  return (
    <svg height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill={fill}>
        <path d="M2.5 5H15.5Q16.5 5 16.5 6V13Q16.5 14 15.5 14H2.5Q1.5 14 1.5 13V6Q1.5 5 2.5 5Z" fill={secondaryfill} fillOpacity="0.4" />
        <path d="M1.5 7H16.5V9H1.5ZM4 11H7V12H4ZM9 11H12V12H9Z" fill={fill} fillRule="evenodd" />
      </g>
    </svg>
  );
}

export default NavBillingSummaryIcon;
