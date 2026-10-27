import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

// Helper to hash passwords
const hashPassword = (password: string): string => {
  return crypto.createHash('sha256').update(password).digest('hex')
}

// Helper to generate ID
const generateId = (): string => {
  return crypto.randomBytes(12).toString('hex')
}

async function main() {
  console.log('🌱 Starting database seed...')

  try {
    // ===========================
    // SEED USERS
    // ===========================
    console.log('📝 Seeding users...')

    const adminUser = await prisma.user.create({
      data: {
        id: generateId(),
        email: 'admin@timeaiwatch.com',
        firstName: 'Admin',
        lastName: 'User',
        password: hashPassword('Admin123!'),
        role: 'ADMIN',
        status: 'ACTIVE',
      },
    })

    const user1 = await prisma.user.create({
      data: {
        id: generateId(),
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: hashPassword('Password123!'),
        phone: '+1-555-0101',
        role: 'USER',
        status: 'ACTIVE',
      },
    })

    const user2 = await prisma.user.create({
      data: {
        id: generateId(),
        email: 'jane@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        password: hashPassword('Password123!'),
        phone: '+1-555-0102',
        role: 'USER',
        status: 'ACTIVE',
      },
    })

    console.log(`✅ Created ${3} users`)

    // ===========================
    // SEED CATEGORIES
    // ===========================
    console.log('📝 Seeding categories...')

    const categories = await Promise.all([
      prisma.category.create({
        data: {
          id: generateId(),
          name: 'Luxury Sports',
          slug: 'luxury-sports',
          description: 'Premium luxury sports watches',
          icon: '⌚',
        },
      }),
      prisma.category.create({
        data: {
          id: generateId(),
          name: 'Classic Dress',
          slug: 'classic-dress',
          description: 'Elegant classic dress watches',
          icon: '👔',
        },
      }),
      prisma.category.create({
        data: {
          id: generateId(),
          name: 'Dive Sports',
          slug: 'dive-sports',
          description: 'Professional diving watches',
          icon: '🏊',
        },
      }),
      prisma.category.create({
        data: {
          id: generateId(),
          name: 'Aviation',
          slug: 'aviation',
          description: 'Aviation pilot watches',
          icon: '✈️',
        },
      }),
    ])

    console.log(`✅ Created ${categories.length} categories`)

    // ===========================
    // SEED PRODUCTS
    // ===========================
    console.log('📝 Seeding products...')

    const products = await Promise.all([
      // Rolex Submariner
      prisma.product.create({
        data: {
          id: generateId(),
          name: 'Rolex Submariner 41mm',
          description: 'Professional diving watch with ceramic bezel and Maxi dial',
          brand: 'Rolex',
          model: 'Submariner 41 (2020)',
          material: 'Stainless Steel',
          waterResistance: '300m',
          movement: 'AUTOMATIC',
          price: 9100,
          originalPrice: 9750,
          thumbnail: 'https://via.placeholder.com/300x300?text=Rolex+Submariner',
          images: [
            'https://via.placeholder.com/500x500?text=Rolex+Submariner+1',
            'https://via.placeholder.com/500x500?text=Rolex+Submariner+2',
          ],
          categoryId: categories[2].id,
          stock: 5,
          isFeatured: true,
          isActive: true,
        },
      }),

      // Omega Seamaster
      prisma.product.create({
        data: {
          id: generateId(),
          name: 'Omega Seamaster Professional',
          description: 'The watch of choice for professional divers worldwide',
          brand: 'Omega',
          model: 'Seamaster 300M',
          material: 'Stainless Steel',
          waterResistance: '300m',
          movement: 'AUTOMATIC',
          price: 6300,
          originalPrice: 6500,
          thumbnail: 'https://via.placeholder.com/300x300?text=Omega+Seamaster',
          images: [
            'https://via.placeholder.com/500x500?text=Omega+Seamaster+1',
            'https://via.placeholder.com/500x500?text=Omega+Seamaster+2',
          ],
          categoryId: categories[2].id,
          stock: 8,
          isFeatured: true,
          isActive: true,
        },
      }),

      // Tag Heuer Carrera
      prisma.product.create({
        data: {
          id: generateId(),
          name: 'TAG Heuer Carrera',
          description: 'Legendary racing chronograph with precision engineering',
          brand: 'TAG Heuer',
          model: 'Carrera 44mm',
          material: 'Stainless Steel',
          waterResistance: '100m',
          movement: 'AUTOMATIC',
          price: 4500,
          originalPrice: 4800,
          thumbnail: 'https://via.placeholder.com/300x300?text=TAG+Heuer+Carrera',
          images: [
            'https://via.placeholder.com/500x500?text=TAG+Heuer+1',
            'https://via.placeholder.com/500x500?text=TAG+Heuer+2',
          ],
          categoryId: categories[0].id,
          stock: 12,
          isFeatured: true,
          isActive: true,
        },
      }),

      // Breitling Navitimer
      prisma.product.create({
        data: {
          id: generateId(),
          name: 'Breitling Navitimer',
          description: 'The legendary aviator watch with integrated slide rule',
          brand: 'Breitling',
          model: 'Navitimer B01 46mm',
          material: 'Stainless Steel',
          waterResistance: '30m',
          movement: 'AUTOMATIC',
          price: 7400,
          originalPrice: 7600,
          thumbnail: 'https://via.placeholder.com/300x300?text=Breitling+Navitimer',
          images: [
            'https://via.placeholder.com/500x500?text=Breitling+1',
            'https://via.placeholder.com/500x500?text=Breitling+2',
          ],
          categoryId: categories[3].id,
          stock: 3,
          isFeatured: true,
          isActive: true,
        },
      }),

      // Cartier Santos
      prisma.product.create({
        data: {
          id: generateId(),
          name: 'Cartier Santos',
          description: 'Iconic dress watch with distinctive square case',
          brand: 'Cartier',
          model: 'Santos Medium',
          material: 'Yellow Gold',
          waterResistance: '100m',
          movement: 'AUTOMATIC',
          price: 8500,
          originalPrice: 9000,
          thumbnail: 'https://via.placeholder.com/300x300?text=Cartier+Santos',
          images: [
            'https://via.placeholder.com/500x500?text=Cartier+1',
            'https://via.placeholder.com/500x500?text=Cartier+2',
          ],
          categoryId: categories[1].id,
          stock: 2,
          isFeatured: true,
          isActive: true,
        },
      }),

      // Seiko Prospex
      prisma.product.create({
        data: {
          id: generateId(),
          name: 'Seiko Prospex Diver',
          description: 'Affordable professional diving watch with solid construction',
          brand: 'Seiko',
          model: 'Prospex SPB143J1',
          material: 'Stainless Steel',
          waterResistance: '200m',
          movement: 'AUTOMATIC',
          price: 500,
          originalPrice: 600,
          thumbnail: 'https://via.placeholder.com/300x300?text=Seiko+Prospex',
          images: [
            'https://via.placeholder.com/500x500?text=Seiko+1',
            'https://via.placeholder.com/500x500?text=Seiko+2',
          ],
          categoryId: categories[2].id,
          stock: 20,
          isFeatured: false,
          isActive: true,
        },
      }),
    ])

    console.log(`✅ Created ${products.length} products`)

    // ===========================
    // SEED INVENTORY
    // ===========================
    console.log('📝 Seeding inventory...')

    await Promise.all(
      products.map((product) =>
        prisma.inventory.create({
          data: {
            id: generateId(),
            productId: product.id,
            quantity: product.stock,
            reorderLevel: 5,
            reorderQuantity: 10,
            warehouse: 'Main Warehouse',
            location: 'Section A',
          },
        })
      )
    )

    console.log(`✅ Created inventory for ${products.length} products`)

    // ===========================
    // SEED ADDRESSES
    // ===========================
    console.log('📝 Seeding addresses...')

    await Promise.all([
      prisma.address.create({
        data: {
          id: generateId(),
          userId: user1.id,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '+1-555-0101',
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          country: 'USA',
          zipCode: '10001',
          isDefault: true,
          addressType: 'BOTH',
        },
      }),
      prisma.address.create({
        data: {
          id: generateId(),
          userId: user2.id,
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          phone: '+1-555-0102',
          street: '456 Oak Ave',
          city: 'Los Angeles',
          state: 'CA',
          country: 'USA',
          zipCode: '90001',
          isDefault: true,
          addressType: 'SHIPPING',
        },
      }),
    ])

    console.log(`✅ Created addresses`)

    // ===========================
    // SEED REVIEWS
    // ===========================
    console.log('📝 Seeding reviews...')

    await Promise.all([
      prisma.review.create({
        data: {
          id: generateId(),
          productId: products[0].id,
          userId: user1.id,
          rating: 5,
          title: 'Exceptional watch!',
          comment: 'Absolutely love this Rolex Submariner. Perfect for diving and everyday wear.',
          isVerified: true,
          status: 'APPROVED',
        },
      }),
      prisma.review.create({
        data: {
          id: generateId(),
          productId: products[0].id,
          userId: user2.id,
          rating: 4,
          title: 'Great quality',
          comment: 'Excellent build quality and accuracy. Highly recommended.',
          isVerified: true,
          status: 'APPROVED',
        },
      }),
      prisma.review.create({
        data: {
          id: generateId(),
          productId: products[1].id,
          userId: user1.id,
          rating: 5,
          title: 'Professional grade',
          comment: 'The Seamaster is a reliable professional diving watch.',
          isVerified: true,
          status: 'APPROVED',
        },
      }),
    ])

    console.log(`✅ Created reviews`)

    // ===========================
    // SEED WISHLIST
    // ===========================
    console.log('📝 Seeding wishlist items...')

    await Promise.all([
      prisma.wishlistItem.create({
        data: {
          id: generateId(),
          userId: user1.id,
          productId: products[3].id,
        },
      }),
      prisma.wishlistItem.create({
        data: {
          id: generateId(),
          userId: user2.id,
          productId: products[4].id,
        },
      }),
    ])

    console.log(`✅ Created wishlist items`)

    console.log('✨ Database seed completed successfully!')
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
