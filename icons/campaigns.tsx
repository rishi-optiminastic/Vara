import React, { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  secondaryfill?: string;
  strokewidth?: number;
  title?: string;
};

function CampaignsIcon({ fill = "currentColor", secondaryfill, ...props }: IconProps): React.ReactElement {
  secondaryfill = secondaryfill || fill;

  return (
    <svg height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill={fill}>
        <path
          d="M9 2C12.866 2 16 5.134 16 9C16 12.866 12.866 16 9 16C5.134 16 2 12.866 2 9C2 5.134 5.134 2 9 2Z"
          fill={secondaryfill}
          fillOpacity="0.4"
        />
        <path
          d="M9 4C11.761 4 14 6.239 14 9C14 11.761 11.761 14 9 14C6.239 14 4 11.761 4 9C4 6.239 6.239 4 9 4ZM9 6.5C10.381 6.5 11.5 7.619 11.5 9C11.5 10.381 10.381 11.5 9 11.5C7.619 11.5 6.5 10.381 6.5 9C6.5 7.619 7.619 6.5 9 6.5Z"
          fill={fill}
          fillRule="evenodd"
        />
        <path
          d="M9 7.75C9.69 7.75 10.25 8.31 10.25 9C10.25 9.69 9.69 10.25 9 10.25C8.31 10.25 7.75 9.69 7.75 9C7.75 8.31 8.31 7.75 9 7.75Z"
          fill={fill}
        />
      </g>
    </svg>
  );
}

export default CampaignsIcon;
