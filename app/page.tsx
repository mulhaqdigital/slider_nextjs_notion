import { getCards } from '@/lib/notion';
import { CardSlider } from '@/components/card-slider';
import CallToAction from '@/components/call-to-action';
import LogoCloud from '@/components/logo-cloud'

export const revalidate = 60; // Revalidate every minute

export default async function Home() {
  const cards = await getCards();

  return (
    <main className="min-h-screen py-5">
      <div className="container mx-auto flex flex-col items-center justify-center">
        <div className="min-w-full rounded-3xl border p-4 mx-10">
          <h3 className="text-center text-4xl font-semibold lg:text-3xl">Powered by DeTA</h3>
          <p className="text-center mt-4">Developers, start building with DeTA</p>
        </div>
        <CardSlider cards={cards} />
        
        <LogoCloud />
      </div>
    </main>
  );
}
