import { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Camera, ChevronDown, ChevronUp, Save, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { visits, getFarm, getProvider, getOperationCenter } from '../../data/mockData';

const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

interface CrewHarvest {
  id: number;
  pesoProm: string;
  totalPepas: string;
  pesoPepa: string;
}

interface CrewFruit {
  id: number;
  muestreo: string;
  sobremaduros: string;
  podridos: string;
  verdes: string;
  pedLargo: string;
  pc: string;
  verdeSoltando: string;
  demotispa: string;
  enferma: string;
}

function calcHarvest(crew: CrewHarvest, muestreoPalmas: string) {
  const pesoProm = parseFloat(crew.pesoProm) || 0;
  const totalPepas = parseFloat(crew.totalPepas) || 0;
  const pesoPepa = parseFloat(crew.pesoPepa) || 0;
  const palmas = parseFloat(muestreoPalmas) || 1;

  const pepasPorPalma = totalPepas > 0 ? (totalPepas / palmas).toFixed(1) : '-'; const pesoPepasTotal = (parseFloat(pepasPorPalma) * pesoPepa).toFixed(1);
  const perdidaAceite = (0.4 * parseFloat(pesoPepasTotal)).toFixed(1);
  const perdidaAlmendra = (0.1 * parseFloat(pesoPepasTotal)).toFixed(1);
  const perdidaExtracAceite = pesoProm > 0
    ? ((parseFloat(perdidaAceite) / (pesoProm * 1000)) * 100).toFixed(2)
    : '-';
  const perdidaExtracAlmendra = pesoProm > 0
    ? ((parseFloat(perdidaAlmendra) / (pesoProm * 1000)) * 100).toFixed(2)
    : '-';

  return { pepasPorPalma, pesoPepasTotal, perdidaAceite, perdidaAlmendra, perdidaExtracAceite, perdidaExtracAlmendra };
}

function calcHarvestTotals(crews: CrewHarvest[], muestreoPalmas: string) {
  const n = crews.length;
  if (n === 0) return null;
  const avg = (fn: (c: CrewHarvest) => number) => crews.reduce((s, c) => s + fn(c), 0) / n;

  const avgPesoProm = avg(c => parseFloat(c.pesoProm) || 0);
  const avgTotalPepas = avg(c => parseFloat(c.totalPepas) || 0);
  const avgPesoPepa = avg(c => parseFloat(c.pesoPepa) || 0);

  const palmas = parseFloat(muestreoPalmas) || 1;
  const totalPepas = avgTotalPepas;
  const pesoPepa = avgPesoPepa;
  const pesoProm = avgPesoProm;

  const pepasPorPalma = totalPepas > 0 ? (totalPepas / palmas).toFixed(1) : '-';
  const pesoPepasTotal = pepasPorPalma !== '-' ? (parseFloat(pepasPorPalma) * pesoPepa).toFixed(1) : '-';
  const perdidaAceite = pesoPepasTotal !== '-' ? (0.4 * parseFloat(pesoPepasTotal)).toFixed(1) : '-';
  const perdidaAlmendra = pesoPepasTotal !== '-' ? (0.1 * parseFloat(pesoPepasTotal)).toFixed(1) : '-';
  const perdidaExtracAceite = pesoProm > 0 && perdidaAceite !== '-'
    ? ((parseFloat(perdidaAceite) / (pesoProm * 1000)) * 100).toFixed(2) : '-';
  const perdidaExtracAlmendra = pesoProm > 0 && perdidaAlmendra !== '-'
    ? ((parseFloat(perdidaAlmendra) / (pesoProm * 1000)) * 100).toFixed(2) : '-';

  return {
    avgPesoProm: avgPesoProm.toFixed(1),
    avgTotalPepas: avgTotalPepas.toFixed(1),
    avgPesoPepa: avgPesoPepa.toFixed(1),
    pepasPorPalma, pesoPepasTotal, perdidaAceite, perdidaAlmendra, perdidaExtracAceite, perdidaExtracAlmendra,
  };
}

function computeMaduros(crew: CrewFruit): number {
  const muestreo = parseFloat(crew.muestreo) || 0;
  const sobremaduros = parseFloat(crew.sobremaduros) || 0;
  const podridos = parseFloat(crew.podridos) || 0;
  const verdes = parseFloat(crew.verdes) || 0;
  return Math.max(0, muestreo - sobremaduros - podridos - verdes);
}

function calcFruitTotals(crews: CrewFruit[], harvPerdidaExtrac: string) {
  const n = crews.length;
  if (n === 0) return null;

  const sum = (fn: (c: CrewFruit) => number) => crews.reduce((s, c) => s + fn(c), 0);

  const totalMuestreo = sum(c => parseFloat(c.muestreo) || 0);
  if (totalMuestreo === 0) return null;

  const sums = {
    maduros: sum(c => computeMaduros(c)),
    sobremaduros: sum(c => parseFloat(c.sobremaduros) || 0),
    podridos: sum(c => parseFloat(c.podridos) || 0),
    verdes: sum(c => parseFloat(c.verdes) || 0),
    pedLargo: sum(c => parseFloat(c.pedLargo) || 0),
    pc: sum(c => parseFloat(c.pc) || 0),
    verdeSoltando: sum(c => parseFloat(c.verdeSoltando) || 0),
    demotispa: sum(c => parseFloat(c.demotispa) || 0),
    enferma: sum(c => parseFloat(c.enferma) || 0),
  };

  const pct = (v: number) => ((v / totalMuestreo) * 100).toFixed(1);

  const pMaduros = pct(sums.maduros);
  const pSobremaduros = pct(sums.sobremaduros);
  const pPodridos = pct(sums.podridos);
  const pVerdes = pct(sums.verdes);
  const pPedLargo = pct(sums.pedLargo);
  const pPc = pct(sums.pc);
  const pVerdeSoltando = pct(sums.verdeSoltando);
  const pDemotispa = pct(sums.demotispa);
  const pEnferma = pct(sums.enferma);

  const hExtrac = parseFloat(harvPerdidaExtrac) || 0;

  const perdCalVerde = (parseFloat(pVerdes) * 0.08).toFixed(3);
  const perdCalPedLargo = (parseFloat(pPedLargo) * 0.003).toFixed(3);
  const perdCalTotal = (parseFloat(perdCalVerde) + parseFloat(perdCalPedLargo) + hExtrac).toFixed(3);

  const perdAgrPc = (parseFloat(pPc) * 0.05).toFixed(3);
  const perdAgrVerdeSoltando = (parseFloat(pVerdeSoltando) * 0.08).toFixed(3);
  const perdAgrDemotispa = (parseFloat(pDemotispa) * 0.02).toFixed(3);
  const perdAgrEnferma = (parseFloat(pEnferma) * 0.08).toFixed(3);
  const perdAgrTotal = (parseFloat(perdAgrPc) + parseFloat(perdAgrVerdeSoltando) + parseFloat(perdAgrDemotispa) + parseFloat(perdAgrEnferma)).toFixed(3);

  const totalLoss = (parseFloat(perdCalTotal) + parseFloat(perdAgrTotal)).toFixed(3);

  return {
    totalMuestreo,
    pMaduros, pSobremaduros, pPodridos, pVerdes, pPedLargo, pPc, pVerdeSoltando, pDemotispa, pEnferma,
    perdCalVerde, perdCalPedLargo, perdCalTotal,
    perdAgrPc, perdAgrVerdeSoltando, perdAgrDemotispa, perdAgrEnferma, perdAgrTotal,
    totalLoss,
  };
}

export function VisitFormScreen() {
  const { visitId, navigate, isDark } = useApp();
  const visit = visits.find(v => v.id === visitId) || visits[3]; // fallback to v4
  const farm = getFarm(visit.farmId);
  const provider = getProvider(visit.providerId);
  const oc = getOperationCenter(visit.operationCenterId);

  const dateStr = (() => {
    const [y, m, d] = visit.date.split('-');
    return `${parseInt(d)} de ${MONTHS[parseInt(m) - 1]}, ${y}`;
  })();

  const [tab, setTab] = useState<'encabezado' | 'cosecha' | 'fruta' | 'info'>('encabezado');
  const [saved, setSaved] = useState(false);

  // Encabezado state
  const [tipoMaterial, setTipoMaterial] = useState('Ténera');
  const [anoSiembra, setAnoSiembra] = useState('2014');
  const [numLote, setNumLote] = useState('');
  const [acompanante, setAcompanante] = useState('');
  const [cargoAcomp, setCargoAcomp] = useState('');
  const [muestreoPalmas, setMuestreoPalmas] = useState('25');
  const [cicloCosecha, setCicloCosecha] = useState('15');

  // Section 1 - Harvest crews
  const [harvestCrews, setHarvestCrews] = useState<CrewHarvest[]>([
    { id: 1, pesoProm: '22', totalPepas: '38', pesoPepa: '4.2' }
  ]);
  const [expandedHarvest, setExpandedHarvest] = useState<number[]>([1]);

  // Section 2 - Fruit crews
  const [fruitCrews, setFruitCrews] = useState<CrewFruit[]>([
    { id: 1, muestreo: '50', sobremaduros: '5', podridos: '2', verdes: '3', pedLargo: '2', pc: '0', verdeSoltando: '0', demotispa: '0', enferma: '0' }
  ]);
  const [expandedFruit, setExpandedFruit] = useState<number[]>([1]);

  // Totals
  const anyCrewComplete = harvestCrews.some(c => c.pesoProm && c.totalPepas && c.pesoPepa);
  const harvestTotals = anyCrewComplete ? calcHarvestTotals(harvestCrews, muestreoPalmas) : null;
  const harvPerdidaExtrac = harvestTotals?.perdidaExtracAceite || '-';
  const anyFruitComplete = fruitCrews.some(c => c.muestreo);
  const fruitTotals = anyFruitComplete ? calcFruitTotals(fruitCrews, harvPerdidaExtrac) : null;

  // Observations
  const [observaciones, setObservaciones] = useState('');
  const [sugerencias, setSugerencias] = useState('');
  const [rayandoRacimo, setRayandoRacimo] = useState('no');
  const [calBasura, setCalBasura] = useState('Bajo');

  const addHarvestCrew = () => {
    const id = Math.max(...harvestCrews.map(c => c.id), 0) + 1;
    setHarvestCrews(prev => [...prev, { id, pesoProm: '', totalPepas: '', pesoPepa: '' }]);
    setExpandedHarvest(prev => [...prev, id]);
  };

  const removeHarvestCrew = (id: number) => {
    setHarvestCrews(prev => prev.filter(c => c.id !== id));
    setExpandedHarvest(prev => prev.filter(i => i !== id));
  };

  const updateHarvestCrew = (id: number, field: keyof CrewHarvest, value: string) => {
    setHarvestCrews(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const addFruitCrew = () => {
    const id = Math.max(...fruitCrews.map(c => c.id), 0) + 1;
    setFruitCrews(prev => [...prev, { id, muestreo: '', sobremaduros: '', podridos: '', verdes: '', pedLargo: '', pc: '', verdeSoltando: '', demotispa: '', enferma: '' }]);
    setExpandedFruit(prev => [...prev, id]);
  };

  const removeFruitCrew = (id: number) => {
    setFruitCrews(prev => prev.filter(c => c.id !== id));
    setExpandedFruit(prev => prev.filter(i => i !== id));
  };

  const updateFruitCrew = (id: number, field: keyof CrewFruit, value: string) => {
    setFruitCrews(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      navigate('home');
    }, 1800);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '8px 10px', borderRadius: 8,
    borderWidth: 1.5, fontSize: 12, outline: 'none', boxSizing: 'border-box',
  };

  const calcFieldStyle: React.CSSProperties = {
    width: '100%', padding: '7px 10px', borderRadius: 8,
    borderWidth: 1.5, fontSize: 12, outline: 'none', boxSizing: 'border-box',
  };

  const TABS = [
    { id: 'encabezado', label: 'Encabezado' },
    { id: 'cosecha', label: 'Sec. 1' },
    { id: 'fruta', label: 'Sec. 2' },
    { id: 'info', label: 'Info Adicional' },
  ] as const;

  return (
    <div className="flex flex-col h-full bg-background">
      {/* App bar */}
      <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 bg-primary">
        <button onClick={() => navigate('home')} className="text-white/85 bg-transparent border-none cursor-pointer p-0.5">
          <ArrowLeft size={22} />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm truncate">{farm?.name}</p>
          <p className="text-white/70 text-xs truncate">{provider?.name}</p>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-warning text-white">
          Pendiente
        </span>
      </div>

      {/* Tab bar */}
      <div className="flex-shrink-0 flex bg-card border-b border-border">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-3 text-center text-xs bg-none cursor-pointer ${
              tab === t.id ? 'text-ring font-bold border-b-2 border-ring' : 'text-muted-foreground font-normal border-b-2 border-transparent'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">

        {/* ENCABEZADO TAB */}
        {tab === 'encabezado' && (
          <div className="space-y-3">
            {/* Pre-filled (read-only) */}
            <div className="bg-card rounded-xl p-4 shadow-sm">
              <p className="text-xs font-bold text-ring uppercase tracking-wide mb-3">
                Datos de la visita
              </p>
              <ReadField label="Proveedor" value={provider?.name || ''} />
              <ReadField label="Finca" value={farm?.name || ''} />
              <ReadField label="Fecha" value={dateStr} />
              <ReadField label="Centro de operación" value={oc?.name || ''} noBorder />
            </div>

            {/* Editable fields */}
            <div className="bg-card rounded-xl p-4 shadow-sm">
              <p className="text-xs font-bold text-ring uppercase tracking-wide mb-3">
                Información del lote
              </p>

              <FormField label="Tipo de material">
                <select value={tipoMaterial} onChange={e => setTipoMaterial(e.target.value)} className="w-full bg-input-background text-foreground border-border text-xs rounded-lg px-2.5 py-2 outline-none" style={inputStyle}>
                  <option>Dura</option>
                  <option>Ténera</option>
                  <option>Pisifera</option>
                </select>
              </FormField>

              <FormField label="Año de siembra">
                <input type="number" value={anoSiembra} onChange={e => setAnoSiembra(e.target.value)} className="w-full bg-input-background text-foreground border-border text-xs rounded-lg px-2.5 py-2 outline-none" style={inputStyle} placeholder="Ej: 2015" />
              </FormField>

              <FormField label="Número de lote">
                <input type="text" value={numLote} onChange={e => setNumLote(e.target.value)} className="w-full bg-input-background text-foreground border-border text-xs rounded-lg px-2.5 py-2 outline-none" style={inputStyle} placeholder="Ej: L-003" />
              </FormField>

              <FormField label="Acompañante durante evaluación">
                <input type="text" value={acompanante} onChange={e => setAcompanante(e.target.value)} className="w-full bg-input-background text-foreground border-border text-xs rounded-lg px-2.5 py-2 outline-none" style={inputStyle} placeholder="Nombre del acompañante" />
              </FormField>

              <FormField label="Cargo del acompañante" last>
                <input type="text" value={cargoAcomp} onChange={e => setCargoAcomp(e.target.value)} className="w-full bg-input-background text-foreground border-border text-xs rounded-lg px-2.5 py-2 outline-none" style={inputStyle} placeholder="Cargo" />
              </FormField>
            </div>
          </div>
        )}

        {/* COSECHA TAB */}
        {tab === 'cosecha' && (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground mb-2">
              Evaluación de calidad de cosecha. Ingrese datos por cuadrilla.
            </p>

            {/* Muestreo de palmas - single input */}
            <div className="bg-card rounded-xl p-4 shadow-sm">
              <FormField label="Muestreo de palmas">
                <input type="number" value={muestreoPalmas} onChange={e => setMuestreoPalmas(e.target.value)} className="w-full bg-input-background text-foreground border-border text-xs rounded-lg px-2.5 py-2 outline-none" style={inputStyle} placeholder="Ej: 25" />
              </FormField>
            </div>

            {harvestCrews.map((crew, idx) => {
              const isOpen = expandedHarvest.includes(crew.id);
              const calc = calcHarvest(crew, muestreoPalmas);
              return (
                <div key={crew.id} className="bg-card rounded-xl shadow-sm overflow-hidden">
                  {/* Crew header */}
                  <button
                    onClick={() => setExpandedHarvest(prev => isOpen ? prev.filter(i => i !== crew.id) : [...prev, crew.id])}
                    className="w-full flex items-center justify-between px-4 py-3 bg-transparent border-none cursor-pointer"
                    style={{ borderBottom: isOpen ? '1px solid var(--color-border)' : 'none' }}
                  >
                    <span className="text-sm font-bold text-primary">Cuadrilla {idx + 1}</span>
                    <div className="flex items-center gap-2">
                      {harvestCrews.length > 1 && (
                        <button
                          onClick={e => { e.stopPropagation(); removeHarvestCrew(crew.id); }}
                          className="text-destructive bg-transparent border-none cursor-pointer p-0.5"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                      {isOpen ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-2 space-y-3">
                      {/* Manual inputs */}
                      <p className="text-[10px] font-bold text-ring uppercase tracking-wide">Datos manuales</p>
                      <div className="grid grid-cols-2 gap-2">
                        <MiniField label="Peso prom. racimo (kg)" value={crew.pesoProm} onChange={v => updateHarvestCrew(crew.id, 'pesoProm', v)} />
                        <MiniField label="Total pepas sin recog." value={crew.totalPepas} onChange={v => updateHarvestCrew(crew.id, 'totalPepas', v)} />
                        <MiniField label="Peso prom. pepa (g)" value={crew.pesoPepa} onChange={v => updateHarvestCrew(crew.id, 'pesoPepa', v)} />
                      </div>

                      {/* Calculated */}
                      <p className="text-[10px] font-bold text-success uppercase tracking-wide mt-1.5">Datos Calculados</p>
                      <div className="grid grid-cols-2 gap-2">
                        <CalcField label="Pepas sin recog. /palma" value={calc.pepasPorPalma} />
                        <CalcField label="Peso pepas sin recog. (g)" value={calc.pesoPepasTotal !== '0' ? calc.pesoPepasTotal : '-'} />
                        <CalcField label="Pérd. aceite (g)" value={parseFloat(calc.perdidaAceite) > 0 ? calc.perdidaAceite : '-'} />
                        <CalcField label="Pérd. almendra (g)" value={parseFloat(calc.perdidaAlmendra) > 0 ? calc.perdidaAlmendra : '-'} />
                        <CalcField label="Pérd. extrac. aceite (%)" value={calc.perdidaExtracAceite !== '-' ? `${calc.perdidaExtracAceite}%` : '-'} />
                        <CalcField label="Pérd. extrac. almendra (%)" value={calc.perdidaExtracAlmendra !== '-' ? `${calc.perdidaExtracAlmendra}%` : '-'} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <button
              onClick={addHarvestCrew}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-border text-ring bg-transparent cursor-pointer text-sm font-semibold"
            >
              <Plus size={16} />
              Agregar cuadrilla
            </button>

            {/* Totals */}
            {harvestTotals && (
              <div className="bg-ring/10 rounded-xl p-3.5">
                <p className="text-xs font-bold text-primary mb-2">TOTALES DE SECCIÓN</p>
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-ring uppercase tracking-wide">Promedios datos manuales</p>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                    <span className="text-xs text-muted-foreground">Peso prom. racimo (kg)</span>
                    <span className="text-xs font-bold text-foreground text-right">{harvestTotals.avgPesoProm}</span>
                    <span className="text-xs text-muted-foreground">Total pepas sin recoger</span>
                    <span className="text-xs font-bold text-foreground text-right">{harvestTotals.avgTotalPepas}</span>
                    <span className="text-xs text-muted-foreground">Peso prom. pepa (g)</span>
                    <span className="text-xs font-bold text-foreground text-right">{harvestTotals.avgPesoPepa}</span>
                    <span className="text-xs text-muted-foreground">Ciclo cosecha (días)</span>
                    <span className="text-xs font-bold text-foreground text-right">{cicloCosecha}</span>
                  </div>
                  <p className="text-[10px] font-bold text-success uppercase tracking-wide pt-1">Calculados promediados</p>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                    <span className="text-xs text-muted-foreground">Pepas sin recoger/palma</span>
                    <span className="text-xs font-bold text-foreground text-right">{harvestTotals.pepasPorPalma}</span>
                    <span className="text-xs text-muted-foreground">Peso pepas (g)</span>
                    <span className="text-xs font-bold text-foreground text-right">{harvestTotals.pesoPepasTotal}</span>
                    <span className="text-xs text-muted-foreground">Pérd. aceite pepa (g)</span>
                    <span className="text-xs font-bold text-foreground text-right">{harvestTotals.perdidaAceite}</span>
                    <span className="text-xs text-muted-foreground">Pérd. almendra (g)</span>
                    <span className="text-xs font-bold text-foreground text-right">{harvestTotals.perdidaAlmendra}</span>
                    <span className="text-xs text-muted-foreground">Pérd. extrac. aceite (%)</span>
                    <span className="text-xs font-bold text-foreground text-right">{harvestTotals.perdidaExtracAceite}</span>
                    <span className="text-xs text-muted-foreground">Pérd. extrac. almendra (%)</span>
                    <span className="text-xs font-bold text-foreground text-right">{harvestTotals.perdidaExtracAlmendra}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* FRUTA TAB */}
        {tab === 'fruta' && (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground mb-2">
              Evaluación de calidad de fruta en carreta y centro de acopio.
            </p>

            {fruitCrews.map((crew, idx) => {
              const isOpen = expandedFruit.includes(crew.id);
              return (
                <div key={crew.id} className="bg-card rounded-xl shadow-sm overflow-hidden">
                  <button
                    onClick={() => setExpandedFruit(prev => isOpen ? prev.filter(i => i !== crew.id) : [...prev, crew.id])}
                    className="w-full flex items-center justify-between px-4 py-3 bg-transparent border-none cursor-pointer"
                    style={{ borderBottom: isOpen ? '1px solid var(--color-border)' : 'none' }}
                  >
                    <span className="text-sm font-bold text-primary">Cuadrilla {idx + 1}</span>
                    <div className="flex items-center gap-2">
                      {fruitCrews.length > 1 && (
                        <button onClick={e => { e.stopPropagation(); removeFruitCrew(crew.id); }} className="text-destructive bg-transparent border-none cursor-pointer p-0.5">
                          <Trash2 size={15} />
                        </button>
                      )}
                      {isOpen ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-2 space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          ['Muestreo racimos', 'muestreo'],
                        ].map(([label, field]) => (
                          <MiniField key={field} label={label} value={(crew as any)[field]} onChange={v => updateFruitCrew(crew.id, field as keyof CrewFruit, v)} />
                        ))}
                        <MiniField label="Maduros" value={computeMaduros(crew).toFixed(1)} onChange={() => {}} disabled />
                        {[
                          ['Sobremaduros', 'sobremaduros'], ['Podridos', 'podridos'],
                          ['Verdes', 'verdes'], ['Pedúnculo largo', 'pedLargo'],
                          ['Pudrición de Cogollos (PC)', 'pc'], ['Verde soltando pepa', 'verdeSoltando'],
                          ['DEMOTISPA', 'demotispa'], ['Fruta enferma', 'enferma'],
                        ].map(([label, field]) => (
                          <MiniField key={field} label={label} value={(crew as any)[field]} onChange={v => updateFruitCrew(crew.id, field as keyof CrewFruit, v)} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <button onClick={addFruitCrew} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-border text-ring bg-transparent cursor-pointer text-sm font-semibold">
              <Plus size={16} />
              Agregar cuadrilla
            </button>

            {/* Totales de sección */}
            {fruitTotals && (
              <div className="bg-ring/10 rounded-xl p-3.5 space-y-3">
                <p className="text-xs font-bold text-primary">TOTALES DE SECCIÓN</p>

                <div>
                  <p className="text-[10px] font-bold text-ring uppercase tracking-wide mb-1">Total muestreo de racimos</p>
                  <p className="text-sm font-bold text-foreground">{fruitTotals.totalMuestreo}</p>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-ring uppercase tracking-wide mb-1">Porcentajes</p>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                    <span className="text-xs text-muted-foreground">% Maduros</span>
                    <span className="text-xs font-bold text-foreground text-right">{fruitTotals.pMaduros}%</span>
                    <span className="text-xs text-muted-foreground">% Sobremaduros</span>
                    <span className="text-xs font-bold text-foreground text-right">{fruitTotals.pSobremaduros}%</span>
                    <span className="text-xs text-muted-foreground">% Podridos</span>
                    <span className="text-xs font-bold text-foreground text-right">{fruitTotals.pPodridos}%</span>
                    <span className="text-xs text-muted-foreground">% Verdes</span>
                    <span className="text-xs font-bold text-foreground text-right">{fruitTotals.pVerdes}%</span>
                    <span className="text-xs text-muted-foreground">% Pedúnculo largo</span>
                    <span className="text-xs font-bold text-foreground text-right">{fruitTotals.pPedLargo}%</span>
                    <span className="text-xs text-muted-foreground">% PC</span>
                    <span className="text-xs font-bold text-foreground text-right">{fruitTotals.pPc}%</span>
                    <span className="text-xs text-muted-foreground">% Verde soltando pepa</span>
                    <span className="text-xs font-bold text-foreground text-right">{fruitTotals.pVerdeSoltando}%</span>
                    <span className="text-xs text-muted-foreground">% DEMOTISPA</span>
                    <span className="text-xs font-bold text-foreground text-right">{fruitTotals.pDemotispa}%</span>
                    <span className="text-xs text-muted-foreground">% Fruta enferma</span>
                    <span className="text-xs font-bold text-foreground text-right">{fruitTotals.pEnferma}%</span>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-warning uppercase tracking-wide mb-1">Pérdidas por calidad cosecha</p>
                  <div className="grid grid-cols-[3fr_1fr] gap-x-3 gap-y-1">
                    <span className="text-xs text-muted-foreground">Fruto verde (% × 0.08)</span>
                    <span className="text-xs font-bold text-foreground text-right">{fruitTotals.perdCalVerde}</span>
                    <span className="text-xs text-muted-foreground">Pedúnculo largo (% × 0.003)</span>
                    <span className="text-xs font-bold text-foreground text-right">{fruitTotals.perdCalPedLargo}</span>
                    <span className="text-xs text-muted-foreground">Pérd. extrac. aceite</span>
                    <span className="text-xs font-bold text-foreground text-right">{harvPerdidaExtrac}</span>
                    <span className="text-xs font-bold text-ring border-t border-border pt-0.5">Total calidad cosecha</span>
                    <span className="text-xs font-bold text-ring text-right border-t border-border pt-0.5">{fruitTotals.perdCalTotal}</span>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-destructive uppercase tracking-wide mb-1">Pérdidas por problemas agronómicos</p>
                  <div className="grid grid-cols-[3fr_1fr] gap-x-3 gap-y-1">
                    <span className="text-xs text-muted-foreground">PC (% × 0.05)</span>
                    <span className="text-xs font-bold text-foreground text-right">{fruitTotals.perdAgrPc}</span>
                    <span className="text-xs text-muted-foreground">Verde soltando pepa (% × 0.08)</span>
                    <span className="text-xs font-bold text-foreground text-right">{fruitTotals.perdAgrVerdeSoltando}</span>
                    <span className="text-xs text-muted-foreground">DEMOTISPA (% × 0.02)</span>
                    <span className="text-xs font-bold text-foreground text-right">{fruitTotals.perdAgrDemotispa}</span>
                    <span className="text-xs text-muted-foreground">Fruta enferma (% × 0.08)</span>
                    <span className="text-xs font-bold text-foreground text-right">{fruitTotals.perdAgrEnferma}</span>
                    <span className="text-xs font-bold text-ring border-t border-border pt-0.5">Total problemas agronómicos</span>
                    <span className="text-xs font-bold text-ring text-right border-t border-border pt-0.5">{fruitTotals.perdAgrTotal}</span>
                  </div>
                </div>

                <div className="bg-primary/10 rounded-lg p-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-primary">Pérdida aprox. total extrac. aceite (%)</span>
                    <span className="text-sm font-bold text-primary">{fruitTotals.totalLoss}%</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* INFO ADICIONAL TAB */}
        {tab === 'info' && (
          <div className="space-y-3">
            <div className="bg-card rounded-xl p-4 shadow-sm">
              <p className="text-xs font-bold text-ring uppercase tracking-wide mb-3">
                Datos de cosecha
              </p>
              <FormField label="Ciclo cosecha (días)">
                <input type="number" value={cicloCosecha} onChange={e => setCicloCosecha(e.target.value)} className="w-full bg-input-background text-foreground border-border text-xs rounded-lg px-2.5 py-2 outline-none" style={inputStyle} placeholder="Ej: 15" />
              </FormField>
              <FormField label="Calificación basura CC">
                <select value={calBasura} onChange={e => setCalBasura(e.target.value)} className="w-full bg-input-background text-foreground border-border text-xs rounded-lg px-2.5 py-2 outline-none" style={inputStyle}>
                  <option>Bajo</option>
                  <option>Medio</option>
                  <option>Alto</option>
                </select>
              </FormField>
              <FormField label="Rayán de racimo" last>
                <select value={rayandoRacimo} onChange={e => setRayandoRacimo(e.target.value)} className="w-full bg-input-background text-foreground border-border text-xs rounded-lg px-2.5 py-2 outline-none" style={inputStyle}>
                  <option value="no">No</option>
                  <option value="si">Sí</option>
                </select>
              </FormField>
            </div>
            <div className="bg-card rounded-xl p-4 shadow-sm">
              <FormField label="Observaciones">
                <textarea
                  value={observaciones}
                  onChange={e => setObservaciones(e.target.value)}
                  placeholder="Observaciones generales de la visita..."
                  rows={4}
                  className="w-full bg-input-background text-foreground border-border text-xs rounded-lg px-2.5 py-2 outline-none resize-none"
                  style={inputStyle}
                />
              </FormField>
              <FormField label="Sugerencias" last>
                <textarea
                  value={sugerencias}
                  onChange={e => setSugerencias(e.target.value)}
                  placeholder="Sugerencias para mejorar la calidad..."
                  rows={4}
                  className="w-full bg-input-background text-foreground border-border text-xs rounded-lg px-2.5 py-2 outline-none resize-none"
                  style={inputStyle}
                />
              </FormField>
            </div>

            {/* Photos per crew */}
            {harvestCrews.map((crew, idx) => (
              <div key={crew.id} className="bg-card rounded-xl p-4 shadow-sm">
                <p className="text-sm font-semibold text-foreground mb-3">
                  Fotos — Cuadrilla {idx + 1}
                </p>
                <div className="flex gap-2">
                  <button
                    className="flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border text-ring bg-card cursor-pointer"
                    style={{ width: 64, height: 64 }}
                  >
                    <Camera size={20} />
                    <span className="text-[9px] font-semibold">Cámara</span>
                  </button>
                  <div className="flex-1 h-16 rounded-xl bg-input-background border border-border flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">Solo fotos de cámara</span>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground mt-2">
                  Se almacenarán fecha, hora y coordenadas GPS con cada foto.
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save footer */}
      <div className="flex-shrink-0 px-4 py-3 bg-card border-t border-border">
        <button
          onClick={handleSave}
          disabled={saved}
          className="w-50 mx-auto flex items-center justify-center gap-2 py-3.5 rounded-xl border-none text-[15px] font-bold text-white cursor-pointer disabled:cursor-default"
          style={{
            background: saved ? 'var(--color-success)' : 'var(--color-primary)',
            boxShadow: saved ? 'none' : '0 4px 15px rgba(46,117,182,0.35)',
          }}
        >
          {saved ? <><CheckCircle2 size={18} /> Guardado</> : <><Save size={18} /> Guardar formulario</>}
        </button>
      </div>
    </div>
  );
}

function ReadField({ label, value, noBorder }: {
  label: string; value: string; noBorder?: boolean;
}) {
  return (
    <div className="flex items-start justify-between py-2.5" style={{ borderBottom: noBorder ? 'none' : '1px solid var(--color-border)' }}>
      <span className="text-xs text-muted-foreground flex-shrink-0 mr-3">{label}</span>
      <span className="text-xs font-semibold text-foreground text-right">{value}</span>
    </div>
  );
}

function FormField({ label, children, last }: {
  label: string; children: React.ReactNode; last?: boolean;
}) {
  return (
    <div className="mb-3" style={{ paddingBottom: last ? 0 : 4 }}>
      <label className="text-xs font-semibold text-muted-foreground uppercase block mb-1.5" style={{ letterSpacing: '0.3px' }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function MiniField({ label, value, onChange, disabled }: {
  label: string; value: string; onChange: (v: string) => void; disabled?: boolean;
}) {
  return (
    <div>
      <label className="text-[10px] font-semibold text-muted-foreground block mb-0.5">{label}</label>
      <input
        type="number"
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        className="w-full bg-input-background text-foreground border-border text-xs rounded-lg px-2 py-1.5 outline-none disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ borderWidth: 1.5, boxSizing: 'border-box' }}
      />
    </div>
  );
}

function CalcField({ label, value }: {
  label: string; value: string;
}) {
  return (
    <div>
      <label className="text-[10px] font-semibold text-muted-foreground block mb-0.5">{label}</label>
      <div className="w-full bg-ring/10 text-ring border-border text-xs rounded-lg px-2.5 py-1.5" style={{ borderWidth: 1.5 }}>
        {value}
      </div>
    </div>
  );
}
