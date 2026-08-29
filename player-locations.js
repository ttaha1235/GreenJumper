const TRACKED_PLAYERS = [
  ['Merchas Doski','ميرخاس دوسكي'],['Zidane Iqbal','زيدان إقبال'],['Muntadher Madjed','منتظر ماجد'],['Aymen Hussein','أيمن حسين'],['Ali Al-Hamadi','علي الحمادي'],['Danilo Al-Saed','دانيلو السعيد'],['Ibrahim Bayesh','إبراهيم بايش'],['Ali Jasim','علي جاسم'],['Youssef Amyn','يوسف أمين'],['Zaid Tahseen','زيد تحسين'],['Bashar Resan','بشار رسن'],['Ahmed Yasin','أحمد ياسين'],['Haidar Abdul Kareem','حيدر عبد الكريم'],['Peter Gwargis','بيتر كوركيس'],['Marwan Mirza','مروان ميرزا'],['Ahmed Saeed','أحمد سعيد'],['Ahmed Qasim','أحمد قاسم'],['Marko Farji','ماركو فرجي'],['Jussef Nasrawe','يوسف نصراوي'],['Noah Darvich','نوح درويش'],['Akam Hashem','أكام هاشم'],['Dario Namo','داريو نامو'],['Hussein Ali','حسين علي'],['Amir Al-Ammari','أمير العماري'],['Mohanad Ali','مهند علي'],['Osama Rashid','أسامة رشيد'],['Rebin Sulaka','ريبين سولاقا'],['Frans Putros','فرانس بطرس'],['Ali Adnan','علي عدنان']
];
const FALLBACK = {
  'Aymen Hussein': ['UZ','Uzbekistan','أوزبكستان',41.38,64.59,'Pakhtakor'],
  'Zaid Tahseen': ['UZ','Uzbekistan','أوزبكستان',41.38,64.59,'Pakhtakor'],
  'Bashar Resan': ['UZ','Uzbekistan','أوزبكستان',41.38,64.59,'Pakhtakor'],
  'Jussef Nasrawe': ['AT','Austria','النمسا',47.52,14.55,'SV Ried'],
  'Noah Darvich': ['DE','Germany','ألمانيا',51.17,10.45,'SV Elversberg'],
  'Youssef Amyn': ['CY','Cyprus','قبرص',35.13,33.43,'AEK Larnaca'],
  'Marwan Mirza': ['DE','Germany','ألمانيا',51.17,10.45,'Borussia Dortmund'],
  'Muntadher Madjed': ['SE','Sweden','السويد',62,15,'Hammarby IF'],
  'Zidane Iqbal': ['NL','Netherlands','هولندا',52.13,5.29,'FC Utrecht'],
  'Merchas Doski': ['CZ','Czechia','التشيك',49.82,15.47,'Viktoria Plzeň'],
  'Ali Al-Hamadi': ['GB','England','إنجلترا',52.36,-1.17,'Luton Town'],
  'Danilo Al-Saed': ['NO','Norway','النرويج',60.47,8.47,null],
  'Hussein Ali': ['PL','Poland','بولندا',51.92,19.15,'Pogoń Szczecin'],
  'Amir Al-Ammari': ['PL','Poland','بولندا',51.92,19.15,'Cracovia']
};
let memory={at:0,data:null};
function norm(s=''){return s.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim()}
function fallbackPlayers(){return TRACKED_PLAYERS.map(([nameEn,nameAr])=>{const f=FALLBACK[nameEn];return {nameEn,nameAr,team:f&&f[5]?{name:f[5]}:null,country:f?{code:f[0],nameEn:f[1],nameAr:f[2],lat:f[3],lon:f[4]}:null,source:'fallback'}}).filter(p=>p.country)}
async function fetchJSON(url,token){const r=await fetch(url,{headers:{Authorization:token,'User-Agent':'GreenJumperSite/1.0'}});if(!r.ok)throw new Error('Sportmonks '+r.status);return r.json()}
async function countryById(id,token,cache){if(!id)return null;if(cache.has(id))return cache.get(id);try{const d=await fetchJSON(`https://api.sportmonks.com/v3/core/countries/${id}`,token);const c=d?.data||null;cache.set(id,c);return c}catch(_){return null}}
function chooseCandidate(rows,name){const target=norm(name);return [...rows].sort((a,b)=>{const vals=x=>[x.name,x.display_name,[x.firstname,x.lastname].filter(Boolean).join(' ')].map(norm);const score=x=>Math.max(...vals(x).map(v=>v===target?100:v.includes(target)||target.includes(v)?70:0));return score(b)-score(a)})[0]||null}
function chooseTeam(player){const now=Date.now();const links=Array.isArray(player?.teams)?player.teams:[];return links.map(x=>({link:x,team:x.team||x})).filter(x=>x.team?.name).sort((a,b)=>{const ae=a.link?.end?new Date(a.link.end).getTime():Infinity,be=b.link?.end?new Date(b.link.end).getTime():Infinity;const aa=ae>=now?1:0,ba=be>=now?1:0;if(aa!==ba)return ba-aa;const as=new Date(a.link?.start||0).getTime()||0,bs=new Date(b.link?.start||0).getTime()||0;return bs-as})[0]||null}
async function lookupPlayer(nameEn,nameAr,token,countryCache){
  const u=`https://api.sportmonks.com/v3/football/players/search/${encodeURIComponent(nameEn)}?include=teams.team.country&per_page=10`;
  const d=await fetchJSON(u,token);const player=chooseCandidate(d?.data||[],nameEn);if(!player)return null;const picked=chooseTeam(player);if(!picked)return null;const team=picked.team;let country=team.country||null;if(!country&&team.country_id)country=await countryById(team.country_id,token,countryCache);if(!country)return null;
  return {nameEn,nameAr,playerId:player.id||null,team:{id:team.id||null,name:team.name||'',shortCode:team.short_code||null},country:{code:country.iso2||null,nameEn:country.name||'',nameAr:country.name||'',lat:Number(country.latitude)||null,lon:Number(country.longitude)||null},source:'sportmonks'};
}
async function mapLimit(items,limit,fn){const out=new Array(items.length);let i=0;async function worker(){while(true){const n=i++;if(n>=items.length)return;try{out[n]=await fn(items[n],n)}catch(_){out[n]=null}}}await Promise.all(Array.from({length:Math.min(limit,items.length)},worker));return out}
module.exports=async(req,res)=>{
  try{
    if(memory.data&&Date.now()-memory.at<6*3600e3){res.setHeader('Cache-Control','s-maxage=21600, stale-while-revalidate=86400');return res.status(200).json(memory.data)}
    const token=process.env.SPORTMONKS_API_TOKEN;
    let players=fallbackPlayers(),provider='fallback';
    if(token){
      const countryCache=new Map();const live=await mapLimit(TRACKED_PLAYERS,4,([en,ar])=>lookupPlayer(en,ar,token,countryCache));const liveMap=new Map(live.filter(Boolean).map(p=>[p.nameEn,p]));players=TRACKED_PLAYERS.map(([en,ar])=>liveMap.get(en)||fallbackPlayers().find(p=>p.nameEn===en)).filter(Boolean);provider='sportmonks';
    }
    const data={provider,updatedAt:new Date().toISOString(),players};memory={at:Date.now(),data};res.setHeader('Cache-Control','s-maxage=21600, stale-while-revalidate=86400');res.setHeader('Content-Type','application/json; charset=utf-8');res.status(200).json(data);
  }catch(e){res.status(502).json({error:'Unable to sync player locations',detail:String(e?.message||e)});}
};
