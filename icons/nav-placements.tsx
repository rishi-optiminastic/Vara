import React, { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  secondaryfill?: string;
  strokewidth?: number;
  title?: string;
};

function NavPlacementsIcon({ fill = "currentColor", secondaryfill, ...props }: IconProps): React.ReactElement {
  secondaryfill = secondaryfill || fill;
  return (
    <svg height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill={fill}>
        <path d="M9 1.5C6.515 1.5 4.5 3.515 4.5 6C4.5 9.5 9 16.5 9 16.5C9 16.5 13.5 9.5 13.5 6C13.5 3.515 11.485 1.5 9 1.5Z" fill={secondaryfill} fillOpacity="0.4" />
        <path d="M9 4C7.619 4 6.5 5.119 6.5 6.5C6.5 7.881 7.619 9 9 9C10.381 9 11.5 7.881 11.5 6.5C11.5 5.119 10.381 4 9 4ZM5 17H13V16H5Z" fill={fill} fillRule="evenodd" />
      </g>
    </svg>
  );
}

export default NavPlacementsIcon;
