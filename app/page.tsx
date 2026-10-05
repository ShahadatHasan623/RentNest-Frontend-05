import HeroSection from "@/_components/public/HeroSection";
import PropertiesPage from "./(public)/properties/page";
import Navbar from "@/_components/public/Navbar";
import { getMe } from "@/services/auth";



const HomePage = async (props: Parameters<typeof PropertiesPage>[0]) => {
  const user = await getMe();

  return (
    <div>
      {/* Hero Section */}
      <Navbar user={user}></Navbar>
      <HeroSection></HeroSection>
      <PropertiesPage searchParams={props.searchParams}></PropertiesPage>
    </div>
  );
};

export default HomePage;