'use client';

import { Header } from '@/components/Header';
import { HeroPanorama } from '@/components/HeroPanorama';
import { MagazineGrid } from '@/components/MagazineGrid';
import { CategoryShowcase } from '@/components/CategoryShowcase';
import { CommunityCTA } from '@/components/CommunityCTA';
import { Footer } from '@/components/Footer';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroPanorama />
        <MagazineGrid />
        <CategoryShowcase />
        <CommunityCTA />
      </main>
      <Footer />
    </>
  );
}