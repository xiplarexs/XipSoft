import type { Metadata } from "next";
import EditProfileClient from "./EditProfileClient";

export const metadata: Metadata = {
  title: 'Profili Düzenle | XipSoft',
  robots: { index: false, follow: false },
};

export default function EditProfilePage() {
  return <EditProfileClient />;
}
