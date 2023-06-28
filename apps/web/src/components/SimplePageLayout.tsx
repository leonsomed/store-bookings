import { Nav } from './Nav';

interface SimplePageLayoutProps {
  children: React.ReactNode;
}

export const SimplePageLayout = ({ children }: SimplePageLayoutProps) => {
  return (
    <>
      <Nav />
      <div className="max-w-screen-xl mx-auto p-4">{children}</div>
    </>
  );
};
