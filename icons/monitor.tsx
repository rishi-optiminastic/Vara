import React, { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  secondaryfill?: string;
  strokewidth?: number;
  title?: string;
};

function MonitorIcon({ fill = "currentColor", secondaryfill, ...props }: IconProps): React.ReactElement {
  const sf = secondaryfill ?? fill;
  return (
    <svg height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="2" y="3" width="14" height="9.5" rx="1.5" fill={sf} fillOpacity="0.4" />
      <path
        d="M3.5 3.5h11a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5V4a.5.5 0 0 1 .5-.5Zm0-1.25A1.75 1.75 0 0 0 1.75 4v8c0 .97.78 1.75 1.75 1.75h3.6l-.4 1.5H6a.75.75 0 0 0 0 1.5h6a.75.75 0 0 0 0-1.5h-.7l-.4-1.5h3.6A1.75 1.75 0 0 0 16.25 12V4a1.75 1.75 0 0 0-1.75-1.75h-11Z"
        fill={fill}
      />
    </svg>
  );
}

export default MonitorIcon;
