import { getDb } from './index';
import { households, members, inventory, services } from './schema';

async function seed() {
  console.log('🌱 Seeding database...');
  const db = await getDb();

  // Create sample households
  const [household1] = await db.insert(households).values({
    name: 'The Smith Family',
    createdAt: new Date(),
  }).returning();

  const [household2] = await db.insert(households).values({
    name: 'The Johnson Family',
    createdAt: new Date(),
  }).returning();

  const [household3] = await db.insert(households).values({
    name: 'The Williams Family',
    createdAt: new Date(),
  }).returning();

  console.log('✓ Created households');

  // Create sample members
  await db.insert(members).values([
    // Smith Family - Will hit household cap ($30 + $69 + $89 + $109 = $297 -> capped at $250)
    {
      firstName: 'Emma',
      lastName: 'Smith',
      email: 'emma.smith@example.com',
      dateOfBirth: '2015-05-15', // Child - $30
      householdId: household1.id,
      status: 'active',
    },
    {
      firstName: 'Michael',
      lastName: 'Smith',
      email: 'michael.smith@example.com',
      dateOfBirth: '1985-08-22', // Young Adult - $69
      householdId: household1.id,
      status: 'active',
    },
    {
      firstName: 'Sarah',
      lastName: 'Smith',
      email: 'sarah.smith@example.com',
      dateOfBirth: '1975-03-10', // Adult - $89
      householdId: household1.id,
      status: 'active',
    },
    {
      firstName: 'Robert',
      lastName: 'Smith',
      email: 'robert.smith@example.com',
      dateOfBirth: '1955-11-30', // Senior - $109
      householdId: household1.id,
      status: 'active',
    },
    // Johnson Family - Under cap
    {
      firstName: 'David',
      lastName: 'Johnson',
      email: 'david.johnson@example.com',
      dateOfBirth: '1990-02-14', // Young Adult - $69
      householdId: household2.id,
      status: 'active',
    },
    {
      firstName: 'Jessica',
      lastName: 'Johnson',
      email: 'jessica.johnson@example.com',
      dateOfBirth: '1992-07-20', // Young Adult - $69
      householdId: household2.id,
      status: 'active',
    },
    // Williams Family - Single member
    {
      firstName: 'James',
      lastName: 'Williams',
      email: 'james.williams@example.com',
      dateOfBirth: '1980-12-05', // Young Adult - $69
      householdId: household3.id,
      status: 'active',
    },
  ]);

  console.log('✓ Created members');

  // Top 50 Generic Medications with wholesale pricing IN CENTS
  await db.insert(inventory).values([
    { name: 'Amoxicillin', category: 'medication', wholesalePrice: 300, stockLevel: 100, description: 'Antibiotic', dosage: '500mg' },
    { name: 'Lisinopril', category: 'medication', wholesalePrice: 250, stockLevel: 150, description: 'Blood pressure medication', dosage: '10mg' },
    { name: 'Metformin', category: 'medication', wholesalePrice: 400, stockLevel: 120, description: 'Diabetes medication', dosage: '500mg' },
    { name: 'Atorvastatin', category: 'medication', wholesalePrice: 500, stockLevel: 90, description: 'Cholesterol medication', dosage: '20mg' },
    { name: 'Omeprazole', category: 'medication', wholesalePrice: 350, stockLevel: 110, description: 'Acid reflux medication', dosage: '20mg' },
    { name: 'Amlodipine', category: 'medication', wholesalePrice: 200, stockLevel: 130, description: 'Blood pressure medication', dosage: '5mg' },
    { name: 'Levothyroxine', category: 'medication', wholesalePrice: 450, stockLevel: 30, description: 'Thyroid medication', dosage: '50mcg' },
    { name: 'Albuterol', category: 'medication', wholesalePrice: 600, stockLevel: 80, description: 'Asthma inhaler', dosage: '90mcg' },
    { name: 'Gabapentin', category: 'medication', wholesalePrice: 550, stockLevel: 95, description: 'Nerve pain medication', dosage: '300mg' },
    { name: 'Hydrochlorothiazide', category: 'medication', wholesalePrice: 225, stockLevel: 140, description: 'Diuretic', dosage: '25mg' },
    { name: 'Sertraline', category: 'medication', wholesalePrice: 475, stockLevel: 105, description: 'Antidepressant', dosage: '50mg' },
    { name: 'Montelukast', category: 'medication', wholesalePrice: 325, stockLevel: 115, description: 'Asthma/allergy medication', dosage: '10mg' },
    { name: 'Furosemide', category: 'medication', wholesalePrice: 275, stockLevel: 125, description: 'Diuretic', dosage: '40mg' },
    { name: 'Losartan', category: 'medication', wholesalePrice: 380, stockLevel: 100, description: 'Blood pressure medication', dosage: '50mg' },
    { name: 'Pantoprazole', category: 'medication', wholesalePrice: 420, stockLevel: 88, description: 'Acid reflux medication', dosage: '40mg' },
  ]);

  console.log('✓ Created medications inventory');

  // Cash-priced lab tests IN CENTS
  await db.insert(inventory).values([
    { name: 'Lipid Panel', category: 'lab', wholesalePrice: 500, stockLevel: 999, description: 'Cholesterol screening' },
    { name: 'Basic Metabolic Panel', category: 'lab', wholesalePrice: 800, stockLevel: 999, description: 'Kidney function and electrolytes' },
    { name: 'Complete Blood Count (CBC)', category: 'lab', wholesalePrice: 600, stockLevel: 999, description: 'Red and white blood cell counts' },
    { name: 'Hemoglobin A1C', category: 'lab', wholesalePrice: 1000, stockLevel: 999, description: 'Diabetes monitoring' },
    { name: 'TSH (Thyroid)', category: 'lab', wholesalePrice: 1200, stockLevel: 999, description: 'Thyroid function test' },
    { name: 'Urinalysis', category: 'lab', wholesalePrice: 400, stockLevel: 999, description: 'Urine screening' },
    { name: 'Vitamin D', category: 'lab', wholesalePrice: 1500, stockLevel: 999, description: 'Vitamin D levels' },
    { name: 'Liver Function Panel', category: 'lab', wholesalePrice: 900, stockLevel: 999, description: 'Liver enzyme tests' },
    { name: 'Prostate Specific Antigen (PSA)', category: 'lab', wholesalePrice: 1800, stockLevel: 999, description: 'Prostate cancer screening' },
    { name: 'Rapid Strep Test', category: 'lab', wholesalePrice: 700, stockLevel: 999, description: 'Strep throat detection' },
  ]);

  console.log('✓ Created lab tests inventory');

  // Services covered (90%) vs insurance-only (10%)
  await db.insert(services).values([
    // 90% Included Services
    { name: 'Sick Visits', category: 'included', description: 'Same-day or next-day appointments for acute illness' },
    { name: 'Wellness Exams', category: 'included', description: 'Annual physical examinations and preventive care' },
    { name: 'Chronic Disease Management', category: 'included', description: 'Ongoing care for diabetes, hypertension, etc.' },
    { name: 'Minor Procedures', category: 'included', description: 'Sutures, wound care, joint injections' },
    { name: 'Care Coordination', category: 'included', description: 'Specialist referrals and care navigation' },
    { name: 'Telemedicine', category: 'included', description: 'Virtual visits via phone or video' },
    { name: 'Basic Labs', category: 'included', description: 'Common blood work at wholesale prices' },
    { name: 'EKG', category: 'included', description: 'Electrocardiogram testing' },
    { name: 'Nebulizer Treatments', category: 'included', description: 'In-office breathing treatments' },

    // 10% Insurance-Only Services
    { name: 'Hospitalization', category: 'insurance_only', description: 'Inpatient hospital stays' },
    { name: 'Emergency Room Visits', category: 'insurance_only', description: 'ER visits for life-threatening emergencies' },
    { name: 'Surgery', category: 'insurance_only', description: 'Surgical procedures requiring anesthesia' },
    { name: 'Advanced Imaging', category: 'insurance_only', description: 'MRI, CT scans (we can help coordinate)' },
    { name: 'Specialist Surgeries', category: 'insurance_only', description: 'Orthopedic, cardiac, etc.' },
  ]);

  console.log('✓ Created services');

  console.log('✅ Database seeded successfully!');
}

seed().catch(console.error);
