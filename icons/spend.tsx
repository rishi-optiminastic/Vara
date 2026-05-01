import React, { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  secondaryfill?: string;
  strokewidth?: number;
  title?: string;
};

function SpendIcon({ fill = "currentColor", secondaryfill, ...props }: IconProps) {
  secondaryfill = secondaryfill || fill;

  return (
    <svg height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill={fill}>
        {/* Coin circle background */}
        <path
          d="M9 1.5C4.858 1.5 1.5 4.858 1.5 9C1.5 13.142 4.858 16.5 9 16.5C13.142 16.5 16.5 13.142 16.5 9C16.5 4.858 13.142 1.5 9 1.5Z"
          fill={secondaryfill}
          fillOpacity="0.4"
        />
        {/* Dollar vertical bar */}
        <path
          d="M9.625 4.375C9.625 4.03 9.345 3.75 9 3.75C8.655 3.75 8.375 4.03 8.375 4.375V5.093C7.108 5.384 6.25 6.388 6.25 7.5C6.25 8.836 7.343 9.75 8.75 9.75H9.25C9.803 9.75 10.25 10.197 10.25 10.75C10.25 11.303 9.803 11.75 9.25 11.75H8.75C8.197 11.75 7.75 11.303 7.75 10.75C7.75 10.405 7.47 10.125 7.125 10.125C6.78 10.125 6.5 10.405 6.5 10.75C6.5 11.862 7.358 12.866 8.625 13.157V13.625C8.625 13.97 8.905 14.25 9.25 14.25C9.595 14.25 9.875 13.97 9.875 13.625V13.107C11.142 12.816 12 11.812 12 10.5C12 9.164 10.907 8.25 9.5 8.25H9C8.447 8.25 8 7.803 8 7.25C8 6.697 8.447 6.25 9 6.25H9.5C10.053 6.25 10.5 6.697 10.5 7.25C10.5 7.595 10.78 7.875 11.125 7.875C11.47 7.875 11.75 7.595 11.75 7.25C11.75 6.138 10.892 5.134 9.625 4.843V4.375Z"
          fill={fill}
        />
      </g>
    </svg>
  );
}

export default SpendIcon;
