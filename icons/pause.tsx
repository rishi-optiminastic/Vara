import React, { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  secondaryfill?: string;
  strokewidth?: number;
  title?: string;
};

function PauseIcon({ fill = "currentColor", secondaryfill, ...props }: IconProps): React.ReactElement {
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
          d="M7.25 5.5C6.836 5.5 6.5 5.836 6.5 6.25V11.75C6.5 12.164 6.836 12.5 7.25 12.5C7.664 12.5 8 12.164 8 11.75V6.25C8 5.836 7.664 5.5 7.25 5.5ZM10.75 5.5C10.336 5.5 10 5.836 10 6.25V11.75C10 12.164 10.336 12.5 10.75 12.5C11.164 12.5 11.5 12.164 11.5 11.75V6.25C11.5 5.836 11.164 5.5 10.75 5.5Z"
          fill={fill}
          fillRule="evenodd"
        />
      </g>
    </svg>
  );
}

export default PauseIcon;
