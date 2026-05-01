import React, { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  secondaryfill?: string;
  strokewidth?: number;
  title?: string;
};

function NavPreferencesIcon({ fill = "currentColor", secondaryfill, ...props }: IconProps): React.ReactElement {
  secondaryfill = secondaryfill || fill;
  return (
    <svg height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill={fill}>
        <path d="M2 4.25H16V5.75H2ZM2 8.25H16V9.75H2ZM2 12.25H16V13.75H2Z" fill={secondaryfill} fillOpacity="0.4" />
        <path d="M5 3C4.172 3 3.5 3.672 3.5 4.5C3.5 5.328 4.172 6 5 6C5.828 6 6.5 5.328 6.5 4.5C6.5 3.672 5.828 3 5 3ZM11 7C10.172 7 9.5 7.672 9.5 8.5C9.5 9.328 10.172 10 11 10C11.828 10 12.5 9.328 12.5 8.5C12.5 7.672 11.828 7 11 7ZM7 11C6.172 11 5.5 11.672 5.5 12.5C5.5 13.328 6.172 14 7 14C7.828 14 8.5 13.328 8.5 12.5C8.5 11.672 7.828 11 7 11Z" fill={fill} fillRule="evenodd" />
      </g>
    </svg>
  );
}

export default NavPreferencesIcon;
