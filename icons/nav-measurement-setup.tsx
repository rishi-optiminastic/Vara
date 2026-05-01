import React, { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  secondaryfill?: string;
  strokewidth?: number;
  title?: string;
};

function NavMeasurementSetupIcon({ fill = "currentColor", secondaryfill, ...props }: IconProps): React.ReactElement {
  secondaryfill = secondaryfill || fill;
  return (
    <svg height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill={fill}>
        <path d="M2 7H16Q16.5 7 16.5 7.5V10.5Q16.5 11 16 11H2Q1.5 11 1.5 10.5V7.5Q1.5 7 2 7Z" fill={secondaryfill} fillOpacity="0.4" />
        <path d="M2 7H16V11H2ZM4 7V9.5H5V7ZM7 7V9.5H8V7ZM10 7V9.5H11V7ZM13 7V9.5H14V7Z" fill={fill} fillRule="evenodd" />
      </g>
    </svg>
  );
}

export default NavMeasurementSetupIcon;
