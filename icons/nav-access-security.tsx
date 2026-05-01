import React, { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  secondaryfill?: string;
  strokewidth?: number;
  title?: string;
};

function NavAccessSecurityIcon({ fill = "currentColor", secondaryfill, ...props }: IconProps): React.ReactElement {
  secondaryfill = secondaryfill || fill;
  return (
    <svg height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill={fill}>
        <path d="M9 1L2.5 4V9C2.5 12.866 5.358 16.417 9 17C12.642 16.417 15.5 12.866 15.5 9V4Z" fill={secondaryfill} fillOpacity="0.4" />
        <path d="M9 2L3.5 4.75V9C3.5 12.306 5.896 15.337 9 16C12.104 15.337 14.5 12.306 14.5 9V4.75ZM8 8V7C8 6.448 8.448 6 9 6C9.552 6 10 6.448 10 7V8H11V12H7V8ZM9 10A1 1 0 1 0 9.001 10Z" fill={fill} fillRule="evenodd" />
      </g>
    </svg>
  );
}

export default NavAccessSecurityIcon;
