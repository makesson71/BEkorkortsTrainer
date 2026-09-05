import { useMemo, useRef, useState } from 'react';
import { loadLabQuestions, loadScenarios } from '../data/loadStability';
import { calculateStaticReactions, classifyStability, type PointLoad } from '../domain/loadStability';
import { SourceLinks } from './SourceLinks';

const stateText = {
  'front-heavy': ['↘ Framtung', 'Kopplingsreaktionen är hög i den här övningen. Kontrollera bilens och kopplingens specifika gräns.'],
  balanced: ['✓ Rimligt område', 'Tyngdpunkten ger en plausibel kopplingsreaktion för just detta övningsexempel. Lasten måste ändå säkras.'],
  'rear-heavy': ['↙ Baktung', 'Kopplingsreaktionen har minskat. Baktung lastning kan försämra stabilitetsmarginalen.'],
  unsafe: ['⚠ Tydligt olämplig', 'Negativ kopplingsreaktion eller en uttryckligen angiven teknisk övningsgräns har passerats.'],
} as const;

function QuizBlock() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  return <div className="lab-questions"><h2>Kunskapskontroll</h2><p>10 egenformulerade träningsfrågor – inte officiellt provmaterial.</p>
    {loadLabQuestions.map((q, index) => <article className="lab-question" key={q.id}>
      <strong>{index + 1}. {q.prompt}</strong>
      <div className="mini-choices">{q.choices.map((choice, choiceIndex) => <label key={choice}><input type="radio" name={q.id} checked={answers[q.id] === choiceIndex} onChange={() => setAnswers(old => ({...old,[q.id]:choiceIndex}))} disabled={checked[q.id]} /> {choice}</label>)}</div>
      {!checked[q.id] ? <button disabled={answers[q.id] === undefined} onClick={() => {
        setChecked(old => ({...old,[q.id]:true}));
        if (answers[q.id] === q.correctIndex) {
          const completed = JSON.parse(localStorage.getItem('be-load-lab-progress') ?? '[]') as string[];
          localStorage.setItem('be-load-lab-progress', JSON.stringify([...new Set([...completed, q.id])]));
        }
      }}>Kontrollera svar</button> : <div className={answers[q.id] === q.correctIndex ? 'answer ok' : 'answer bad'}><b>{answers[q.id] === q.correctIndex ? 'Rätt.' : `Inte riktigt. Rätt svar: ${q.choices[q.correctIndex]}.`}</b> {q.explanation}<SourceLinks ids={q.sourceIds}/></div>}
    </article>)}
  </div>;
}

