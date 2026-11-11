const $ = (id) => document.getElementById(id);
let rows = [];
let headers = [];
let numericColumns = [];
let histChart = null;
let freqChart = null;

const sample = [
  {"Dias de atividade física por semana":0,"Porções de frutas por semana":2,"Horas de sono por noite":6,"Bebidas açucaradas por semana":5,"Horas de tela por semana":12},
  {"Dias de atividade física por semana":1,"Porções de frutas por semana":3,"Horas de sono por noite":7,"Bebidas açucaradas por semana":5,"Horas de tela por semana":15},
  {"Dias de atividade física por semana":1,"Porções de frutas por semana":1,"Horas de sono por noite":8,"Bebidas açucaradas por semana":0,"Horas de tela por semana":10},
  {"Dias de atividade física por semana":2,"Porções de frutas por semana":4,"Horas de sono por noite":7,"Bebidas açucaradas por semana":8,"Horas de tela por semana":20},
  {"Dias de atividade física por semana":1,"Porções de frutas por semana":2,"Horas de sono por noite":6,"Bebidas açucaradas por semana":5,"Horas de tela por semana":18},
  {"Dias de atividade física por semana":0,"Porções de frutas por semana":1,"Horas de sono por noite":5,"Bebidas açucaradas por semana":20,"Horas de tela por semana":30},
  {"Dias de atividade física por semana":4,"Porções de frutas por semana":5,"Horas de sono por noite":8,"Bebidas açucaradas por semana":2,"Horas de tela por semana":8},
  {"Dias de atividade física por semana":5,"Porções de frutas por semana":6,"Horas de sono por noite":9,"Bebidas açucaradas por semana":1,"Horas de tela por semana":25},
  {"Dias de atividade física por semana":1,"Porções de frutas por semana":2,"Horas de sono por noite":7,"Bebidas açucaradas por semana":7,"Horas de tela por semana":14},
  {"Dias de atividade física por semana":0,"Porções de frutas por semana":0,"Horas de sono por noite":4,"Bebidas açucaradas por semana":40,"Horas de tela por semana":50},
  {"Dias de atividade física por semana":2,"Porções de frutas por semana":3,"Horas de sono por noite":6,"Bebidas açucaradas por semana":3,"Horas de tela por semana":16},
  {"Dias de atividade física por semana":7,"Porções de frutas por semana":8,"Horas de sono por noite":10,"Bebidas açucaradas por semana":6,"Horas de tela por semana":22}
];

