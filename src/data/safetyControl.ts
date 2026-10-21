import type { SafetyControlPrompt, SafetyProcedureStep } from '../types';

const testSources = ['TRV-BE-PROV'];
const couplingSources = ['TRV-BE-PROV', 'TS-SLAP-REGLER', 'TSFS-2019-127'];

export const safetyProcedureSteps: SafetyProcedureStep[] = [
  {
    id: 'couple-position', procedure: 'couple', title: 'Säkra plats och ekipage',
    instruction: 'Välj en säker plats, ställ fordonen stabilt och använd parkeringsbroms. Följ alltid bilens, släpets och kopplingens instruktionsbok för den mekaniska manövern.',
    confirmation: 'Platsen och fordonen är säkrade innan kopplingen hanteras.', sourceIds: testSources,
  },
  {
    id: 'couple-lock', procedure: 'couple', title: 'Kontrollera kopplingen',
    instruction: 'Koppla enligt utrustningens instruktion och kontrollera den avsedda låsindikeringen. Om bilen har avtagbar dragkula ska även den vara rätt monterad och säkrad.',
    confirmation: 'Kopplingsanordningen är rätt kopplad och dess låsning är verifierad.', sourceIds: ['TRV-BE-PROV', 'TS-SLAP-REGLER'],
  },
  {
    id: 'couple-breakaway', procedure: 'couple', title: 'Fäst katastrofbromsvajern',
    instruction: 'Fäst vajern i bilens avsedda ögla när sådan finns. Lägg den inte runt kulhalsen om ögla finns. Saknas ögla på en godkänd koppling anger Trafikverket att vajern får läggas runt dragkroken vid provet.',
    confirmation: 'Vajern är ansluten till dragfordonet på rätt plats och kan aktivera reservbromsningen.', sourceIds: couplingSources,
  },
  {
    id: 'couple-electricity', procedure: 'couple', title: 'Anslut el och prova signalerna',
    instruction: 'Anslut elkabeln och kontrollera belysning, körriktningsvisare och bromsljus. Kabeln ska inte kunna släpa eller sträckas i sväng.',
    confirmation: 'Elanslutningen sitter och alla kontrollerade signaler fungerar.', sourceIds: ['TRV-BE-PROV', 'TS-SLAP-REGLER'],
  },
  {
    id: 'couple-walkaround', procedure: 'couple', title: 'Gör slutkontrollen',
    instruction: 'Kontrollera broms, däck, dörrar och luckor, att lasten är säkrad och placerad rätt samt att parkeringsbromsen på släpet är lossad först när ekipaget är färdigkopplat.',
    confirmation: 'Ekipaget är kontrollerat runt om och redo för en säker funktionskontroll.', sourceIds: ['TRV-BE-PROV', 'TS-SLAP-REGLER'],
  },
  {
    id: 'uncouple-place', procedure: 'uncouple', title: 'Välj säker uppställningsplats',
    instruction: 'Placera ekipaget så att släpet kan stå stabilt och säkert för lastning eller lossning. Följ utrustningens instruktioner och bedöm lutning och omgivning.',
    confirmation: 'Släpet kan lämnas stabilt utan att skapa risk för andra.', sourceIds: testSources,
  },
  {
    id: 'uncouple-secure', procedure: 'uncouple', title: 'Säkra släpet först',
    instruction: 'Ansätt släpets parkeringsbroms och använd föreskrivna stöd enligt släpets instruktionsbok innan anslutningar eller koppling lossas.',
    confirmation: 'Släpet är säkrat mot oavsiktlig rörelse.', sourceIds: testSources,
  },
  {
    id: 'uncouple-connections', procedure: 'uncouple', title: 'Lossa anslutningarna kontrollerat',
    instruction: 'Koppla bort el och katastrofbromsvajer utan att skada dem och placera dem så att de inte hamnar på marken eller kläms.',
    confirmation: 'El och vajer är frånkopplade och skyddade.', sourceIds: couplingSources,
  },
  {
    id: 'uncouple-separate', procedure: 'uncouple', title: 'Frikoppla enligt utrustningen',
    instruction: 'Lossa kopplingsanordningen enligt tillverkarens instruktion. Kontrollera efteråt att släpet står säkert och att bilen kan flyttas utan att något fortfarande är anslutet.',
    confirmation: 'Fordonet och släpet är helt separerade och släpet står säkert.', sourceIds: testSources,
  },
];

