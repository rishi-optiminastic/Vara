import React, { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  secondaryfill?: string;
  strokewidth?: number;
  title?: string;
};

function NavLandingPagesIcon({ fill = "currentColor", secondaryfill, ...props }: IconProps): React.ReactElement {
  secondaryfill = secondaryfill || fill;
  return (
    <svg height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill={fill}>
        <path d="M4 2H11L15 6V15Q15 16 14 16H4Q3 16 3 15V3Q3 2 4 2Z" fill={secondaryfill} fillOpacity="0.4" />
        <path d="M11 2V6H15L11 2ZM5.5 8.5H12.5V9.5H5.5ZM5.5 11H12.5V12H5.5ZM5.5 13.5H10V14.5H5.5Z" fill={fill} fillRule="evenodd" />
      </g>
    </svg>
  );
}

export default NavLandingPagesIcon;