function toNumber(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (value === null || value === undefined || String(value).trim() === "") return null;
  let s = String(value).trim().replace(/\s/g, "");
  if (/^-?\d{1,3}(\.\d{3})+,\d+$/.test(s)) s = s.replace(/\./g, "").replace(",", ".");
  else if (/^-?\d+,\d+$/.test(s)) s = s.replace(",", ".");
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}
function valuesFor(col) {
  return rows.map(r => toNumber(r[col])).filter(v => v !== null);
}
function mean(a) { return a.reduce((s,v)=>s+v,0)/a.length; }
function median(a) {
  const b=[...a].sort((x,y)=>x-y), m=Math.floor(b.length/2);
  return b.length%2 ? b[m] : (b[m-1]+b[m])/2;
}
function percentile(a,p) {
  const b=[...a].sort((x,y)=>x-y);
  if (!b.length) return NaN;
  const pos=(b.length-1)*p, lo=Math.floor(pos), hi=Math.ceil(pos);
  return b[lo]+(b[hi]-b[lo])*(pos-lo);
}
function std(a) {
  if(a.length<2) return 0;
  const m=mean(a);
  return Math.sqrt(a.reduce((s,v)=>s+(v-m)**2,0)/(a.length-1));
}
function fmt(n) {
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("pt-BR",{maximumFractionDigits:2}).format(n);
}
function setStatus(msg, error=false) {
  $("dataStatus").textContent=msg;
  $("dataStatus").style.background=error?"#fff0ed":"#edf8f2";
  $("dataStatus").style.color=error?"#b34d3c":"#547465";
}
function loadData(data, label) {
  if (!data || !data.length) { setStatus("O arquivo não contém linhas de dados.",true); return; }
  headers=Object.keys(data[0] || {});
  rows=data.filter(r=>r && Object.values(r).some(v=>String(v??"").trim()!==""));
  numericColumns=headers.filter(h=>rows.filter(r=>toNumber(r[h])!==null).length>=2);
  if (!numericColumns.length) { setStatus("Não encontrei colunas numéricas. Confira se as respostas da planilha são números.",true); return; }
  const select=$("columnSelect");
  select.innerHTML="";
  numericColumns.forEach(h=>{const op=document.createElement("option");op.value=h;op.textContent=h;select.appendChild(op);});
  setStatus(`${label} · ${rows.length} registros carregados · ${numericColumns.length} colunas numéricas identificadas.`);
  renderTable();
  renderAnalysis();
}
function renderTable() {
  $("rowsLabel").textContent=`${rows.length} linhas`;
  $("dataHead").innerHTML="<tr>"+headers.map(h=>`<th>${escapeHtml(h)}</th>`).join("")+"</tr>";
  $("dataBody").innerHTML=rows.slice(0,8).map(r=>"<tr>"+headers.map(h=>`<td>${escapeHtml(r[h]??"")}</td>`).join("")+"</tr>").join("");
}
function escapeHtml(v) {
  return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
function renderAnalysis() {
  const col=$("columnSelect").value;
  const a=valuesFor(col);
  if(!a.length) return;
  const m=mean(a), med=median(a), sd=std(a), min=Math.min(...a), max=Math.max(...a);
  const q1=percentile(a,.25), q3=percentile(a,.75), iqr=q3-q1;
  const low=q1-1.5*iqr, high=q3+1.5*iqr;
  const out=a.filter(v=>v<low||v>high);
  $("kCount").textContent=fmt(a.length);
  $("kMean").textContent=fmt(m);
  $("kMedian").textContent=fmt(med);
  $("kStd").textContent=fmt(sd);
  const stats=[
    ["Quantidade de valores (count)",a.length],["Média (mean)",m],["Desvio padrão (std)",sd],
    ["Valor mínimo (min)",min],["Primeiro quartil (25%)",q1],["Mediana (50%)",med],
    ["Terceiro quartil (75%)",q3],["Valor máximo (max)",max]
  ];
  $("statsTable").innerHTML=stats.map(([k,v])=>`<tr><td>${k}</td><td>${fmt(v)}</td></tr>`).join("");
  $("outlierCount").textContent=out.length;
  $("outlierText").textContent=out.length?`Valores identificados: ${out.map(fmt).join(", ")}. Verifique se são respostas possíveis ou erros de preenchimento.`:"Nenhum valor foi identificado fora dos limites calculados pelo método IQR.";
  $("lowerFence").textContent=`Limite inferior: ${fmt(low)}`;
  $("upperFence").textContent=`Limite superior: ${fmt(high)}`;
  const freq=new Map(); a.forEach(v=>freq.set(v,(freq.get(v)||0)+1));
  const sorted=[...freq.entries()].sort((x,y)=>x[0]-y[0]);
  const mode=sorted.reduce((best,item)=>item[1]>best[1]?item:best,sorted[0]);
  $("autoInsight").textContent=`Na variável “${col}”, foram analisadas ${a.length} respostas. A média foi ${fmt(m)} e a mediana foi ${fmt(med)}. O valor que mais se repetiu foi ${fmt(mode[0])}, aparecendo ${mode[1]} vez(es). ${Math.abs(m-med)>sd?"A média e a mediana apresentam uma diferença considerável; vale investigar possíveis valores extremos.":"A média e a mediana estão relativamente próximas, sugerindo que não há grande afastamento entre essas duas medidas."}`;
  drawHistogram(a);
  drawFrequency(sorted);
}
function drawHistogram(a) {
  const min=Math.min(...a),max=Math.max(...a),bins=Math.min(8,Math.max(3,Math.ceil(Math.sqrt(a.length))));
  const width=(max-min)/bins || 1;
  const counts=Array(bins).fill(0), labels=[];
  a.forEach(v=>{let i=Math.min(bins-1,Math.floor((v-min)/width));counts[i]++;});
  for(let i=0;i<bins;i++){const lo=min+i*width,hi=i===bins-1?max:min+(i+1)*width;labels.push(`${fmt(lo)}–${fmt(hi)}`);}
  if(histChart)histChart.destroy();
  histChart=new Chart($("histChart"),{type:"bar",data:{labels,datasets:[{data:counts,backgroundColor:"#2b9c78",borderRadius:5,borderSkipped:false,maxBarThickness:48}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>`${c.raw} resposta(s)`}}},scales:{x:{grid:{display:false},ticks:{font:{size:9},color:"#7b8995"}},y:{beginAtZero:true,ticks:{precision:0,font:{size:9}},grid:{color:"#edf1f3"}}}}});
}
function drawFrequency(sorted) {
  const top=sorted.slice().sort((a,b)=>b[1]-a[1]).slice(0,10).sort((a,b)=>a[0]-b[0]);
  if(freqChart)freqChart.destroy();
  freqChart=new Chart($("freqChart"),{type:"bar",data:{labels:top.map(x=>fmt(x[0])),datasets:[{data:top.map(x=>x[1]),backgroundColor:"#7797d6",borderRadius:5,maxBarThickness:34}]},options:{indexAxis:"y",responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>`${c.raw} ocorrência(s)`}}},scales:{x:{beginAtZero:true,ticks:{precision:0,font:{size:9}},grid:{color:"#edf1f3"}},y:{grid:{display:false},ticks:{font:{size:9},color:"#71808d"}}}}});
}
$("csvFile").addEventListener("change",e=>{
  const file=e.target.files[0]; if(!file)return;
  if(!window.Papa){setStatus("Não foi possível carregar o leitor CSV. Verifique sua conexão com a internet.",true);return;}
  Papa.parse(file,{header:true,skipEmptyLines:true,dynamicTyping:false,complete:r=>loadData(r.data,`Arquivo: ${file.name}`),error:()=>setStatus("Erro ao ler o arquivo CSV.",true)});
});
$("columnSelect").addEventListener("change",renderAnalysis);
$("sampleBtn").addEventListener("click",()=>loadData(sample,"Dados demonstrativos carregados"));
loadData(sample,"Dados demonstrativos carregados");
