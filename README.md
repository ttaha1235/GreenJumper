# GreenJumper V22

## Important: preview vs live site

The standalone HTML preview cannot reliably run the server-side `/api/coverage` function. If YouTube cannot be reached from the preview, V22 now says **SYNC UNAVAILABLE** instead of incorrectly saying there were no highlights.

On a deployed host (for example Vercel), `/api/coverage` runs server-side and reads the public `@GreenJumper` uploads. For the most reliable production sync, configure `YOUTUBE_API_KEY`; the server verifies public status, video owner/channel, real video ID, publish timestamp, title, description and thumbnail.

The weekly window includes the full calendar day from seven days ago, so an upload YouTube describes as “7 days ago” remains eligible for the current weekly view.

# GreenJumper V19 — public-channel-first live coverage

V19 removes the hand-written weekly preview dataset. The page only renders real public @GreenJumper uploads inside a rolling 168-hour window.

## Standalone HTML
When `index.html` is opened directly, it resolves @GreenJumper's public channel ID and reads the official YouTube public Atom/RSS feed through a CORS proxy. This supplies the real video ID, title, published timestamp and YouTube thumbnail. There is no `LIVE LINK AFTER DEPLOYMENT` placeholder anymore. If the public feed cannot be reached, the website shows no weekly cards instead of showing stale/fake data.

## Deployed site
`/api/coverage` is still the preferred production path. It reads only public @GreenJumper videos from the last 7 days, detects the player from the title, then resolves the current club/country using Sportmonks and (optionally) OpenAI web research for new players/spelling variants.

Recommended environment variables:
- `GREENJUMPER_CHANNEL_ID` (optional; the server can resolve @GreenJumper automatically)
- `YOUTUBE_API_KEY` (recommended for robust public-status verification)
- `SPORTMONKS_API_TOKEN`
- `OPENAI_API_KEY`
- `OPENAI_MODEL=gpt-5`

The globe geometry and V15 hit testing are unchanged.


## V23 — Likes + views
Each weekly match card now displays the selected video's live YouTube likes and views. Switching between a player's match 1/2/3 also switches the thumbnail, title, date, URL, likes and views together.

The deployed site reads these metrics from the official YouTube Data API `videos.list` statistics fields. Set `YOUTUBE_API_KEY` in the server environment. The LIKES and VIEWS boxes are always visible in This Week's Matches. When the standalone preview does not have official API statistics yet, they display an em dash (—) rather than inventing a number. On deployment with YOUTUBE_API_KEY, they populate from YouTube's official statistics.


## V25 standalone live statistics
When index.html is opened directly, the public YouTube RSS feed supplies the real video IDs but not view/like totals.
V25 now looks up each discovered video ID through the public Return YouTube Dislike API, which exposes public `likes` and `viewCount`, so the standalone weekly cards populate rather than showing dashes.
When deployed with `YOUTUBE_API_KEY`, the server continues to use the official YouTube Data API statistics response as the preferred source.


## V26 visual cleanup
- Removed the hero-side GreenJumper graphic panel.
- Centered the opening hero headline, description, CTAs, and stats.
- Hid the technical live-sync status bar from the public-facing design.
- Removed the GreenJumper footer logo; social links remain.


## V27 stat icons
The weekly match cards now use a thumbs-up icon for likes and an eye icon for views instead of written LIKES / VIEWS labels.
The icon treatment is used for every weekly card and remains synchronized when switching between multiple matches for the same player.


## V28 local viewing fallback
If the standalone HTML cannot reach YouTube, it now renders a cached weekly snapshot instead of an empty error state.
This snapshot is for visual review only. A successful live feed/server response automatically replaces it.
Cached cards use branded preview artwork; the deployed live site still uses each video's real YouTube thumbnail and current data.


## V29 hero video
The uploaded INTRO V1 clip is used as a looping hero background. Its audio stream has been physically removed from the packaged MP4, and the video is additionally marked muted/playsinline for autoplay compatibility.

