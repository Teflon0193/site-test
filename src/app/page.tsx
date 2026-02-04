import MainLayout from "./components/layouts/MainLayout";
import HeroSlider from "./components/home/hero";
import DirectorMessage from "./components/home/director-message";
import QuickAgenda from "./components/home/agenda";
import ActivitySlantedGallery from "./components/home/ActivitySlantedGallery";
import VideoFocus from "./components/home/video-focus";
import Partners from "./components/home/partners";
import Programmes from "./components/home/programme";

export default async function Page() {
  return (
    <MainLayout>
      <HeroSlider />
      <Programmes />
      <DirectorMessage />
      <ActivitySlantedGallery />
      <QuickAgenda />
      <VideoFocus />
      <Partners />
    </MainLayout>
  );
}
