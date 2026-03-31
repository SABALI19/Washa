import React from "react";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  fontWeight = "semibold",
  className = "",
  onClick,
}) => {
     const fontWeights = {
    light: "font-light",
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
    thin: "font-thin",
  };



  const baseStyles =
  "font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2";

const variants = {
  primary: "bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-hover)]",
  secondary:
    "bg-white text-[var(--color-primary)] rounded-md hover:bg-[var(--color-primary)] hover:text-white border border-[var(--color-primary)]",
    regular: "bg-transparent text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]",
};

  const sizes = {
    sm: "text-sm px-5 py-2",
    md: "text-base px-7 py-3",
    lg: "text-lg px-10 py-4",
    xl: "text-base px-5 py-2",
  };

  const buttonStyles = `
    ${baseStyles}
    ${variants[variant]}
    ${sizes[size]}
    ${fontWeights[fontWeight]}
    ${className}
  `;

  return (
    <button onClick={onClick} className={buttonStyles}>
      {children}
    </button>
  );
};

export default Button;
