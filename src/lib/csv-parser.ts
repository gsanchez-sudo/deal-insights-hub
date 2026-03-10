export interface DealRecord {
  id: string;
  mes: string;
  fecha: string;
  ticket: string;
  tiempoGestion: number;
  tipoContrato: string;
  truoraScore: number | null;
  area: string;
  encargado: string;
  nombreDeal: string;
  linkHubspot: string;
  tipoNegocio: string;
  subsidiaria: string;
  pais: string;
  valorLocal: number;
  moneda: string;
  usd: number;
  valorHubspot: number;
  valorNetsuite: number;
  diferencia: number;
  estatusHubspot: string;
  estatusNetsuite: string;
  oc: string;
  pipeline: string;
  excepcion: string;
  tipoAprobacion: string;
  estado: string;
  aprobador: string;
  estadoFacturacion: string;
  cartera: string;
  fechaContrato: string;
  ingresoRetenido: string;
  seguimientoExcepcion: string;
  dealOriginal: string;
  observaciones: string;
  raw: Record<string, string>;
}

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const SPANISH_MONTHS: Record<string, number> = {
  'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3, 'mayo': 4, 'junio': 5,
  'julio': 6, 'agosto': 7, 'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11
};

function extractMonth(dateStr: string): string {
  if (!dateStr || dateStr === '#N/A') return '';
  
  // "19 de enero de 2026" format
  const spanishMatch = dateStr.toLowerCase().match(/de\s+(\w+)\s+de/);
  if (spanishMatch) {
    const monthName = spanishMatch[1];
    if (monthName in SPANISH_MONTHS) {
      return MONTH_NAMES[SPANISH_MONTHS[monthName]];
    }
  }
  
  // Try standard date parsing
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    return MONTH_NAMES[d.getMonth()];
  }
  
  // Already a month name
  const lower = dateStr.toLowerCase().trim();
  const found = MONTH_NAMES.find(m => m.toLowerCase() === lower);
  if (found) return found;
  
  return dateStr;
}

function parseSpanishNumber(str: string): number {
  if (!str || str === '#N/A' || str === 'N/A') return 0;
  // Remove currency symbols, spaces
  let clean = str.replace(/[$\s]/g, '');
  // Spanish format: 23.560,00 → 23560.00
  if (clean.includes(',') && clean.includes('.')) {
    // Determine which is decimal: last separator
    const lastComma = clean.lastIndexOf(',');
    const lastDot = clean.lastIndexOf('.');
    if (lastComma > lastDot) {
      // 23.560,00 → comma is decimal
      clean = clean.replace(/\./g, '').replace(',', '.');
    } else {
      // 23,560.00 → dot is decimal
      clean = clean.replace(/,/g, '');
    }
  } else if (clean.includes(',')) {
    // Could be decimal comma: 11000,09
    const parts = clean.split(',');
    if (parts.length === 2 && parts[1].length <= 2) {
      clean = clean.replace(',', '.');
    } else {
      clean = clean.replace(/,/g, '');
    }
  }
  return parseFloat(clean) || 0;
}

function normalizeArea(area: string): string {
  const upper = area.toUpperCase().trim();
  if (upper.includes('SALES') || upper === 'SALES') return 'SALES';
  if (upper.includes('CUSTOMER') || upper === 'CUSTOMER') return 'CUSTOMER';
  return upper;
}

export function parseCSV(text: string): { records: DealRecord[]; months: string[]; areas: string[] } {
  const lines = text.split(/\r?\n/);
  
  // Find header row - look for row with "DEAL" and "FECHA"
  let headerIdx = -1;
  for (let i = 0; i < Math.min(10, lines.length); i++) {
    const cells = parseCSVLine(lines[i]);
    if (cells.some(c => c.trim().toUpperCase() === 'DEAL') && 
        cells.some(c => c.trim().toUpperCase() === 'FECHA')) {
      headerIdx = i;
      break;
    }
  }
  if (headerIdx === -1) headerIdx = 3; // fallback to row 4 (index 3)

  const headers = parseCSVLine(lines[headerIdx]);
  
  const records: DealRecord[] = [];
  const monthSet = new Set<string>();
  const areaSet = new Set<string>();

  for (let i = headerIdx + 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line || line.trim().length === 0) continue;
    
    const cells = parseCSVLine(line);
    if (cells.length < 10) continue;
    
    const id = cells[0]?.trim() || '';
    const fecha = cells[1]?.trim() || '';
    
    // Skip non-data rows
    if (!id || id === '#N/A' || id.startsWith('TOTAL') || !fecha || fecha === '#N/A') continue;
    // Skip if id is not numeric-like
    if (!/^\d+$/.test(id)) continue;

    const raw: Record<string, string> = {};
    headers.forEach((h, idx) => { raw[h.trim()] = cells[idx] || ''; });

    const mes = extractMonth(fecha);
    const area = normalizeArea(cells[6] || '');
    const usd = parseSpanishNumber(cells[15] || '');
    const truoraStr = cells[5]?.trim();
    const truoraScore = (truoraStr && truoraStr !== '#N/A') ? (parseFloat(truoraStr) || null) : null;

    if (!mes && !area && usd === 0) continue;

    const record: DealRecord = {
      id,
      mes: mes || 'Sin Mes',
      fecha,
      ticket: cells[2]?.trim() || '',
      tiempoGestion: parseInt(cells[3]?.trim() || '0') || 0,
      tipoContrato: cells[4]?.trim() || '',
      truoraScore,
      area,
      encargado: cells[7]?.trim() || '',
      nombreDeal: cells[8]?.trim() || '',
      linkHubspot: cells[9]?.trim() || '',
      tipoNegocio: cells[10]?.trim() || '',
      subsidiaria: cells[11]?.trim() || '',
      pais: cells[12]?.trim() || '',
      valorLocal: parseSpanishNumber(cells[13] || ''),
      moneda: cells[14]?.trim() || '',
      usd,
      valorHubspot: parseSpanishNumber(cells[16] || ''),
      valorNetsuite: parseSpanishNumber(cells[17] || ''),
      diferencia: parseSpanishNumber(cells[18] || ''),
      estatusHubspot: cells[19]?.trim().toUpperCase() || '',
      estatusNetsuite: cells[20]?.trim().toUpperCase() || '',
      oc: cells[21]?.trim().toUpperCase() || '',
      pipeline: cells[22]?.trim() || '',
      excepcion: cells[23]?.trim().toUpperCase() || '',
      tipoAprobacion: cells[24]?.trim() || '',
      estado: cells[25]?.trim() || '',
      aprobador: cells[26]?.trim() || '',
      estadoFacturacion: cells[27]?.trim() || '',
      cartera: cells[28]?.trim() || '',
      fechaContrato: cells[29]?.trim() || '',
      ingresoRetenido: cells[30]?.trim() || '',
      seguimientoExcepcion: cells[31]?.trim() || '',
      dealOriginal: cells[32]?.trim() || '',
      observaciones: cells[40]?.trim() || '',
      raw,
    };

    if (record.mes) monthSet.add(record.mes);
    if (record.area) areaSet.add(record.area);
    records.push(record);
  }

  const months = MONTH_NAMES.filter(m => monthSet.has(m));
  if (months.length === 0) months.push(...monthSet);

  // Only show SALES and CUSTOMER
  const areas = ['SALES', 'CUSTOMER'].filter(a => areaSet.has(a));

  return { records, months, areas };
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        result.push(current);
        current = '';
      } else {
        current += ch;
      }
    }
  }
  result.push(current);
  return result;
}
