import HeroSection from "@/_components/public/HeroSection";
import PropertiesPage from "./(public)/properties/page";
import Navbar from "@/_components/public/Navbar";
import { getMe } from "@/services/auth";
import Footer from "@/_components/public/Footer";



const HomePage = async (props: Parameters<typeof PropertiesPage>[0]) => {
  const user = await getMe();

  return (
    <div>
      {/* Hero Section */}
      <Navbar user={user}></Navbar>
      <HeroSection></HeroSection>
      <PropertiesPage searchParams={props.searchParams}></PropertiesPage>
      <Footer></Footer>
    </div>
  );
};

export default HomePage;