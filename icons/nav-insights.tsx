import React, { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  secondaryfill?: string;
  strokewidth?: number;
  title?: string;
};

function NavInsightsIcon({ fill = "currentColor", secondaryfill, ...props }: IconProps): React.ReactElement {
  secondaryfill = secondaryfill || fill;
  return (
    <svg height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill={fill}>
        <path d="M3 7H7V15H3ZM7.5 4H11.5V15H7.5ZM12 10H16V15H12Z" fill={secondaryfill} fillOpacity="0.4" fillRule="evenodd" />
        <path d="M3 13H7V15H3ZM7.5 10H11.5V15H7.5ZM12 12H16V15H12Z" fill={fill} fillRule="evenodd" />
      </g>
    </svg>
  );
}

export default NavInsightsIcon;
