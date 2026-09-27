import { useEffect, useMemo, useRef, useState } from 'react'
import baseData from './data.json'

const extra = {
  articles: [
    ['anime', 'Why New Anime Worlds Feel Bigger Than Ever', 'Visual storytelling keeps building new worlds with stronger character arcs.'],
    ['gaming', 'Five Game Worlds Fans Keep Returning To', 'Great exploration design turns a map into a place players remember.'],
    ['movies', 'The Return of Event Cinema', 'Big releases are giving audiences new reasons to celebrate opening night.'],
    ['tv-shows', 'Mystery Series Are Having a Brilliant Year', 'Clues and weekly fan theories are back at the center of television.'],
    ['k-pop', 'How Comeback Concepts Build a Complete Era', 'Music, styling and stage design combine into a complete fan story.'],
    ['comics', 'Independent Heroes Take the Spotlight', 'Creators are expanding what a superhero story can be.'],
    ['manga', 'The Art of a Perfect First Chapter', 'Strong openings balance mystery, visual rhythm and a reason to continue.']
  ],
  characters: [
    ['Kael Arashi', 'anime', 'Sky Guardian'], ['Mira Vale', 'anime', 'Spirit Keeper'], ['Vex Nova', 'gaming', 'Rift Runner'], ['Ember', 'gaming', 'Flame Bearer'],
    ['Dr. Soren Pike', 'movies', 'Deep-space Captain'], ['Iris Cole', 'movies', 'Master Thief'], ['Nora Signal', 'tv-shows', 'Radio Investigator'], ['Eli North', 'tv-shows', 'Town Detective'],
    ['Jina Park', 'k-pop', 'Main Performer'], ['Min Seo', 'k-pop', 'Producer'], ['Crimson Guard', 'comics', 'City Protector'], ['Nova Rex', 'comics', 'Squad Pilot'],
    ['Aiko Ren', 'manga', 'Ink Apprentice'], ['Rei Kuroda', 'manga', 'Quiet Blade']
  ],
  events: [
    ['03', 'OCT', 'Anime Autumn Showcase', 'Online premieres, creator panels and season previews.', 'Anime'],
    ['11', 'OCT', 'NexPlay Community Game Night', 'Friendly challenges across featured multiplayer worlds.', 'Gaming'],
    ['18', 'OCT', 'Midnight Movie Marathon', 'Four fan-favorite adventures on one big screen.', 'Movies'],
    ['25', 'OCT', 'Series Theory Live', 'A spoiler-friendly discussion of this season mysteries.', 'TV'],
    ['02', 'NOV', 'K-Pop Stage Replay', 'Performance breakdowns and fan-voted encore moments.', 'K-Pop'],
    ['09', 'NOV', 'Independent Comics Day', 'Creator spotlights, digital releases and artist Q&A.', 'Comics'],
    ['16', 'NOV', 'Manga New Volume Week', 'Upcoming volumes, reading lists and collector editions.', 'Manga']
  ],
  products: [
    ['Skybound Art Print', 'anime', 18, 6], ['Rift Runners Desk Mat', 'gaming', 24, 4], ['Cinema Club Poster', 'movies', 16, 8], ['Signal Room Mug', 'tv-shows', 14, 5],
    ['Electric Bloom Lightband', 'k-pop', 29, 3], ['Crimson Guard Pin Set', 'comics', 12, 9], ['Inkbound Notebook', 'manga', 11, 7], ['NexPlay Collector Tote', 'gaming', 20, 4]
  ]
}

function getCategory(data, id) { return data.categories.find((item) => item.id === id) }
function getImage(card, data) { const cat = getCategory(data, card.category); return card.image || cat.sheet }
function getPosition(num = 0) { return `${(num % 4) * 33.333}% ${Math.floor(num / 4) * 33.333}%` }
function safeText(text) { return String(text || '').replace(/<[^>]+>/g, '') }

const categoryShowcases = {
  anime: 'https://www.youtube-nocookie.com/embed/QlFRoUMkUDw?autoplay=1&rel=0',
  movies: 'https://www.youtube-nocookie.com/embed/Way9Dexny3w?autoplay=1&rel=0',
  'tv-shows': 'https://www.youtube-nocookie.com/embed/yQEondeGvKo?autoplay=1&rel=0',
  'k-pop': 'https://www.youtube-nocookie.com/embed/XsX3ATc3FbA?autoplay=1&rel=0',
  comics: 'https://www.youtube-nocookie.com/embed/TcMBFSGVi1c?autoplay=1&rel=0',
  manga: 'https://www.youtube-nocookie.com/embed/MGRm4IzK1SQ?autoplay=1&rel=0'
}

