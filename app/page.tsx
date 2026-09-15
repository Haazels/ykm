import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Bio from "@/components/Bio";
import Shop from "@/components/shop/Shop";
import Marquee from "@/components/Marquee";
import Reviews from "@/components/Reviews";
import AboutVideos from "@/components/AboutVideos";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <Hero />
      <Navbar />
      <Bio />
      <Shop />
      <Marquee />
      <Reviews />
      <AboutVideos />
      <Footer />
    </main>
  );
}
