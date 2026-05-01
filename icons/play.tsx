import React, { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  secondaryfill?: string;
  strokewidth?: number;
  title?: string;
};

function PlayIcon({ fill = "currentColor", secondaryfill, ...props }: IconProps): React.ReactElement {
  secondaryfill = secondaryfill || fill;

  return (
    <svg height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill={fill}>
        <path
          d="M9 1C4.589 1 1 4.589 1 9C1 13.411 4.589 17 9 17C13.411 17 17 13.411 17 9C17 4.589 13.411 1 9 1Z"
          fill={secondaryfill}
          fillOpacity="0.4"
        />
        <path
          d="M12.5 9C12.5 8.724 12.356 8.468 12.121 8.326L7.621 5.576C7.379 5.43 7.079 5.424 6.831 5.561C6.583 5.698 6.429 5.958 6.429 6.25V11.75C6.429 12.042 6.583 12.302 6.831 12.439C6.951 12.505 7.083 12.538 7.215 12.538C7.355 12.538 7.495 12.5 7.621 12.424L12.121 9.674C12.356 9.532 12.5 9.276 12.5 9Z"
          fill={fill}
        />
      </g>
    </svg>
  );
}

export default PlayIcon;
