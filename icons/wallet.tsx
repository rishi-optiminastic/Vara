import React, { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  secondaryfill?: string;
  strokewidth?: number;
  title?: string;
};

function WalletIcon({ fill = "currentColor", secondaryfill, ...props }: IconProps) {
  secondaryfill = secondaryfill || fill;

  return (
    <svg height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill={fill}>
        {/* Wallet body */}
        <path
          d="M1.75 5C1.75 3.757 2.757 2.75 4 2.75H14C15.243 2.75 16.25 3.757 16.25 5V13C16.25 14.243 15.243 15.25 14 15.25H4C2.757 15.25 1.75 14.243 1.75 13V5Z"
          fill={secondaryfill}
          fillOpacity="0.4"
        />
        {/* Card slot / inner pocket */}
        <path
          d="M11.25 7.75C10.836 7.75 10.5 8.086 10.5 8.5C10.5 8.914 10.836 9.25 11.25 9.25H13.25C13.664 9.25 14 8.914 14 8.5C14 8.086 13.664 7.75 13.25 7.75H11.25Z"
          fill={fill}
          fillRule="evenodd"
        />
        {/* Top edge / card flap */}
        <path
          d="M1.75 7H16.25V5C16.25 3.757 15.243 2.75 14 2.75H4C2.757 2.75 1.75 3.757 1.75 5V7Z"
          fill={fill}
          fillRule="evenodd"
        />
      </g>
    </svg>
  );
}

export default WalletIcon;
