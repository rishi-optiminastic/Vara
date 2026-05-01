import React, { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  secondaryfill?: string;
  strokewidth?: number;
  title?: string;
};

function NavAudiencesItemIcon({ fill = "currentColor", secondaryfill, ...props }: IconProps): React.ReactElement {
  secondaryfill = secondaryfill || fill;
  return (
    <svg height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill={fill}>
        <path d="M12 8C13.657 8 15 6.657 15 5C15 3.343 13.657 2 12 2C10.343 2 9 3.343 9 5C9 6.657 10.343 8 12 8ZM12 9C9.791 9 8 10.791 8 13V16H16V13C16 10.791 14.209 9 12 9Z" fill={secondaryfill} fillOpacity="0.4" />
        <path d="M6 9C7.657 9 9 7.657 9 6C9 4.343 7.657 3 6 3C4.343 3 3 4.343 3 6C3 7.657 4.343 9 6 9ZM2 16V13C2 11.144 3.274 9.582 5 9.126C5 9.084 5 9.042 5 9H7C7 9.042 7 9.084 7 9.126C8.726 9.582 10 11.144 10 13V16Z" fill={fill} fillRule="evenodd" />
      </g>
    </svg>
  );
}

export default NavAudiencesItemIcon;
