interface HeadingProps {
  children: React.ReactNode | string;
}

export const Heading = ({ children }: HeadingProps) => {
  return (
    <h1 className="m-0 text-3xl font-medium leading-tight text-primary dark:text-white">
      {children}
    </h1>
  );
};

export const Subheading = ({ children }: HeadingProps) => {
  return (
    <h1 className="m-0 text-xl font-medium leading-tight text-black dark:text-white">
      {children}
    </h1>
  );
};
