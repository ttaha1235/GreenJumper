const HANDLE = '@GreenJumper';
function weekCutoff(){const d=new Date();d.setUTCHours(0,0,0,0);d.setUTCDate(d.getUTCDate()-7);return d.getTime();}
const FALLBACK_CHANNEL_ID = process.env.GREENJUMPER_CHANNEL_ID || 'UCcCEkPu1n4P8k57SvRxhvAQ';

const PLAYERS = [
  ['Merchas Doski','ميرخاس دوسكي',['merkhas doski','merchas doski','mirchas doski','merkhasdowski','marhasdowski','ميرخاس دوسكي','ميرخاس دوشكي','ميرخاس']],
  ['Zidane Iqbal','زيدان إقبال',['zidane iqbal','zidan iqbal','زيدان إقبال','زيدان اقبال']],
  ['Muntadher Madjed','منتظر ماجد',['muntadher madjed','montadher madjed','muntadhar madjed','منتظر ماجد']],
  ['Aymen Hussein','أيمن حسين',['aymen hussein','aiman hussein','أيمن حسين','ايمن حسين']],
  ['Ali Al-Hamadi','علي الحمادي',['ali al-hamadi','ali al hamadi','علي الحمادي']],
  ['Danilo Al-Saed','دانيلو السعيد',['danilo al-saed','danilo alsaed','danilo al saed','دانيلو السعيد','دانيلو الساعد']],
  ['Ibrahim Bayesh','إبراهيم بايش',['ibrahim bayesh','ibrahim bayesh','إبراهيم بايش','ابراهيم بايش']],
  ['Ali Jasim','علي جاسم',['ali jasim','ali jassim','علي جاسم']],
  ['Youssef Amyn','يوسف أمين',['youssef amyn','yusuf amyn','yousef amyn','يوسف أمين','يوسف امين']],
  ['Zaid Tahseen','زيد تحسين',['zaid tahseen','zaid tahsin','زيد تحسين']],
  ['Bashar Resan','بشار رسن',['bashar resan','bashar rasan','بشار رسن']],
  ['Ahmed Yasin','أحمد ياسين',['ahmed yasin','ahmad yasin','أحمد ياسين','احمد ياسين']],
  ['Haidar Abdul Kareem','حيدر عبد الكريم',['haidar abdul kareem','haider abdul kareem','حيدر عبد الكريم']],
  ['Peter Gwargis','بيتر كوركيس',['peter gwargis','peter gorgis','بيتر كوركيس','بيتر غورغيس']],
  ['Marwan Mirza','مروان ميرزا',['marwan mirza','مروان ميرزا']],
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


const PLAYER_COUNTRIES = {
  'Merchas Doski': {code:'CZ',nameEn:'Czechia',nameAr:'التشيك',lat:49.82,lon:15.47},
  'Zidane Iqbal': {code:'NL',nameEn:'Netherlands',nameAr:'هولندا',lat:52.13,lon:5.29},
  'Muntadher Madjed': {code:'SE',nameEn:'Sweden',nameAr:'السويد',lat:62.0,lon:15.0},
  'Aymen Hussein': {code:'UZ',nameEn:'Uzbekistan',nameAr:'أوزبكستان',lat:41.38,lon:64.59},
  'Ali Al-Hamadi': {code:'GB',nameEn:'England',nameAr:'إنجلترا',lat:52.36,lon:-1.17},
  'Danilo Al-Saed': {code:'NO',nameEn:'Norway',nameAr:'النرويج',lat:60.47,lon:8.47},
  'Ibrahim Bayesh': {code:'AE',nameEn:'United Arab Emirates',nameAr:'الإمارات',lat:23.42,lon:53.85},
  'Ali Jasim': {code:'IQ',nameEn:'Iraq',nameAr:'العراق',lat:33.22,lon:43.68},
  'Zaid Tahseen': {code:'UZ',nameEn:'Uzbekistan',nameAr:'أوزبكستان',lat:41.38,lon:64.59},
  'Bashar Resan': {code:'UZ',nameEn:'Uzbekistan',nameAr:'أوزبكستان',lat:41.38,lon:64.59},
  'Ahmed Yasin': {code:'SE',nameEn:'Sweden',nameAr:'السويد',lat:62.0,lon:15.0},
  'Haidar Abdul Kareem': {code:'SA',nameEn:'Saudi Arabia',nameAr:'السعودية',lat:23.89,lon:45.08},
  'Peter Gwargis': {code:'EG',nameEn:'Egypt',nameAr:'مصر',lat:26.82,lon:30.80},
  'Marwan Mirza': {code:'DE',nameEn:'Germany',nameAr:'ألمانيا',lat:51.17,lon:10.45},
  'Youssef Amyn': {code:'CY',nameEn:'Cyprus',nameAr:'قبرص',lat:35.13,lon:33.43},
  'Jussef Nasrawe': {code:'AT',nameEn:'Austria',nameAr:'النمسا',lat:47.52,lon:14.55},
  'Noah Darvich': {code:'DE',nameEn:'Germany',nameAr:'ألمانيا',lat:51.17,lon:10.45},
};

function normalize(s=''){
  return s.toLowerCase()
    .normalize('NFKD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ؤ/g,'و').replace(/ئ/g,'ي')
    .replace(/[\u064B-\u065F\u0670]/g,'')
    .replace(/[^\p{L}\p{N}]+/gu,' ').trim();
}
function playersFor(title){
  const n=normalize(title);
  return PLAYERS.filter(([, ,aliases])=>aliases.some(a=>n.includes(normalize(a)))).map(([nameEn,nameAr])=>({nameEn,nameAr,country:PLAYER_COUNTRIES[nameEn]||null}));
}
function decodeXml(s=''){
  return s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,'$1').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>');
}
function tag(block,name){ const m=block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`)); return m?decodeXml(m[1].trim()):''; }
async function resolveChannelId(){
  if(process.env.GREENJUMPER_CHANNEL_ID) return process.env.GREENJUMPER_CHANNEL_ID;
  try{
    const r=await fetch('https://www.youtube.com/'+HANDLE,{headers:{'user-agent':'Mozilla/5.0 (compatible; GreenJumperSite/1.0)','accept-language':'en-US,en;q=0.9'}});
    const t=await r.text();
    const m=t.match(/"channelId":"(UC[\w-]{20,})"/)||t.match(/"externalId":"(UC[\w-]{20,})"/)||t.match(/itemprop="channelId" content="(UC[\w-]{20,})"/);
    if(m) return m[1];
  }catch(e){}
  return FALLBACK_CHANNEL_ID;
}
async function fetchFeed(channelId){
  const u='https://www.youtube.com/feeds/videos.xml?channel_id='+encodeURIComponent(channelId);
  const r=await fetch(u,{headers:{'user-agent':'Mozilla/5.0 (compatible; GreenJumperSite/1.0)'}});
  if(!r.ok) throw new Error('YouTube feed '+r.status);
  return r.text();
}
function parse(xml,days){
  const cutoff=days===7?weekCutoff():Date.now()-days*864e5;
  const entries=xml.match(/<entry>[\s\S]*?<\/entry>/g)||[];
  return entries.map(block=>{
    const videoId=tag(block,'yt:videoId'); const title=tag(block,'title'); const published=tag(block,'published');
    const thumb=(block.match(/<media:thumbnail[^>]*url="([^"]+)"/)||[])[1]||(`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`);
    return {videoId,title,published,thumbnail:decodeXml(thumb),url:`https://www.youtube.com/watch?v=${videoId}`,players:playersFor(title)};
  }).filter(v=>v.videoId&&v.published&&new Date(v.published).getTime()>=cutoff).sort((a,b)=>new Date(b.published)-new Date(a.published));
}

