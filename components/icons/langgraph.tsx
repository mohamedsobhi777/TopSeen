import React from "react";

interface LangGraphLogoSVGProps {
  width?: string | number;
  height?: string | number;
  className?: string;
}

export const LangGraphLogoSVG: React.FC<LangGraphLogoSVGProps> = ({
  width = "32",
  height = "32",
  className = "",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="32" height="32" rx="6" fill="#1C64F2" />
      <path
        d="M16 8L24 12V20L16 24L8 20V12L16 8Z"
        fill="white"
        fillOpacity="0.9"
      />
      <path
        d="M16 12L20 14V18L16 20L12 18V14L16 12Z"
        fill="#1C64F2"
      />
    </svg>
  );
}; 