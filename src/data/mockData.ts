export type BloodType = 'O−' | 'O+' | 'A−' | 'A+' | 'B−' | 'B+' | 'AB−' | 'AB+';

export const bloodTypes: BloodType[] = ['O−', 'O+', 'A−', 'A+', 'B−', 'B+', 'AB−', 'AB+'];

export const compatibility: Record<BloodType, BloodType[]> = {
  'O−': ['O−', 'O+', 'A−', 'A+', 'B−', 'B+', 'AB−', 'AB+'],
  'O+': ['O+', 'A+', 'B+', 'AB+'],
  'A−': ['A−', 'A+', 'AB−', 'AB+'],
  'A+': ['A+', 'AB+'],
  'B−': ['B−', 'B+', 'AB−', 'AB+'],
  'B+': ['B+', 'AB+'],
  'AB−': ['AB−', 'AB+'],
  'AB+': ['AB+'],
};

export interface InventoryEntry {
  units: number;
  max: number;
}

export const initialInventory: Record<BloodType, InventoryEntry> = {
  'O−': { units: 2, max: 120 },
  'O+': { units: 89, max: 200 },
  'A−': { units: 18, max: 100 },
  'A+': { units: 134, max: 200 },
  'B−': { units: 7, max: 80 },
  'B+': { units: 61, max: 160 },
  'AB−': { units: 14, max: 60 },
  'AB+': { units: 43, max: 120 },
};

export interface Donor {
  name: string;
  type: BloodType;
  city: string;
  daysSinceDonation: number;
  available: boolean;
}

export const donors: Donor[] = [
  { name: 'Maria Santos', type: 'O−', city: 'Downtown', daysSinceDonation: 0, available: true },
  { name: 'James Okonkwo', type: 'A+', city: 'Midtown', daysSinceDonation: 12, available: true },
  { name: 'Priya Nair', type: 'B+', city: 'East Side', daysSinceDonation: 45, available: true },
  { name: 'Chen Wei', type: 'AB+', city: 'Westpark', daysSinceDonation: 55, available: false },
  { name: 'Sofia Martínez', type: 'O+', city: 'Northgate', daysSinceDonation: 3, available: true },
  { name: 'Liam Osei', type: 'B−', city: 'Southville', daysSinceDonation: 8, available: true },
  { name: 'Fatima Al-Hassan', type: 'A−', city: 'Old Quarter', daysSinceDonation: 30, available: false },
  { name: 'David Park', type: 'O−', city: 'Harbor', daysSinceDonation: 0, available: true },
];

export type Urgency = 'critical' | 'high' | 'standard';

export interface BloodRequest {
  patient: string;
  type: BloodType;
  hospital: string;
  urgency: Urgency;
  createdAt: string;
  units: number;
}

export const requests: BloodRequest[] = [
  { patient: 'Patient #8841', type: 'O−', hospital: 'City General', urgency: 'critical', units: 2, createdAt: new Date(Date.now() - 8 * 60_000).toISOString() },
  { patient: 'Patient #9204', type: 'AB+', hospital: 'Riverside Medical', urgency: 'critical', units: 4, createdAt: new Date(Date.now() - 22 * 60_000).toISOString() },
  { patient: 'Patient #7719', type: 'B−', hospital: 'Northside ER', urgency: 'high', units: 1, createdAt: new Date(Date.now() - 60 * 60_000).toISOString() },
  { patient: 'Patient #8003', type: 'A+', hospital: "St. Mary's", urgency: 'standard', units: 3, createdAt: new Date(Date.now() - 2 * 3_600_000).toISOString() },
  { patient: 'Patient #9910', type: 'O+', hospital: 'Harbor View', urgency: 'standard', units: 2, createdAt: new Date(Date.now() - 3 * 3_600_000).toISOString() },
];

