import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useRef } from "react";

interface FilterBarProps {
  months: string[];
  areas: string[];
  selectedMonth: string;
  selectedArea: string;
  onMonthChange: (m: string) => void;
  onAreaChange: (a: string) => void;
  onFileUpload: (file: File) => void;
  hasData: boolean;
}

export function FilterBar({
  months, areas, selectedMonth, selectedArea,
  onMonthChange, onAreaChange, onFileUpload, hasData
}: FilterBarProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        <label className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">Mes</label>
        <Select value={selectedMonth} onValueChange={onMonthChange} disabled={!hasData}>
          <SelectTrigger className="w-36 bg-sidebar-border/30 border-sidebar-border text-sidebar-foreground h-9 text-sm">
            <SelectValue placeholder="Seleccionar" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="__all__">Todos</SelectItem>
            {months.map(m => (
              <SelectItem key={m} value={m}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">Área</label>
        <Select value={selectedArea} onValueChange={onAreaChange} disabled={!hasData}>
          <SelectTrigger className="w-36 bg-sidebar-border/30 border-sidebar-border text-sidebar-foreground h-9 text-sm">
            <SelectValue placeholder="Seleccionar" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="__all__">Todas</SelectItem>
            {areas.map(a => (
              <SelectItem key={a} value={a}>{a}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="ml-auto">
        <input
          ref={fileRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFileUpload(f);
          }}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileRef.current?.click()}
          className="border-sidebar-border text-sidebar-foreground hover:bg-sidebar-border/30"
        >
          <Upload className="w-4 h-4 mr-2" />
          Cargar CSV
        </Button>
      </div>
    </div>
  );
}
