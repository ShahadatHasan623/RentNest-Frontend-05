import HeroSection from "@/_components/public/HeroSection";
import PropertiesPage from "./(public)/properties/page";



const HomePage = async (props: Parameters<typeof PropertiesPage>[0]) => {


  return (
    <div>
      {/* Hero Section */}
      <HeroSection></HeroSection>
      <PropertiesPage searchParams={props.searchParams}></PropertiesPage>
    </div>
  );
};

export default HomePage;