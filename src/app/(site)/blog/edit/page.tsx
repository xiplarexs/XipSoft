import PageTransitionWrapper from "@/components/Animate/PageTransitionWrapper/PageTransitionWrapper";
import APP_CONFIg from "@/config/config";
import { Metadata } from "next";
import BlogEditClient from "./BlogEditClient";

export const metadata: Metadata = {
  title: `Edit Blog | ${APP_CONFIg.title}`,
  description: "Edit your blog.",
  robots: { index: false, follow: false },
};

export default function BlogEditPage() {
  return (
    <PageTransitionWrapper>
      <BlogEditClient />
    </PageTransitionWrapper>
  );
}
