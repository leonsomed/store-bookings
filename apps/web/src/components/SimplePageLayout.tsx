interface SimplePageLayoutProps {
  children: React.ReactNode;
}

export const SimplePageLayout = ({ children }: SimplePageLayoutProps) => {
  return <div className="max-w-screen-xl mx-auto p-2">{children}</div>;
};
