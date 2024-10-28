import { ITService, DataFeed, DataFlow } from '../types/types';

export const services: ITService[] = [
  { id: 'CRM001', name: 'Customer CRM' },
  { id: 'BIL001', name: 'Billing System' },
  { id: 'INV001', name: 'Inventory Management' },
  { id: 'REP001', name: 'Reporting System' },
];

export const feeds: DataFeed[] = [
  {
    id: 'F001',
    name: 'Customer Data Sync',
    supplierId: 'CRM001',
    receiverId: 'BIL001',
  },
  {
    id: 'F002',
    name: 'Billing to Inventory',
    supplierId: 'BIL001',
    receiverId: 'INV001',
  },
  {
    id: 'F003',
    name: 'Inventory Reports',
    supplierId: 'INV001',
    receiverId: 'REP001',
  },
];

export const flows: DataFlow[] = [
  {
    id: 'FL001',
    name: 'Customer to Reporting Flow',
    feeds: ['F001', 'F002', 'F003'],
  },
  {
    id: 'FL002',
    name: 'Billing to Reporting Flow',
    feeds: ['F002', 'F003'],
  },
];