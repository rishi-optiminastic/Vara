import React, { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  secondaryfill?: string;
  strokewidth?: number;
  title?: string;
};

function NavConversionsIcon({ fill = "currentColor", secondaryfill, ...props }: IconProps): React.ReactElement {
  secondaryfill = secondaryfill || fill;
  return (
    <svg height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill={fill}>
        <path d="M9 2C5.134 2 2 5.134 2 9C2 12.866 5.134 16 9 16C12.866 16 16 12.866 16 9C16 5.134 12.866 2 9 2Z" fill={secondaryfill} fillOpacity="0.4" />
        <path d="M12.5 6.5L8 11L5.5 8.5L6.5 7.5L8 9L11.5 5.5ZM9 3.5C5.962 3.5 3.5 5.962 3.5 9C3.5 12.038 5.962 14.5 9 14.5C12.038 14.5 14.5 12.038 14.5 9C14.5 5.962 12.038 3.5 9 3.5Z" fill={fill} fillRule="evenodd" />
      </g>
    </svg>
  );
}

export default NavConversionsIcon;
