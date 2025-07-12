// app/store/page.tsx
"use client";

import { Navigation } from "@/components/ui/Navigation";
import { Footer } from "@/components/ui/Footer";
import { useSeasonalColors } from "@/contexts/ThemeContext";
import {
  ShoppingCart,
  Star,
  Heart,
  Package,
  Truck,
  Shield,
  Gift,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    icon: Package,
    title: "Apparel",
    description: "Result Road branded clothing and accessories",
    itemCount: "12 items",
  },
  {
    icon: Gift,
    title: "Equipment",
    description: "Adaptive fitness equipment and accessories",
    itemCount: "8 items",
  },
  {
    icon: Heart,
    title: "Wellness",
    description: "Health and wellness products",
    itemCount: "6 items",
  },
  {
    icon: Star,
    title: "Gifts",
    description: "Perfect gifts for participants and supporters",
    itemCount: "10 items",
  },
];

const featuredProducts = [
  {
    name: "Result Road Performance T-Shirt",
    price: "$29.95",
    originalPrice: "$39.95",
    category: "Apparel",
    rating: 4.8,
    reviews: 24,
    description:
      "Comfortable, moisture-wicking performance tee with Result Road logo.",
    features: [
      "Moisture-wicking fabric",
      "Comfortable fit",
      "Durable design",
      "Available in multiple colors",
    ],
    image: "1.jpg",
    featured: true,
    sale: true,
  },
  {
    name: "Adaptive Exercise Kit",
    price: "$89.95",
    category: "Equipment",
    rating: 4.9,
    reviews: 18,
    description:
      "Complete kit of adaptive exercise equipment for home workouts.",
    features: [
      "Resistance bands",
      "Balance disc",
      "Exercise guide",
      "Storage bag included",
    ],
    image: "2.jpg",
    featured: true,
    sale: false,
  },
  {
    name: "Result Road Water Bottle",
    price: "$19.95",
    category: "Accessories",
    rating: 4.7,
    reviews: 32,
    description:
      "Insulated stainless steel water bottle with motivational quotes.",
    features: [
      "Double-wall insulation",
      "24oz capacity",
      "Leak-proof design",
      "Dishwasher safe",
    ],
    image: "3.jpg",
    featured: false,
    sale: false,
  },
  {
    name: "Wellness Journal",
    price: "$24.95",
    category: "Wellness",
    rating: 4.6,
    reviews: 15,
    description:
      "Guided journal for tracking fitness goals and mental wellness.",
    features: [
      "12-week format",
      "Goal tracking pages",
      "Reflection prompts",
      "Progress charts",
    ],
    image: "4.jpg",
    featured: false,
    sale: false,
  },
  {
    name: "Result Road Hoodie",
    price: "$54.95",
    category: "Apparel",
    rating: 4.9,
    reviews: 28,
    description: "Premium quality hoodie with embroidered Result Road logo.",
    features: [
      "Cotton blend material",
      "Comfortable fit",
      "Kangaroo pocket",
      "Unisex design",
    ],
    image: "1.jpg",
    featured: true,
    sale: false,
  },
  {
    name: "Mindfulness Card Deck",
    price: "$16.95",
    category: "Wellness",
    rating: 4.5,
    reviews: 12,
    description:
      "52 cards with mindfulness exercises and motivational messages.",
    features: [
      "52 unique cards",
      "Portable size",
      "Daily exercises",
      "Beautiful illustrations",
    ],
    image: "2.jpg",
    featured: false,
    sale: false,
  },
];

const storeFeatures = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Free shipping on orders over $50 within Australia",
  },
  {
    icon: Shield,
    title: "Quality Guarantee",
    description: "100% satisfaction guarantee on all products",
  },
  {
    icon: Heart,
    title: "Community Support",
    description: "Proceeds support Result Road programs and participants",
  },
  {
    icon: Gift,
    title: "Gift Options",
    description: "Gift wrapping and personalized messages available",
  },
];

