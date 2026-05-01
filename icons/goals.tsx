import React, { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  secondaryfill?: string;
  strokewidth?: number;
  title?: string;
};

function GoalsIcon({ fill = "currentColor", secondaryfill, ...props }: IconProps): React.ReactElement {
  secondaryfill = secondaryfill || fill;

  return (
    <svg height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill={fill}>
        <path
          d="M4.75 2L15.5 5.75L4.75 9.5V2Z"
          fill={secondaryfill}
          fillOpacity="0.4"
        />
        <path
          d="M3.25 1.5H4.75V16.5H3.25V1.5Z"
          fill={fill}
        />
      </g>
    </svg>
  );
}

export default GoalsIcon;