## V30 performance pass
The hero background video was re-encoded from 1280×720/30fps (~2.2 MB) to 768×432/24fps (~0.72 MB), still H.264 and with no audio stream. The expensive live CSS video filter was removed and the existing overlay now supplies the dark GreenJumper grade. A lightweight poster image is shown before playback. The video automatically pauses when the hero is off-screen or the tab is hidden. The globe geometry and interaction are unchanged, but its canvas rendering now skips expensive drawing while the radar section is off-screen.


## V31 total views hero stat
The previous `IRAQ FIRST` hero stat is now `TOTAL VIEWS`.
The local standalone preview displays `4,000,000+` as a viewing fallback.
When deployed, `/api/channel-stats` loads the GreenJumper channel-level lifetime `viewCount` and replaces that fallback with the exact current number.
With `YOUTUBE_API_KEY`, the endpoint uses YouTube Data API `channels.list(part=statistics)`. Without a key it attempts the public GreenJumper About page.


## V32 weekly country markers
The Global Player Radar now marks only countries represented by public GreenJumper videos in the active 7-day coverage set.
Each qualifying country receives a pulsing aqua location marker and a compact country-name tag directly on the globe.
The markers are derived from the same weekly video/player-country data used by the radar panel, so countries automatically appear and disappear with weekly coverage.
If multiple qualifying GreenJumper videos map to the same country, its marker shows the video count.


## V33 responsive pass
V33 preserves the approved desktop design while adding dedicated phone, tablet, small-laptop, and wide-desktop breakpoints.
- Mobile navigation has touch-sized controls, ARIA state, outside/Escape closing, safe-area support, and bounded scrolling.
- Hero headline, actions, and all three statistics scale without horizontal overflow. The background video is disabled on phones for smoother performance.
- Weekly match cards become full-width on phones; match selectors and video metrics remain usable at touch sizes.
- Global Player Radar gets a phone-sized canvas, non-trapping vertical page scrolling, responsive HUD, ResizeObserver/orientation support, and collision-aware compact country labels.
- About/contact/footer spacing, long English/Arabic text, and social links are responsive.


## V34 mobile globe reliability
- Mobile no longer relies on IntersectionObserver to decide whether the globe animation should run.
- Added repeated layout/resize settling for Safari, orientation changes, pageshow, visual viewport changes, and tab restores.
- Added a lightweight static globe fallback behind the canvas. It uses the same country-border geometry and disappears automatically after the live canvas completes its first successful draw.
- The interactive canvas remains the primary globe; the fallback only prevents a blank map during phone initialization or in constrained local-file viewers.


## V35 phone globe controls + weekly labels
- On phones, a one-finger gesture inside the globe now always rotates the globe. Page scrolling remains available outside the globe section.
- Added explicit non-passive touch handlers for iPhone/iPad/Android webviews in addition to desktop pointer handling.
- Touch movement forces an immediate globe repaint, so rotation stays visibly responsive even if requestAnimationFrame is throttled in a local-file preview.
- Weekly coverage countries now also render as real HTML tags positioned over their locations on the mobile globe. This avoids relying exclusively on canvas text rendering.
- Country tags move with globe rotation, disappear on the far side, and can be tapped to center/select the country and reveal its GreenJumper videos.
- The canvas-based aqua marker/ring system remains in place underneath the mobile HTML labels.


## V36 mobile interaction fix
- Mobile touch input is now attached to the entire globe stage instead of the canvas.
- On phones the canvas is visual-only (`pointer-events:none`), preventing embedded phone viewers from treating it like a static image interaction layer.
- Dragging anywhere inside the globe stage rotates the same live globe.
- Tapping the globe still performs country hit-testing against the real country polygons.
- Weekly country-name tags remain tappable and now respond on pointer-up as well as click.
- Added small left / reset / right controls as an interaction fallback for restrictive in-app HTML viewers. These controls rotate the same globe state.