async function fetchApiHistory(channelId,days,key){
  const cutoff=days===7?weekCutoff():Date.now()-days*864e5;
  const playlistId='UU'+channelId.slice(2);
  let pageToken='', videos=[], pages=0;
  do{
    const u=new URL('https://www.googleapis.com/youtube/v3/playlistItems');
    u.searchParams.set('part','snippet,contentDetails');u.searchParams.set('playlistId',playlistId);u.searchParams.set('maxResults','50');u.searchParams.set('key',key);if(pageToken)u.searchParams.set('pageToken',pageToken);
    const r=await fetch(u);if(!r.ok)throw new Error('YouTube Data API '+r.status);const d=await r.json();pages++;
    for(const it of d.items||[]){const videoId=it.contentDetails?.videoId||it.snippet?.resourceId?.videoId;const title=it.snippet?.title||'';const published=it.contentDetails?.videoPublishedAt||it.snippet?.publishedAt; if(!videoId||!published)continue; const t=new Date(published).getTime(); if(t<cutoff)continue; const th=it.snippet?.thumbnails||{};const thumbnail=th.maxres?.url||th.standard?.url||th.high?.url||th.medium?.url||`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;videos.push({videoId,title,published,thumbnail,url:`https://www.youtube.com/watch?v=${videoId}`,players:playersFor(title)});}
    pageToken=d.nextPageToken||'';
    const last=d.items?.[d.items.length-1];const lastDate=last&&(last.contentDetails?.videoPublishedAt||last.snippet?.publishedAt);if(lastDate&&new Date(lastDate).getTime()<cutoff)break;
  }while(pageToken&&pages<20);
  return videos.sort((a,b)=>new Date(b.published)-new Date(a.published));
}

async function attachPublicStatistics(videos,channelId,key){
  if(!key||!videos.length)return videos;
  const details=new Map();
  for(let i=0;i<videos.length;i+=50){
    const ids=videos.slice(i,i+50).map(v=>v.videoId).filter(Boolean);
    if(!ids.length)continue;
    const u=new URL('https://www.googleapis.com/youtube/v3/videos');
    u.searchParams.set('part','status,snippet,statistics');
    u.searchParams.set('id',ids.join(','));u.searchParams.set('key',key);
    const r=await fetch(u);if(!r.ok)throw new Error('YouTube video-details API '+r.status);
    const d=await r.json();
    for(const it of d.items||[]){
      if(it?.status?.privacyStatus==='public'&&it?.snippet?.channelId===channelId){
        details.set(it.id,{
          views:it?.statistics?.viewCount!=null?Number(it.statistics.viewCount):null,
          likes:it?.statistics?.likeCount!=null?Number(it.statistics.likeCount):null
        });
      }
    }
  }
  return videos.filter(v=>details.has(v.videoId)).map(v=>({...v,visibility:'public',statistics:details.get(v.videoId)}));
}

module.exports = async (req,res) => {
  try{
    const history=req.query?.scope==='history';
    const days=history?Math.min(3650,Math.max(30,Number(req.query?.days)||3650)):Math.min(30,Math.max(7,Number(req.query?.days)||30));
    const channelId=await resolveChannelId();
    let videos;
    if(process.env.YOUTUBE_API_KEY){
      videos=await fetchApiHistory(channelId,days,process.env.YOUTUBE_API_KEY);
      videos=await attachPublicStatistics(videos,channelId,process.env.YOUTUBE_API_KEY);
    }else{
      const xml=await fetchFeed(channelId);
      videos=parse(xml,days);
    }
    res.setHeader('Cache-Control','s-maxage=600, stale-while-revalidate=3600');
    res.setHeader('Content-Type','application/json; charset=utf-8');
    res.status(200).json({channel:'GreenJumper',handle:HANDLE,channelId,days,updatedAt:new Date().toISOString(),videos});
  }catch(err){
    res.status(502).json({error:'Unable to sync GreenJumper uploads',detail:String(err&&err.message||err)});
  }
};
