import { getCards } from '@/lib/notion';
import { CardSlider } from '@/components/card-slider';

export const revalidate = 60; // Revalidate every minute

export default async function Home() {
  const cards = await getCards();

  return (
    <main className="min-h-screen py-12">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          Powered by DeTA
        </h1>
        <CardSlider cards={cards} />
      </div>
    </main>
  );
}
