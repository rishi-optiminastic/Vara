import React, { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  secondaryfill?: string;
  strokewidth?: number;
  title?: string;
};

function NavProductsItemIcon({ fill = "currentColor", secondaryfill, ...props }: IconProps): React.ReactElement {
  secondaryfill = secondaryfill || fill;
  return (
    <svg height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill={fill}>
        <path d="M4.5 6H13.5L14.5 16H3.5ZM6.5 6A2.5 2.5 0 0 1 11.5 6" fill={secondaryfill} fillOpacity="0.4" />
        <path d="M6.5 6C6.5 4.619 7.619 3.5 9 3.5C10.381 3.5 11.5 4.619 11.5 6H13.5L14.5 16H3.5L4.5 6ZM9 4.5C8.172 4.5 7.5 5.172 7.5 6H10.5C10.5 5.172 9.828 4.5 9 4.5ZM7 9C7 10.105 7.895 11 9 11C10.105 11 11 10.105 11 9H12C12 10.657 10.657 12 9 12C7.343 12 6 10.657 6 9Z" fill={fill} fillRule="evenodd" />
      </g>
    </svg>
  );
}

export default NavProductsItemIcon;
