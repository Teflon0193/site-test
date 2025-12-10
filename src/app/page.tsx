import Header from "@/app/components/home/header";
import HeroSlider from "@/app/components/home/hero";
import DirectorMessage from "@/app/components/home/director-message";
import QuickAgenda from "@/app/components/home/agenda";
import VideoFocus from "@/app/components/home/video-focus";
import Partners from "@/app/components/home/partners";
import Footer from "@/app/components/home/footer";
import Programmes from "@/app/components/home/programme";

export default async function Page() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <HeroSlider />

      <Programmes />

      <DirectorMessage />

      <QuickAgenda />

      <VideoFocus />

      <Partners />

      <Footer />
    </div>
  );
}
