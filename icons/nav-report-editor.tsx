import React, { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  secondaryfill?: string;
  strokewidth?: number;
  title?: string;
};

function NavReportEditorIcon({ fill = "currentColor", secondaryfill, ...props }: IconProps): React.ReactElement {
  secondaryfill = secondaryfill || fill;
  return (
    <svg height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill={fill}>
        <path d="M12.5 2L15.5 5L7.5 13L4.5 13L4.5 10Z" fill={secondaryfill} fillOpacity="0.4" />
        <path d="M14 2.5L15.5 4L13.5 6L12 4.5ZM4.5 10.5L11.5 3.5L13.5 5.5L6.5 12.5H4.5ZM3 13H7V14H3ZM3 15H16V16H3Z" fill={fill} fillRule="evenodd" />
      </g>
    </svg>
  );
}

export default NavReportEditorIcon;
