import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays, List, SlidersHorizontal, Building2, X, CheckCircle2, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { visits, farms, providers, operationCenters, getFarm, getProvider, getOperationCenter } from '../../data/mockData';
import type { Visit } from '../../data/mockData';

const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DAYS_SHORT = ['Do','Lu','Ma','Mi','Ju','Vi','Sá'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function formatDate(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

interface Filters {
  providerId: string;
  farmId: string;
  operationCenterId: string;
  dateFrom: string;
  dateTo: string;
}

export function CalendarScreen() {
  const { navigate, isDark } = useApp();
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(5); // June (0-indexed)
  const [selectedDay, setSelectedDay] = useState<number | null>(5);
  const [showFilters, setShowFilters] = useState(false);
  const today = new Date();
  const defaultDateFrom = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
  const defaultDateTo = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const [filters, setFilters] = useState<Filters>({ providerId: '', farmId: '', operationCenterId: '', dateFrom: '', dateTo: '' });

  const filteredVisits = useMemo(() => {
    return visits.filter(v => {
      if (filters.providerId && v.providerId !== filters.providerId) return false;
      if (filters.farmId && v.farmId !== filters.farmId) return false;
      if (filters.operationCenterId && v.operationCenterId !== filters.operationCenterId) return false;
      if (filters.dateFrom && v.date < filters.dateFrom) return false;
      if (filters.dateTo && v.date > filters.dateTo) return false;
      return true;
    });
  }, [filters]);

  const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
  const monthVisits = filteredVisits.filter(v => v.date.startsWith(monthPrefix));

  const visitsByDay = useMemo(() => {
    const map: Record<number, Visit[]> = {};
    monthVisits.forEach(v => {
      const day = parseInt(v.date.split('-')[2]);
      if (!map[day]) map[day] = [];
      map[day].push(v);
    });
    return map;
  }, [monthVisits]);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const selectedDateStr = selectedDay ? formatDate(year, month, selectedDay) : null;
  const selectedVisits = selectedDay ? (visitsByDay[selectedDay] || []) : [];

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
    setSelectedDay(null);
  };

  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
    setSelectedDay(null);
  };

  const activeFilters = Object.values(filters).filter(Boolean).length;

  const allMonthVisitsSorted = [...filteredVisits]
    .filter(v => v.date.startsWith(monthPrefix))
    .sort((a, b) => a.date.localeCompare(b.date));

  const completedCount = monthVisits.filter(v => v.status === 'completada').length;
  const pendingCount = monthVisits.filter(v => v.status === 'pendiente').length;

  return (
    <div className="flex flex-col h-full bg-background">
      {/* App Bar */}
      <div className="flex-shrink-0 bg-primary" style={{ paddingTop: 4 }}>
        {/* Month navigation row */}
        <div className="flex items-center px-4 py-2">
          <button onClick={prevMonth} className="p-1.5 rounded-full text-white/80 bg-white/10">
            <ChevronLeft size={18} />
          </button>
          <span className="flex-1 text-center text-white font-semibold text-base">
            {MONTHS[month]} {year}
          </span>
          <button onClick={nextMonth} className="p-1.5 rounded-full text-white/80 bg-white/10">
            <ChevronRight size={18} />
          </button>
        </div>

        {/* View toggle + filter row */}
        <div className="flex items-center justify-between px-4 pb-3">
          {/* Stats */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="bg-success rounded-full" style={{ width: 8, height: 8 }} />
              <span className="text-white/75 text-xs">{completedCount} completadas</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="bg-warning rounded-full" style={{ width: 8, height: 8 }} />
              <span className="text-white/75 text-xs">{pendingCount} pendientes</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(true)}
              className="flex items-center gap-1 p-2 rounded-lg text-white"
              style={{ background: activeFilters > 0 ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.15)' }}
            >
              <SlidersHorizontal size={14} />
              {activeFilters > 0 && <span className="text-xs font-bold">{activeFilters}</span>}
            </button>

            <div className="flex rounded-lg overflow-hidden border border-white/30">
              <button
                onClick={() => setView('calendar')}
                className="p-1.5 text-white"
                style={{ background: view === 'calendar' ? 'rgba(255,255,255,0.25)' : 'transparent' }}
              >
                <CalendarDays size={15} />
              </button>
              <button
                onClick={() => setView('list')}
                className="p-1.5 text-white"
                style={{ background: view === 'list' ? 'rgba(255,255,255,0.25)' : 'transparent' }}
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {view === 'calendar' ? (
          <div>
            {/* Day headers */}
            <div className="grid grid-cols-7 px-2 pt-3 pb-1">
              {DAYS_SHORT.map(d => (
                <div key={d} className="text-center text-xs font-semibold text-muted-foreground">
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 px-2 pb-2">
              {/* Empty cells before first day */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}

              {/* Day cells */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dayVisits = visitsByDay[day] || [];
                const isSelected = selectedDay === day;
                const isToday = day === 5 && month === 5 && year === 2026;
                const hasCompleted = dayVisits.some(v => v.status === 'completada');
                const hasPending = dayVisits.some(v => v.status === 'pendiente');

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(isSelected ? null : day)}
                    className={`flex flex-col items-center py-1 mx-0.5 rounded-xl ${isSelected ? 'bg-primary' : isToday ? 'bg-accent' : 'bg-transparent'}`}
                    style={{ minHeight: 52 }}
                  >
                    <span
                      className={`text-sm ${isToday || isSelected ? 'font-bold' : 'font-normal'} ${isSelected ? 'text-white' : isToday ? 'text-primary' : 'text-foreground'}`}
                      style={{ lineHeight: '22px' }}
                    >
                      {day}
                    </span>
                    {/* Visit dots */}
                    <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center" style={{ minHeight: 8 }}>
                      {hasCompleted && (
                        <div className="bg-success rounded-full" style={{ width: 6, height: 6 }} />
                      )}
                      {hasPending && (
                        <div className="bg-warning rounded-full" style={{ width: 6, height: 6 }} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected day visits panel */}
            {selectedDay !== null && (
              <div className="mx-3 mb-3 bg-card rounded-2xl shadow-lg shadow-black/8 overflow-hidden">
                <div className="px-4 py-3 flex items-center justify-between border-b border-border">
                  <span className="text-primary text-sm font-bold">
                    {selectedDay} de {MONTHS[month]}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {selectedVisits.length} visita{selectedVisits.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {selectedVisits.length === 0 ? (
                  <div className="py-6 text-center text-muted-foreground text-sm">
                    No hay visitas programadas
                  </div>
                ) : (
                  selectedVisits.map(v => <VisitRow key={v.id} visit={v} onPress={() => navigate('visit', { visitId: v.id })} />)
                )}
              </div>
            )}
          </div>
        ) : (
          /* List View */
          <div className="px-3 pt-3 pb-2">
            {allMonthVisitsSorted.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <CalendarDays size={40} strokeWidth={1.2} className="mb-2" />
                <span className="text-sm">Sin visitas este mes</span>
              </div>
            ) : (
              allMonthVisitsSorted.map(v => (
                <VisitCard
                  key={v.id}
                  visit={v}
                  onPress={() => navigate('visit', { visitId: v.id })}
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* Filter Bottom Sheet */}
      {showFilters && (
        <FilterSheet
          filters={filters}
          setFilters={setFilters}
          onClose={() => setShowFilters(false)}
        />
      )}
    </div>
  );
}

function VisitRow({ visit, onPress }: { visit: Visit; onPress: () => void }) {
  const farm = getFarm(visit.farmId);
  const provider = getProvider(visit.providerId);
  const isCompleted = visit.status === 'completada';

  return (
    <button
      onClick={onPress}
      className="w-full text-left px-4 py-3 flex items-start gap-3 border-b border-border"
    >
      <div className="mt-0.5">
        {isCompleted
          ? <CheckCircle2 size={18} className="text-success" />
          : <Clock size={18} className="text-warning" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">
          {farm?.name}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {provider?.name}
        </p>
      </div>
      <span
        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${
          isCompleted ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
        }`}
      >
        {isCompleted ? 'Completada' : 'Pendiente'}
      </span>
    </button>
  );
}

function VisitCard({
  visit, onPress
}: {
  visit: Visit; onPress: () => void;
}) {
  const farm = getFarm(visit.farmId);
  const provider = getProvider(visit.providerId);
  const oc = getOperationCenter(visit.operationCenterId);
  const isCompleted = visit.status === 'completada';
  const [d, m, day] = [visit.date.split('-')[2], parseInt(visit.date.split('-')[1]) - 1, visit.date.split('-')[0]];

  return (
    <button
      onClick={onPress}
      className="w-full text-left mb-3 bg-card rounded-xl shadow shadow-black/7 overflow-hidden"
    >
      {/* Status accent bar */}
      <div className={isCompleted ? 'bg-success' : 'bg-warning'} style={{ height: 4 }} />
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0 pr-3">
            <p className="text-sm font-bold text-foreground truncate">
              {farm?.name}
            </p>
            <p className="text-xs text-muted-foreground truncate">{provider?.name}</p>
          </div>
          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full flex-shrink-0 ${
              isCompleted ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
            }`}
          >
            {isCompleted ? 'Completada' : 'Pendiente'}
          </span>
        </div>

        <div className="flex items-center gap-3 border-t border-border pt-2.5">
          <div className="flex items-center gap-1">
            <CalendarDays size={12} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {d} {MONTHS[parseInt(visit.date.split('-')[1]) - 1].slice(0, 3)} {visit.date.split('-')[0]}
            </span>
          </div>
          <div className="flex items-center gap-1 flex-1 min-w-0">
            <Building2 size={12} className="text-muted-foreground flex-shrink-0" />
            <span className="text-xs text-muted-foreground truncate">{oc?.name}</span>
          </div>
        </div>
      </div>
    </button>
  );
}

function FilterSheet({
  filters, setFilters, onClose
}: {
  filters: Filters;
  setFilters: (f: Filters) => void;
  onClose: () => void;
}) {
  const [local, setLocal] = useState(filters);

  const applyFilters = () => { setFilters(local); onClose(); };
  const clearFilters = () => { const empty = { providerId: '', farmId: '', operationCenterId: '', dateFrom: '', dateTo: '' }; setLocal(empty); setFilters(empty); onClose(); };

  const availableFarms = local.providerId ? farms.filter(f => f.providerId === local.providerId) : farms;

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-black/50">
      <div className="flex-1" onClick={onClose} />
      <div className="bg-card rounded-t-3xl pb-5">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-sm bg-border" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-4 border-b border-border">
          <span className="text-base font-bold text-foreground">Filtros</span>
          <button onClick={onClose} className="text-muted-foreground bg-transparent border-none">
            <X size={20} />
          </button>
        </div>

        <div className="px-5 pt-4 space-y-4">
          {/* Provider filter */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
              PROVEEDOR
            </label>
            <select
              value={local.providerId}
              onChange={e => setLocal({ ...local, providerId: e.target.value, farmId: '' })}
              className="w-full bg-input-background text-foreground border-border text-sm rounded-xl px-3.5 py-2.5 outline-none"
              style={{ borderWidth: 1.5 }}
            >
              <option value="">Todos los proveedores</option>
              {providers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          {/* Farm filter */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
              FINCA
            </label>
            <select
              value={local.farmId}
              onChange={e => setLocal({ ...local, farmId: e.target.value })}
              className="w-full bg-input-background text-foreground border-border text-sm rounded-xl px-3.5 py-2.5 outline-none"
              style={{ borderWidth: 1.5 }}
            >
              <option value="">Todas las fincas</option>
              {availableFarms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>

          {/* Operation center filter */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
              CENTRO DE OPERACIÓN
            </label>
            <select
              value={local.operationCenterId}
              onChange={e => setLocal({ ...local, operationCenterId: e.target.value })}
              className="w-full bg-input-background text-foreground border-border text-sm rounded-xl px-3.5 py-2.5 outline-none"
              style={{ borderWidth: 1.5 }}
            >
              <option value="">Todos los centros</option>
              {operationCenters.map(oc => <option key={oc.id} value={oc.id}>{oc.name}</option>)}
            </select>
          </div>

          {/* Date range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                DESDE
              </label>
              <input
                type="date"
                value={local.dateFrom}
                onChange={e => setLocal({ ...local, dateFrom: e.target.value })}
                className="w-full bg-input-background text-foreground border-border text-sm rounded-xl px-3.5 py-2.5 outline-none"
                style={{ borderWidth: 1.5, colorScheme: 'light' }}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                HASTA
              </label>
              <input
                type="date"
                value={local.dateTo}
                onChange={e => setLocal({ ...local, dateTo: e.target.value })}
                className="w-full bg-input-background text-foreground border-border text-sm rounded-xl px-3.5 py-2.5 outline-none"
                style={{ borderWidth: 1.5, colorScheme: 'light' }}
              />
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 px-5 mt-6">
          <button
            onClick={clearFilters}
            className="flex-1 py-3 rounded-xl border border-border text-sm font-semibold text-muted-foreground bg-transparent cursor-pointer"
            style={{ borderWidth: 1.5 }}
          >
            Limpiar
          </button>
          <button
            onClick={applyFilters}
            className="flex-[2] py-3 rounded-xl border-none text-sm font-bold text-white cursor-pointer bg-primary"
          >
            Aplicar filtros
          </button>
        </div>
      </div>
    </div>
  );
}
