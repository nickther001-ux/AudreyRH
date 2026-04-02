import './StarBorder.css';

interface StarBorderProps {
  as?: React.ElementType;
  className?: string;
  color?: string;
  speed?: string;
  thickness?: number;
  innerBg?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  [key: string]: unknown;
}

const StarBorder = ({
  as: Component = 'div',
  className = '',
  color = '#6B2ED8',
  speed = '8s',
  thickness = 1.5,
  innerBg = '#ffffff',
  children,
  style,
  ...rest
}: StarBorderProps) => {
  return (
    <Component
      className={`star-border-container ${className}`}
      style={{ padding: `${thickness}px`, ...(style ?? {}) }}
      {...rest}
    >
      <div
        className="border-gradient-bottom"
        style={{
          background: `radial-gradient(ellipse at center, ${color} 0%, ${color}88 25%, transparent 70%)`,
          animationDuration: speed,
        }}
      />
      <div
        className="border-gradient-top"
        style={{
          background: `radial-gradient(ellipse at center, ${color} 0%, ${color}88 25%, transparent 70%)`,
          animationDuration: speed,
        }}
      />
      <div className="inner-content" style={{ background: innerBg }}>
        {children}
      </div>
    </Component>
  );
};

export default StarBorder;