export function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diffMs / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs > 1 ? 's' : ''} ago`;
  const days = Math.round(hrs / 24);
  return `${days}d ago`;
}

export type StockLevel = 'critical' | 'low' | 'ok';

export interface Hospital {
  name: string;
  address: string;
  phone: string;
  needs: Partial<Record<BloodType, StockLevel>>;
}

export const hospitals: Hospital[] = [
  {
    name: 'City General Hospital',
    address: '200 Medical Center Dr, Downtown',
    phone: '+1 (555) 200-4000',
    needs: { 'O−': 'critical', 'B−': 'critical', 'AB+': 'low', 'A+': 'ok', 'O+': 'ok' },
  },
  {
    name: 'Riverside Medical Center',
    address: '1 Riverside Blvd, Eastbank',
    phone: '+1 (555) 300-7800',
    needs: { 'AB+': 'critical', 'A−': 'low', 'B+': 'ok', 'O−': 'low' },
  },
  {
    name: 'Northside Emergency',
    address: '88 North Ave, Northgate',
    phone: '+1 (555) 400-1122',
    needs: { 'B−': 'critical', 'O−': 'low', 'A+': 'ok', 'AB−': 'low' },
  },
  {
    name: "St. Mary's Hospital",
    address: '45 Chapel Street, Midtown',
    phone: '+1 (555) 500-3300',
    needs: { 'O+': 'ok', 'A+': 'ok', 'B+': 'low', 'AB+': 'ok' },
  },
  {
    name: 'Harbor View Medical',
    address: '9 Harbor Road, Waterfront',
    phone: '+1 (555) 600-9900',
    needs: { 'O−': 'critical', 'O+': 'low', 'A−': 'ok', 'AB−': 'ok' },
  },
  {
    name: 'Westpark Community',
    address: '300 West Park Ave, Westside',
    phone: '+1 (555) 700-4455',
    needs: { 'A+': 'ok', 'B+': 'ok', 'O+': 'ok', 'AB+': 'low' },
  },
];

export interface Drive {
  name: string;
  loc: string;
  date: string;
  slots: number;
}

export const drives: Drive[] = [
  { name: "St. Mary's Community Drive", loc: "St. Mary's Community Center, 120 Chapel St", date: 'Sat Oct 4, 9am – 3pm', slots: 12 },
  { name: 'Downtown Civic Blood Drive', loc: 'City Hall Lobby, 1 Civic Plaza', date: 'Tue Oct 7, 10am – 6pm', slots: 20 },
  { name: 'University Campus Drive', loc: 'Student Union Building, Room 102', date: 'Thu Oct 9, 11am – 5pm', slots: 8 },
];

export type AlertLevel = 'critical' | 'warning' | 'info';

export interface Alert {
  level: AlertLevel;
  icon: string;
  title: string;
  text: string;
  createdAt: string;
  hospital: string | null;
}

export const alerts: Alert[] = [
  {
    level: 'critical',
    icon: '🚨',
    title: 'Critical shortage: O− at City General',
    text: 'Only 2 units remain. O− is needed for emergency trauma patients. O− donors within 10 km have been notified.',
    createdAt: new Date(Date.now() - 8 * 60_000).toISOString(),
    hospital: 'City General Hospital',
  },
  {
    level: 'critical',
    icon: '🚨',
    title: 'Urgent: AB+ needed at Riverside Medical',
    text: 'Scheduled surgeries require 4 units of AB+ within 6 hours. Current stock critically low.',
    createdAt: new Date(Date.now() - 22 * 60_000).toISOString(),
    hospital: 'Riverside Medical Center',
  },
  {
    level: 'warning',
    icon: '⚠️',
    title: 'Low B− supply — Northside ER',
    text: 'B− stock has dropped to 7 units city-wide. Routine surgeries may be affected if supplies are not replenished within 48 hours.',
    createdAt: new Date(Date.now() - 3_600_000).toISOString(),
    hospital: 'Northside Emergency',
  },
  {
    level: 'warning',
    icon: '📢',
    title: 'Blood drive this Saturday',
    text: "St. Mary's Community Center is hosting a blood drive on Saturday Oct 4. 12 donor slots still available.",
    createdAt: new Date(Date.now() - 3 * 3_600_000).toISOString(),
    hospital: null,
  },
  {
    level: 'info',
    icon: '🩸',
    title: 'A− inventory stabilized',
    text: "Following last week's alert, A− supplies have recovered to adequate levels thanks to 14 new donors.",
    createdAt: new Date(Date.now() - 5 * 3_600_000).toISOString(),
    hospital: null,
  },
];

export function levelColor(pct: number, theme: { danger: string; warning: string; success: string }) {
  if (pct < 0.12) return theme.danger;
  if (pct < 0.35) return theme.warning;
  return theme.success;
}

export function levelStatus(pct: number): { label: string; key: StockLevel | 'ok' } {
  if (pct < 0.12) return { label: 'CRITICAL', key: 'critical' };
  if (pct < 0.35) return { label: 'LOW', key: 'low' };
  return { label: pct < 0.7 ? 'ADEQUATE' : 'SURPLUS', key: 'ok' };
}
