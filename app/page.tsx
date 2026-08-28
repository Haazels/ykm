import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Bio from "@/components/Bio";
import Shop from "@/components/shop/Shop";
import Reviews from "@/components/Reviews";
import AboutVideos from "@/components/AboutVideos";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <Marquee />
      <Bio />
      <Shop />
      <Reviews />
      <AboutVideos />
      <Footer />
    </main>
  );
}
