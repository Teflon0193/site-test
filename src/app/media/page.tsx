import MainLayout from "../components/layouts/MainLayout";
import MediaPageClient from "./MediaPageClient";

export default function MediaPage() {
  return (
    <MainLayout transparentHeader={false}>
      <MediaPageClient />
    </MainLayout>
  );
}
