import Navbar from "@/_components/public/Navbar";

const PublicLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>{children}</main>
    </div>
  );
};

export default PublicLayout;