export default function StorePage() {
  const seasonalColors = useSeasonalColors();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navigation />

      {/* Hero Section with Background Image */}
      <section className="relative h-screen overflow-hidden flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/1.jpg" // Replace with your desired background image path
            alt="Result Road store background"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40 dark:bg-black/60"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              Result Road Store
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              Shop Result Road branded merchandise and adaptive fitness
              equipment. Every purchase supports our community programs and
              participants.
            </p>
          </div>
        </div>
      </section>

      {/* Store Features */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {storeFeatures.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 hover:shadow-lg transition-all duration-300"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: `${seasonalColors.primary}20` }}
                >
                  <feature.icon
                    className="w-8 h-8"
                    style={{ color: seasonalColors.primary }}
                  />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Shop by Category
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Browse our carefully curated selection of products across
              different categories.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: `${seasonalColors.primary}20` }}
                >
                  <category.icon
                    className="w-8 h-8"
                    style={{ color: seasonalColors.primary }}
                  />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                  {category.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  {category.description}
                </p>
                <span
                  className="text-sm font-semibold"
                  style={{ color: seasonalColors.primary }}
                >
                  {category.itemCount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Featured Products
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Discover our most popular items and latest additions to the Result
              Road store.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <div
                key={index}
                className={`bg-slate-50 dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] ${
                  product.featured ? "ring-2 ring-opacity-50" : ""
                }`}
                style={
                  product.featured
                    ? { boxShadow: `0 0 0 2px ${seasonalColors.primary}40` }
                    : {}
                }
              >
                {product.sale && (
                  <div
                    className="px-4 py-2 text-white text-sm font-semibold"
                    style={{ backgroundColor: "#ef4444" }}
                  >
                    ON SALE
                  </div>
                )}

                <div className="relative h-48">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute top-4 right-4">
                    <button className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-md hover:bg-white transition-colors">
                      <Heart className="w-5 h-5 text-slate-600" />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-sm font-medium px-2 py-1 rounded"
                      style={{
                        backgroundColor: `${seasonalColors.primary}20`,
                        color: seasonalColors.primary,
                      }}
                    >
                      {product.category}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-current text-yellow-400" />
                      <span className="text-sm text-slate-600 dark:text-slate-300">
                        {product.rating} ({product.reviews})
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    {product.name}
                  </h3>

                  <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    {product.features
                      .slice(0, 2)
                      .map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-center space-x-2"
                        >
                          <div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: seasonalColors.primary }}
                          />
                          <span className="text-slate-600 dark:text-slate-300 text-sm">
                            {feature}
                          </span>
                        </div>
                      ))}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span
                        className="text-2xl font-bold"
                        style={{ color: seasonalColors.primary }}
                      >
                        {product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-slate-500 line-through text-lg">
                          {product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    className="w-full text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                    style={{ backgroundColor: seasonalColors.primary }}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center shadow-xl">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              Stay Updated on New Products
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
              Be the first to know about new merchandise, exclusive discounts,
              and special edition items.
            </p>

            <div className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent"
                style={
                  {
                    "--tw-ring-color": seasonalColors.primary,
                  } as React.CSSProperties
                }
              />
              <button
                className="px-6 py-3 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105"
                style={{ backgroundColor: seasonalColors.primary }}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-20 relative"
        style={{
          background: `linear-gradient(135deg, ${seasonalColors.primary}, ${seasonalColors.primaryHover})`,
        }}
      >
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Support Our Community
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Every purchase helps fund Result Road programs and supports our
            amazing community of participants.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-slate-900 font-semibold px-8 py-4 rounded-xl hover:bg-slate-50 transition-all duration-300 inline-flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl hover:scale-105">
              <ShoppingCart className="w-5 h-5" />
              <span>Shop Now</span>
            </button>
            <Link
              href="/about"
              className="border-2 border-white text-white font-semibold px-8 py-4 rounded-xl hover:bg-white hover:text-slate-900 hover:scale-105 transition-all duration-300 inline-flex items-center justify-center space-x-2 backdrop-blur-sm"
            >
              <span>Learn More</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
