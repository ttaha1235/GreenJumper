const HANDLE='@GreenJumper';
const FALLBACK_CHANNEL_ID='UCcCEkPu1n4P8k57SvRxhvAQ';
let CHANNEL_ID=process.env.GREENJUMPER_CHANNEL_ID||FALLBACK_CHANNEL_ID;
const OPENAI_MODEL=process.env.OPENAI_MODEL||'gpt-5';
const WEEK_MS=7*864e5;
function weekCutoff(){const d=new Date();d.setUTCHours(0,0,0,0);d.setUTCDate(d.getUTCDate()-7);return d.getTime();}


async function resolveChannelId(){
  if(process.env.GREENJUMPER_CHANNEL_ID)return process.env.GREENJUMPER_CHANNEL_ID;
  try{const r=await fetch('https://www.youtube.com/'+HANDLE,{headers:{'user-agent':'Mozilla/5.0 (compatible; GreenJumperSite/1.0)','accept-language':'en-US,en;q=0.9'}});const t=await r.text();const m=t.match(/\"channelId\":\"(UC[\w-]{20,})\"/)||t.match(/\"externalId\":\"(UC[\w-]{20,})\"/)||t.match(/itemprop=\"channelId\" content=\"(UC[\w-]{20,})\"/);if(m)return m[1]}catch(_){ }
  return FALLBACK_CHANNEL_ID;
}
// Known GreenJumper players + spelling variants. AI is only needed when a title
// contains a player not yet represented here, or when a live data provider misses.
const PLAYERS=[
  ['Merchas Doski','ميرخاس دوسكي',['merkhas doski','merchas doski','mirchas doski','merkhasdowski','marhasdowski','ميرخاس دوسكي','ميرخاس دوشكي','ميرخاس']],
  ['Zidane Iqbal','زيدان إقبال',['zidane iqbal','zidan iqbal','زيدان إقبال','زيدان اقبال']],
  ['Muntadher Madjed','منتظر ماجد',['muntadher madjed','montadher madjed','muntadhar madjed','منتظر ماجد']],
  ['Aymen Hussein','أيمن حسين',['aymen hussein','aiman hussein','ayman hussein','أيمن حسين','ايمن حسين']],
  ['Ali Al-Hamadi','علي الحمادي',['ali al-hamadi','ali al hamadi','علي الحمادي']],
  ['Danilo Al-Saed','دانيلو السعيد',['danilo al-saed','danilo alsaed','danilo al saed','دانيلو السعيد','دانيلو الساعد']],
  ['Ibrahim Bayesh','إبراهيم بايش',['ibrahim bayesh','إبراهيم بايش','ابراهيم بايش']],
  ['Ali Jasim','علي جاسم',['ali jasim','ali jassim','علي جاسم']],
  ['Youssef Amyn','يوسف أمين',['youssef amyn','yusuf amyn','yousef amyn','يوسف أمين','يوسف امين']],
  ['Zaid Tahseen','زيد تحسين',['zaid tahseen','zaid tahsin','زيد تحسين']],
  ['Bashar Resan','بشار رسن',['bashar resan','bashar rasan','بشار رسن']],
  ['Ahmed Yasin','أحمد ياسين',['ahmed yasin','ahmad yasin','أحمد ياسين','احمد ياسين']],
  ['Haidar Abdul Kareem','حيدر عبد الكريم',['haidar abdul kareem','haider abdul kareem','حيدر عبد الكريم']],
  ['Peter Gwargis','بيتر كوركيس',['peter gwargis','peter gorgis','بيتر كوركيس','بيتر غورغيس']],
  ['Marwan Mirza','مروان ميرزا',['marwan mirza','marwan omir mirza','مروان ميرزا']],
  ['Ahmed Saeed','أحمد سعيد',['ahmed saeed','ahmad saeed','أحمد سعيد','احمد سعيد']],
  ['Ahmed Qasim','أحمد قاسم',['ahmed qasim','ahmad qasim','أحمد قاسم','احمد قاسم']],
  ['Marko Farji','ماركو فرجي',['marko farji','marko fargi','ماركو فرجي','ماركو فارجي']],
  ['Jussef Nasrawe','يوسف نصراوي',['jussef nasrawe','jussef nasrawi','yusef nasrawi','youssef nasrawi','youssef nasrawe','يوسف نصراوي']],
  ['Noah Darvich','نوح درويش',['noah darvich','noah darwich','نوح درويش','نوح دارفيش']],
  ['Akam Hashem','أكام هاشم',['akam hashem','أكام هاشم','اكام هاشم']],
  ['Dario Namo','داريو نامو',['dario namo','داريو نامو']],
  ['Hussein Ali','حسين علي',['hussein ali','حسين علي']],
  ['Amir Al-Ammari','أمير العماري',['amir al-ammari','amir al ammari','أمير العماري','امير العماري']],
  ['Mohanad Ali','مهند علي',['mohanad ali','muhannad ali','مهند علي']],
  ['Osama Rashid','أسامة رشيد',['osama rashid','أسامة رشيد','اسامة رشيد']],
  ['Rebin Sulaka','ريبين سولاقا',['rebin sulaka','rebin solaka','ريبين سولاقا','ريبين سولاكا']],
  ['Frans Putros','فرانس بطرس',['frans putros','فرانس بطرس']],
  ['Ali Adnan','علي عدنان',['ali adnan','علي عدنان']]
];

// High-confidence local fallback only. Live Sportmonks/OpenAI resolution overrides it.
const STATIC_LOCATIONS={
  'Aymen Hussein':loc('UZ','Uzbekistan','أوزبكستان','Pakhtakor',41.38,64.59),
  'Zaid Tahseen':loc('UZ','Uzbekistan','أوزبكستان','Pakhtakor',41.38,64.59),
  'Bashar Resan':loc('UZ','Uzbekistan','أوزبكستان','Pakhtakor',41.38,64.59),
  'Jussef Nasrawe':loc('AT','Austria','النمسا','SV Ried',47.52,14.55),
  'Noah Darvich':loc('DE','Germany','ألمانيا','SV Elversberg',51.17,10.45),
  'Marwan Mirza':loc('DE','Germany','ألمانيا','Borussia Dortmund',51.17,10.45),
  'Youssef Amyn':loc('CY','Cyprus','قبرص','AEK Larnaca',35.13,33.43),
  'Muntadher Madjed':loc('SE','Sweden','السويد','Hammarby IF',62.0,15.0),
  'Zidane Iqbal':loc('NL','Netherlands','هولندا','FC Utrecht',52.13,5.29),
  'Merchas Doski':loc('CZ','Czechia','التشيك','Viktoria Plzeň',49.82,15.47),
  'Ali Al-Hamadi':loc('GB','England','إنجلترا','Luton Town',52.36,-1.17),
  'Danilo Al-Saed':loc('NO','Norway','النرويج',null,60.47,8.47),
  'Hussein Ali':loc('PL','Poland','بولندا','Pogoń Szczecin',51.92,19.15),
  'Amir Al-Ammari':loc('PL','Poland','بولندا','Cracovia',51.92,19.15)
};
function loc(code,nameEn,nameAr,team,lat,lon){return {team:team?{name:team}:null,country:{code,nameEn,nameAr,lat,lon},source:'static'}}
function norm(s=''){return s.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ؤ/g,'و').replace(/ئ/g,'ي').replace(/[\u064B-\u065F\u0670]/g,'').replace(/[^\p{L}\p{N}]+/gu,' ').trim()}
function knownPlayers(title){const n=norm(title);return PLAYERS.filter(([, ,a])=>a.some(x=>n.includes(norm(x)))).map(([nameEn,nameAr])=>({nameEn,nameAr}))}
function decodeXml(s=''){return s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,'$1').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>')}
function tag(block,name){const m=block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`));return m?decodeXml(m[1].trim()):''}
async function fetchFeed(days){const r=await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(CHANNEL_ID)}`,{headers:{'user-agent':'Mozilla/5.0 (compatible; GreenJumperSite/1.0)'}});if(!r.ok)throw new Error('YouTube RSS '+r.status);const xml=await r.text(),cutoff=Date.now()-days*864e5;return (xml.match(/<entry>[\s\S]*?<\/entry>/g)||[]).map(b=>{const videoId=tag(b,'yt:videoId'),title=tag(b,'title'),published=tag(b,'published'),thumb=(b.match(/<media:thumbnail[^>]*url="([^"]+)"/)||[])[1]||`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;return {videoId,title,published,thumbnail:decodeXml(thumb),url:`https://www.youtube.com/watch?v=${videoId}`,visibility:'public'}}).filter(v=>v.videoId&&v.published&&new Date(v.published).getTime()>=cutoff).sort((a,b)=>new Date(b.published)-new Date(a.published))}
async function keepPublicYouTubeVideos(videos,key){
  if(!videos.length)return [];
  const publicDetails=new Map();
  for(let i=0;i<videos.length;i+=50){
    const ids=videos.slice(i,i+50).map(v=>v.videoId).filter(Boolean);
    if(!ids.length)continue;
    const u=new URL('https://www.googleapis.com/youtube/v3/videos');
    // Official YouTube statistics are tied to the exact video ID.
    u.searchParams.set('part','status,snippet,statistics');
    u.searchParams.set('id',ids.join(','));u.searchParams.set('key',key);
    const r=await fetch(u);if(!r.ok)throw new Error('YouTube video-details API '+r.status);
    const d=await r.json();
    for(const it of d.items||[]){
      if(it?.status?.privacyStatus==='public' && it?.snippet?.channelId===CHANNEL_ID){
        publicDetails.set(it.id,{
          views:it?.statistics?.viewCount!=null?Number(it.statistics.viewCount):null,
          likes:it?.statistics?.likeCount!=null?Number(it.statistics.likeCount):null
        });
      }
    }
  }
  return videos.filter(v=>publicDetails.has(v.videoId)).map(v=>({...v,visibility:'public',statistics:publicDetails.get(v.videoId)}));
}

async function fetchYouTubeApi(days,key){
  const cutoff=days===7?weekCutoff():Date.now()-days*864e5,playlistId='UU'+CHANNEL_ID.slice(2);let page='',out=[],pages=0;
  do{
    const u=new URL('https://www.googleapis.com/youtube/v3/playlistItems');
    u.searchParams.set('part','snippet,contentDetails');u.searchParams.set('playlistId',playlistId);u.searchParams.set('maxResults','50');u.searchParams.set('key',key);if(page)u.searchParams.set('pageToken',page);
    const r=await fetch(u);if(!r.ok)throw new Error('YouTube Data API '+r.status);const d=await r.json();pages++;
    for(const it of d.items||[]){
      const videoId=it.contentDetails?.videoId||it.snippet?.resourceId?.videoId,published=it.contentDetails?.videoPublishedAt||it.snippet?.publishedAt,title=it.snippet?.title||'';
      if(!videoId||!published||!title||title==='Private video'||title==='Deleted video')continue;
      if(new Date(published).getTime()<cutoff)continue;
      const t=it.snippet?.thumbnails||{};
      out.push({videoId,title,published,thumbnail:t.maxres?.url||t.standard?.url||t.high?.url||`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,url:`https://www.youtube.com/watch?v=${videoId}`});
    }
    page=d.nextPageToken||'';const last=d.items?.[d.items.length-1],ld=last&&(last.contentDetails?.videoPublishedAt||last.snippet?.publishedAt);if(ld&&new Date(ld).getTime()<cutoff)break;
  }while(page&&pages<6);
  return keepPublicYouTubeVideos(out.sort((a,b)=>new Date(b.published)-new Date(a.published)),key);
}

const playerCache=new Map(),aiCache=new Map();
function chooseCandidate(rows,name){const target=norm(name);function score(x){const vals=[x?.name,x?.display_name,[x?.firstname,x?.lastname].filter(Boolean).join(' ')].map(norm);return Math.max(0,...vals.map(v=>v===target?100:(v.includes(target)||target.includes(v)?70:0)))}return [...(rows||[])].sort((a,b)=>score(b)-score(a))[0]||null}
function chooseTeam(player){const now=Date.now(),links=Array.isArray(player?.teams)?player.teams:[];return links.map(x=>({link:x,team:x.team||x})).filter(x=>x.team?.name).sort((a,b)=>{const ae=a.link?.end?new Date(a.link.end).getTime():Infinity,be=b.link?.end?new Date(b.link.end).getTime():Infinity;if((be>=now)!==(ae>=now))return be>=now?1:-1;return (new Date(b.link?.start||0).getTime()||0)-(new Date(a.link?.start||0).getTime()||0)})[0]||null}
async function sportmonksLocation(nameEn){const token=process.env.SPORTMONKS_API_TOKEN;if(!token)return null;const key='sm:'+nameEn;if(playerCache.has(key)&&Date.now()-playerCache.get(key).at<12*3600e3)return playerCache.get(key).value;try{const u=`https://api.sportmonks.com/v3/football/players/search/${encodeURIComponent(nameEn)}?include=teams.team.country&per_page=10`;const r=await fetch(u,{headers:{Authorization:token,'User-Agent':'GreenJumperSite/1.0'}});if(!r.ok)throw new Error('Sportmonks '+r.status);const d=await r.json(),p=chooseCandidate(d.data,nameEn),pick=chooseTeam(p),team=pick?.team,c=team?.country;if(!team||!c)return null;const value={team:{id:team.id||null,name:team.name||''},country:{code:c.iso2||c.iso_alpha_2||null,nameEn:c.name||'',nameAr:c.name||'',lat:Number(c.latitude)||null,lon:Number(c.longitude)||null},source:'sportmonks'};playerCache.set(key,{at:Date.now(),value});return value}catch(_){return null}}
function outputText(d){if(typeof d?.output_text==='string')return d.output_text;let s='';for(const item of d?.output||[])for(const c of item?.content||[])if(c?.type==='output_text'&&c?.text)s+=c.text;return s}
async function aiResearch(title,known=[]){const apiKey=process.env.OPENAI_API_KEY;if(!apiKey)return [];const cacheKey=title+'|'+known.map(x=>x.nameEn).join(',');if(aiCache.has(cacheKey)&&Date.now()-aiCache.get(cacheKey).at<12*3600e3)return aiCache.get(cacheKey).value;const schema={type:'object',additionalProperties:false,properties:{players:{type:'array',items:{type:'object',additionalProperties:false,properties:{nameEn:{type:'string'},nameAr:{type:'string'},team:{type:'string'},countryName:{type:'string'},countryCode:{type:'string'},confidence:{type:'number'}},required:['nameEn','nameAr','team','countryName','countryCode','confidence']}}},required:['players']};const prompt=`You resolve GreenJumper Iraqi-football YouTube uploads. Video title: ${JSON.stringify(title)}. ${known.length?'Likely players already detected: '+known.map(x=>x.nameEn).join(', ')+'.':''} Identify only Iraqi or Iraq-eligible football players clearly represented by this title. Research each player's CURRENT club as of today, and return the COUNTRY WHERE THAT CLUB PLAYS. Do not use birthplace, nationality, opponent country, or national-team venue. If the title does not identify a player, return an empty players array. Prefer official club/league sources and current reliable football databases.`;try{const r=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json'},body:JSON.stringify({model:OPENAI_MODEL,tools:[{type:'web_search'}],input:prompt,text:{format:{type:'json_schema',name:'greenjumper_player_resolution',strict:true,schema}}})});if(!r.ok)throw new Error('OpenAI '+r.status);const d=await r.json(),parsed=JSON.parse(outputText(d)||'{"players":[]}'),value=(parsed.players||[]).filter(p=>p.nameEn&&p.countryCode).map(p=>({nameEn:p.nameEn,nameAr:p.nameAr||p.nameEn,team:p.team?{name:p.team}:null,country:{code:String(p.countryCode).toUpperCase(),nameEn:p.countryName||'',nameAr:p.countryName||'',lat:null,lon:null},source:'openai',confidence:p.confidence}));aiCache.set(cacheKey,{at:Date.now(),value});return value}catch(_){return []}}
async function resolveVideo(v){let base=knownPlayers(v.title),ai=[];const useAI=!!process.env.OPENAI_API_KEY;if(!base.length&&useAI){ai=await aiResearch(v.title,[]);base=ai.map(x=>({nameEn:x.nameEn,nameAr:x.nameAr}))}const out=[];for(const p of base){let resolved=await sportmonksLocation(p.nameEn);if(!resolved&&useAI){let hit=ai.find(x=>norm(x.nameEn)===norm(p.nameEn));if(!hit){const got=await aiResearch(v.title,[p]);hit=got.find(x=>norm(x.nameEn)===norm(p.nameEn))||got[0]}if(hit)resolved={team:hit.team,country:hit.country,source:'openai'}}if(!resolved)resolved=STATIC_LOCATIONS[p.nameEn]||null;out.push({...p,team:resolved?.team||null,country:resolved?.country||null,locationSource:resolved?.source||'unresolved'})}return {...v,players:out}}
async function mapLimit(items,limit,fn){const out=new Array(items.length);let i=0;async function worker(){for(;;){const n=i++;if(n>=items.length)return;try{out[n]=await fn(items[n],n)}catch(_){out[n]={...items[n],players:[]}}}}await Promise.all(Array.from({length:Math.min(limit,items.length)},worker));return out}

module.exports=async(req,res)=>{try{const days=7;CHANNEL_ID=await resolveChannelId();let videos;if(process.env.YOUTUBE_API_KEY)videos=await fetchYouTubeApi(days,process.env.YOUTUBE_API_KEY);else videos=await fetchFeed(days);videos=videos.filter(v=>v.visibility==='public'&&new Date(v.published).getTime()>=weekCutoff());videos=await mapLimit(videos,3,resolveVideo);const weekly=videos.filter(v=>v.visibility==='public'&&new Date(v.published).getTime()>=weekCutoff());const countries=[...new Set(weekly.flatMap(v=>v.players||[]).map(p=>p.country?.code).filter(Boolean))];res.setHeader('Cache-Control','s-maxage=120, stale-while-revalidate=600');res.setHeader('Content-Type','application/json; charset=utf-8');res.status(200).json({channel:'GreenJumper',handle:HANDLE,days,visibility:'public-only',window:'last-7-calendar-days-inclusive',updatedAt:new Date().toISOString(),resolver:{youtube:process.env.YOUTUBE_API_KEY?'data-api+status-check':'public-rss',playerData:process.env.SPORTMONKS_API_TOKEN?'sportmonks':(process.env.OPENAI_API_KEY?'openai+fallback':'fallback'),ai:!!process.env.OPENAI_API_KEY},countriesThisWeek:countries,videos:weekly})}catch(e){res.status(502).json({error:'Unable to build live GreenJumper coverage',detail:String(e?.message||e)})}};
