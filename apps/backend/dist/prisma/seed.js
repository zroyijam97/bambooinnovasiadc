"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const defaultTemplate = await prisma.template.upsert({
        where: { id: 'classic' },
        update: {},
        create: {
            id: 'classic',
            name: 'Classic Template',
            version: '1.0.0',
            config: {
                layout: 'classic',
                colors: {
                    primary: '#10B981',
                    secondary: '#FFFFFF',
                    text: '#1F2937'
                },
                fonts: {
                    primary: 'Inter',
                    secondary: 'Inter'
                }
            },
            status: 'LIVE',
            preview: null
        }
    });
    console.log('✅ Default template created:', defaultTemplate);
    const testUser = await prisma.user.upsert({
        where: { email: 'test@bambooinnovasia.com' },
        update: {},
        create: {
            id: 'test-user-123',
            email: 'test@bambooinnovasia.com',
            name: 'Test User',
            password: '$2b$10$hashedpassword',
            role: 'USER',
            status: 'ACTIVE',
            emailVerified: true
        }
    });
    console.log('✅ Test user created:', testUser);
    const testOrganization = await prisma.organization.upsert({
        where: { id: 'test-org-123' },
        update: {},
        create: {
            id: 'test-org-123',
            name: 'BambooInnovasia Tech Labs',
            ownerId: testUser.id
        }
    });
    console.log('✅ Test organization created:', testOrganization);
    const testVCard = await prisma.vCard.upsert({
        where: { slug: 'robotester-3000' },
        update: {},
        create: {
            slug: 'robotester-3000',
            templateId: 'classic',
            title: 'AI Testing Assistant',
            name: 'RoboTester 3000',
            jobTitle: 'Senior Test Automation Engineer',
            company: 'BambooInnovasia Tech Labs',
            bio: 'Advanced AI robot specialized in comprehensive testing of digital business card platforms. Equipped with state-of-the-art validation algorithms and user experience optimization protocols.',
            phone: '+1-800-ROBOT-TEST',
            email: 'robotester@bambooinnovasia.com',
            website: 'https://robotester.bambooinnovasia.com',
            address: '123 Tech Street, Innovation City, IC 12345',
            organizationId: testOrganization.id,
            publishStatus: 'PUBLISHED',
            themeConfig: {
                color: '#10B981',
                font: 'Inter'
            }
        }
    });
    console.log('✅ Test VCard created:', testVCard);
    await prisma.businessHours.createMany({
        data: [
            {
                vcardId: testVCard.id,
                day: 'MONDAY',
                openTime: '09:00',
                closeTime: '17:00'
            },
            {
                vcardId: testVCard.id,
                day: 'TUESDAY',
                openTime: '09:00',
                closeTime: '17:00'
            },
            {
                vcardId: testVCard.id,
                day: 'WEDNESDAY',
                openTime: '09:00',
                closeTime: '17:00'
            },
            {
                vcardId: testVCard.id,
                day: 'THURSDAY',
                openTime: '09:00',
                closeTime: '17:00'
            },
            {
                vcardId: testVCard.id,
                day: 'FRIDAY',
                openTime: '09:00',
                closeTime: '17:00'
            }
        ],
        skipDuplicates: true
    });
    await prisma.service.createMany({
        data: [
            {
                vcardId: testVCard.id,
                title: 'Automated Testing',
                description: 'Comprehensive automated testing solutions for web applications',
                price: 150.00,
                currency: 'USD',
                order: 1
            },
            {
                vcardId: testVCard.id,
                title: 'Performance Testing',
                description: 'Load and performance testing to ensure optimal application performance',
                price: 200.00,
                currency: 'USD',
                order: 2
            }
        ],
        skipDuplicates: true
    });
    await prisma.socialLink.createMany({
        data: [
            {
                vcardId: testVCard.id,
                platform: 'LinkedIn',
                url: 'https://linkedin.com/in/robotester3000',
                order: 1
            },
            {
                vcardId: testVCard.id,
                platform: 'GitHub',
                url: 'https://github.com/robotester3000',
                order: 2
            }
        ],
        skipDuplicates: true
    });
    await prisma.testimonial.createMany({
        data: [
            {
                vcardId: testVCard.id,
                name: 'Alice Johnson',
                rating: 5,
                text: 'RoboTester 3000 provided exceptional testing services for our platform. Highly recommended!',
                order: 1
            },
            {
                vcardId: testVCard.id,
                name: 'Bob Smith',
                rating: 5,
                text: 'Outstanding automated testing capabilities. Saved us countless hours of manual testing.',
                order: 2
            }
        ],
        skipDuplicates: true
    });
    console.log('✅ Test data seeded successfully!');
}
main()
    .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map