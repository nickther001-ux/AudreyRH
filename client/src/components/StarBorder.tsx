import "./StarBorder.css";

type StarBorderProps<T extends React.ElementType = "button"> = {
  as?: T;
  color?: string;
  speed?: string;
  thickness?: number;
  className?: string;
  children?: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "color" | "speed" | "thickness" | "className" | "children">;

export function StarBorder<T extends React.ElementType = "button">({
  as,
  color = "#f97316",
  speed = "5s",
  thickness = 2,
  className = "",
  children,
  ...rest
}: StarBorderProps<T>) {
  const Tag = (as ?? "button") as React.ElementType;

  return (
    <Tag
      className={`star-border-container ${className}`}
      style={
        {
          "--star-color": color,
          "--star-speed": speed,
          "--star-thickness": `${thickness}px`,
        } as React.CSSProperties
      }
      {...rest}
    >
      <span className="star-border-track" aria-hidden="true" />
      <span className="star-border-mask" aria-hidden="true" />
      <span className="star-border-inner">{children}</span>
    </Tag>
  );
}
