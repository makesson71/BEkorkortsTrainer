import type { PointLoad } from '../domain/loadStability';

export interface LoadScenario {
  id: string;
  title: string;
  instruction: string;
  trailerEmptyKg: number;
  emptyCentreM: number;
  axleM: number;
  bodyStartM: number;
  bodyEndM: number;
  loads: PointLoad[];
  plausibleCouplingRangeKg: [number, number];
  payloadLimitKg?: number;
  couplingLimitKg?: number;
  axleLimitKg?: number;
  shiftOnBrakeM?: number;
  sourceIds: string[];
}

export const loadScenarios: LoadScenario[] = [
  { id:'ordinary', title:'A. Vardagslast i balans', instruction:'Flytta lådan och hitta det markerade, rimliga området.', trailerEmptyKg:500, emptyCentreM:2.45, axleM:2.8, bodyStartM:.8, bodyEndM:4.2, loads:[{id:'box',label:'Låda',massKg:300,positionM:2.25}], plausibleCouplingRangeKg:[75,145], sourceIds:['TS-SLAP-REGLER','TS-KURSPLAN-BE'] },
  { id:'rear', title:'B. Tung last långt bak', instruction:'Undersök vad som händer bakom axeln.', trailerEmptyKg:500, emptyCentreM:2.45, axleM:2.8, bodyStartM:.8, bodyEndM:4.2, loads:[{id:'machine',label:'Maskin',massKg:600,positionM:3.75}], plausibleCouplingRangeKg:[75,155], sourceIds:['TS-SLAP-REGLER','TS-KURSPLAN-BE'] },
  { id:'front', title:'C. Tung last långt fram', instruction:'Flytta lasten framåt och bevaka kopplingsreaktionen.', trailerEmptyKg:500, emptyCentreM:2.45, axleM:2.8, bodyStartM:.8, bodyEndM:4.2, loads:[{id:'stone',label:'Sten',massKg:600,positionM:1.05}], plausibleCouplingRangeKg:[75,155], couplingLimitKg:180, sourceIds:['TS-SLAP-REGLER','TS-KURSPLAN-BE'] },
  { id:'multiple', title:'D. Tre kollin och gränser', instruction:'Ordna alla tre utan att överskrida övningens kopplings- eller axelgräns.', trailerEmptyKg:550, emptyCentreM:2.5, axleM:2.9, bodyStartM:.8, bodyEndM:4.3, loads:[{id:'a',label:'Skåp',massKg:320,positionM:1.2},{id:'b',label:'Plattor',massKg:450,positionM:3.8},{id:'c',label:'Verktyg',massKg:180,positionM:2.5}], plausibleCouplingRangeKg:[80,165], payloadLimitKg:1000, couplingLimitKg:190, axleLimitKg:1370, sourceIds:['TS-VIKTER','TS-AXELTRYCK','TS-SLAP-REGLER'] },
  { id:'shift', title:'E. Lastförskjutning vid bromsning', instruction:'Jämför före och efter att den osäkrade lasten glider framåt.', trailerEmptyKg:450, emptyCentreM:2.45, axleM:2.8, bodyStartM:.8, bodyEndM:4.2, loads:[{id:'loose',label:'Osäkrad last',massKg:350,positionM:3.15}], plausibleCouplingRangeKg:[70,145], shiftOnBrakeM:.9, sourceIds:['SFS-1998-1276','TSFS-2017-25'] },
  { id:'tall', title:'F. Hög last, sidvind och fart', instruction:'Placera den höga lasten så att du inte dessutom skapar en baktung tendens.', trailerEmptyKg:600, emptyCentreM:2.5, axleM:2.85, bodyStartM:.8, bodyEndM:4.25, loads:[{id:'tall-load',label:'Hög last',massKg:500,positionM:3.5}], plausibleCouplingRangeKg:[80,165], sourceIds:['TS-KURSPLAN-BE','TS-VARNINGSMARKEN'] },
];

