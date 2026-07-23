import HomePageComponent from "./HomePageComponents";

// Metadata is handled globally in layout.tsx, so page.tsx only renders the home component.
export const revalidate = 300;

export default function HomePage() {
  return <HomePageComponent />;
}
