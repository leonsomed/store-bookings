interface ColoredTextProps {
  color: string;
  children: React.ReactNode | string;
}

export const ColoredText = ({ children, color }: ColoredTextProps) => {
  return <span className={color}>{children}</span>;
};
