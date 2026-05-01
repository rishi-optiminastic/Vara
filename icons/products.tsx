import React, { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  secondaryfill?: string;
  strokewidth?: number;
  title?: string;
};

function ProductsIcon({ fill = "currentColor", secondaryfill, ...props }: IconProps): React.ReactElement {
  secondaryfill = secondaryfill || fill;

  return (
    <svg height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill={fill}>
        <path
          d="M4 8H14V15C14 15.5523 13.5523 16 13 16H5C4.4477 16 4 15.5523 4 15V8Z"
          fill={secondaryfill}
          fillOpacity="0.4"
        />
        <path
          d="M4 8C4 5.239 6.239 3 9 3C11.761 3 14 5.239 14 8H12C12 6.343 10.657 5 9 5C7.343 5 6 6.343 6 8H4Z"
          fill={fill}
        />
      </g>
    </svg>
  );
}

export default ProductsIcon;
