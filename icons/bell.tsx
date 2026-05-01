import React, { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  secondaryfill?: string;
  strokewidth?: number;
  title?: string;
};

function BellIcon({ fill = "currentColor", secondaryfill, ...props }: IconProps): React.ReactElement {
  secondaryfill = secondaryfill || fill;

  return (
    <svg height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill={fill}>
        <path
          d="M9 2C6.515 2 4.5 4.015 4.5 6.5V11.5L3 13H15L13.5 11.5V6.5C13.5 4.015 11.485 2 9 2Z"
          fill={secondaryfill}
          fillOpacity="0.4"
        />
        <path
          fillRule="evenodd"
          d="M9 1C6.239 1 4 3.239 4 6V11.379L2.47 12.909C2.329 13.05 2.25 13.241 2.25 13.44V13.75C2.25 14.164 2.586 14.5 3 14.5H7.083C7.291 15.376 8.072 16 9 16C9.928 16 10.709 15.376 10.917 14.5H15C15.414 14.5 15.75 14.164 15.75 13.75V13.44C15.75 13.241 15.671 13.05 15.53 12.909L14 11.379V6C14 3.239 11.761 1 9 1ZM5.5 6C5.5 4.067 7.067 2.5 9 2.5C10.933 2.5 12.5 4.067 12.5 6V11.75C12.5 11.949 12.579 12.14 12.72 12.28L13.689 13.25H4.311L5.28 12.28C5.421 12.14 5.5 11.949 5.5 11.75V6ZM9 14.5C8.622 14.5 8.296 14.268 8.144 13.941C8.097 13.842 8.073 13.734 8.083 13.625V13.5H9.917V13.625C9.927 13.734 9.903 13.842 9.856 13.941C9.704 14.268 9.378 14.5 9 14.5Z"
          fill={fill}
        />
      </g>
    </svg>
  );
}

export default BellIcon;
