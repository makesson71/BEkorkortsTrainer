import { describe, expect, it } from 'vitest';
import { calculateStaticReactions, classifyStability, exerciseOverallPass } from '../src/domain/loadStability';
import { loadLabQuestions, loadScenarios } from '../src/data/loadStability';
import { sourceById } from '../src/data/sources';

const beam = (loads: {id:string;label:string;massKg:number;positionM:number}[]) => calculateStaticReactions({couplingM:0,axleM:3,loads});
describe('static single-axle beam model', () => {
  it('preserves force and both moment equilibria', () => { const r=beam([{id:'a',label:'A',massKg:400,positionM:1},{id:'b',label:'B',massKg:200,positionM:2.5}]); expect(r.couplingKg+r.axleKg).toBeCloseTo(r.totalMassKg); expect(r.momentAboutCouplingKgM).toBeCloseTo(0); expect(r.momentAboutAxleKgM).toBeCloseTo(0) });
  it('splits a centred load equally',()=>{const r=beam([{id:'a',label:'A',massKg:600,positionM:1.5}]);expect(r.couplingKg).toBeCloseTo(300);expect(r.axleKg).toBeCloseTo(300)});
  it('increases coupling reaction when load moves forward',()=>expect(beam([{id:'a',label:'A',massKg:300,positionM:1}]).couplingKg).toBeGreaterThan(beam([{id:'a',label:'A',massKg:300,positionM:2}]).couplingKg));
  it('decreases coupling reaction when load moves rearward',()=>expect(beam([{id:'a',label:'A',massKg:300,positionM:3.5}]).couplingKg).toBeLessThan(beam([{id:'a',label:'A',massKg:300,positionM:2.5}]).couplingKg));
  it('combines multiple loads by moments',()=>{const r=beam([{id:'a',label:'A',massKg:100,positionM:1},{id:'b',label:'B',massKg:100,positionM:2}]);expect(r.centreOfMassM).toBeCloseTo(1.5);expect(r.couplingKg).toBeCloseTo(100)});
  it('handles zero load and load exactly over axle',()=>{expect(beam([])).toMatchObject({totalMassKg:0,centreOfMassM:null,couplingKg:0,axleKg:0});expect(beam([{id:'a',label:'A',massKg:200,positionM:3}])).toMatchObject({couplingKg:0,axleKg:200})});
  it('calculates configured front and rear boundaries',()=>{expect(beam([{id:'a',label:'A',massKg:300,positionM:.5}]).couplingKg).toBeCloseTo(250);expect(beam([{id:'a',label:'A',massKg:300,positionM:4}]).couplingKg).toBeCloseTo(-100)});
  it('accepts technical limits exactly equal to reactions',()=>{const r=beam([{id:'a',label:'A',massKg:300,positionM:2}]);expect(classifyStability(r,[50,150],100,200)).toBe('balanced')});
});
describe('separate semantics',()=>{
  it('licence pass does not imply stability pass',()=>expect(exerciseOverallPass({licencePass:true,technicalPass:true,stabilityPass:false,securementPass:true})).toBe(false));
  it('stability pass does not imply licence pass',()=>expect(exerciseOverallPass({licencePass:false,technicalPass:true,stabilityPass:true,securementPass:true})).toBe(false));
  it('technical pass does not imply securement pass',()=>expect(exerciseOverallPass({licencePass:true,technicalPass:true,stabilityPass:true,securementPass:false})).toBe(false));
});
describe('load lab content integrity',()=>{
  it('contains six drills and requested question groups',()=>{expect(loadScenarios).toHaveLength(6);expect(loadLabQuestions.filter(q=>q.kind==='securing')).toHaveLength(4);expect(loadLabQuestions.filter(q=>q.kind==='stability')).toHaveLength(3);expect(loadLabQuestions.filter(q=>q.kind==='separation')).toHaveLength(3)});
  it('resolves every claim to an authority source',()=>{for(const item of [...loadScenarios,...loadLabQuestions]){expect(item.sourceIds.length).toBeGreaterThan(0);for(const id of item.sourceIds){expect(sourceById[id]).toBeDefined();expect(['Transportstyrelsen','Trafikverket','Sveriges riksdag']).toContain(sourceById[id].publisher)}}});
  it('contains no unsupported universal number or official-question claim',()=>{const value=JSON.stringify({loadScenarios,loadLabQuestions}).toLowerCase();expect(value).not.toMatch(/officiell(a|t)? traf(i|ik)kverket|\b\d+\s*%.*kultryck|friktionskoefficient\s*(är|=)\s*\d|bandkapacitet\s*(är|=)\s*\d/) });
});
