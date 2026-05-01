import React, { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  secondaryfill?: string;
  strokewidth?: number;
  title?: string;
};

function AudiencesIcon({ fill = "currentColor", secondaryfill, ...props }: IconProps): React.ReactElement {
  secondaryfill = secondaryfill || fill;

  return (
    <svg height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill={fill}>
        <path
          d="M12 2.5C13.381 2.5 14.5 3.619 14.5 5C14.5 6.381 13.381 7.5 12 7.5C10.619 7.5 9.5 6.381 9.5 5C9.5 3.619 10.619 2.5 12 2.5Z"
          fill={secondaryfill}
          fillOpacity="0.4"
        />
        <path
          d="M8 16C8 13 10.5 9 13 9C15.5 9 18 13 18 16H8Z"
          fill={secondaryfill}
          fillOpacity="0.4"
        />
        <path
          d="M7 2.5C8.381 2.5 9.5 3.619 9.5 5C9.5 6.381 8.381 7.5 7 7.5C5.619 7.5 4.5 6.381 4.5 5C4.5 3.619 5.619 2.5 7 2.5Z"
          fill={fill}
        />
        <path
          d="M2 16C2 13 4.5 9 7 9C9.5 9 12 13 12 16H2Z"
          fill={fill}
        />
      </g>
    </svg>
  );
}

export default AudiencesIcon;
