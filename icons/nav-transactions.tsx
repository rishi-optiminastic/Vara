import React, { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  secondaryfill?: string;
  strokewidth?: number;
  title?: string;
};

function NavTransactionsIcon({ fill = "currentColor", secondaryfill, ...props }: IconProps): React.ReactElement {
  secondaryfill = secondaryfill || fill;
  return (
    <svg height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill={fill}>
        <path d="M2 6L6 2L6 5H16V7H6V10L2 6ZM16 12L12 16V13H2V11H12V8L16 12Z" fill={secondaryfill} fillOpacity="0.4" />
        <path d="M2 5.5L5.5 2L5.5 4.5H15V6.5H5.5V9L2 5.5ZM16 12.5L12.5 16V13.5H3V11.5H12.5V9L16 12.5Z" fill={fill} fillRule="evenodd" />
      </g>
    </svg>
  );
}

export default NavTransactionsIcon;