export function LoadStabilityLab({ onOpenWeightLab }: { onOpenWeightLab: () => void }) {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const scenario = loadScenarios[scenarioIndex];
  const [positions, setPositions] = useState<Record<string, number>>({});
  const [lastChange, setLastChange] = useState('Flytta en last för att se vad som ändras.');
  const [showShift, setShowShift] = useState(false);
  const areaRef = useRef<HTMLDivElement>(null);
  const loads: PointLoad[] = scenario.loads.map(load => ({...load, positionM:(positions[`${scenario.id}:${load.id}`] ?? load.positionM) - (showShift && scenario.shiftOnBrakeM ? scenario.shiftOnBrakeM : 0)}));
  const modelLoads = [{id:'empty', label:'Släpets egen massa', massKg:scenario.trailerEmptyKg, positionM:scenario.emptyCentreM}, ...loads];
  const reactions = useMemo(() => calculateStaticReactions({couplingM:0, axleM:scenario.axleM, loads:modelLoads}), [scenario, positions, showShift]);
  const stability = classifyStability(reactions, scenario.plausibleCouplingRangeKg, scenario.couplingLimitKg, scenario.axleLimitKg);
  const payload = loads.reduce((sum, load) => sum + load.massKg, 0);
  const technicalPass = (scenario.payloadLimitKg === undefined || payload <= scenario.payloadLimitKg) &&
    (scenario.couplingLimitKg === undefined || reactions.couplingKg <= scenario.couplingLimitKg) &&
    (scenario.axleLimitKg === undefined || reactions.axleKg <= scenario.axleLimitKg);

  function move(load: PointLoad, next: number) {
    const clamped = Math.max(scenario.bodyStartM, Math.min(scenario.bodyEndM, Math.round(next * 20) / 20));
    const old = positions[`${scenario.id}:${load.id}`] ?? load.positionM;
    setPositions(value => ({...value,[`${scenario.id}:${load.id}`]:clamped}));
    const delta = Math.round((clamped - old) * 100);
    setLastChange(`Du flyttade ${load.massKg} kg ${Math.abs(delta)} cm ${delta < 0 ? 'framåt' : 'bakåt'}. Kopplingsreaktionen ${delta < 0 ? 'ökade' : 'minskade'} och axelreaktionen ${delta < 0 ? 'minskade' : 'ökade'}.`);
  }
  function pointerMove(event: React.PointerEvent, load: PointLoad) {
    if (!(event.buttons & 1) || !areaRef.current) return;
    const rect = areaRef.current.getBoundingClientRect();
    move(load, scenario.bodyStartM + ((event.clientX - rect.left) / rect.width) * (scenario.bodyEndM - scenario.bodyStartM));
  }
  function selectScenario(index: number) { setScenarioIndex(index); setShowShift(false); setLastChange('Flytta en last för att se vad som ändras.'); }

  return <section className="load-lab"><span className="eyebrow">Visuellt träningslabb</span><h1>Last & stabilitet</h1><p className="lead">Se sambandet mellan lastens läge, statiska stödreaktioner och stabilitetstendens. Detta är träning – inte juridiskt klartecken eller fordonsteknisk certifiering.</p>
    <div className="scenario-tabs" aria-label="Lastscenarier">{loadScenarios.map((item,index) => <button className={index === scenarioIndex ? 'selected' : ''} onClick={() => selectScenario(index)} key={item.id}>{item.title}</button>)}</div>
    <article className="lab-block"><h2>{scenario.title}</h2><p>{scenario.instruction}</p>
      <div className="trailer-scene" aria-label="Dragbil och släp sett uppifrån">
        <div className="tow-car">DRAGBIL <span>färdriktning →</span></div><div className="drawbar"><i /></div>
        <div className="trailer-body" ref={areaRef}><span className="body-label">LASTYTA</span><span className="axle" style={{left:`${((scenario.axleM-scenario.bodyStartM)/(scenario.bodyEndM-scenario.bodyStartM))*100}%`}}>┃<small>axel</small></span>
          {reactions.centreOfMassM !== null && <span className="com" style={{left:`${((reactions.centreOfMassM-scenario.bodyStartM)/(scenario.bodyEndM-scenario.bodyStartM))*100}%`}} title="Samlad tyngdpunkt">◆<small>tyngdpunkt</small></span>}
          {loads.map(load => <button key={load.id} className="load-block" style={{left:`${((load.positionM-scenario.bodyStartM)/(scenario.bodyEndM-scenario.bodyStartM))*100}%`}} onPointerMove={event => pointerMove(event,load)} onPointerDown={event => event.currentTarget.setPointerCapture(event.pointerId)} aria-label={`${load.label}, ${load.massKg} kg, läge ${load.positionM.toFixed(2)} meter. Dra eller använd knapparna.`}>{load.label}<small>{load.massKg} kg</small></button>)}
        </div>
      </div>
      <div className="load-controls">{loads.map(load => <div key={load.id}><b>{load.label}: {load.positionM.toFixed(2)} m från kopplingen</b><span><button onClick={() => move(load,load.positionM-.1)} aria-label={`Flytta ${load.label} 10 centimeter framåt`}>← 10 cm</button><button onClick={() => move(load,load.positionM+.1)} aria-label={`Flytta ${load.label} 10 centimeter bakåt`}>10 cm →</button></span></div>)}</div>
      <button onClick={() => {setPositions(old => Object.fromEntries(Object.entries(old).filter(([key]) => !key.startsWith(`${scenario.id}:`)))); setShowShift(false); setLastChange('Scenariot är återställt.');}}>Återställ scenario</button>
      {scenario.shiftOnBrakeM && <button className="brake-button" onClick={() => {setShowShift(value=>!value);setLastChange(!showShift ? `Vid inbromsningen flyttades den osäkrade lasten ${scenario.shiftOnBrakeM} m framåt i det här exemplet.` : 'Lasten visas åter före bromsningen.');}}>{showShift ? 'Visa före bromsning' : 'Bromsa → visa lastförskjutning'}</button>}
      <div className={`stability-card state-${stability}`} role="status"><strong>{stateText[stability][0]}</strong><p>{stateText[stability][1]}</p></div>
      <div className="reaction-grid"><div><small>Samlad tyngdpunkt</small><b>{reactions.centreOfMassM?.toFixed(2)} m</b></div><div><small>Kopplingsreaktion</small><b>{reactions.couplingKg.toFixed(0)} kg-ekv.</b>{scenario.couplingLimitKg && <em>övningsgräns {scenario.couplingLimitKg} kg</em>}</div><div><small>Axelreaktion</small><b>{reactions.axleKg.toFixed(0)} kg-ekv.</b>{scenario.axleLimitKg && <em>övningsgräns {scenario.axleLimitKg} kg</em>}</div><div><small>Aktuell bruttovikt</small><b>{reactions.totalMassKg} kg</b></div></div>
      <div className="what-changed"><strong>Vad ändrades?</strong><p>{lastChange}</p></div>
      <p className="assumption"><strong>Modellantaganden:</strong> ett stelt balkformat släp, en ideal kopplingspunkt, en ideal enkel axel/axelgrupp, punktlaster och statisk jämvikt på plan mark. kg-ekvivalent är kraften delad med tyngdaccelerationen. Modellen beräknar inte kurvtagning, vind, däck, fjädring, bromsar eller dynamisk slingring.</p><SourceLinks ids={scenario.sourceIds}/>
    </article>
    <article className="lab-block brake-lesson"><h2>Bromsning och lastsäkring</h2><div className="brake-visual"><span>🚙 + ▣</span><b>färd →</b><strong>BROMS</strong><i>lastens rörelsetendens →</i></div><p>Vid bromsning vill lasten fortsätta framåt. Vid kurvtagning uppstår en rörelsetendens i sidled, och ojämn väg kan sätta lasten i rörelse. Friktion, förstängning och surrning behöver väljas för lasten; även fästpunkternas gränser måste respekteras. Ingen universell friktionskoefficient eller bandkapacitet antas här.</p><SourceLinks ids={['SFS-1998-1276','TSFS-2017-25']}/></article>
    <article className="lab-block"><h2>Sidvind och slingring</h2><div className="wind-visual"><b>SIDVIND ⇢⇢</b><span>Högt släp</span><i>↝ möjlig störning</i></div><p>Ett högt eller stort släp fångar vind. Baktung lastning och högre fart kan samtidigt minska stabilitetsmarginalen. Det finns ingen universell fartgräns som garanterar stabilitet: minska farten kontrollerat och rätta lastningen eller problemet.</p><SourceLinks ids={['TS-KURSPLAN-BE','TS-VARNINGSMARKEN']}/></article>
    <article className="lab-block"><h2>Tre separata besked</h2><div className="three-checks"><div><b>1. Körkort</b><p>B, B96 eller BE bedöms från behörighetsreglernas vikter.</p></div><div><b>2. Teknik</b><p>O.1/O.2, F.3, total-, brutto-, axel- och kopplingsgränser kontrolleras bara när de finns angivna.</p><strong>{technicalPass ? 'Angivna tekniska övningsgränser passeras inte.' : 'En angiven teknisk övningsgräns passeras.'}</strong></div><div><b>3. Lastning</b><p>Placering och lastsäkring återstår även när 1 och 2 passerar.</p></div></div><button onClick={onOpenWeightLab}>Öppna Viktlabbet för B/B96/BE</button><p className="notice">Säg aldrig ”allt är lagligt/säkert” utifrån detta labb. Kontrollera verkliga kombinationer i registreringsbevisen och Transportstyrelsens släpvagnskalkylator.</p><SourceLinks ids={['TS-SLAP','TS-VIKTER-SLAP','TS-KALKYLATOR']}/></article>
    <QuizBlock />
  </section>;
}
