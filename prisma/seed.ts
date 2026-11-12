import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial database records...');

  // 1. Create or update Default Owner Admin Account
  const passwordHash = await bcrypt.hash('cardiff786', 10);
  const adminUser = await prisma.adminUser.upsert({
    where: { email: 'admin@cardifftaxisltd.co.uk' },
    update: {
      passwordHash: passwordHash,
      name: 'Cardiff Taxis Management',
      role: 'OWNER',
      active: true,
    },
    create: {
      email: 'admin@cardifftaxisltd.co.uk',
      name: 'Cardiff Taxis Management',
      passwordHash: passwordHash,
      role: 'OWNER',
      active: true,
    },
  });
  console.log('Admin user initialized:', adminUser.email);

  // 2. Initial fleet drivers
  const sampleDrivers = [
    { name: 'Tariq Hussain', phone: '07700 900123', callsign: 'Car 01', vehicleMake: 'Skoda Superb (2023)', vehiclePlate: 'CF23 TQX', vehicleType: 'Saloon' },
    { name: 'David Evans', phone: '07700 900456', callsign: 'Car 02', vehicleMake: 'Toyota Corolla Touring', vehiclePlate: 'CF72 DEV', vehicleType: 'Estate' },
    { name: 'Ali Mohammed', phone: '07700 900789', callsign: 'Car 03', vehicleMake: 'Ford Tourneo Custom', vehiclePlate: 'CF71 ALI', vehicleType: 'MPV' },
    { name: 'Gareth Lewis', phone: '07700 900321', callsign: 'Car 04', vehicleMake: 'Mercedes-Benz Vito', vehiclePlate: 'CF24 GLX', vehicleType: 'Minibus' },
  ];

  for (const d of sampleDrivers) {
    const existing = await prisma.driver.findFirst({ where: { phone: d.phone } });
    if (!existing) {
      await prisma.driver.create({ data: d });
      console.log('Added driver:', d.name);
    }
  }

  // 3. Pricing settings
  const defaultPricing = [
    { key: 'base_fare_saloon', label: 'Saloon Base Fare (£)', value: '5.00', category: 'FARES' },
    { key: 'per_mile_saloon', label: 'Saloon Per Mile (£)', value: '2.40', category: 'FARES' },
    { key: 'base_fare_estate', label: 'Estate Base Fare (£)', value: '7.00', category: 'FARES' },
    { key: 'per_mile_estate', label: 'Estate Per Mile (£)', value: '2.80', category: 'FARES' },
    { key: 'base_fare_mpv', label: '6-Seater MPV Base Fare (£)', value: '10.00', category: 'FARES' },
    { key: 'per_mile_mpv', label: '6-Seater MPV Per Mile (£)', value: '3.40', category: 'FARES' },
    { key: 'base_fare_minibus', label: '8-Seater Minibus Base Fare (£)', value: '15.00', category: 'FARES' },
    { key: 'per_mile_minibus', label: '8-Seater Minibus Per Mile (£)', value: '4.00', category: 'FARES' },
    { key: 'airport_bristol', label: 'Cardiff to Bristol Airport Fixed Fare (£)', value: '85.00', category: 'AIRPORTS' },
    { key: 'airport_heathrow', label: 'Cardiff to London Heathrow Fixed Fare (£)', value: '210.00', category: 'AIRPORTS' },
    { key: 'airport_gatwick', label: 'Cardiff to London Gatwick Fixed Fare (£)', value: '245.00', category: 'AIRPORTS' },
    { key: 'airport_birmingham', label: 'Cardiff to Birmingham Airport Fixed Fare (£)', value: '165.00', category: 'AIRPORTS' },
    { key: 'night_rate_multiplier', label: 'Night/Weekend Rate Multiplier (23:00 - 06:00)', value: '1.25', category: 'SURCHARGES' },
  ];

  for (const p of defaultPricing) {
    await prisma.pricingSetting.upsert({
      where: { key: p.key },
      update: { label: p.label, value: p.value, category: p.category },
      create: p,
    });
  }
  console.log('Pricing settings initialized.');

  // 4. Import existing bookings from data/bookings.json if available
  const bookingsJsonPath = path.join(process.cwd(), 'data', 'bookings.json');
  if (fs.existsSync(bookingsJsonPath)) {
    try {
      const raw = fs.readFileSync(bookingsJsonPath, 'utf8');
      const list = JSON.parse(raw);
      console.log(`Found ${list.length} existing bookings in bookings.json to import...`);
      for (const item of list) {
        if (!item.bookingReference) continue;
        const exists = await prisma.booking.findUnique({
          where: { bookingReference: item.bookingReference },
        });
        if (!exists) {
          await prisma.booking.create({
            data: {
              bookingReference: item.bookingReference,
              customerName: item.customerName || 'Customer',
              customerEmail: item.customerEmail || '',
              customerPhone: item.customerPhone || '',
              pickupAddress: item.pickupAddress || 'Unknown Pickup',
              dropoffAddress: item.dropoffAddress || 'Unknown Destination',
              pickupDate: item.pickupDate || new Date().toISOString().split('T')[0],
              pickupTime: item.pickupTime || '12:00',
              isReturn: Boolean(item.isReturn || item.returnDate),
              returnDate: item.returnDate || null,
              returnTime: item.returnTime || null,
              tripType: item.tripType || (item.returnDate ? 'return' : 'one-way'),
              vehicleType: item.vehicleType || 'Saloon',
              passengers: item.passengers || 1,
              luggage: item.luggage || 1,
              price: Number(item.price) || 0,
              flightNumber: item.flightNumber || null,
              specialRequests: item.specialRequests || null,
              source: item.source || 'ONLINE',
              status: item.status || 'CONFIRMED',
              paymentStatus: item.paymentStatus || 'PAID',
              paymentMethod: item.paymentMethod || 'sumup',
              paymentId: item.paymentId || null,
              createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
            },
          });
        }
      }
      console.log('Imported existing bookings into MySQL successfully.');
    } catch (e: any) {
      console.warn('Could not import bookings.json:', e.message);
    }
  }
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
