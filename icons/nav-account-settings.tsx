import React, { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  secondaryfill?: string;
  strokewidth?: number;
  title?: string;
};

function NavAccountSettingsIcon({ fill = "currentColor", secondaryfill, ...props }: IconProps): React.ReactElement {
  secondaryfill = secondaryfill || fill;
  return (
    <svg height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill={fill}>
        <path d="M9 9C11.209 9 13 7.209 13 5C13 2.791 11.209 1 9 1C6.791 1 5 2.791 5 5C5 7.209 6.791 9 9 9ZM3 17C3 13.686 5.686 11 9 11C10.306 11 11.517 11.417 12.5 12.126" fill={secondaryfill} fillOpacity="0.4" />
        <path d="M9 2C7.343 2 6 3.343 6 5C6 6.657 7.343 8 9 8C10.657 8 12 6.657 12 5C12 3.343 10.657 2 9 2ZM14 12.5C14 12.5 14 11.5 13 11L12 11.5V12.5H11V13.5H12V14.5L13 15C14 14.5 14 13.5 14 13.5H15V12.5ZM13 15.5A1 1 0 1 0 13.001 15.5ZM3 17C3 13.686 5.686 11 9 11H10.5C8.668 11.762 7.27 13.313 6.78 15.215C5.527 15.712 4.462 16.75 4 17Z" fill={fill} fillRule="evenodd" />
      </g>
    </svg>
  );
}

export default NavAccountSettingsIcon;
