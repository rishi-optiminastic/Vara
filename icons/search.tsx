import React, { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  secondaryfill?: string;
  strokewidth?: number;
  title?: string;
};

function SearchIcon({ fill = "currentColor", secondaryfill, ...props }: IconProps): React.ReactElement {
  secondaryfill = secondaryfill || fill;

  return (
    <svg height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill={fill}>
        <circle cx="7.75" cy="7.75" r="5.25" fill={secondaryfill} fillOpacity="0.4" />
        <path
          fillRule="evenodd"
          d="M7.75 1C4.022 1 1 4.022 1 7.75C1 11.478 4.022 14.5 7.75 14.5C9.319 14.5 10.762 13.963 11.905 13.065L15.47 16.53C15.763 16.823 16.237 16.823 16.53 16.53C16.823 16.237 16.823 15.763 16.53 15.47L12.965 11.905C13.963 10.762 14.5 9.319 14.5 7.75C14.5 4.022 11.478 1 7.75 1ZM2.5 7.75C2.5 4.85 4.85 2.5 7.75 2.5C10.65 2.5 13 4.85 13 7.75C13 10.65 10.65 13 7.75 13C4.85 13 2.5 10.65 2.5 7.75Z"
          fill={fill}
        />
      </g>
    </svg>
  );
}

export default SearchIcon;
