import { ITService, DataFeed, DataFlow } from '../types/types';

export const services: ITService[] = [
  { id: 'FDR001', name: 'FDA' },
  { id: 'FDR002', name: 'SSD' },
  { id: 'FDR003', name: 'FDS' },
  { id: 'FDR004', name: 'ATS' },
  { id: 'FDR005', name: 'STARTS' },
  { id: 'FDR006', name: 'FIRM' },
  { id: 'FDR007', name: 'Magnus' },
  { id: 'FDR008', name: 'PCP' },
  { id: 'NFDR01', name: 'FTP' },
  { id: 'NFDR02', name: 'RAS' },
  { id: 'NFDR03', name: 'GF' },
];

export const feeds: DataFeed[] = [
  {
    id: 'F001',
    name: 'FDA > SSD',
    supplierId: 'FDR001',
    receiverId: 'FDR002',
  },
  {
    id: 'F002',
    name: 'SSD > FDS',
    supplierId: 'FDR002',
    receiverId: 'FDR003',
  },
  {
    id: 'F003',
    name: 'FDS > ATS',
    supplierId: 'FDR003',
    receiverId: 'FDR004',
  },
  {
    id: 'F004',
    name: 'ATS > STARTS',
    supplierId: 'FDR004',
    receiverId: 'FDR005',
  },
  {
    id: 'F005',
    name: 'STARTS > FIRM',
    supplierId: 'FDR005',
    receiverId: 'FDR006',
  },
  {
    id: 'F006',
    name: 'FIRM > Magnus',
    supplierId: 'FDR006',
    receiverId: 'FDR007',
  },
  {
    id: 'F007',
    name: 'Magnus > GF',
    supplierId: 'FDR007',
    receiverId: 'NFDR03',
  },
  {
    id: 'F008',
    name: 'FTP > RAS',
    supplierId: 'NFDR01',
    receiverId: 'NFDR02',
  },
  {
    id: 'F009',
    name: 'ATS > FTP',
    supplierId: 'FDR004',
    receiverId: 'NFDR01',
  },
  {
    id: 'F010',
    name: 'FDS > PCP',
    supplierId: 'FDR003',
    receiverId: 'FDR008',
  },
];

export const flows: DataFlow[] = [
  {
    id: 'FL001',
    name: 'FDA > SSD > FDS > ATS > FTP > RAS',
    feeds: ['F001', 'F002', 'F003', 'F009', 'F008'],
  },
  {
    id: 'FL002',
    name: 'FDA > SSD > FDS > ATS > STARTS > FIRM > Magnus > GF',
    feeds: ['F001', 'F002', 'F003', 'F004', 'F005', 'F006', 'F007'],
  },
  {
    id: 'FL003',
    name: 'FDA > SSD > FDS > PCP',
    feeds: ['F001', 'F002', 'F003', 'F010'],
  },
];
