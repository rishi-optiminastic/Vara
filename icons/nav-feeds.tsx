import React, { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  secondaryfill?: string;
  strokewidth?: number;
  title?: string;
};

function NavFeedsIcon({ fill = "currentColor", secondaryfill, ...props }: IconProps): React.ReactElement {
  secondaryfill = secondaryfill || fill;
  return (
    <svg height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill={fill}>
        <path d="M3 3C9.075 3 14 7.925 14 14H16C16 6.82 10.18 1 3 1Z" fill={secondaryfill} fillOpacity="0.4" />
        <path d="M3 7C7.418 7 11 10.582 11 15H13C13 9.477 8.523 5 3 5ZM3 11C5.209 11 7 12.791 7 15H9C9 11.686 6.314 9 3 9ZM3 14A1 1 0 1 0 3.001 14Z" fill={fill} fillRule="evenodd" />
      </g>
    </svg>
  );
}

export default NavFeedsIcon;
