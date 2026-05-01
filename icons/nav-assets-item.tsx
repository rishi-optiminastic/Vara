import React, { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  secondaryfill?: string;
  strokewidth?: number;
  title?: string;
};

function NavAssetsItemIcon({ fill = "currentColor", secondaryfill, ...props }: IconProps): React.ReactElement {
  secondaryfill = secondaryfill || fill;
  return (
    <svg height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill={fill}>
        <path d="M9 2L16 5.5V12.5L9 16L2 12.5V5.5Z" fill={secondaryfill} fillOpacity="0.4" />
        <path d="M9 2L16 5.5L9 9L2 5.5ZM9 9V16L2 12.5V5.5ZM9 9V16L16 12.5V5.5Z" fill={fill} fillRule="evenodd" />
      </g>
    </svg>
  );
}

export default NavAssetsItemIcon;
