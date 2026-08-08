import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Gallery from "@/components/Gallery";
import Reel from "@/components/Reel";
import Resume from "@/components/Resume";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { getContent } from "@/lib/getContent";

// Re-check saved content periodically so admin edits appear without a redeploy.
export const revalidate = 30;

export default async function Home() {
  const content = await getContent();

  return (
    <main>
      <Nav name={content.hero?.name} />
      <Hero hero={content.hero} />
      <About about={content.about} />
      <Gallery photos={content.photos} />
      <Reel reel={content.reel} />
      <Resume resume={content.resume} />
      <Contact contact={content.contact} />
      <Footer footer={content.footer} contact={content.contact} />
    </main>
  );
}
