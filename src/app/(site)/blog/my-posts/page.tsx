import PageTransitionWrapper from "@/components/Animate/PageTransitionWrapper/PageTransitionWrapper";
import APP_CONFIg from "@/config/config";
import { Metadata } from "next";
import MyPostsClient from "./MyPostsClient";

export const metadata: Metadata = {
  title: `My Blogs | ${APP_CONFIg.title}`,
  description: "Manage your blogs.",
  robots: { index: false, follow: false },
};

export default function MyPostsPage() {
  return (
    <PageTransitionWrapper>
      <MyPostsClient />
    </PageTransitionWrapper>
  );
}
