import React, { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  secondaryfill?: string;
  strokewidth?: number;
  title?: string;
};

function PhoneIcon({ fill = "currentColor", secondaryfill, ...props }: IconProps): React.ReactElement {
  const sf = secondaryfill ?? fill;
  return (
    <svg height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="5" y="2" width="8" height="14" rx="1.5" fill={sf} fillOpacity="0.4" />
      <path
        d="M6.5 2.25A1.75 1.75 0 0 0 4.75 4v10c0 .97.78 1.75 1.75 1.75h5A1.75 1.75 0 0 0 13.25 14V4A1.75 1.75 0 0 0 11.5 2.25h-5Zm0 1.5h5a.25.25 0 0 1 .25.25v8.25h-5.5V4a.25.25 0 0 1 .25-.25ZM6.25 14v-.25h5.5V14a.25.25 0 0 1-.25.25h-5a.25.25 0 0 1-.25-.25Z"
        fill={fill}
      />
    </svg>
  );
}

export default PhoneIcon;
