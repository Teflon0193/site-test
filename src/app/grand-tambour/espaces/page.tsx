import MainLayout from "@/app/components/layouts/MainLayout";
import EspacesPageClient from "./EspacesPageClient";

export default function EspacesGrandTambour() {
  return (
    <MainLayout transparentHeader={false}>
      <EspacesPageClient />
    </MainLayout>
  );
}
