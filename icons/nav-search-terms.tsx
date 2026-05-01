import React, { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  secondaryfill?: string;
  strokewidth?: number;
  title?: string;
};

function NavSearchTermsIcon({ fill = "currentColor", secondaryfill, ...props }: IconProps): React.ReactElement {
  secondaryfill = secondaryfill || fill;
  return (
    <svg height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill={fill}>
        <path d="M7.5 2C4.462 2 2 4.462 2 7.5C2 10.538 4.462 13 7.5 13C10.538 13 13 10.538 13 7.5C13 4.462 10.538 2 7.5 2Z" fill={secondaryfill} fillOpacity="0.4" />
        <path d="M7.5 3.5C5.291 3.5 3.5 5.291 3.5 7.5C3.5 9.709 5.291 11.5 7.5 11.5C9.709 11.5 11.5 9.709 11.5 7.5C11.5 5.291 9.709 3.5 7.5 3.5ZM11.56 11.56L15.5 15.5L14.44 16.56L10.5 12.62C10.206 12.372 10.178 11.928 10.44 11.644C10.702 11.36 11.148 11.348 11.432 11.6L11.56 11.56Z" fill={fill} fillRule="evenodd" />
      </g>
    </svg>
  );
}

export default NavSearchTermsIcon;
