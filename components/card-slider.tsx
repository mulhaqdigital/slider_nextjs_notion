'use client';

/**
 * Card Slider Component
 * A responsive carousel that displays cards with images, titles, descriptions, and author information.
 * Built with Next.js, shadcn/ui, and Notion integration.
 * 
 * @component
 * @example
 * ```tsx
 * <CardSlider cards={notionCards} />
 * ```
 * 
 * Dependencies:
 * - shadcn/ui (Carousel, Card components)
 * - next/image (Image optimization)
 * - lucide-react (Icons)
 * - Tailwind CSS (Styling)
 */

import * as React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'; // shadcn/ui carousel component
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'; // shadcn/ui card component
import { User, Image as ImageIcon } from 'lucide-react'; // Icons from lucide-react
import Image from 'next/image';
import Link from 'next/link';
import type { Card as CardType } from '@/lib/notion';

/**
 * Props interface for the CardSlider component
 * @interface
 * @property {CardType[]} cards - Array of card data from Notion
 */
interface CardSliderProps {
  cards: CardType[];
}

export function CardSlider({ cards }: CardSliderProps) {
  return (
    // Main carousel wrapper with responsive max-width and padding
    <Carousel
      opts={{
        align: 'start',
        loop: true, // Enable infinite loop
      }}
      className="w-full max-w-6xl mx-auto px-6"
    >
      {/* Carousel content with negative margin for alignment */}
      <CarouselContent className="-ml-2 md:-ml-4">
        {cards.map((card) => (
          // Individual card item with responsive width breakpoints
          <CarouselItem 
            key={card.id} 
            className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3" // 1 card on mobile, 2 on tablet, 3 on desktop
          >
            {/* Card link wrapper with hover and focus effects */}
            <Link 
              href={card.link || '#'} 
              target={card.link ? "_blank" : undefined} 
              className="block h-full transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-xl"
            >
              {/* Main card component with gradient background */}
              <Card className="h-full overflow-hidden border-0 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 shadow-lg rounded-xl">
                {/* Image section with gradient background fallback */}
                <div className="relative w-full h-72">
                  {card.imageUrl ? (
                    <Image
                      src={card.imageUrl}
                      alt={card.title}
                      fill
                      className="object-cover rounded-xl"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    // Placeholder icon when no image is available
                    <div className="flex items-center justify-center w-full h-full bg-gray-100 dark:bg-gray-800">
                      <ImageIcon className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>
                {/* Card content section */}
                <CardHeader className="space-y-2">
                  {/* Title with single line truncation */}
                  <CardTitle className="text-xl font-bold line-clamp-1">
                    {card.title || 'Untitled'}
                  </CardTitle>
                  {/* Description with two-line truncation */}
                  <CardDescription className="text-sm line-clamp-2">
                    {card.description || 'No description available'}
                  </CardDescription>
                </CardHeader>
                {/* Author section */}
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {/* Author avatar with gradient background */}
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500">
                      <User size={14} className="text-white" />
                    </div>
                    <span className="font-medium">{card.author || 'Anonymous'}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      {/* Navigation buttons */}
      <div className="flex items-center justify-center gap-2 mt-4">
        <CarouselPrevious className="static relative translate-x-0 translate-y-0 hover:bg-blue-50 dark:hover:bg-gray-800" />
        <CarouselNext className="static relative translate-x-0 translate-y-0 hover:bg-blue-50 dark:hover:bg-gray-800" />
      </div>
    </Carousel>
  );
}

/**
 * Style References:
 * 
 * Breakpoints:
 * - Mobile: < 768px (1 card)
 * - Tablet: 768px - 1024px (2 cards)
 * - Desktop: > 1024px (3 cards)
 * 
 * Colors:
 * - Gradient backgrounds: blue-400 to purple-500
 * - Card background: white to gray-50 (light), gray-900 to gray-950 (dark)
 * - Text: Default theme colors with muted variants
 * 
 * Animations:
 * - Hover scale: 1.02
 * - Transitions: transform, colors
 * 
 * Components used from shadcn/ui:
 * - Carousel: For sliding functionality
 * - Card: Base card structure
 * 
 * Image handling:
 * - next/image for optimization
 * - object-cover for proper scaling
 * - Fallback icon from lucide-react
 * 
 * Accessibility:
 * - Focus states for keyboard navigation
 * - Alt text for images
 * - Semantic HTML structure
 */ 