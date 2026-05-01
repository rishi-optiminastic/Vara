import React, { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  secondaryfill?: string;
  strokewidth?: number;
  title?: string;
};

function ChevronLeftIcon({ fill = "currentColor", ...props }: IconProps): React.ReactElement {
  return (
    <svg height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M11.03 3.47C11.323 3.763 11.323 4.237 11.03 4.53L6.56 9L11.03 13.47C11.323 13.763 11.323 14.237 11.03 14.53C10.737 14.823 10.263 14.823 9.97 14.53L4.97 9.53C4.677 9.237 4.677 8.763 4.97 8.47L9.97 3.47C10.263 3.177 10.737 3.177 11.03 3.47Z"
        fill={fill}
        fillRule="evenodd"
      />
    </svg>
  );
}

export default ChevronLeftIcon;
