interface HeadingProps {
  children: React.ReactNode | string;
}

export const Heading = ({ children }: HeadingProps) => {
  return (
    <h1 className="m-0 text-3xl font-medium leading-tight text-primary">
      {children}
    </h1>
  );
};
