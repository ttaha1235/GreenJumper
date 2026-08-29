const HANDLE='@GreenJumper';
const FALLBACK_CHANNEL_ID=process.env.GREENJUMPER_CHANNEL_ID||'UCcCEkPu1n4P8k57SvRxhvAQ';

async function resolveChannelId(){
  if(process.env.GREENJUMPER_CHANNEL_ID) return process.env.GREENJUMPER_CHANNEL_ID;
  try{
    const r=await fetch('https://www.youtube.com/'+HANDLE,{
      headers:{'user-agent':'Mozilla/5.0 (compatible; GreenJumperSite/1.0)','accept-language':'en-US,en;q=0.9'}
    });
    const t=await r.text();
    const m=t.match(/"channelId":"(UC[\w-]{20,})"/)
      ||t.match(/"externalId":"(UC[\w-]{20,})"/)
      ||t.match(/itemprop="channelId" content="(UC[\w-]{20,})"/);
    if(m) return m[1];
  }catch(_){}
  return FALLBACK_CHANNEL_ID;
}

async function fromYoutubeApi(channelId,key){
  const u=new URL('https://www.googleapis.com/youtube/v3/channels');
  u.searchParams.set('part','statistics');
  u.searchParams.set('id',channelId);
  u.searchParams.set('key',key);
  const r=await fetch(u);
  if(!r.ok) throw new Error('YouTube channel statistics API '+r.status);
  const d=await r.json();
  const stats=d.items?.[0]?.statistics;
  const views=Number(stats?.viewCount);
  if(!Number.isFinite(views)) throw new Error('YouTube did not return a channel view count');
  return {
    views,
    subscribers:stats?.subscriberCount!=null?Number(stats.subscriberCount):null,
    videos:stats?.videoCount!=null?Number(stats.videoCount):null,
    source:'youtube-data-api'
  };
}

function parseNumberText(s=''){
  const cleaned=s.replace(/,/g,'').trim();
  const m=cleaned.match(/([\d.]+)\s*([KMB])?/i);
  if(!m) return null;
  let n=Number(m[1]);
  if(!Number.isFinite(n)) return null;
  const mult={K:1e3,M:1e6,B:1e9}[String(m[2]||'').toUpperCase()]||1;
  return Math.round(n*mult);
}

async function fromPublicAbout(){
  const r=await fetch('https://www.youtube.com/'+HANDLE+'/about',{
    headers:{'user-agent':'Mozilla/5.0 (compatible; GreenJumperSite/1.0)','accept-language':'en-US,en;q=0.9'}
  });
  if(!r.ok) throw new Error('YouTube public about page '+r.status);
  const t=await r.text();

  // YouTube has used several JSON shapes for the public channel About page.
  const patterns=[
    /"viewCountText":\{"simpleText":"([^"]*views?)"\}/i,
    /"viewCountText":\{"runs":\[\{"text":"([^"]*views?)"\}/i,
    /"viewCount":"(\d+)"/i
  ];
  for(const p of patterns){
    const m=t.match(p);
    if(!m) continue;
    if(/^\d+$/.test(m[1])) return {views:Number(m[1]),source:'youtube-public-about'};
    const n=parseNumberText(m[1]);
    if(Number.isFinite(n)) return {views:n,source:'youtube-public-about'};
  }
  throw new Error('Public About page did not expose a readable view count');
}

module.exports=async(req,res)=>{
  try{
    const channelId=await resolveChannelId();
    let data;
    if(process.env.YOUTUBE_API_KEY){
      data=await fromYoutubeApi(channelId,process.env.YOUTUBE_API_KEY);
    }else{
      data=await fromPublicAbout();
    }
    res.setHeader('Cache-Control','s-maxage=900, stale-while-revalidate=3600');
    res.setHeader('Content-Type','application/json; charset=utf-8');
    res.status(200).json({channel:'GreenJumper',handle:HANDLE,channelId,...data,updatedAt:new Date().toISOString()});
  }catch(err){
    res.status(502).json({error:'Unable to load GreenJumper channel statistics',detail:String(err?.message||err)});
  }
};
