'use client';

import { Header } from '@/components/Header';
import { HeroPanorama } from '@/components/HeroPanorama';
import { HomeSearchSection } from '@/components/home/HomeSearchSection';
import { MagazineGrid } from '@/components/MagazineGrid';
import { EditorPickSection } from '@/components/EditorPickSection';
import { CommunityCTA } from '@/components/CommunityCTA';
import { Footer } from '@/components/Footer';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroPanorama />
        <HomeSearchSection />
        <MagazineGrid />
        <EditorPickSection />
        <CommunityCTA />
      </main>
      <Footer />
    </>
  );
}