export type LabQuestionKind = 'securing' | 'stability' | 'separation';
export interface LabQuestion { id:string; kind:LabQuestionKind; prompt:string; choices:string[]; correctIndex:number; explanation:string; sourceIds:string[] }
export const loadLabQuestions: LabQuestion[] = [
  {id:'secure-1',kind:'securing',prompt:'Vad vill lasten göra när ekipaget bromsar?',choices:['Fortsätta framåt','Flytta bakåt','Stå still av sig själv'],correctIndex:0,explanation:'Trögheten ger en rörelsetendens framåt relativt släpet. Därför behövs lämplig säkring.',sourceIds:['SFS-1998-1276','TSFS-2017-25']},
  {id:'secure-2',kind:'securing',prompt:'Är godkänd bruttovikt tillräckligt för säker last?',choices:['Nej, lasten måste också vara säkrad','Ja, alltid','Bara i kurvor'],correctIndex:0,explanation:'Viktgräns och lastsäkring är olika kontroller.',sourceIds:['SFS-1998-1276']},
  {id:'secure-3',kind:'securing',prompt:'Vad kan tillsammans hindra förflyttning?',choices:['Friktion, förstängning och surrning','Enbart lastens egen vikt','Enbart stängd baklucka'],correctIndex:0,explanation:'Säkringsmetoden måste passa lasten; fästpunkternas gränser måste respekteras.',sourceIds:['TSFS-2017-25']},
  {id:'secure-4',kind:'securing',prompt:'Kan samma friktionsvärde antas för alla ytor?',choices:['Nej','Ja','Ja, om släpet är bromsat'],correctIndex:0,explanation:'Material, yta och förhållanden varierar. Övningen antar inget universellt värde.',sourceIds:['TSFS-2017-25']},
  {id:'stable-1',kind:'stability',prompt:'Vad händer typiskt när tung last flyttas bakom axeln?',choices:['Kopplingsreaktionen minskar','Kopplingsreaktionen ökar','Ingenting ändras'],correctIndex:0,explanation:'Momentet kring axeln minskar kopplingens nedåtriktade reaktion och kan till slut vända den.',sourceIds:['TS-KURSPLAN-BE']},
  {id:'stable-2',kind:'stability',prompt:'Vilken kombination kan minska stabilitetsmarginalen?',choices:['Baktung last, sidvind och högre fart','Enbart laglig totalvikt','Fastspänd last nära en rimlig tyngdpunkt'],correctIndex:0,explanation:'Flera störningar kan samverka. Ingen viss fart garanterar stabilitet.',sourceIds:['TS-KURSPLAN-BE','TS-VARNINGSMARKEN']},
  {id:'stable-3',kind:'stability',prompt:'Vad är en rimlig åtgärd vid slingring?',choices:['Minska farten lugnt och rätta orsaken','Accelerera kraftigt','Ignorera om vikten är laglig'],correctIndex:0,explanation:'Sänk farten kontrollerat och rätta lastning eller annat problem innan fortsatt färd.',sourceIds:['TS-KURSPLAN-BE']},
  {id:'separate-1',kind:'separation',prompt:'BE-behörigheten passar totalvikterna. Är allt därmed säkert?',choices:['Nej, teknik, placering och säkring återstår','Ja','Bara kultrycket återstår'],correctIndex:0,explanation:'Behörighet är en separat kontroll.',sourceIds:['TS-BE','TS-VIKTER-SLAP','SFS-1998-1276']},
  {id:'separate-2',kind:'separation',prompt:'O.1 och F.3 klaras i övningen. Vad kan fortfarande vara fel?',choices:['Lasten kan vara baktung eller osäkrad','Ingenting','Förarens BE blir ogiltigt'],correctIndex:0,explanation:'Kontrollerade tekniska viktfält säger inte hur lasten ligger eller sitter fast.',sourceIds:['TS-VIKTER-SLAP','SFS-1998-1276']},
  {id:'separate-3',kind:'separation',prompt:'Lasten är balanserad och säkrad. Får B-föraren alltid köra?',choices:['Nej, behörigheten måste kontrolleras separat','Ja','Ja, om vädret är lugnt'],correctIndex:0,explanation:'Stabil lastning ändrar inte körkortsgränserna.',sourceIds:['TS-SLAP','TS-B96','TS-BE']},
];
