import './AccessibleButton.css';
interface ButtonProps {
  text: string;
  ariaLabel: string;
  decorationLeft?: string;
  decorationRight?: string;
  className?: string;
  onClick?: Function;
  disabled?: boolean;
}

const AccessibleLink: React.FC<ButtonProps> = ({
  text,
  decorationLeft,
  decorationRight,
  className,
  onClick,
  ariaLabel,
  disabled = false,
}) => {
  return undefined;
};

export default AccessibleLink;
