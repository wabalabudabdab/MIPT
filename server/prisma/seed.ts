import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Очищаем существующие данные
  await prisma.visit.deleteMany();
  await prisma.patient.deleteMany();

  console.log('📝 Creating 4000 patients...');

  const patients = [];

  // Создаем 4000 пациентов
  for (let i = 0; i < 4000; i++) {
    const patient = await prisma.patient.create({
      data: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        dateOfBirth: faker.date.between({
          from: new Date('1920-01-01'),
          to: new Date('2010-12-31')
        }),
        phoneNumber: faker.phone.number('+7##########'),
        email: Math.random() > 0.3 ? faker.internet.email() : null, // 70% имеют email
      },
    });

    patients.push(patient);

    if (i % 100 === 0) {
      console.log(`Created ${i} patients...`);
    }
  }

  console.log('🏥 Creating visits for patients...');

  const statuses = ['SCHEDULED', 'COMPLETED', 'CANCELLED'] as const;
  let totalVisits = 0;

  // Для каждого пациента создаем от 0 до 11 визитов
  for (let i = 0; i < patients.length; i++) {
    const patient = patients[i];
    const visitsCount = Math.floor(Math.random() * 12); // 0-11 визитов

    for (let j = 0; j < visitsCount; j++) {
      await prisma.visit.create({
        data: {
          patientId: patient.id,
          visitDate: faker.date.between({
            from: new Date('2020-01-01'),
            to: new Date('2025-12-31')
          }),
          diagnosis: faker.helpers.arrayElement([
            'Острое респираторное заболевание',
            'Артериальная гипертензия',
            'Сахарный диабет 2 типа',
            'Остеохондроз позвоночника',
            'Гастрит',
            'Бронхит',
            'Аллергический ринит',
            'Головная боль напряжения',
            'Депрессивный эпизод',
            'Профилактический осмотр',
            'Вакцинация',
            'Контрольное обследование'
          ]),
          treatment: faker.helpers.arrayElement([
            'Медикаментозная терапия',
            'Физиотерапия',
            'Диетотерапия',
            'Лечебная физкультура',
            'Наблюдение',
            'Хирургическое лечение',
            'Антибиотикотерапия',
            'Симптоматическое лечение',
            'Профилактические мероприятия',
            'Реабилитация'
          ]),
          status: faker.helpers.arrayElement(statuses),
          notes: Math.random() > 0.5 ? faker.lorem.sentence() : null,
        },
      });

      totalVisits++;
    }

    if (i % 100 === 0) {
      console.log(`Processed ${i} patients, created ${totalVisits} visits...`);
    }
  }

  console.log(`✅ Seed completed!`);
  console.log(`📊 Created ${patients.length} patients and ${totalVisits} visits`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });