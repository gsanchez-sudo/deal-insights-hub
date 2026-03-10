export interface DealRecord {
  mes: string;
  fecha: string;
  area: string;
  tipoContrato: string;
  pais: string;
  usd: number;
  truoraScore: number | null;
  excepcion: string;
  cliente: string;
  deal: string;
  raw: Record<string, string>;
}

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

function extractMonth(dateStr: string): string {
  if (!dateStr) return '';
  // Try parsing date formats
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    return MONTH_NAMES[d.getMonth()];
  }
  // Check if it's already a month name
  const lower = dateStr.toLowerCase().trim();
  const found = MONTH_NAMES.find(m => m.toLowerCase() === lower);
  if (found) return found;
  return dateStr;
}

function findColumnIndex(headers: string[], ...candidates: string[]): number {
  for (const c of candidates) {
    const idx = headers.findIndex(h => h.toLowerCase().trim().includes(c.toLowerCase()));
    if (idx !== -1) return idx;
  }
  return -1;
}

export function parseCSV(text: string): { records: DealRecord[]; months: string[]; areas: string[] } {
  const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
  
  // Find header row (row 3, index 2, but try to auto-detect)
  let headerIdx = 2;
  // If fewer than 3 lines, try first
  if (lines.length <= 2) headerIdx = 0;
  // Auto-detect: find a row that has multiple non-empty cells
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const cells = lines[i].split(',');
    const nonEmpty = cells.filter(c => c.trim().length > 0).length;
    if (nonEmpty >= 5) {
      headerIdx = i;
      break;
    }
  }

  const headerLine = lines[headerIdx];
  const headers = parseCSVLine(headerLine);

  const colMes = findColumnIndex(headers, 'MES');
  const colFecha = findColumnIndex(headers, 'FECHA');
  const colArea = findColumnIndex(headers, 'ÁREA', 'AREA');
  const colTipo = findColumnIndex(headers, 'TIPO DE CONTRATO', 'TIPO_CONTRATO', 'TIPO');
  const colPais = findColumnIndex(headers, 'PAÍS', 'PAIS');
  const colUsd = findColumnIndex(headers, 'USD', 'VALOR USD', 'MONTO');
  const colTruora = findColumnIndex(headers, 'TRUORA', 'SCORE');
  const colExcepcion = findColumnIndex(headers, 'EXCEPCIÓN', 'EXCEPCION');
  const colCliente = findColumnIndex(headers, 'CLIENTE', 'EMPRESA');
  const colDeal = findColumnIndex(headers, 'DEAL', 'NOMBRE');

  const records: DealRecord[] = [];
  const monthSet = new Set<string>();
  const areaSet = new Set<string>();

  for (let i = headerIdx + 1; i < lines.length; i++) {
    const cells = parseCSVLine(lines[i]);
    if (cells.length < 3) continue;

    const raw: Record<string, string> = {};
    headers.forEach((h, idx) => {
      raw[h] = cells[idx] || '';
    });

    let mes = colMes !== -1 ? cells[colMes]?.trim() || '' : '';
    if (!mes && colFecha !== -1) {
      mes = extractMonth(cells[colFecha]?.trim() || '');
    }

    const area = colArea !== -1 ? (cells[colArea]?.trim() || '').toUpperCase() : '';
    const usdStr = colUsd !== -1 ? (cells[colUsd]?.trim() || '0') : '0';
    const usd = parseFloat(usdStr.replace(/[,$]/g, '')) || 0;
    const truoraStr = colTruora !== -1 ? cells[colTruora]?.trim() : '';
    const truoraScore = truoraStr ? parseFloat(truoraStr) || null : null;

    if (!mes && !area && usd === 0) continue;

    const record: DealRecord = {
      mes: mes || 'Sin Mes',
      fecha: colFecha !== -1 ? cells[colFecha]?.trim() || '' : '',
      area,
      tipoContrato: colTipo !== -1 ? cells[colTipo]?.trim() || '' : '',
      pais: colPais !== -1 ? cells[colPais]?.trim() || '' : '',
      usd,
      truoraScore,
      excepcion: colExcepcion !== -1 ? (cells[colExcepcion]?.trim() || '').toUpperCase() : '',
      cliente: colCliente !== -1 ? cells[colCliente]?.trim() || '' : '',
      deal: colDeal !== -1 ? cells[colDeal]?.trim() || '' : '',
      raw,
    };

    if (record.mes) monthSet.add(record.mes);
    if (record.area) areaSet.add(record.area);
    records.push(record);
  }

  const months = MONTH_NAMES.filter(m => monthSet.has(m));
  if (months.length === 0) months.push(...monthSet);

  return { records, months, areas: Array.from(areaSet).sort() };
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
