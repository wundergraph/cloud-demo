import { cx } from "@emotion/css";
import { HTMLAttributes } from "react";
import { FiLoader } from "react-icons/fi";

type ColorScheme = "white";

interface ButtonProperties extends HTMLAttributes<HTMLButtonElement> {
  appearance?: "solid" | "outline" | "none";
  colorScheme?: ColorScheme;
  type?: "button" | "reset" | "submit";
  leftIcon?: React.ReactElement;
  rightIcon?: React.ReactElement;
  onClick?: (e?: React.MouseEvent<HTMLElement>) => void;
  size?: "small" | "large";
  loading?: boolean;
  disabled?: boolean;
  children?: React.ReactNode | React.ReactNode[];
}

const Button = ({
  className,
  appearance,
  children,
  onClick,
  type,
  loading,
  disabled,
  size,
  leftIcon: LI,
  rightIcon: RI,
  colorScheme,
  ...rest
}: ButtonProperties) => (
  <button
    className={cx(
      "group flex h-min max-w-max cursor-pointer items-center justify-center rounded-sm border border-transparent font-main font-semibold transition-all active:scale-95",

      // solid color schemes
      {
        "bg-white text-gray-800 hover:bg-gray-100":
          appearance === "solid" && colorScheme === "white",
      },

      // outline color schemes
      {
        "border-gray-300 bg-transparent text-white hover:bg-gray-100 hover:text-gray-800":
          appearance === "outline" && colorScheme === "white",
      },

      // sizes
      {
        "min-h-[44px] px-4 text-lg": size === "large",
        "min-h-[36px] px-3 text-base": size === "small",
      },

      // appearance
      {
        "!p-0": appearance === "none",
      },

      // rest
      {
        "cursor-not-allowed opacity-50": disabled,
        "cursor-not-allowed": loading,
      },
      className
    )}
    type={type}
    disabled={disabled || loading}
    onClick={(e) => !(disabled || loading) && onClick?.(e)}
    {...rest}
  >
    <FiLoader
      className={cx(
        "absolute animate-spin",
        {
          "invisible ": !loading,
        },
        {
          "text-lg": size === "large",
          "text-base": size === "small",
        }
      )}
    />
    <span
      className={cx("flex transform items-center justify-center gap-x-2", {
        "scale-0": loading,
        "scale-100": !loading,
      })}
    >
      {LI}
      {children}
      {RI}
    </span>
  </button>
);

Button.defaultProps = {
  appearance: "solid",
  type: "button",
  size: "small",
  colorScheme: "white",
};

export default Button;
