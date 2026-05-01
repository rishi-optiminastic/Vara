import React, { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  secondaryfill?: string;
  strokewidth?: number;
  title?: string;
};

function NavKeywordsIcon({ fill = "currentColor", secondaryfill, ...props }: IconProps): React.ReactElement {
  secondaryfill = secondaryfill || fill;
  return (
    <svg height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill={fill}>
        <path d="M7 2H10L8 16H5ZM3 6H15V8H3ZM3 10H15V12H3Z" fill={secondaryfill} fillOpacity="0.4" />
        <path d="M6 2H9L7 16H4ZM11 2H14L12 16H9ZM2 6H14V8H2ZM4 10H16V12H4Z" fill={fill} fillRule="evenodd" />
      </g>
    </svg>
  );
}

export default NavKeywordsIcon;
