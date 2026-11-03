import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@components/common/Button'

export const AboutPage: React.FC = () => {
  const highlights = [
    {
      icon: '🌸',
      title: 'Handpicked Fresh Blooms',
      description:
        'Sourced daily at dawn from organic botanic growers, ensuring maximum freshness, vibrant colors, and unforgettable fragrances.',
      bgGradient: 'from-pink-500 to-rose-500',
      lightBg: 'bg-pink-50 text-pink-700',
    },
    {
      icon: '🍚',
      title: 'Artisan Rice & Culinary Delights',
      description:
        'Crafted with aged heritage grains, aromatic spices, and chef-curated recipes that harmonize comfort food with visual beauty.',
      bgGradient: 'from-amber-500 to-orange-500',
      lightBg: 'bg-amber-50 text-amber-700',
    },
    {
      icon: '🎨',
      title: 'Bespoke Floral Styling',
      description:
        'Every arrangement is treated as a living artwork—custom color palettes, artisan wraps, and personalized gift notes.',
      bgGradient: 'from-purple-500 to-indigo-500',
      lightBg: 'bg-purple-50 text-purple-700',
    },
    {
      icon: '🌿',
      title: 'Eco-Friendly & Sustainable',
      description:
        'Biodegradable wraps, zero chemical preservatives, recycled ribbon accents, and sustainable compost-ready packaging.',
      bgGradient: 'from-emerald-500 to-teal-500',
      lightBg: 'bg-emerald-50 text-emerald-700',
    },
  ]

  const galleryImages = [
    {
      url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
      caption: 'The Morning Petal Studio',
      badge: 'Fresh Daily',
      color: 'bg-rose-500',
    },
    {
      url: 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=800&q=80',
      caption: 'Artisan Florist Crafting',
      badge: 'Master Florists',
      color: 'bg-purple-500',
    },
    {
      url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      caption: 'Culinary Harvest Bowls',
      badge: 'Gourmet Kitchen',
      color: 'bg-amber-500',
    },
    {
      url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      caption: 'Velvet Rose Collections',
      badge: 'Premium Roses',
      color: 'bg-pink-600',
    },
    {
      url: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?auto=format&fit=crop&w=800&q=80',
      caption: 'Steamed Heritage Rice & Spices',
      badge: 'Authentic Flavors',
      color: 'bg-yellow-600',
    },
    {
      url: 'https://images.unsplash.com/photo-1469259943454-aa100abba749?auto=format&fit=crop&w=800&q=80',
      caption: 'Wildflowers & Botanical Garden',
      badge: 'Naturally Grown',
      color: 'bg-teal-600',
    },
  ]

  const milestones = [
    { number: '10,000+', label: 'Bouquets Handcrafted', color: 'text-rose-500' },
    { number: '100%', label: 'Farm-Fresh Guarantee', color: 'text-emerald-500' },
    { number: '20+', label: 'Signature Dishes & Combos', color: 'text-amber-500' },
    { number: '4.9 ★', label: 'Customer Delight Rating', color: 'text-purple-500' },
  ]

  const teamMembers = [
    {
      name: 'Elena Rostova',
      role: 'Head Floral Designer & Founder',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
      quote: 'Flowers are unspoken poetry that brighten any quiet corner of the soul.',
      tag: '🌸 Master Florist',
      badgeBg: 'bg-pink-100 text-pink-700',
    },
    {
      name: 'Chef Marcus Chen',
      role: 'Culinary Master & Rice Artisan',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80',
      quote: 'A bowl of well-cooked rice is warmth, nourishment, and centuries of tradition.',
      tag: '🍚 Executive Chef',
      badgeBg: 'bg-amber-100 text-amber-700',
    },
    {
      name: 'Aria Takahashi',
      role: 'Creative Stylist & Botanist',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80',
      quote: 'Nature gives us every color imaginable; we simply bring them into balance.',
      tag: '🌿 Botanical Artist',
      badgeBg: 'bg-emerald-100 text-emerald-700',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/60 via-amber-50/40 to-purple-50/50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        {/* Colorful Glow Blobs */}
        <div className="absolute top-0 -left-20 -z-10 h-96 w-96 rounded-full bg-pink-300 opacity-30 blur-3xl" />
        <div className="absolute top-20 right-0 -z-10 h-96 w-96 rounded-full bg-amber-300 opacity-30 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 -z-10 h-96 w-96 rounded-full bg-purple-300 opacity-25 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-amber-500/10 border border-pink-200 px-4 py-1.5 text-sm font-semibold text-pink-700">
                <span>🌺 Welcome to Bloom & Basmati</span>
              </div>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                Where{' '}
                <span className="bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">
                  Fresh Flowers
                </span>{' '}
                Meet Heartfelt{' '}
                <span className="bg-gradient-to-r from-amber-600 via-yellow-500 to-orange-500 bg-clip-text text-transparent">
                  Gourmet Rice
                </span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-gray-700">
                Founded with a unique passion: celebration should be an experience for all the senses.
                We marry the visual splendor and fragrant charm of handcrafted fresh flowers with the rich,
                comforting feast of culinary rice dishes and festive gourmet banquets.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/menu">
                  <Button
                    variant="primary"
                    size="lg"
                    className="bg-gradient-to-r from-pink-600 to-rose-500 shadow-lg shadow-pink-200 hover:from-pink-700 hover:to-rose-600"
                  >
                    🌸 Explore 20 Items Menu 🍚
                  </Button>
                </Link>
                <Link to="/products">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-purple-300 text-purple-700 hover:bg-purple-50"
                  >
                    View All Products
                  </Button>
                </Link>
              </div>

              {/* Quick Trust Badges */}
              <div className="mt-10 grid grid-cols-2 gap-4 border-t border-pink-200/60 pt-8 sm:grid-cols-4">
                {milestones.map((item, idx) => (
                  <div key={idx} className="text-left">
                    <p className={`text-2xl font-bold sm:text-3xl ${item.color}`}>
                      {item.number}
                    </p>
                    <p className="mt-1 text-xs font-medium text-gray-600">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Collage Hero Image Grid */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="group relative overflow-hidden rounded-2xl shadow-xl transition-all duration-300 hover:scale-[1.02]">
                    <img
                      src="https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80"
                      alt="Colorful flower arrangements"
                      className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                    <span className="absolute bottom-3 left-3 rounded-full bg-rose-500 px-3 py-1 text-xs font-semibold text-white shadow">
                      🌸 Daily Blooms
                    </span>
                  </div>
                  <div className="group relative overflow-hidden rounded-2xl shadow-xl transition-all duration-300 hover:scale-[1.02]">
                    <img
                      src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80"
                      alt="Artisan food and rice"
                      className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                    <span className="absolute bottom-3 left-3 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white shadow">
                      🍚 Rice Bowls
                    </span>
                  </div>
                </div>

                <div className="space-y-4 pt-8">
                  <div className="group relative overflow-hidden rounded-2xl shadow-xl transition-all duration-300 hover:scale-[1.02]">
                    <img
                      src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=600&q=80"
                      alt="Bouquet arrangement"
                      className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                    <span className="absolute bottom-3 left-3 rounded-full bg-purple-500 px-3 py-1 text-xs font-semibold text-white shadow">
                      ✨ Handcrafted
                    </span>
                  </div>
                  <div className="group relative overflow-hidden rounded-2xl shadow-xl transition-all duration-300 hover:scale-[1.02]">
                    <img
                      src="https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80"
                      alt="Gourmet saffron rice"
                      className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                    <span className="absolute bottom-3 left-3 rounded-full bg-teal-500 px-3 py-1 text-xs font-semibold text-white shadow">
                      🌿 Gourmet Flavors
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story & Philosophy Section */}
      <section className="relative bg-white/80 py-16 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-block rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white">
              Our Journey
            </span>
            <h2 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              A Symphony of Petals, Palettes & Flavors
            </h2>
            <p className="mt-4 text-base text-gray-600 sm:text-lg">
              We started as a small neighborhood flower workshop celebrating intimate birthdays and romantic gestures.
              Over time, our customers asked us to pair vibrant floral greetings with celebratory comfort food.
              Today, we proudly blend botanical floral arts with fragrant heritage rice dining.
            </p>
          </div>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((item, index) => (
              <div
                key={index}
                className="group relative rounded-2xl border border-gray-100 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-lg"
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.bgGradient} text-2xl text-white shadow-md`}
                >
                  {item.icon}
                </div>
                <h3 className="mt-5 text-lg font-bold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Photo Gallery */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <div>
              <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-purple-700">
                Visual Showcase
              </span>
              <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
                Moments in Full Bloom & Savory Aromas
              </h2>
            </div>
            <Link to="/menu">
              <Button
                variant="outline"
                className="border-pink-300 text-pink-700 hover:bg-pink-50"
              >
                Browse Menu Gallery →
              </Button>
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl bg-gray-100 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="h-64 overflow-hidden">
                  <img
                    src={image.url}
                    alt={image.caption}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute top-3 right-3">
                  <span
                    className={`rounded-full ${image.color} px-3 py-1 text-xs font-bold text-white shadow`}
                  >
                    {image.badge}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-base font-bold">{image.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet The Creators */}
      <section className="bg-white/80 py-16 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-rose-700">
              Passionate Artisans
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Meet The Heart Behind Our Shop
            </h2>
            <p className="mt-3 text-gray-600">
              Dedicated botanists and culinary chefs working side-by-side to bring delight to your door.
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member, idx) => (
              <div
                key={idx}
                className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-card transition-all duration-300 hover:shadow-card-lg"
              >
                <div className="relative mx-auto h-40 w-40 overflow-hidden rounded-full ring-4 ring-pink-100">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="mt-5 text-center">
                  <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${member.badgeBg}`}>
                    {member.tag}
                  </span>
                  <h3 className="mt-2 text-xl font-bold text-gray-900">{member.name}</h3>
                  <p className="text-sm font-medium text-gray-500">{member.role}</p>
                  <p className="mt-4 italic text-sm text-gray-600">
                    "{member.quote}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Colorful Call to Action */}
      <section className="relative overflow-hidden py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 px-6 py-12 text-center shadow-2xl sm:px-12 sm:py-16">
            {/* Background pattern */}
            <div className="absolute -top-10 -right-10 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-10 -left-10 h-64 w-64 rounded-full bg-yellow-300/20 blur-2xl" />

            <h2 className="text-3xl font-black text-white sm:text-4xl lg:text-5xl">
              Ready to Send Joy & Good Taste?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-pink-50 sm:text-lg">
              Explore our fresh bouquets, comforting savory rice bowls, and celebration bundles with fast same-day handling.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/menu">
                <Button
                  size="lg"
                  className="bg-white text-rose-600 font-bold hover:bg-rose-50 shadow-lg"
                >
                  🌸 View Menu (20 Items) 🍚
                </Button>
              </Link>
              <Link to="/cart">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white/10"
                >
                  Go to Cart
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