export const safetyControlPrompts: SafetyControlPrompt[] = [
  {
    id: 'always-coupling', title: 'Koppling och anslutningar', alwaysIncluded: true,
    prompt: 'Visa hur du kontrollerar kopplingsanordning, katastrofbromsvajer, broms och elanslutning.',
    checklist: ['Koppling och eventuell avtagbar kula är låsta', 'Katastrofbromsvajern är rätt fäst', 'Bromsen kontrolleras på ett säkert sätt', 'Elanslutning, ljus och signaler fungerar'],
    why: 'En felaktig koppling eller anslutning kan göra att släpet lossnar, inte bromsar eller inte syns korrekt.',
    faultAction: 'Kör inte vidare. Säkra ekipaget och åtgärda felet enligt instruktionsbok eller med fackhjälp.', sourceIds: couplingSources,
  },
  {
    id: 'always-load', title: 'Last, dörrar och registrering', alwaysIncluded: true,
    prompt: 'Visa hur du kontrollerar att dörrar är stängda och att lasten, lastmängden och registreringen är lämpliga för ekipaget.',
    checklist: ['Dörrar och luckor är stängda', 'Lasten är säkrad och rätt placerad', 'Mängden last ryms inom ekipagets gränser', 'Registreringsuppgifterna stämmer med kontrollen'],
    why: 'Öppen dörr, förskjuten last eller fel belastning kan försämra stabilitet och orsaka skada.',
    faultAction: 'Stanna kvar och rätta last, stängning eller fordonsval innan färd.', sourceIds: ['TRV-BE-PROV', 'TS-SLAP-REGLER'],
  },
  {
    id: 'random-lighting', title: 'Belysning', alwaysIncluded: false, prompt: 'Gör en säkerhetskontroll av ekipagets belysning.',
    checklist: ['Identifiera vilka lampor som ska provas', 'Kontrollera funktion och synliga skador', 'Förklara hur kontrollen kan göras säkert'],
    why: 'Belysningen gör ekipaget synligt och visar andra trafikanter vad föraren gör.', faultAction: 'Åtgärda trasig eller felaktig belysning innan färd.', sourceIds: testSources,
  },
  {
    id: 'random-brakes', title: 'Bilens bromsar', alwaysIncluded: false, prompt: 'Beskriv och visa hur du kontrollerar dragbilens bromsar.',
    checklist: ['Kontrollera varningsindikering', 'Beskriv en säker funktionskontroll', 'Bedöm avvikande känsla eller ljud'],
    why: 'Bromsfel får större konsekvenser när bilen drar en tung släpvagn.', faultAction: 'Kör inte ett ekipage med misstänkt bromsfel; låt felet undersökas.', sourceIds: testSources,
  },
  {
    id: 'random-tyres', title: 'Däck och fälgar', alwaysIncluded: false, prompt: 'Gör en säkerhetskontroll av däck och fälgar på hela ekipaget.',
    checklist: ['Kontrollera synliga skador och mönster', 'Bedöm lufttryck utan att hitta på ett universellt värde', 'Kontrollera fälg och hjulinfästning visuellt'],
    why: 'Skador eller felaktigt tryck kan påverka grepp, stabilitet och bromssträcka.', faultAction: 'Använd fordonets uppgifter och åtgärda avvikelsen innan färd.', sourceIds: testSources,
  },
  {
    id: 'random-signals', title: 'Körriktningsvisare, reflexer och signal', alwaysIncluded: false, prompt: 'Kontrollera körriktningsvisare, reflexer och ljudsignal.',
    checklist: ['Prova körriktningsvisare på bil och släp', 'Kontrollera att reflexer är hela och synliga', 'Prova ljudsignalen utan att skapa olägenhet'],
    why: 'Andra måste kunna upptäcka ekipaget och förstå förarens avsikt.', faultAction: 'Rengör, reparera eller byt felaktig utrustning före färd.', sourceIds: testSources,
  },
  {
    id: 'random-fluids', title: 'Vätskor', alwaysIncluded: false, prompt: 'Visa hur du kontrollerar relevanta vätskor i dragbilen.',
    checklist: ['Identifiera behållare enligt instruktionsbok', 'Kontrollera nivå på säkert sätt', 'Sök efter synliga läckage'],
    why: 'För låg nivå eller läckage kan ge funktionsfel och skada.', faultAction: 'Fyll bara rätt vätska enligt instruktionsbok och utred läckage före färd.', sourceIds: testSources,
  },
  {
    id: 'random-view', title: 'Rutor och sikt', alwaysIncluded: false, prompt: 'Kontrollera rutor, speglar och fri sikt för ekipaget.',
    checklist: ['Rutor och speglar är rena och hela', 'Speglarna ger tillräcklig sikt längs släpet', 'Inget föremål skymmer sikten'],
    why: 'Ett brett och långt ekipage kräver god sikt bakåt och åt sidorna.', faultAction: 'Rengör, justera eller åtgärda skadan innan körning.', sourceIds: ['TRV-BE-PROV', 'TS-SLAP-REGLER'],
  },
  {
    id: 'random-steering', title: 'Styrning', alwaysIncluded: false, prompt: 'Beskriv och visa hur du kontrollerar styrningen.',
    checklist: ['Kontrollera onormalt glapp eller motstånd', 'Lyssna efter avvikande ljud', 'Kontrollera varningsindikering'],
    why: 'Styrfel kan göra att föraren förlorar kontrollen över hela ekipaget.', faultAction: 'Kör inte vidare med misstänkt styrfel; låt felet undersökas.', sourceIds: testSources,
  },
  {
    id: 'random-warnings', title: 'Varningssystem', alwaysIncluded: false, prompt: 'Kontrollera bilens varningssystem före färd.',
    checklist: ['Observera kontrollampornas självtest', 'Identifiera kvarstående varningar', 'Använd instruktionsboken för betydelsen'],
    why: 'En varning kan visa att en säkerhetskritisk funktion inte är redo.', faultAction: 'Ignorera inte okänd varning; slå upp den och åtgärda orsaken.', sourceIds: testSources,
  },
  {
    id: 'random-wipers', title: 'Vindrutetorkare och spolare', alwaysIncluded: false, prompt: 'Kontrollera vindrutetorkare och spolare.',
    checklist: ['Prova torkarnas funktion och bladens skick', 'Prova spolningen', 'Kontrollera att sikten blir fri'],
    why: 'Fungerande torkare och spolare behövs för att behålla sikten.', faultAction: 'Fyll rätt spolarvätska eller byt felaktiga delar före körning i dålig sikt.', sourceIds: testSources,
  },
];

export function nextPromptIndex(current: number, randomValue = Math.random()): number {
  if (safetyControlPrompts.length < 2) return 0;
  const clamped = Math.max(0, Math.min(randomValue, 0.999999));
  return (current + 1 + Math.floor(clamped * (safetyControlPrompts.length - 1))) % safetyControlPrompts.length;
}
