export type RiskStatus = 'Aprobado' | 'Riesgo' | 'Rechazado' | 'Requiere Revisión de VP' | 'Jurisdicción Extranjera' | 'Alerta de Jurisdicción';

export interface ClosingRecord {
  id: string;
  cliente: string;
  monto: number;
  fecha: string;
  duracion: number;
  duracionUnidad: 'Meses' | 'Años';
  jurisdiccion: string;
  clausulasEspeciales: string;
  estadoRiesgo: RiskStatus;
  motivoRiesgo: string;
  createdAt: string;
}

export const LOCAL_JURISDICTION = 'Colombia';

export const RISK_COLORS: Record<string, string> = {
  'Aprobado': 'hsl(152, 100%, 38%)',
  'Riesgo': 'hsl(44, 97%, 49%)',
  'Rechazado': 'hsl(216, 68%, 7%)',
  'Requiere Revisión de VP': 'hsl(356, 82%, 47%)',
  'Jurisdicción Extranjera': 'hsl(207, 100%, 39%)',
  'Alerta de Jurisdicción': 'hsl(193, 100%, 38%)',
};

export const JURISDICTIONS = [
  'Colombia', 'México', 'Chile', 'Perú', 'Panamá', 'Guatemala',
  'Nicaragua', 'Costa Rica', 'Ecuador', 'Argentina', 'Brasil',
  'Estados Unidos', 'España', 'Otra'
];
