import React, { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  secondaryfill?: string;
  strokewidth?: number;
  title?: string;
};

function NavRecommendationsIcon({ fill = "currentColor", secondaryfill, ...props }: IconProps): React.ReactElement {
  secondaryfill = secondaryfill || fill;
  return (
    <svg height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill={fill}>
        <path d="M9 2C5.686 2 3 4.686 3 8C3 10.39 4.326 12.472 6.3 13.574C6.456 13.659 6.5 13.79 6.5 13.939V14.5H11.5V13.939C11.5 13.79 11.544 13.659 11.7 13.574C13.674 12.472 15 10.39 15 8C15 4.686 12.314 2 9 2Z" fill={secondaryfill} fillOpacity="0.4" />
        <path d="M6.5 15.25H11.5V15.75H6.5ZM7.25 16H10.75V16.5H7.25ZM9 4.5C7.067 4.5 5.5 6.067 5.5 8C5.5 8.414 5.836 8.75 6.25 8.75C6.664 8.75 7 8.414 7 8C7 6.895 7.895 6 9 6C9.414 6 9.75 5.664 9.75 5.25C9.75 4.836 9.414 4.5 9 4.5Z" fill={fill} fillRule="evenodd" />
      </g>
    </svg>
  );
}

export default NavRecommendationsIcon;
