import React, { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  secondaryfill?: string;
  strokewidth?: number;
  title?: string;
};

function OnChainIcon({ fill = "currentColor", secondaryfill, ...props }: IconProps) {
  secondaryfill = secondaryfill || fill;

  return (
    <svg height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill={fill}>
        {/* Left chain link (secondary) */}
        <path
          d="M6.5 6C4.567 6 3 7.567 3 9.5C3 11.433 4.567 13 6.5 13H8C8.828 13 9.5 12.328 9.5 11.5C9.5 10.672 8.828 10 8 10H6.5C6.224 10 6 9.776 6 9.5C6 9.224 6.224 9 6.5 9H8C8.828 9 9.5 8.328 9.5 7.5C9.5 6.672 8.828 6 8 6H6.5Z"
          fill={secondaryfill}
          fillOpacity="0.4"
        />
        {/* Right chain link (primary) */}
        <path
          d="M10 6C9.172 6 8.5 6.672 8.5 7.5C8.5 8.328 9.172 9 10 9H11.5C11.776 9 12 9.224 12 9.5C12 9.776 11.776 10 11.5 10H10C9.172 10 8.5 10.672 8.5 11.5C8.5 12.328 9.172 13 10 13H11.5C13.433 13 15 11.433 15 9.5C15 7.567 13.433 6 11.5 6H10Z"
          fill={fill}
        />
        {/* Sparkle top */}
        <path
          d="M13 1.5C13.276 1.5 13.5 1.724 13.5 2V3H14.5C14.776 3 15 3.224 15 3.5C15 3.776 14.776 4 14.5 4H13.5V5C13.5 5.276 13.276 5.5 13 5.5C12.724 5.5 12.5 5.276 12.5 5V4H11.5C11.224 4 11 3.776 11 3.5C11 3.224 11.224 3 11.5 3H12.5V2C12.5 1.724 12.724 1.5 13 1.5Z"
          fill={fill}
        />
      </g>
    </svg>
  );
}

export default OnChainIcon;
