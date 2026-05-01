import React, { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  secondaryfill?: string;
  strokewidth?: number;
  title?: string;
};

function NavCampaignsItemIcon({ fill = "currentColor", secondaryfill, ...props }: IconProps): React.ReactElement {
  secondaryfill = secondaryfill || fill;
  return (
    <svg height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill={fill}>
        <path d="M13 4L16 6V12L13 14L3 11V7Z" fill={secondaryfill} fillOpacity="0.4" />
        <path d="M13 4L16 6V12L13 14V4ZM3 7L13 4V14L3 11ZM5 12.5V16H7L7.5 12L5 12.5Z" fill={fill} fillRule="evenodd" />
      </g>
    </svg>
  );
}

export default NavCampaignsItemIcon;
