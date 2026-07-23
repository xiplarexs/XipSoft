import PageTransitionWrapper from "@/components/Animate/PageTransitionWrapper/PageTransitionWrapper";
import APP_CONFIg from "@/config/config";
import { Metadata } from "next";
import BlogWriteClient from "./BlogWriteClient";

export const metadata: Metadata = {
  title: `Write | ${APP_CONFIg.title}`,
  description: "Write a new blog post for the community.",
  robots: { index: false, follow: false },
};

export default function BlogWritePage() {
  return (
    <PageTransitionWrapper>
      <BlogWriteClient />
    </PageTransitionWrapper>
  );
}
