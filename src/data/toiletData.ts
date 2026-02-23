import { ToiletFacility, CleanlinessGrade, ToiletStatus } from '@/types/toilet';

export const NAGPUR_CENTER = { lat: 21.178538, lng: 79.1514602 };

function randomBetween(min: number, max: number) {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10;
}

function generateSensorData() {
  const odor = randomBetween(5, 85);
  const ammonia = randomBetween(3, 80);
  const humidity = randomBetween(30, 90);
  const usage = randomBetween(2, 40);
  return { odorLevel: odor, ammoniaLevel: ammonia, humidity, usageFrequency: usage };
}

export function calculateGrade(score: number): CleanlinessGrade {
  if (score >= 80) return 'A';
  if (score >= 60) return 'B';
  if (score >= 40) return 'C';
  return 'D';
}

export function calculateStatus(grade: CleanlinessGrade): ToiletStatus {
  if (grade === 'A') return 'clean';
  if (grade === 'B' || grade === 'C') return 'needs-cleaning';
  return 'unhygienic';
}

export function calculateHygieneScore(sensor: { odorLevel: number; ammoniaLevel: number; humidity: number; usageFrequency: number }): number {
  const odorScore = 100 - sensor.odorLevel;
  const ammoniaScore = 100 - sensor.ammoniaLevel;
  const humidityScore = sensor.humidity > 70 ? 100 - (sensor.humidity - 70) * 2 : 100 - Math.abs(50 - sensor.humidity);
  const usageScore = Math.max(0, 100 - sensor.usageFrequency * 2);
  return Math.round(odorScore * 0.3 + ammoniaScore * 0.3 + humidityScore * 0.2 + usageScore * 0.2);
}

function timeAgo(minutes: number): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() - minutes);
  return d.toISOString();
}

const toiletNames = [
  'Sitabuldi Public Toilet', 'Dharampeth Community Restroom', 'Sadar Clean Station',
  'Ramdaspeth Hygiene Hub', 'Mahal Public Facility', 'Itwari Smart Toilet',
  'Gandhibagh Sanitation Point', 'Lakadganj Public Restroom', 'Manewada Smart Facility',
  'Hingna Road Toilet Block', 'Wardha Road Clean Zone', 'Pardi Public Toilet',
  'Nandanvan Hygiene Point', 'Besa Smart Restroom', 'Koradi Road Facility',
  'Kamptee Road Public Toilet', 'Jaripatka Sanitation Hub', 'Trimurti Nagar Restroom',
  'Pratap Nagar Smart Toilet', 'Narendra Nagar Facility',
];

const addresses = [
  'Near Sitabuldi Fort, Nagpur', 'Dharampeth Main Road, Nagpur', 'Sadar Bazaar, Nagpur',
  'Ramdaspeth Square, Nagpur', 'Mahal Bus Stop, Nagpur', 'Itwari Railway Station, Nagpur',
  'Gandhibagh Market, Nagpur', 'Lakadganj Circle, Nagpur', 'Manewada Road, Nagpur',
  'Hingna MIDC Road, Nagpur', 'Wardha Road NH-7, Nagpur', 'Pardi Market Area, Nagpur',
  'Nandanvan Layout, Nagpur', 'Besa Square, Nagpur', 'Koradi Temple Road, Nagpur',
  'Kamptee Road, Nagpur', 'Jaripatka Flyover, Nagpur', 'Trimurti Nagar, Nagpur',
  'Pratap Nagar Metro, Nagpur', 'Narendra Nagar Main Rd, Nagpur',
];

export const mockToilets: ToiletFacility[] = toiletNames.map((name, i) => {
  const sensor = generateSensorData();
  const hygieneScore = calculateHygieneScore(sensor);
  const grade = calculateGrade(hygieneScore);
  const opStatuses: ('open' | 'closed' | 'maintenance')[] = ['open', 'open', 'open', 'open', 'closed', 'maintenance'];

  return {
    id: `toilet-${i + 1}`,
    name,
    lat: NAGPUR_CENTER.lat + (Math.random() - 0.5) * 0.04,
    lng: NAGPUR_CENTER.lng + (Math.random() - 0.5) * 0.04,
    address: addresses[i],
    grade,
    hygieneScore,
    status: calculateStatus(grade),
    operationalStatus: opStatuses[i % opStatuses.length],
    userRating: randomBetween(2.5, 4.8),
    totalReviews: Math.floor(Math.random() * 300) + 10,
    isAccessible: Math.random() > 0.4,
    isFree: Math.random() > 0.3,
    lastCleaned: timeAgo(Math.floor(Math.random() * 180) + 10),
    sensorData: sensor,
  };
});

export function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 100) / 100;
}

export function getNearbyAlternatives(toilet: ToiletFacility, allToilets: ToiletFacility[], maxDistance = 2): ToiletFacility[] {
  return allToilets
    .filter(t => t.id !== toilet.id && t.operationalStatus === 'open' && (t.grade === 'A' || t.grade === 'B'))
    .map(t => ({ ...t, distance: getDistance(toilet.lat, toilet.lng, t.lat, t.lng) }))
    .filter(t => t.distance! <= maxDistance)
    .sort((a, b) => a.distance! - b.distance!)
    .slice(0, 3);
}
