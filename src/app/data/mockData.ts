export interface Technician {
  id: string;
  name: string;
  role: string;
  email: string;
  zone: string;
}

export interface Provider {
  id: string;
  name: string;
  code: string;
}

export interface Farm {
  id: string;
  name: string;
  providerId: string;
  hectares: number;
  location: string;
}

export interface OperationCenter {
  id: string;
  name: string;
  location: string;
}

export type VisitStatus = 'pendiente' | 'completada';
export type SyncStatus = 'pending' | 'synced' | 'error';

export interface Visit {
  id: string;
  date: string;
  technicianId: string;
  farmId: string;
  providerId: string;
  operationCenterId: string;
  status: VisitStatus;
  syncStatus?: SyncStatus;
}

export interface SyncItem {
  id: string;
  visitId: string;
  farmName: string;
  providerName: string;
  date: string;
  syncStatus: SyncStatus;
  syncedAt?: string;
  errorMessage?: string;
}

export const currentUser: Technician = {
  id: 't1',
  name: 'Usuario Prueba',
  role: 'Técnico de Campo',
  email: 'u.prueba@extractoracentral.com',
  zone: 'Zona Norte',
};

export const technicians: Technician[] = [
  currentUser,
  { id: 't2', name: 'María Jiménez', role: 'Técnico de Campo', email: 'm.jimenez@extractoracentral.com', zone: 'Zona Sur' },
  { id: 't3', name: 'Luis Ramírez', role: 'Técnico de Campo', email: 'l.ramirez@extractoracentral.com', zone: 'Zona Centro' },
];

export const providers: Provider[] = [
  { id: 'p1', name: 'Palmas del Norte S.A.', code: 'PN-001' },
  { id: 'p2', name: 'Finca La Esperanza', code: 'FE-002' },
  { id: 'p3', name: 'Agrícola El Progreso', code: 'AP-003' },
  { id: 'p4', name: 'Plantaciones del Sur', code: 'PS-004' },
  { id: 'p5', name: 'Cooperativa Palmares', code: 'CP-005' },
];

export const farms: Farm[] = [
  { id: 'f1', name: 'Finca Las Palmas', providerId: 'p1', hectares: 45, location: 'Km 12, Ruta Norte' },
  { id: 'f2', name: 'Lote El Refugio', providerId: 'p1', hectares: 32, location: 'Km 15, Ruta Norte' },
  { id: 'f3', name: 'Parcela La Colina', providerId: 'p2', hectares: 28, location: 'Vereda Los Pinos' },
  { id: 'f4', name: 'Finca El Porvenir', providerId: 'p3', hectares: 60, location: 'Km 8, Ruta Este' },
  { id: 'f5', name: 'Lote San Isidro', providerId: 'p3', hectares: 25, location: 'Km 10, Ruta Este' },
  { id: 'f6', name: 'Finca La Victoria', providerId: 'p4', hectares: 78, location: 'Zona Sur, Lote 3' },
  { id: 'f7', name: 'Parcela Los Almendros', providerId: 'p5', hectares: 19, location: 'Vereda El Palmar' },
  { id: 'f8', name: 'Finca El Palmar', providerId: 'p5', hectares: 50, location: 'Km 22, Ruta Oeste' },
];

export const operationCenters: OperationCenter[] = [
  { id: 'oc1', name: 'Planta Extractora Norte', location: 'Zona Norte' },
  { id: 'oc2', name: 'Planta Extractora Sur', location: 'Zona Sur' },
];

export const visits: Visit[] = [
  { id: 'v1', date: '2026-06-02', technicianId: 't1', farmId: 'f1', providerId: 'p1', operationCenterId: 'oc1', status: 'completada', syncStatus: 'synced' },
  { id: 'v2', date: '2026-06-03', technicianId: 't1', farmId: 'f3', providerId: 'p2', operationCenterId: 'oc1', status: 'completada', syncStatus: 'pending' },
  { id: 'v15', date: '2026-06-04', technicianId: 't1', farmId: 'f5', providerId: 'p3', operationCenterId: 'oc2', status: 'completada', syncStatus: 'error' },
  { id: 'v3', date: '2026-06-05', technicianId: 't1', farmId: 'f2', providerId: 'p1', operationCenterId: 'oc1', status: 'completada', syncStatus: 'synced' },
  { id: 'v4', date: '2026-06-05', technicianId: 't1', farmId: 'f4', providerId: 'p3', operationCenterId: 'oc2', status: 'pendiente' },
  { id: 'v5', date: '2026-06-09', technicianId: 't1', farmId: 'f5', providerId: 'p3', operationCenterId: 'oc2', status: 'pendiente' },
  { id: 'v6', date: '2026-06-10', technicianId: 't1', farmId: 'f6', providerId: 'p4', operationCenterId: 'oc2', status: 'pendiente' },
  { id: 'v7', date: '2026-06-12', technicianId: 't1', farmId: 'f7', providerId: 'p5', operationCenterId: 'oc1', status: 'pendiente' },
  { id: 'v8', date: '2026-06-16', technicianId: 't1', farmId: 'f8', providerId: 'p5', operationCenterId: 'oc1', status: 'pendiente' },
  { id: 'v9', date: '2026-06-17', technicianId: 't1', farmId: 'f1', providerId: 'p1', operationCenterId: 'oc1', status: 'pendiente' },
  { id: 'v10', date: '2026-06-19', technicianId: 't1', farmId: 'f2', providerId: 'p1', operationCenterId: 'oc1', status: 'pendiente' },
  { id: 'v11', date: '2026-06-23', technicianId: 't1', farmId: 'f3', providerId: 'p2', operationCenterId: 'oc1', status: 'pendiente' },
  { id: 'v12', date: '2026-06-24', technicianId: 't1', farmId: 'f4', providerId: 'p3', operationCenterId: 'oc2', status: 'pendiente' },
  { id: 'v13', date: '2026-06-26', technicianId: 't1', farmId: 'f6', providerId: 'p4', operationCenterId: 'oc2', status: 'pendiente' },
  { id: 'v14', date: '2026-06-30', technicianId: 't1', farmId: 'f7', providerId: 'p5', operationCenterId: 'oc1', status: 'pendiente' },
];

export const syncItems: SyncItem[] = [
  { id: 's1', visitId: 'v2', farmName: 'Parcela La Colina', providerName: 'Finca La Esperanza', date: '2026-06-03', syncStatus: 'pending' },
  { id: 's2', visitId: 'v15', farmName: 'Lote San Isidro', providerName: 'Agrícola El Progreso', date: '2026-06-04', syncStatus: 'error', errorMessage: 'Error de conexión al servidor' },
  { id: 's3', visitId: 'v1', farmName: 'Finca Las Palmas', providerName: 'Palmas del Norte S.A.', date: '2026-06-02', syncStatus: 'synced', syncedAt: '08:45' },
  { id: 's4', visitId: 'v3', farmName: 'Lote El Refugio', providerName: 'Palmas del Norte S.A.', date: '2026-06-05', syncStatus: 'synced', syncedAt: '14:22' },
];

export function getFarm(id: string) {
  return farms.find(f => f.id === id);
}

export function getProvider(id: string) {
  return providers.find(p => p.id === id);
}

export function getOperationCenter(id: string) {
  return operationCenters.find(oc => oc.id === id);
}

export function getVisitsByDate(date: string) {
  return visits.filter(v => v.date === date);
}

export function getVisitsByMonth(year: number, month: number) {
  const prefix = `${year}-${String(month + 1).padStart(2, '0')}`;
  return visits.filter(v => v.date.startsWith(prefix));
}
