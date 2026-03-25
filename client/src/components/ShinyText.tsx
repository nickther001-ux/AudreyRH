import './ShinyText.css';

const ShinyText = ({ 
  text, 
  disabled = false, 
  speed = 3, 
  className = '',
  color = '#1e293b', 
  shineColor = '#f97316',
  spread = 150 
}) => {
  return (
    <span
      className={`shiny-text ${disabled ? 'disabled' : ''} ${className}`}
      style={{
        '--shiny-width': `${spread}px`,
        '--shiny-color': color,
        '--shiny-shine-color': shineColor,
        '--shiny-duration': `${speed}s`,
      }}
    >
      {text}
    </span>
  );
};

export default ShinyText;
