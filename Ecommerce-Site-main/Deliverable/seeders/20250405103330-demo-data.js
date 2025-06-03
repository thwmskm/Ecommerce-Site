'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Insert a guest user
    await queryInterface.bulkInsert('Users', [{

      fName: 'Guest',
      lName: 'User',
      email: 'guest@gamil.com',
      password: Sequelize.literal("SHA2('guestpw', 256)"),
      createdAt: new Date('2025-03-20 00:30:27'),
      updatedAt: new Date('2025-03-20 21:00:35')
    }], {});

    // Insert vehicle records
    await queryInterface.bulkInsert('Vehicles', [
      {
        name: 'Ford Mustang',
        description: 'A high-performance sports car with sleek design.',
        brand: 'Ford',
        model: 'Mustang GT',
        modelYear: 2022,
        shape: 'Coupe',
        mileage: 5000,
        hasAccidents: true,
        historyReport: 'Minor rear-end collision, professionally repaired.',
        isHotDeal: false,
        quantity: 7,
        price: 55000.75,
        exColour: 'Blue',
        inColour: 'Black',
        inFabric: 'Leather',
        imageUrl: 'https://media.ed.edmunds-media.com/ford/mustang/2022/oem/2022_ford_mustang_coupe_ecoboost-premium_fq_oem_1_815x543.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Chevrolet Camaro',
        description: 'A muscle car offering powerful performance and iconic style.',
        brand: 'Chevrolet',
        model: 'Camaro',
        modelYear: 2020,
        shape: 'Coupe',
        mileage: 8000,
        hasAccidents: false,
        historyReport: null,
        isHotDeal: true,
        quantity: 5,
        price: 40000.00,
        exColour: 'Grey',
        inColour: 'Black',
        inFabric: 'Leather',
        imageUrl: 'https://media.ed.edmunds-media.com/chevrolet/camaro/2020/oem/2020_chevrolet_camaro_convertible_1ss_fq_oem_1_815x543.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'BMW X5',
        description: 'A luxury SUV with advanced technology and excellent performance.',
        brand: 'BMW',
        model: 'X5',
        modelYear: 2021,
        shape: 'SUV',
        mileage: 15000,
        hasAccidents: false,
        historyReport: 'No reported issues.',
        isHotDeal: false,
        quantity: 3,
        price: 60000.00,
        exColour: 'White',
        inColour: 'Brown',
        inFabric: 'Synthetic',
        imageUrl: 'https://media.ed.edmunds-media.com/bmw/x5/2021/oem/2021_bmw_x5_4dr-suv_xdrive45e_fq_oem_1_815x543.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Jeep Wrangler',
        description: 'An off-road vehicle perfect for adventurous journeys.',
        brand: 'Jeep',
        model: 'Wrangler Rubicon',
        modelYear: 2023,
        shape: 'SUV',
        mileage: 2000,
        hasAccidents: false,
        historyReport: 'No accidents reported.',
        isHotDeal: true,
        quantity: 8,
        price: 55000.50,
        exColour: 'Green',
        inColour: 'Black',
        inFabric: 'Fabric',
        imageUrl: 'https://media.ed.edmunds-media.com/jeep/wrangler/2023/oem/2023_jeep_wrangler_convertible-suv_willys_fq_oem_3_815x543.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

    // Insert customization records
    await queryInterface.bulkInsert('Customizations', [
      {
        vid: 1,
        category: 'Paint',
        name: 'Blue Metallic',
        description: 'Glossy blue metallic paint with a premium finish.',
        priceAdjustment: 1200.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        vid: 1,
        category: 'Interior',
        name: 'Glass Sunroof',
        description: 'A large glass sunroof for extra natural light.',
        priceAdjustment: 2500.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        vid: 2,
        category: 'Wheels',
        name: 'Performance Wheels',
        description: 'Durable and lightweight wheels for better performance.',
        priceAdjustment: 3200.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        vid: 2,
        category: 'Tech Package',
        name: 'Camera System',
        description: 'A 360-degree camera system for easier parking and safety.',
        priceAdjustment: 1500.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        vid: 3,
        category: 'Sound System',
        name: 'Premium Audio',
        description: 'High-quality sound system for an enhanced audio experience.',
        priceAdjustment: 2800.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        vid: 3,
        category: 'Exterior',
        name: 'Rear Spoiler',
        description: 'Sleek rear spoiler for better aerodynamics and style.',
        priceAdjustment: 2200.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        vid: 4,
        category: 'Tech Package',
        name: 'Heads-Up Display',
        description: 'A digital display on the windshield for key vehicle info.',
        priceAdjustment: 4500.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        vid: 4,
        category: 'Paint',
        name: 'Matte Black',
        description: 'Smooth matte black paint for a modern look.',
        priceAdjustment: 3500.00,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    // Delete in reverse order to avoid foreign key issues
    await queryInterface.bulkDelete('Customizations', null, {});
    await queryInterface.bulkDelete('Vehicles', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
};