const arcadeGame = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>*{box-sizing:border-box}body{margin:0;overflow:hidden;background:#070914;color:#fff;font-family:Arial,sans-serif}canvas{display:block;width:100vw;height:100vh;touch-action:none}.hud{position:fixed;top:18px;left:20px;right:20px;display:flex;justify-content:space-between;font-weight:800;pointer-events:none}.title{color:#a98cff}.help{position:fixed;left:50%;bottom:18px;transform:translateX(-50%);display:flex;gap:12px}.help button{width:68px;height:52px;border:1px solid #ffffff33;border-radius:14px;background:#171b34;color:#fff;font-size:24px}.start{position:fixed;inset:0;display:grid;place-items:center;background:#050711dd;text-align:center}.start div{max-width:420px;padding:28px}.start h1{font-size:42px;margin:0 0 10px}.start p{color:#b9bfd3;line-height:1.6}.start button{padding:14px 25px;border:0;border-radius:14px;background:linear-gradient(135deg,#7c5cff,#ff4f9a);color:#fff;font-weight:900;font-size:17px}</style></head><body><canvas id="game"></canvas><div class="hud"><span class="title">NEXPLAY STAR RUNNER</span><span>Score: <b id="score">0</b> &nbsp; Lives: <b id="lives">3</b></span></div><div class="help"><button id="left">◀</button><button id="right">▶</button></div><div class="start" id="screen"><div><h1>Star Runner</h1><p>Move the ship, collect glowing stars and avoid red meteors. Use arrow keys, A/D, or touch buttons.</p><button id="start">Start Game</button></div></div><script>const c=document.getElementById('game'),x=c.getContext('2d'),scoreEl=document.getElementById('score'),livesEl=document.getElementById('lives'),screen=document.getElementById('screen');let w,h,p,items,score,lives,running,last,spawn,left=false,right=false;function size(){w=c.width=innerWidth*devicePixelRatio;h=c.height=innerHeight*devicePixelRatio;x.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);w=innerWidth;h=innerHeight}addEventListener('resize',size);size();function reset(){p={x:w/2-28,y:h-92,w:56,h:34};items=[];score=0;lives=3;spawn=0;last=performance.now();scoreEl.textContent=score;livesEl.textContent=lives;running=true;screen.style.display='none';requestAnimationFrame(loop)}function make(){let good=Math.random()>.36;items.push({x:25+Math.random()*(w-50),y:-30,r:good?11:16,v:2.5+Math.random()*3,good})}function loop(now){if(!running)return;let d=Math.min(2,(now-last)/16.67);last=now;if(left)p.x-=8*d;if(right)p.x+=8*d;p.x=Math.max(8,Math.min(w-p.w-8,p.x));spawn+=d;if(spawn>18){spawn=0;make()}x.fillStyle='#070914';x.fillRect(0,0,w,h);let g=x.createRadialGradient(w/2,h/2,20,w/2,h/2,h);g.addColorStop(0,'#171d45');g.addColorStop(1,'#070914');x.fillStyle=g;x.fillRect(0,0,w,h);for(let i=0;i<80;i++){x.fillStyle='#ffffff'+(i%3?'25':'55');x.fillRect((i*83)%w,(i*47+now*.02)%h,2,2)}items.forEach(o=>{o.y+=o.v*d;x.beginPath();x.arc(o.x,o.y,o.r,0,Math.PI*2);x.fillStyle=o.good?'#ffe66d':'#ff466b';x.shadowColor=x.fillStyle;x.shadowBlur=18;x.fill();x.shadowBlur=0});items=items.filter(o=>{let hit=o.x+o.r>p.x&&o.x-o.r<p.x+p.w&&o.y+o.r>p.y&&o.y-o.r<p.y+p.h;if(hit){if(o.good){score+=10;scoreEl.textContent=score}else{lives--;livesEl.textContent=lives}return false}return o.y<h+40});x.fillStyle='#7c5cff';x.beginPath();x.moveTo(p.x+p.w/2,p.y);x.lineTo(p.x+p.w,p.y+p.h);x.lineTo(p.x,p.y+p.h);x.closePath();x.fill();x.fillStyle='#6ef3ff';x.fillRect(p.x+20,p.y+p.h,16,10);if(lives<=0){running=false;screen.style.display='grid';screen.querySelector('h1').textContent='Game Over';screen.querySelector('p').textContent='Final score: '+score+'. Ready for another run?';screen.querySelector('button').textContent='Play Again';return}requestAnimationFrame(loop)}function hold(el,key){el.addEventListener('pointerdown',e=>{e.preventDefault();if(key==='l')left=true;else right=true});el.addEventListener('pointerup',()=>{left=false;right=false});el.addEventListener('pointerleave',()=>{left=false;right=false})}hold(document.getElementById('left'),'l');hold(document.getElementById('right'),'r');addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key.toLowerCase()==='a')left=true;if(e.key==='ArrowRight'||e.key.toLowerCase()==='d')right=true});addEventListener('keyup',e=>{if(e.key==='ArrowLeft'||e.key.toLowerCase()==='a')left=false;if(e.key==='ArrowRight'||e.key.toLowerCase()==='d')right=false});document.getElementById('start').onclick=reset;</script></body></html>`

const memoryGame = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;background:radial-gradient(circle at top,#22265a,#070914 65%);color:#fff;font-family:Arial,sans-serif}.wrap{width:min(680px,94vw);text-align:center}h1{margin:0 0 8px;font-size:clamp(30px,6vw,52px)}p{color:#b8bfd6}.top{display:flex;justify-content:center;gap:24px;margin:18px}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.card{aspect-ratio:1;border:1px solid #ffffff24;border-radius:16px;background:linear-gradient(145deg,#22294c,#12162d);color:transparent;font-size:clamp(26px,6vw,48px);box-shadow:0 12px 30px #0005;transition:.2s;cursor:pointer}.card.open,.card.done{color:#fff;transform:rotateY(180deg);background:linear-gradient(135deg,#7c5cff,#d946ef)}.card.done{opacity:.58}.again{margin-top:20px;padding:12px 20px;border:0;border-radius:12px;background:#fff;color:#111526;font-weight:900}</style></head><body><main class="wrap"><h1>Memory Match</h1><p>Match all fandom symbols in the fewest moves.</p><div class="top"><b>Moves: <span id="moves">0</span></b><b>Pairs: <span id="pairs">0</span>/8</b></div><div class="grid" id="grid"></div><button class="again" id="again">New Game</button></main><script>const icons=['⚔️','🎮','🎬','🎤','🦸','📚','🐉','🚀'];let deck,open,lock,moves,pairs;const grid=document.getElementById('grid');function start(){deck=[...icons,...icons].sort(()=>Math.random()-.5);open=[];lock=false;moves=0;pairs=0;document.getElementById('moves').textContent=0;document.getElementById('pairs').textContent=0;grid.innerHTML='';deck.forEach((v,i)=>{let b=document.createElement('button');b.className='card';b.textContent=v;b.onclick=()=>flip(b,i,v);grid.appendChild(b)})}function flip(b,i,v){if(lock||b.classList.contains('open')||b.classList.contains('done'))return;b.classList.add('open');open.push({b,i,v});if(open.length===2){moves++;document.getElementById('moves').textContent=moves;if(open[0].v===open[1].v){open.forEach(o=>{o.b.classList.remove('open');o.b.classList.add('done')});open=[];pairs++;document.getElementById('pairs').textContent=pairs;if(pairs===8)setTimeout(()=>alert('You won in '+moves+' moves!'),250)}else{lock=true;setTimeout(()=>{open.forEach(o=>o.b.classList.remove('open'));open=[];lock=false},700)}}}document.getElementById('again').onclick=start;start();</script></body></html>`

const targetGame = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>*{box-sizing:border-box}body{margin:0;overflow:hidden;background:#060812;color:#fff;font-family:Arial,sans-serif}.arena{position:fixed;inset:0;background:radial-gradient(circle at 50% 50%,#152052,#060812 65%)}.hud{position:fixed;z-index:3;top:18px;left:20px;right:20px;display:flex;justify-content:space-between;font-weight:900}.target{position:absolute;width:72px;height:72px;border:0;border-radius:50%;background:radial-gradient(circle,#fff 0 10%,#67f5ff 11% 28%,#7c5cff 29% 58%,#ff4f9a 59%);box-shadow:0 0 38px #7c5cff;cursor:crosshair;animation:pulse .65s infinite alternate}.screen{position:fixed;z-index:5;inset:0;display:grid;place-items:center;background:#050711dd;text-align:center}.screen div{max-width:430px;padding:30px}.screen h1{font-size:48px;margin:0}.screen p{color:#b8bfd6;line-height:1.6}.screen button{padding:14px 24px;border:0;border-radius:14px;background:linear-gradient(135deg,#7c5cff,#ff4f9a);color:#fff;font-size:17px;font-weight:900}@keyframes pulse{to{transform:scale(.86)}}</style></head><body><div class="arena" id="arena"></div><div class="hud"><span>NEON TARGET RUSH</span><span>Score: <b id="score">0</b> &nbsp; Time: <b id="time">30</b></span></div><div class="screen" id="screen"><div><h1>Target Rush</h1><p>Hit as many neon targets as possible before the timer reaches zero.</p><button id="start">Start Game</button></div></div><script>const arena=document.getElementById('arena'),screen=document.getElementById('screen');let score,time,timer,target;function place(){if(target)target.remove();target=document.createElement('button');target.className='target';target.style.left=20+Math.random()*(innerWidth-112)+'px';target.style.top=70+Math.random()*(innerHeight-170)+'px';target.onpointerdown=e=>{e.preventDefault();score++;document.getElementById('score').textContent=score;place()};arena.appendChild(target)}function start(){score=0;time=30;document.getElementById('score').textContent=0;document.getElementById('time').textContent=time;screen.style.display='none';place();clearInterval(timer);timer=setInterval(()=>{time--;document.getElementById('time').textContent=time;if(time<=0){clearInterval(timer);target.remove();screen.style.display='grid';screen.querySelector('h1').textContent='Time Up!';screen.querySelector('p').textContent='Final score: '+score+' targets.';screen.querySelector('button').textContent='Play Again'}},1000)}document.getElementById('start').onclick=start;</script></body></html>`

const games = [
  { name: 'Star Runner', source: arcadeGame },
  { name: 'Memory Match', source: memoryGame },
  { name: 'Neon Target Rush', source: targetGame }
]

export default function App() {
  const [page, setPage] = useState(window.location.hash.replace('#', '') || 'home')
  const [theme, setTheme] = useState(localStorage.getItem('nexplay-theme') || 'dark')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('featured')
  const [liveCards, setLiveCards] = useState({})
  const [selected, setSelected] = useState(null)
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('nexplay-cart') || '[]'))
  const stockDefaults = Object.fromEntries(extra.products.map(([name, , , stock]) => [name, stock]))
  const [stocks, setStocks] = useState(() => JSON.parse(localStorage.getItem('nexplay-stock') || 'null') || stockDefaults)
  const [saved, setSaved] = useState(JSON.parse(localStorage.getItem('nexplay-bookmarks') || '[]'))
  const [notes, setNotes] = useState(JSON.parse(localStorage.getItem('nexplay-notes') || '{}'))
  const [chatOpen, setChatOpen] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState([{ from: 'bot', text: 'Hi! I am Nex Guide. Ask me anything about fandoms, titles, events, videos or your saved collection.' }])
  const [clock, setClock] = useState('')
  const [sideOpen, setSideOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [notice, setNotice] = useState(null)
  const [visits] = useState(() => {
    const count = Number(localStorage.getItem('nexplay-visits') || 0) + 1
    localStorage.setItem('nexplay-visits', String(count))
    return count
  })

  useEffect(() => { const change = () => { setPage(window.location.hash.replace('#', '') || 'home'); setSideOpen(false); window.scrollTo(0, 0) }; window.addEventListener('hashchange', change); return () => window.removeEventListener('hashchange', change) }, [])
  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem('nexplay-theme', theme) }, [theme])
  useEffect(() => { const update = () => setClock(new Intl.DateTimeFormat([], { hour: '2-digit', minute: '2-digit' }).format(new Date())); update(); const id = setInterval(update, 30000); return () => clearInterval(id) }, [])
  useEffect(() => {
    if (page.startsWith('category/')) loadLive(page.split('/')[1])
    if (page === 'home') loadLive('anime')
    if (page === 'media') { loadLive('movies'); loadLive('tv-shows'); loadLive('gaming'); loadLive('anime') }
  }, [page])

  async function loadLive(id) {
    if (liveCards[id]) return
    try {
      let list = []
      if (id === 'anime' || id === 'manga') {
        const answer = await fetch('https://api.jikan.moe/v4/top/anime?filter=bypopularity&limit=12'); const data = await answer.json();
        list = data.data.filter((item) => item.images?.jpg?.large_image_url).map((item, index) => ({ id: `live-${id}-${item.mal_id}`, category: id, title: item.title_english || item.title, subtitle: id === 'manga' ? 'Manga adaptation' : (item.genres?.slice(0, 2).map((x) => x.name).join(' · ') || 'Top picks'), type: id === 'manga' ? 'Adaptation' : (item.type || 'Anime'), rating: item.score || 'Top', year: item.year || 'Now', description: item.synopsis, image: item.images.jpg.large_image_url, embedUrl: item.trailer?.embed_url || null, tile: index }))
      } else if (id === 'gaming') {
        list = [
          { id: 'game-star-runner', category: id, title: 'Star Runner', subtitle: 'Space arcade challenge', type: 'Playable Game', rating: '9.1', year: '2026', description: 'Pilot a neon starship, collect golden stars and dodge incoming meteors before your lives run out.', image: '/assets/images/games/star-runner.png', gameIndex: 0, tile: 0 },
          { id: 'game-memory-match', category: id, title: 'Memory Match', subtitle: 'Fandom puzzle challenge', type: 'Playable Game', rating: '8.8', year: '2026', description: 'Reveal magical fandom symbols and match all eight pairs using the fewest possible moves.', image: '/assets/images/games/memory-match.png', gameIndex: 1, tile: 1 },
          { id: 'game-neon-target', category: id, title: 'Neon Target Rush', subtitle: 'Fast reaction challenge', type: 'Playable Game', rating: '9.0', year: '2026', description: 'Hit as many neon targets as possible before the thirty-second countdown reaches zero.', image: '/assets/images/games/neon-target-rush.png', gameIndex: 2, tile: 2 }
        ]
      } else if (id === 'movies') {
        const answer = await fetch('/apple-api/search?term=blockbuster&media=movie&entity=movie&limit=12&country=us'); const data = await answer.json();
        list = data.results.filter((item) => item.artworkUrl100).map((item, index) => ({ id: `live-movie-${item.trackId}`, category: id, title: item.trackName, subtitle: item.primaryGenreName || 'Movie', type: 'Movie', rating: item.contentAdvisoryRating || 'Featured', year: item.releaseDate?.slice(0, 4) || 'Now', description: item.longDescription || item.shortDescription, image: item.artworkUrl100?.replace('100x100bb', '900x900bb').replace('100x100', '900x900'), videoUrl: item.previewUrl, tile: index }))
      } else if (id === 'tv-shows') {
        const answer = await fetch('https://api.tvmaze.com/shows?page=0'); const data = await answer.json();
        list = await Promise.all(data.filter((item) => item.image?.original).slice(0, 8).map(async (item, index) => {
          let preview = null
          try { const find = await fetch(`/apple-api/search?term=${encodeURIComponent(item.name)}&media=tvShow&entity=tvEpisode&limit=1&country=us`); const found = await find.json(); preview = found.results?.[0] || null } catch { preview = null }
          return { id: `live-tv-${item.id}`, category: id, title: item.name, subtitle: item.genres?.slice(0, 2).join(' · ') || 'Series', type: item.type || 'Series', rating: item.rating?.average || 'Top', year: item.premiered?.slice(0, 4) || 'Now', description: safeText(item.summary), image: item.image.original, videoUrl: preview?.previewUrl || null, tile: index }
        }))
      } else if (id === 'k-pop') {
        const answer = await fetch('/apple-api/search?term=kpop&media=musicVideo&entity=musicVideo&limit=12&country=us'); const data = await answer.json()
        list = data.results.filter((item) => item.artworkUrl100).map((item, index) => ({ id: `live-kpop-${item.trackId}`, category: id, title: item.trackName, subtitle: item.artistName, type: 'Music Video', rating: 'Preview', year: item.releaseDate?.slice(0, 4) || 'Now', description: `${item.trackName} by ${item.artistName}.`, image: item.artworkUrl100.replace('100x100bb', '900x900bb').replace('100x100', '900x900'), videoUrl: item.previewUrl || null, tile: index }))
      } else if (id === 'comics') {
        const answer = await fetch('/apple-api/search?term=superhero&media=movie&entity=movie&limit=12&country=us'); const data = await answer.json()
        list = data.results.filter((item) => item.artworkUrl100).map((item, index) => ({ id: `live-comic-${item.trackId}`, category: id, title: item.trackName, subtitle: item.primaryGenreName || 'Comic adaptation', type: 'Screen Adaptation', rating: item.contentAdvisoryRating || 'Featured', year: item.releaseDate?.slice(0, 4) || 'Now', description: item.longDescription || item.shortDescription || 'A live-action comic-inspired preview.', image: item.artworkUrl100.replace('100x100bb', '900x900bb').replace('100x100', '900x900'), videoUrl: item.previewUrl || null, tile: index }))
      }
      setLiveCards((old) => ({ ...old, [id]: list }))
    } catch { setLiveCards((old) => ({ ...old, [id]: dataCards.filter((item) => item.category === id) })) }
  }

  const dataCards = baseData.cards
  const allCards = useMemo(() => [...dataCards, ...Object.values(liveCards).flat()], [liveCards])
  const currentId = page.startsWith('category/') ? page.split('/')[1] : null
  const currentCategory = currentId ? getCategory(baseData, currentId) : null
  const shownCards = useMemo(() => { let list = filter === 'all' ? dataCards : dataCards.filter((item) => item.category === filter); if (search) list = list.filter((item) => `${item.title} ${item.subtitle}`.toLowerCase().includes(search.toLowerCase())); if (sort === 'rating') list.sort((a, b) => Number(b.rating) - Number(a.rating)); if (sort === 'title') list.sort((a, b) => a.title.localeCompare(b.title)); return list }, [filter, search, sort])

  function openCard(card) { setSelected(card) }
  function toggleSaved(id) { const next = saved.includes(id) ? saved.filter((item) => item !== id) : [...saved, id]; setSaved(next); localStorage.setItem('nexplay-bookmarks', JSON.stringify(next)) }
  function addCart(product) {
    const used = cart.filter((id) => id === product.id).length
    if (used >= (stocks[product.id] || 0)) { setNotice(`Only ${stocks[product.id] || 0} left in stock.`); return }
    const next = [...cart, product.id]; setCart(next); localStorage.setItem('nexplay-cart', JSON.stringify(next))
  }
  function changeCart(productId, amount) {
    const current = cart.filter((id) => id === productId).length
    if (amount > 0 && current >= (stocks[productId] || 0)) { setNotice(`Only ${stocks[productId] || 0} left in stock.`); return }
    let next = [...cart]
    if (amount > 0) next.push(productId)
    else { const index = next.lastIndexOf(productId); if (index >= 0) next.splice(index, 1) }
    setCart(next); localStorage.setItem('nexplay-cart', JSON.stringify(next))
  }
  function placeOrder() {
    if (!cart.length) { setNotice('Your cart is empty.'); return }
    const nextStocks = { ...stocks }
    for (const product of extra.products) {
      const name = product[0]; const quantity = cart.filter((id) => id === name).length
      if (quantity > (nextStocks[name] || 0)) { setNotice(`${name} does not have enough stock.`); return }
      nextStocks[name] -= quantity
    }
    setStocks(nextStocks); localStorage.setItem('nexplay-stock', JSON.stringify(nextStocks)); setCart([]); localStorage.setItem('nexplay-cart', '[]'); setCartOpen(false); setNotice('Your order has been placed successfully!')
  }
  function askGuide(question = chatInput) {
    const clean = question.trim()
    if (!clean) return
    const words = clean.toLowerCase()
    const category = baseData.categories.find((item) => words.includes(item.name.toLowerCase()) || words.includes(item.id.replace('-', ' ')))
    const title = allCards.find((item) => words.includes(item.title.toLowerCase()))
    let answer = ''
    if (/hello|hi|hey|salam|assalam/.test(words)) answer = 'Hello! Tell me what you enjoy and I can suggest a fandom, title or section.'
    else if (title) answer = `${title.title} is listed under ${getCategory(baseData, title.category).name}. It is a ${title.type} from ${title.year}, rated ${title.rating}. Open Discover and search its name to view the full card.`
    else if (category) answer = `${category.name} has dedicated stories, artwork and live catalog results. Open ${category.name} from the Fandom Categories bar to explore everything in one place.`
    else if (/recommend|suggest|what.*watch|bored/.test(words)) { const pick = dataCards[Math.floor(Math.random() * dataCards.length)]; answer = `Try ${pick.title} from ${getCategory(baseData, pick.category).name}. ${pick.description}` }
    else if (/movie|film/.test(words)) answer = 'The Movies category loads fresh movie titles and artwork from the Apple Search catalog. Select Movies in the category bar.'
    else if (/video|trailer|audio|music/.test(words)) answer = 'Open the Media Hub for seven playable category videos. K-Pop live cards can also include short audio previews.'
    else if (/event|release|calendar|upcoming/.test(words)) answer = `There are ${extra.events.length} upcoming community events and releases. Open Events & Releases from the sidebar for dates and details.`
    else if (/shop|merch|cart|buy|price/.test(words)) answer = `The fan shop has ${extra.products.length} demo products. Your temporary cart currently contains ${cart.length} item${cart.length === 1 ? '' : 's'}; checkout and payment are intentionally disabled.`
    else if (/bookmark|saved|note/.test(words)) answer = `You currently have ${saved.length} bookmarked item${saved.length === 1 ? '' : 's'}. Open Bookmarks & Notes from the sidebar to review them.`
    else if (/about|nexplay/.test(words)) answer = 'NexPlay is a responsive discovery hub for Anime, Gaming, Movies, TV, K-Pop, Comics and Manga.'
    else if (/help|menu|where|find/.test(words)) answer = 'Use the top search button for titles, the Fandom Categories bar for universes, or the left sidebar for News, Media, Characters, Events, Shop and saved items.'
    else answer = `I could not find an exact match for “${clean}”. Try asking for a category, recommendation, movie, event, video, product or bookmark.`
    setChatMessages((old) => [...old, { from: 'user', text: clean }, { from: 'bot', text: answer }])
    setChatInput('')
  }
  function cardView(card) { const cat = getCategory(baseData, card.category); return <article className="story-card" key={card.id} onClick={() => openCard(card)}><div className={`card-art ${card.image ? 'remote-art' : ''}`} style={card.image ? { '--image': `url(${card.image})` } : { '--sheet': `url(${cat.sheet})`, '--position': getPosition(card.tile) }}><span className="card-rating">★ {card.rating}</span></div><div className="card-body" style={{ '--category-color': cat.accent }}><span className="card-category">{cat.name} · {card.type}</span><h3>{card.title}</h3><p>{card.subtitle}</p><div className="card-meta"><span>{card.year}</span><span>View story →</span></div></div></article> }
  function liveSection(id) { const cat = getCategory(baseData, id); const list = liveCards[id] || []; return <section className="content-section live-section"><div className="section-heading"><div><span className="eyebrow">Live catalog</span><h2>Fresh from {cat.name}</h2><p>Real titles and artwork loaded from a public catalog.</p></div><span className="live-status">Live data</span></div><div className="card-grid">{list.length ? list.map(cardView) : dataCards.filter((item) => item.category === id).map(cardView)}</div></section> }

  function homePage() { return <div className="page"><section className="hero"><div className="hero-media" style={{ backgroundImage: `url(${getCategory(baseData, 'gaming').banner})` }} /><div className="hero-content"><span className="hero-badge">Featured universe</span><h1>Find your next <span>obsession.</span></h1><p>Explore stories, worlds and moments fans cannot stop talking about.</p><div className="hero-actions"><a className="primary-button" href="#discover">Start exploring →</a><a className="secondary-button" href="#media">Open media hub ▶</a></div></div></section><section className="content-section"><div className="section-heading"><div><span className="eyebrow">Choose your universe</span><h2>Explore every fandom</h2><p>Anime, Gaming, Movies, TV, K-Pop, Comics and Manga.</p></div></div><div className="category-grid">{baseData.categories.map((cat, index) => <a className={`category-tile ${index < 2 ? 'wide' : ''}`} key={cat.id} href={`#category/${cat.id}`} style={{ '--image': `url(${cat.banner})` }}><div className="category-tile-content"><span>{cat.eyebrow}</span><h3>{cat.name}</h3></div></a>)}</div></section>{liveSection('anime')}<section className="content-section compact"><div className="section-heading"><div><span className="eyebrow">Explore more</span><h2>Complete fandom hub</h2></div></div><div className="filter-bar"><a className="filter-chip" href="#articles">📰 News</a><a className="filter-chip" href="#media">🎬 Media</a><a className="filter-chip" href="#characters">👤 Characters</a><a className="filter-chip" href="#events">📅 Events</a><a className="filter-chip" href="#shop">🛍 Shop</a></div></section></div> }

  function discoverPage() { return <div className="page"><section className="page-hero" style={{ '--image': `url(${baseData.categories[0].banner})` }}><div><span className="eyebrow">All fandoms</span><h1>Discover</h1><p>Search, filter and sort all NexPlay stories.</p></div></section><div className="discover-tools"><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search all cards…" /><select value={filter} onChange={(event) => setFilter(event.target.value)}><option value="all">All categories</option>{baseData.categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}</select><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Featured</option><option value="rating">Highest rated</option><option value="title">A–Z</option></select></div><section className="content-section"><div className="card-grid">{shownCards.map(cardView)}</div></section></div> }

  function articlesPage() { return <Page title="Fandom Feed" small="Articles & news"><div className="article-grid">{extra.articles.map(([cat, title, text]) => <article className="article-card" key={title}><div className="article-image" style={{ backgroundImage: `url(${getCategory(baseData, cat).banner})` }} /><div className="article-copy"><span className="card-category">{getCategory(baseData, cat).name}</span><h3>{title}</h3><p>{text}</p><small>Fresh feature · 4 min read</small></div></article>)}</div></Page> }
  function charactersPage() { return <Page title="Meet the Icons" small="Character profiles"><div className="character-grid">{extra.characters.map(([name, cat, role], index) => <article className="character-card" key={name}><div className="character-art" style={{ '--sheet': `url(${getCategory(baseData, cat).sheet})`, '--position': getPosition(index % 4) }} /><div><span className="card-category">{getCategory(baseData, cat).name}</span><h3>{name}</h3><p>{role}</p></div></article>)}</div></Page> }
  function eventsPage() { return <Page title="Events & Releases" small="Calendar"><div className="event-list">{extra.events.map(([day, month, title, text, tag]) => <article className="event-card" key={title}><div className="event-date"><strong>{day}</strong><span>{month}</span></div><div><h3>{title}</h3><p>{text}</p></div><span className="event-tag">{tag}</span></article>)}</div></Page> }
  function shopPage() { return <Page title="Fan Shop" small="Merchandise"><div className="shop-grid">{extra.products.map(([name, cat, price], index) => <article className="product-card" key={name}><div className="product-art" style={{ '--sheet': `url(${getCategory(baseData, cat).sheet})`, '--position': getPosition(index % 4) }} /><div className="product-copy"><span className="card-category">{getCategory(baseData, cat).name}</span><h3>{name}</h3><div className="product-row"><strong>${price.toFixed(2)}</strong><button className="add-cart" disabled={!stocks[name]} onClick={() => addCart({ id: name, name, price })}>{stocks[name] ? 'Add to cart' : 'Out of stock'}</button></div><small className={stocks[name] ? 'stock-label' : 'stock-label sold-out'}>{stocks[name] || 0} in stock</small></div></article>)}</div></Page> }
  function contactPage() { return <Page title="Contact NexPlay" small="We would love to hear from you"><div className="contact-layout"><div className="contact-copy"><span className="eyebrow">Fan support</span><h2>Have a thought, idea or question?</h2><p>Send a message to the NexPlay team. This demo form confirms your message in the browser and does not send data to a server.</p><div className="contact-points"><span>✉ hello@nexplay.example</span><span>◷ Replies within 1–2 days</span><span>✦ Built for every fandom</span></div></div><form className="contact-form" onSubmit={(event) => { event.preventDefault(); event.currentTarget.reset(); setNotice('Thanks! Your message has been sent.') }}><label>Name<input required name="name" placeholder="Your name" /></label><label>Email<input required type="email" name="email" placeholder="you@example.com" /></label><label>Message<textarea required name="message" rows="6" placeholder="Write your message…" /></label><button className="primary-button" type="submit">Send message →</button></form></div></Page> }
  function Page({ title, small, children }) { return <div className="page"><section className="page-hero" style={{ '--image': `url(${baseData.categories[1].banner})` }}><div><span className="eyebrow">{small}</span><h1>{title}</h1><p>Discover more from the NexPlay universe.</p></div></section><section className="content-section">{children}</section></div> }
  function mediaPage() {
    const moviePreviews = (liveCards.movies || []).filter((item) => item.videoUrl)
    const animePreviews = (liveCards.anime || []).filter((item) => item.embedUrl)
    const previewSection = (title, label, items) => <section className="media-preview-section"><div className="section-heading media-heading"><div><span className="eyebrow">{label}</span><h2>{title}</h2><p>Only real previews linked to the matching title are shown.</p></div><span className="live-status">Live API</span></div>{items.length ? <div className="trailer-grid">{items.map((item) => <article className="trailer-card" key={item.id} onClick={() => setSelected(item)}><div className="trailer-preview"><img src={item.image} alt={item.title} /><span className="play-button">▶</span></div><div className="trailer-copy"><span>{item.year} · {item.subtitle}</span><h3>{item.title}</h3></div></article>)}</div> : <p className="page-note">No playable previews are available from this catalog right now.</p>}</section>
    return <Page title="Media Hub" small="Real trailers and previews">{previewSection('Movie Previews', 'Apple movie catalog', moviePreviews)}{previewSection('Anime Trailers', 'Jikan catalog', animePreviews)}<div className="section-heading media-heading"><div><span className="eyebrow">TVMaze page 0</span><h2>TV Shows</h2><p>TVMaze provides show information and artwork; Play is hidden because it does not supply videos.</p></div></div><div className="card-grid">{(liveCards['tv-shows'] || []).map(cardView)}</div></Page>
  }

  function galleryPage() { return <Page title="Image Galleries" small="Seven visual worlds"><div className="gallery-grid">{baseData.categories.map((cat) => <a className="gallery-item" key={cat.id} href={`#category/${cat.id}`} style={{ backgroundImage: `url(${cat.banner})` }}><span>{cat.name}</span></a>)}</div></Page> }
  function bookmarksPage() { const items = allCards.filter((item) => saved.includes(item.id)); return <Page title="Bookmarks & Notes" small="Your collection">{items.length ? <div className="card-grid">{items.map(cardView)}</div> : <div className="empty-state"><h2>Your collection is empty</h2><p>Open any card and select Bookmark. Your personal notes stay saved in this browser.</p><a className="primary-button" href="#discover">Discover stories</a></div>}</Page> }
  function aboutPage() { return <Page title="About NexPlay" small="One universe, every fandom"><div className="policy-copy"><h2>Made for fans who explore everything</h2><p>NexPlay brings anime, games, movies, television, K-Pop, comics and manga into one easy place. It is a student web project focused on discovery, visual storytelling and a smooth experience on every screen.</p><h2>What you can do</h2><p>Browse live public catalogs, watch short local previews, save bookmarks, write private notes, discover characters and releases, and try the temporary merchandise cart.</p><h2>Our approach</h2><p>The interface keeps the main header simple while the sidebar gives quick access to every feature and fandom.</p></div></Page> }
  function privacyPage() { return <Page title="Privacy Policy" small="Clear and simple"><div className="policy-copy"><h2>Data stored on your device</h2><p>NexPlay stores theme choice, bookmarks, personal notes, cart items and a local visitor counter in your browser storage. This information is not sent to NexPlay.</p><h2>Public catalog services</h2><p>Live titles and artwork may be requested from Jikan, Apple Search, TVmaze, CheapShark and Open Library. Those services can receive standard web request information under their own policies.</p><h2>Shopping</h2><p>The cart is a demonstration only. NexPlay does not collect addresses, card details or payments, and it does not provide checkout.</p></div></Page> }

  const pageView = page === 'discover' ? discoverPage() : page === 'articles' ? articlesPage() : page === 'characters' ? charactersPage() : page === 'events' ? eventsPage() : page === 'shop' ? shopPage() : page === 'media' ? mediaPage() : page === 'gallery' ? galleryPage() : page === 'bookmarks' ? bookmarksPage() : page === 'about' ? aboutPage() : page === 'privacy' ? privacyPage() : page === 'contact' ? contactPage() : page.startsWith('category/') ? <Page title={currentCategory?.name || 'Category'} small={currentCategory?.eyebrow}>{liveSection(currentCategory?.id || 'anime')}</Page> : homePage()

  const menu = [['home', '⌂', 'Home'], ['discover', '⌕', 'Discover'], ['articles', '▤', 'Articles & News'], ['media', '▶', 'Trailers, Video & Audio'], ['gallery', '▧', 'Image Galleries'], ['characters', '♙', 'Character Profiles'], ['events', '◷', 'Events & Releases'], ['shop', '▣', 'Merchandise'], ['bookmarks', '★', 'Bookmarks & Notes'], ['about', 'ⓘ', 'About Us'], ['contact', '✉', 'Contact'], ['privacy', '⌾', 'Privacy Policy']]
  const results = search.trim() ? allCards.filter((item) => `${item.title} ${item.subtitle} ${item.category}`.toLowerCase().includes(search.toLowerCase())).slice(0, 8) : []
  const cartItems = extra.products.map(([name, cat, price]) => ({ name, cat, price, quantity: cart.filter((id) => id === name).length })).filter((item) => item.quantity)
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return <div>{notice && <div className="theme-notice" role="status"><span>{notice}</span><button onClick={() => setNotice(null)} aria-label="Close notification">×</button></div>}<Intro /><header className="site-header"><button className="menu-button visible-menu" onClick={() => setSideOpen(true)} aria-label="Open menu">☰</button><a className="brand" href="#home"><span className="brand-mark"><span>N</span><i /></span><span>NexPlay</span></a><nav className="main-nav"><a className={page === 'home' ? 'active' : ''} href="#home">Home</a><a className={page === 'discover' ? 'active' : ''} href="#discover">Discover</a><a className={page === 'about' ? 'active' : ''} href="#about">About Us</a></nav><div className="header-actions"><span className="visitor-count">Visitors · {visits}</span><span className="header-clock">{clock}</span><button className="icon-button" onClick={() => setSearchOpen(true)} aria-label="Search">⌕</button><button className="theme-toggle" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>☼ <span className="toggle-track"><i /></span>☾</button><button className="cart-button" onClick={() => setCartOpen(true)}>🛍 {cart.length}</button></div></header><nav className="category-nav"><span className="category-nav-title">Fandom Categories</span>{baseData.categories.map((cat) => <a className={currentId === cat.id ? 'active' : ''} key={cat.id} href={`#category/${cat.id}`}>{cat.name}</a>)}</nav><div className="breadcrumbs"><a href="#home">Home</a><span>›</span><strong>{currentCategory?.name || page.replace('-', ' ')}</strong></div><main>{pageView}</main><footer className="site-footer"><a className="brand" href="#home"><span className="brand-mark"><span>N</span><i /></span><span>NexPlay</span></a><p>One universe. Every fandom.</p><div><a href="#about">About Us</a> · <a href="#privacy">Privacy Policy</a></div></footer>

  {sideOpen && <button className="screen-backdrop" onClick={() => setSideOpen(false)} aria-label="Close menu" />}<aside className={`app-sidebar ${sideOpen ? 'open' : ''}`}><div className="sidebar-head"><a className="brand" href="#home"><span className="brand-mark"><span>N</span><i /></span><span>NexPlay</span></a><button onClick={() => setSideOpen(false)}>×</button></div><span className="sidebar-label">Explore</span><nav>{menu.map(([id, icon, label]) => <a className={page === id ? 'active' : ''} key={id} href={`#${id}`}><i>{icon}</i>{label}</a>)}</nav><span className="sidebar-label">Fandom categories</span><nav>{baseData.categories.map((cat) => <a className={currentId === cat.id ? 'active' : ''} key={cat.id} href={`#category/${cat.id}`}><i>◆</i>{cat.name}</a>)}</nav></aside>

  {searchOpen && <div className="search-layer"><button className="screen-backdrop" onClick={() => setSearchOpen(false)} aria-label="Close search" /><section className="search-modal"><div className="search-title"><h2>Search NexPlay</h2><button onClick={() => setSearchOpen(false)}>×</button></div><input autoFocus value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search anime, games, movies and more…" />{search.trim() && <div className="search-results">{results.length ? results.map((item) => <button key={item.id} onClick={() => { setSelected(item); setSearchOpen(false) }}><strong>{item.title}</strong><span>{getCategory(baseData, item.category).name} · {item.subtitle}</span></button>) : <p>No matching stories found.</p>}</div>}</section></div>}

  {cartOpen && <><button className="screen-backdrop" onClick={() => setCartOpen(false)} aria-label="Close cart" /><aside className="cart-drawer open"><div className="cart-head"><h2>Your Cart</h2><button onClick={() => setCartOpen(false)}>×</button></div><p className="page-note">Temporary demo cart — checkout and payment are not available.</p><div className="cart-items">{cartItems.length ? cartItems.map(({ name, cat, price, quantity }) => <div className="cart-item" key={name}><div><strong>{name}</strong><span>{getCategory(baseData, cat).name}</span></div><div className="quantity-controls"><button onClick={() => changeCart(name, -1)} aria-label={`Remove one ${name}`}>−</button><span>{quantity}</span><button onClick={() => changeCart(name, 1)} aria-label={`Add one ${name}`}>+</button></div><span>${(price * quantity).toFixed(2)}</span></div>) : <p>Your cart is empty.</p>}</div><div className="cart-total"><strong>Total</strong><strong>${total.toFixed(2)}</strong></div>{cart.length > 0 && <div className="cart-actions"><button className="secondary-button" onClick={() => { setCart([]); localStorage.setItem('nexplay-cart', '[]') }}>Clear cart</button><button className="primary-button order-button" onClick={placeOrder}>Place Demo Order</button></div>}</aside></>}

  <button className="chat-toggle" onClick={() => setChatOpen(!chatOpen)}>✦</button>{chatOpen && <div className="chat-panel open"><div className="chat-head"><div><strong>Nex Guide</strong><small>Online · Ask anything</small></div><button onClick={() => setChatOpen(false)}>×</button></div><div className="chat-messages">{chatMessages.map((message, index) => <p className={message.from === 'bot' ? 'bot-message' : 'user-message'} key={`${message.from}-${index}`}>{message.text}</p>)}</div><div className="chat-options">{['Recommend something', 'What can I watch?', 'Show my bookmarks'].map((text) => <button key={text} onClick={() => askGuide(text)}>{text}</button>)}</div><form className="chat-form" onSubmit={(event) => { event.preventDefault(); askGuide() }}><input value={chatInput} onChange={(event) => setChatInput(event.target.value)} placeholder="Type your question…" aria-label="Ask Nex Guide" /><button type="submit" aria-label="Send message">➤</button></form></div>}{selected && <Detail card={selected} close={() => setSelected(null)} saved={saved} toggleSaved={toggleSaved} notes={notes} setNotes={setNotes} data={baseData} />}</div>
}

function Intro() { const [show, setShow] = useState(true); return show ? <div className="intro"><div className="intro-content"><div className="brand-mark brand-mark-large"><span>N</span><i /></div><p className="intro-kicker">Your fandom starts here</p><h1>Welcome to <strong>NexPlay</strong></h1><p>Stories, games and fandoms — all in one universe.</p><button className="primary-button" onClick={() => setShow(false)}>Enter the universe →</button></div></div> : null }

function Detail({ card, close, saved, toggleSaved, notes, setNotes, data }) {
  const cat = getCategory(data, card.category)
  const isSaved = saved.includes(card.id)
  const player = useRef(null)
  const hasGame = card.category === 'gaming'
  const gameNumber = card.gameIndex ?? ([...String(card.id)].reduce((total, letter) => total + letter.charCodeAt(0), 0) % games.length)
  const selectedGame = games[gameNumber]
  const fallbackEmbed = categoryShowcases[card.category]
  const exactVideo = Boolean(card.videoUrl || card.embedUrl)
  const hasRealVideo = !hasGame && Boolean(card.videoUrl || card.embedUrl || fallbackEmbed)
  const embedSource = card.embedUrl || (!card.videoUrl ? fallbackEmbed : null)
  const [playing, setPlaying] = useState(hasRealVideo)
  const [gameOpen, setGameOpen] = useState(false)
  function stopVideo() {
    if (player.current) { player.current.pause(); player.current.currentTime = 0 }
    setPlaying(false)
  }
  return <div className="modal open"><div className="modal-backdrop" onClick={close} /><section className={`detail-dialog ${(playing && hasRealVideo) || gameOpen ? 'playing-video' : ''}`}><button className="modal-close" onClick={close}>×</button>{gameOpen ? <div className="game-stage"><iframe srcDoc={selectedGame.source} title={`NexPlay ${selectedGame.name}`} sandbox="allow-scripts allow-modals" /><div className="player-actions"><button onClick={() => setGameOpen(false)}>■ Exit Game</button><span>{selectedGame.name}</span></div></div> : playing && hasRealVideo ? <div className="detail-art video-detail">{embedSource ? <iframe src={embedSource} title={exactVideo ? `${card.title} trailer` : `${cat.name} category showcase`} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /> : <video ref={player} src={card.videoUrl} poster={card.image || undefined} controls autoPlay playsInline preload="metadata">Your browser does not support video playback.</video>}<div className="player-actions"><button onClick={stopVideo}>■ Stop</button><button onClick={() => setPlaying(false)}>View Poster</button>{!exactVideo && <span>Category Showcase</span>}</div></div> : <div className={`detail-art ${card.image ? 'remote-art' : ''}`} style={card.image ? { '--image': `url(${card.image})` } : { '--sheet': `url(${cat.sheet})`, '--position': getPosition(card.tile) }}>{hasGame ? <button className="poster-play" onClick={() => setGameOpen(true)}><span>🎮</span> Play {selectedGame.name}</button> : hasRealVideo && <button className="poster-play" onClick={() => setPlaying(true)}><span>▶</span>{exactVideo ? 'Play Trailer' : `Play ${cat.name} Showcase`}</button>}</div>}<div className="detail-copy"><span className="eyebrow">{cat.name} · {card.type}</span><h2>{card.title}</h2><p className="detail-subtitle">{card.subtitle}</p><div className="detail-meta"><span>★ {card.rating}</span><span>{card.year}</span></div><p>{card.description}</p>{card.audio && <audio className="audio-player" src={card.audio} controls />}<label className="note-label">Personal note</label><textarea className="note-input" rows="3" value={notes[card.id] || ''} onChange={(event) => { const next = { ...notes, [card.id]: event.target.value }; setNotes(next); localStorage.setItem('nexplay-notes', JSON.stringify(next)) }} /><div className="detail-actions">{hasGame ? <button className="play-detail-button" onClick={() => setGameOpen(true)}>🎮 Play {selectedGame.name}</button> : hasRealVideo && <button className="play-detail-button" onClick={() => setPlaying(true)}>▶ {exactVideo ? 'Play Trailer' : 'Category Showcase'}</button>}<button className="primary-button" onClick={() => toggleSaved(card.id)}>{isSaved ? '★ Bookmarked' : '☆ Bookmark'}</button><button className="secondary-button" onClick={close}>Close</button></div></div></section></div>
}
