/* ============ Lumière — interactions ============ */

/* ====== CONFIG ====== */
/* TODO: replace with the maison's real WhatsApp number, intl format, digits only */
const WA_NUMBER = '15551234567';

/* ====== SVG jewelry (inline, no external assets) ====== */
const SVG = {
  ring:`<svg viewBox="0 0 120 120"><defs><linearGradient id="g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fbf6ea"/><stop offset="1" stop-color="#c5a572"/></linearGradient></defs><g fill="none" stroke="url(#g1)" stroke-width="2"><circle cx="60" cy="78" r="30"/><path d="M48 50 L60 30 L72 50 L60 62 Z"/><path d="M48 50 L72 50 M60 30 L54 50 M60 30 L66 50 M54 50 L60 62 M66 50 L60 62"/></g></svg>`,
  necklace:`<svg viewBox="0 0 120 120"><defs><linearGradient id="g2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fbf6ea"/><stop offset="1" stop-color="#c5a572"/></linearGradient></defs><g fill="none" stroke="url(#g2)" stroke-width="2"><path d="M20 28 Q60 78 100 28"/><path d="M52 64 L60 52 L68 64 L60 80 Z"/><path d="M52 64 L68 64 M60 52 L60 80"/></g></svg>`,
  earrings:`<svg viewBox="0 0 120 120"><defs><linearGradient id="g3" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fbf6ea"/><stop offset="1" stop-color="#c5a572"/></linearGradient></defs><g fill="none" stroke="url(#g3)" stroke-width="2"><g><path d="M42 28 a8 8 0 1 1 0 16"/><path d="M34 52 L42 40 L50 52 L42 70 Z"/><path d="M34 52 L50 52"/></g><g><path d="M78 28 a8 8 0 1 1 0 16"/><path d="M70 52 L78 40 L86 52 L78 70 Z"/><path d="M70 52 L86 52"/></g></g></svg>`,
  bracelet:`<svg viewBox="0 0 120 120"><defs><linearGradient id="g4" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fbf6ea"/><stop offset="1" stop-color="#c5a572"/></linearGradient></defs><g fill="none" stroke="url(#g4)" stroke-width="2"><ellipse cx="60" cy="60" rx="40" ry="26"/><path d="M50 48 L60 38 L70 48 L60 56 Z"/><path d="M50 48 L70 48 M60 38 L60 56"/></g></svg>`
};
const mediaBg = {
  rings:'radial-gradient(circle at 50% 40%,#1d2622,#0e0f10)',
  necklaces:'radial-gradient(circle at 50% 40%,#241d22,#0e0f10)',
  earrings:'radial-gradient(circle at 50% 40%,#22201d,#0e0f10)',
  bracelets:'radial-gradient(circle at 50% 40%,#1d2226,#0e0f10)'
};

/* ====== catalogue ====== */
const PRODUCTS = [
  {id:'r1',name:'Étoile Solitaire',cat:'rings',svg:'ring',price:2850,tag:'Icon',occ:['wedding','anniversary'],desc:'A single cultivated brilliant rising from a band of recycled platinum — our most enduring expression of light.',carat:'1.00',color:'D',clarity:'VVS1',cut:'Excellent',metal:'Recycled Platinum 950',hall:'Hall A · Chartres',co2:'7 kg'},
  {id:'r2',name:'Aurore Trilogy',cat:'rings',svg:'ring',price:4200,tag:'New',occ:['anniversary','wedding'],desc:'Three cultivated stones — past, present and future — set in a continuous line of recycled gold.',carat:'1.50',color:'E',clarity:'VVS2',cut:'Excellent',metal:'Recycled Yellow Gold 18k',hall:'Hall A · Chartres',co2:'9 kg'},
  {id:'n1',name:'Goutte de Lumière',cat:'necklaces',svg:'necklace',price:1980,tag:null,occ:['birthday','anniversary'],desc:'A pear-cut pendant suspended like a single drop of light on a fine recycled-gold chain.',carat:'0.75',color:'F',clarity:'VS1',cut:'Excellent',metal:'Recycled White Gold 18k',hall:'Hall B · Lyon',co2:'6 kg'},
  {id:'n2',name:'Rivière Céleste',cat:'necklaces',svg:'necklace',price:6400,tag:'Icon',occ:['wedding','anniversary'],desc:'Twenty-two graduated cultivated diamonds flow together in an unbroken river of brilliance.',carat:'5.00',color:'D-F',clarity:'VVS',cut:'Excellent',metal:'Recycled Platinum 950',hall:'Hall B · Lyon',co2:'24 kg'},
  {id:'e1',name:'Rosée Studs',cat:'earrings',svg:'earrings',price:1450,tag:null,occ:['birthday','anniversary'],desc:'A matched pair of cultivated brilliants, held in four delicate prongs like morning dew.',carat:'1.00',color:'E',clarity:'VVS2',cut:'Excellent',metal:'Recycled Yellow Gold 18k',hall:'Hall C · Antwerp',co2:'8 kg'},
  {id:'e2',name:'Cascade Drops',cat:'earrings',svg:'earrings',price:3300,tag:'New',occ:['birthday','wedding'],desc:'Articulated drops that move and catch the light with every turn of the head.',carat:'2.00',color:'E',clarity:'VS1',cut:'Excellent',metal:'Recycled White Gold 18k',hall:'Hall C · Antwerp',co2:'11 kg'},
  {id:'b1',name:'Lien Éternel',cat:'bracelets',svg:'bracelet',price:3950,tag:null,occ:['anniversary','wedding'],desc:'Fifteen cultivated brilliants linked in a continuous embrace — the tennis bracelet, reimagined.',carat:'3.00',color:'F',clarity:'VVS2',cut:'Excellent',metal:'Recycled White Gold 18k',hall:'Hall A · Chartres',co2:'14 kg'},
  {id:'b2',name:'Halo Bangle',cat:'bracelets',svg:'bracelet',price:2600,tag:'New',occ:['birthday','anniversary'],desc:'A solitary cultivated diamond crowns a polished cuff of solid recycled gold.',carat:'1.00',color:'E',clarity:'VVS1',cut:'Excellent',metal:'Recycled Yellow Gold 18k',hall:'Hall B · Lyon',co2:'9 kg'}
];
const certNo = id => 'LUM-' + id.toUpperCase() + '-' + (2600 + id.charCodeAt(0)*7 + id.charCodeAt(1)*13);

/* ====== customizer options ====== */
const OPT = {
  metal:[
    {v:'Yellow Gold',d:0,c:'#d4af37'},{v:'White Gold',d:0,c:'#e8e8e8'},
    {v:'Rose Gold',d:.03,c:'#e0a896'},{v:'Platinum',d:.18,c:'#cfd2d4'}
  ],
  karat:[{v:'14k',d:-.08},{v:'18k',d:0},{v:'22k',d:.12}],
  stone:[
    {v:'Lab Diamond',d:0},{v:'Blue Sapphire',d:-.05},{v:'Emerald',d:.04},
    {v:'Ruby',d:.06},{v:'Pink Diamond',d:.28}
  ],
  cut:[{v:'Round',d:0},{v:'Oval',d:.02},{v:'Emerald',d:.03},{v:'Pear',d:.02},{v:'Princess',d:0}]
};
const sizeOpts = cat => cat==='rings' ? ['4','4.5','5','5.5','6','6.5','7','7.5','8']
  : cat==='necklaces' ? ['40 cm','45 cm','50 cm','55 cm']
  : cat==='bracelets' ? ['16 cm','17 cm','18 cm','19 cm']
  : ['One Size'];

/* ====== state ====== */
let cart = [];          // {key, id, price, config}
let activeFilter = 'all';
let activeOccasion = null;
let activeSort = 'featured';

/* ====== COUNTDOWN ====== */
(function countdown(){
  // rolling 12-day event window so it never expires
  const base = new Date('2026-06-20T00:00:00');
  let end = new Date(base);
  const now = Date.now();
  while(end.getTime() < now) end = new Date(end.getTime() + 12*864e5);
  const tgt = end.getTime();
  const D=document.getElementById('cdD'),H=document.getElementById('cdH'),M=document.getElementById('cdM'),S=document.getElementById('cdS');
  const pad=n=>String(n).padStart(2,'0');
  function tick(){
    let diff=Math.max(0,tgt-Date.now());
    const d=Math.floor(diff/864e5);diff-=d*864e5;
    const h=Math.floor(diff/36e5);diff-=h*36e5;
    const m=Math.floor(diff/6e4);diff-=m*6e4;
    const s=Math.floor(diff/1e3);
    if(D){D.textContent=pad(d);H.textContent=pad(h);M.textContent=pad(m);S.textContent=pad(s);}
  }
  tick(); setInterval(tick,1000);
})();

/* ====== render products (filter + occasion + sort) ====== */
const grid = document.getElementById('productGrid');
function visibleProducts(){
  let list = PRODUCTS.filter(p=>{
    const okCat = activeFilter==='all' || p.cat===activeFilter;
    const okOcc = !activeOccasion || p.occ.includes(activeOccasion);
    return okCat && okOcc;
  });
  if(activeSort==='price-asc') list=[...list].sort((a,b)=>a.price-b.price);
  else if(activeSort==='price-desc') list=[...list].sort((a,b)=>b.price-a.price);
  else if(activeSort==='name') list=[...list].sort((a,b)=>a.name.localeCompare(b.name));
  return list;
}
function renderGrid(){
  const list = visibleProducts();
  grid.innerHTML = list.map(p=>`
    <article class="card">
      <div class="card__media" style="background:${mediaBg[p.cat]}">
        ${p.tag?`<span class="card__tag">${p.tag}</span>`:''}
        ${SVG[p.svg]}
        <div class="card__view" data-view="${p.id}"><span>Quick View</span></div>
      </div>
      <div class="card__body">
        <h3 class="card__name">${p.name}</h3>
        <p class="card__desc">${p.desc.split('—')[0]}</p>
        <p class="card__price">$${p.price.toLocaleString()}</p>
        <button class="card__add" data-id="${p.id}">Add to Bag</button>
      </div>
    </article>`).join('') || `<p style="grid-column:1/-1;text-align:center;font-family:var(--serif);font-style:italic;color:#8a887d">No pieces match — try another selection.</p>`;
  // occasion banner
  const ao=document.getElementById('activeOccasion');
  if(activeOccasion){
    ao.hidden=false;
    ao.innerHTML=`Curated for a <em>${activeOccasion}</em><button id="clearOcc">Clear</button>`;
  } else ao.hidden=true;
}
renderGrid();

document.getElementById('filters').addEventListener('click',e=>{
  const b=e.target.closest('.filter'); if(!b) return;
  document.querySelectorAll('.filter').forEach(f=>f.classList.remove('is-active'));
  b.classList.add('is-active');
  activeFilter=b.dataset.filter; renderGrid();
});
document.getElementById('sortSelect').addEventListener('change',e=>{activeSort=e.target.value;renderGrid();});

grid.addEventListener('click',e=>{
  const add=e.target.closest('.card__add');
  if(add){ addToCart(add.dataset.id); toast('Added to your bag'); return; }
  const view=e.target.closest('[data-view]');
  if(view){ openProduct(view.dataset.view); }
});

/* occasion section */
document.querySelectorAll('.occasion').forEach(o=>o.addEventListener('click',()=>{
  activeOccasion=o.dataset.occasion;
  activeFilter='all';
  document.querySelectorAll('.filter').forEach(f=>f.classList.toggle('is-active',f.dataset.filter==='all'));
  renderGrid();
  document.getElementById('collections').scrollIntoView({behavior:'smooth'});
}));
document.getElementById('activeOccasion').addEventListener('click',e=>{
  if(e.target.id==='clearOcc'){ activeOccasion=null; renderGrid(); }
});

/* ====== cart ====== */
const cartEl=document.getElementById('cart'), overlay=document.getElementById('overlay');
const openCart=()=>{cartEl.classList.add('open');overlay.classList.add('show')};
const closeCart=()=>{cartEl.classList.remove('open');overlay.classList.remove('show')};
document.getElementById('cartBtn').addEventListener('click',openCart);
document.getElementById('cartClose').addEventListener('click',closeCart);
overlay.addEventListener('click',closeCart);

function addToCart(id,config,price){
  const p=PRODUCTS.find(x=>x.id===id);
  const cfg=config||{};
  const key=id+'|'+JSON.stringify(cfg);
  const existing=cart.find(c=>c.key===key);
  if(existing) existing.qty++;
  else cart.push({key,id,qty:1,price:price||p.price,config:cfg});
  renderCart();
}
function changeQty(key,d){const c=cart.find(x=>x.key===key);if(!c)return;c.qty+=d;if(c.qty<=0)cart=cart.filter(x=>x.key!==key);renderCart();}
function removeItem(key){cart=cart.filter(x=>x.key!==key);renderCart();}
function cartTotal(){return cart.reduce((s,c)=>s+c.price*c.qty,0);}
function cartCount(){return cart.reduce((s,c)=>s+c.qty,0);}

function renderCart(){
  const items=document.getElementById('cartItems');
  if(!cart.length){
    items.innerHTML='<p class="cart__empty">Your bag awaits its first treasure.</p>';
  } else {
    items.innerHTML=cart.map(c=>{
      const p=PRODUCTS.find(x=>x.id===c.id);
      const cfg=Object.values(c.config||{}).filter(Boolean).join(' · ');
      return `<div class="cart-item">
        <div class="cart-item__media">${SVG[p.svg]}</div>
        <div class="cart-item__info">
          <div class="cart-item__name">${p.name}</div>
          ${cfg?`<div class="cart-item__price" style="font-size:.7rem;color:#8a887d">${cfg}</div>`:''}
          <div class="cart-item__price">$${c.price.toLocaleString()}</div>
          <div class="cart-item__qty">
            <button data-act="dec" data-key="${c.key}">&minus;</button><span>${c.qty}</span>
            <button data-act="inc" data-key="${c.key}">+</button>
          </div>
          <button class="cart-item__remove" data-act="rm" data-key="${c.key}">Remove</button>
        </div></div>`;
    }).join('');
  }
  document.getElementById('cartCount').textContent=cartCount();
  document.getElementById('cartTotal').textContent='$'+cartTotal().toLocaleString();
}
document.getElementById('cartItems').addEventListener('click',e=>{
  const b=e.target.closest('[data-act]'); if(!b)return;
  const {act,key}=b.dataset;
  if(act==='inc')changeQty(key,1);
  if(act==='dec')changeQty(key,-1);
  if(act==='rm')removeItem(key);
});
document.getElementById('checkoutBtn').addEventListener('click',()=>{
  if(!cart.length){toast('Your bag is empty');return;}
  closeCart(); openCheckout();
});
renderCart();

/* ====== toast ====== */
let toastTimer;
function toast(msg){
  const t=document.getElementById('toast');
  t.textContent=msg;t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>t.classList.remove('show'),2200);
}

/* ====== generic modals ====== */
function openModal(id){const m=document.getElementById(id);m.classList.add('open');m.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';}
function closeModal(m){m.classList.remove('open');m.setAttribute('aria-hidden','true');if(!document.querySelector('.modal.open'))document.body.style.overflow='';if(m.id==='tryonModal')stopCamera();}
document.querySelectorAll('.modal').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)closeModal(m);}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){const o=document.querySelector('.modal.open');if(o)closeModal(o);else closeCart();}});
// data-open buttons across the page
document.body.addEventListener('click',e=>{
  const o=e.target.closest('[data-open]'); if(!o)return;
  const t=o.dataset.open;
  if(t==='tryon')openTryon();
  else if(t==='appointment')openAppointment();
  else if(t==='tracking')openTracking();
  document.getElementById('mobileMenu').classList.remove('open');
});

/* ====== product quick-view + customizer ====== */
function priceFor(p,cfg){
  let d=0;
  ['metal','karat','stone','cut'].forEach(k=>{
    const found=(OPT[k]||[]).find(o=>o.v===cfg[k]); if(found)d+=found.d;
  });
  return Math.round(p.price*(1+d)/10)*10;
}
let pmState=null;
function openProduct(id){
  const p=PRODUCTS.find(x=>x.id===id);
  pmState={id,cfg:{metal:p.metal.includes('Platinum')?'Platinum':p.metal.includes('White')?'White Gold':'Yellow Gold',karat:'18k',stone:'Lab Diamond',cut:'Round',size:sizeOpts(p.cat)[Math.floor(sizeOpts(p.cat).length/2)]}};
  renderProduct();
  openModal('productModal');
}
function chipRow(group,key){
  return `<div class="cz__opts">${OPT[group].map(o=>{
    const sel=pmState.cfg[key]===o.v?'sel':'';
    const sw=o.c?`<span class="cz__swatch"><i style="background:${o.c}"></i>${o.v}</span>`:o.v;
    return `<button class="cz__opt ${sel}" data-cz="${key}" data-val="${o.v}">${sw}</button>`;
  }).join('')}</div>`;
}
function renderProduct(){
  const p=PRODUCTS.find(x=>x.id===pmState.id);
  const price=priceFor(p,pmState.cfg);
  const sizes=sizeOpts(p.cat);
  document.getElementById('productPanel').innerHTML=`
    <button class="modal__close" data-close>&times;</button>
    <div class="pm">
      <div class="pm__media" style="background:${mediaBg[p.cat]}">${SVG[p.svg]}</div>
      <div class="pm__body">
        <p class="pm__tag">${p.tag||'Lumière'} · Cultivated</p>
        <h3 class="pm__name">${p.name}</h3>
        <p class="pm__price" id="pmPrice">$${price.toLocaleString()}</p>
        <p class="pm__desc">${p.desc}</p>
        <div class="cz">
          <div class="cz__group"><div class="cz__label">Metal &amp; Colour <b>${pmState.cfg.metal}</b></div>${chipRow('metal','metal')}</div>
          <div class="cz__group"><div class="cz__label">Gold Karat <b>${pmState.cfg.karat}</b></div>${chipRow('karat','karat')}</div>
          <div class="cz__group"><div class="cz__label">Centre Stone <b>${pmState.cfg.stone}</b></div>${chipRow('stone','stone')}</div>
          <div class="cz__group"><div class="cz__label">Cut <b>${pmState.cfg.cut}</b></div>${chipRow('cut','cut')}</div>
          <div class="cz__group"><div class="cz__label">Size <b>${pmState.cfg.size}</b></div>
            <div class="cz__opts">${sizes.map(s=>`<button class="cz__opt ${pmState.cfg.size===s?'sel':''}" data-cz="size" data-val="${s}">${s}</button>`).join('')}</div>
          </div>
        </div>
        <ul class="pm__specs">
          <li><span>Carat</span><span>${p.carat}</span></li>
          <li><span>Colour</span><span>${p.color}</span></li>
          <li><span>Clarity</span><span>${p.clarity}</span></li>
        </ul>
        <div class="pm__actions">
          <button class="btn btn--gold" id="pmAdd">Add to Bag — $${price.toLocaleString()}</button>
          <button class="pm__cert" data-cert="${p.id}">View Origin Certificate ◇</button>
        </div>
      </div>
    </div>`;
}
document.getElementById('productPanel').addEventListener('click',e=>{
  if(e.target.closest('[data-close]'))return closeModal(document.getElementById('productModal'));
  const cz=e.target.closest('[data-cz]');
  if(cz){ pmState.cfg[cz.dataset.cz]=cz.dataset.val; renderProduct(); return; }
  if(e.target.closest('#pmAdd')){
    const p=PRODUCTS.find(x=>x.id===pmState.id);
    addToCart(p.id,{...pmState.cfg},priceFor(p,pmState.cfg));
    toast('Added to your bag'); closeModal(document.getElementById('productModal')); openCart(); return;
  }
  const cert=e.target.closest('[data-cert]');
  if(cert)openCertificate(cert.dataset.cert,pmState&&pmState.id===cert.dataset.cert?pmState.cfg:null);
});

/* ====== certificate ====== */
function openCertificate(id,cfg){
  const p=PRODUCTS.find(x=>x.id===id);
  const metal=cfg?`${cfg.metal==='Platinum'?'Recycled Platinum 950':'Recycled '+cfg.metal+' '+cfg.karat}`:p.metal;
  const stone=cfg?cfg.stone:'Lab Diamond';
  document.getElementById('certPanel').innerHTML=`
    <button class="modal__close" data-close>&times;</button>
    <div class="cert">
      <div class="cert__head"><div class="cert__mark">&#9670;</div><div class="cert__brand">LUMIÈRE</div><div class="cert__sub">Certificate of Cultivated Origin</div></div>
      <p class="cert__title">${p.name}</p>
      <p class="cert__no">No. ${certNo(id)}</p>
      <ul class="cert__rows">
        <li><span>Diamond Type</span><span>Laboratory-Grown (CVD)</span></li>
        <li><span>Centre Stone</span><span>${stone}</span></li>
        <li><span>Carat Weight</span><span>${p.carat} ct</span></li>
        <li><span>Colour Grade</span><span>${p.color}</span></li>
        <li><span>Clarity Grade</span><span>${p.clarity}</span></li>
        <li><span>Cut</span><span>${cfg?cfg.cut:p.cut}</span></li>
        <li><span>Setting</span><span>${metal}</span></li>
        <li><span>Cultivation Hall</span><span>${p.hall}</span></li>
        <li><span>Energy Source</span><span>100% Renewable</span></li>
        <li><span>Carbon Footprint</span><span>${p.co2} CO₂e</span></li>
        <li><span>Earth Displaced</span><span>0 m³</span></li>
      </ul>
      <div class="cert__seal">
        <svg viewBox="0 0 60 60"><g fill="none" stroke="#c5a572" stroke-width="1"><circle cx="30" cy="30" r="26"/><circle cx="30" cy="30" r="21"/><path d="M30 14 L42 26 L30 50 L18 26 Z"/><path d="M18 26 L42 26 M30 14 L24 26 M30 14 L36 26"/></g></svg>
        <p>Grown, cut and set under the Lumière Maison standard. Traceable to the atom, guaranteed for life.</p>
      </div>
      <p class="cert__foot">Issued ${new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'long',year:'numeric'})} · Lumière Maison</p>
    </div>`;
  openModal('certModal');
  document.getElementById('certPanel').querySelector('[data-close]').addEventListener('click',()=>closeModal(document.getElementById('certModal')));
}

/* ====== multi-step checkout ====== */
let coStep=1; const coData={};
function openCheckout(){coStep=1;renderCheckout();openModal('checkoutModal');}
function stepsBar(){
  const labels=['Information','Shipping','Payment'];
  return `<div class="co__steps">${labels.map((l,i)=>{const n=i+1,cls=n<coStep?'done':n===coStep?'active':'';
    return `<div class="co__step ${cls}"><b>${n<coStep?'✓':n}</b><span>${l}</span></div>${i<2?'<i class="co__bar"></i>':''}`;}).join('')}</div>`;
}
function summaryBlock(){
  const lines=cart.map(c=>{const p=PRODUCTS.find(x=>x.id===c.id);
    return `<div class="co__line"><span>${p.name} × ${c.qty}</span><span>$${(c.price*c.qty).toLocaleString()}</span></div>`;}).join('');
  return `<div class="co__summary">${lines}
    <div class="co__line"><span>Insured Delivery</span><span>Complimentary</span></div>
    <div class="co__line co__line--total"><span>Total</span><span>$${cartTotal().toLocaleString()}</span></div></div>`;
}
function renderCheckout(){
  const panel=document.getElementById('checkoutPanel'); let inner='';
  if(coStep===1){
    inner=`<h3 class="co__title">Your Details</h3>${stepsBar()}
      <form id="coForm" class="co__grid">
        <div class="co__field"><label>First Name</label><input name="first" required value="${coData.first||''}"></div>
        <div class="co__field"><label>Last Name</label><input name="last" required value="${coData.last||''}"></div>
        <div class="co__field full"><label>Email</label><input type="email" name="email" required value="${coData.email||''}"></div>
        <div class="co__field full"><label>Phone</label><input name="phone" value="${coData.phone||''}"></div>
      </form>
      <div class="co__nav"><button class="btn co__back" data-close>Cancel</button><button class="btn btn--gold" data-next>Continue to Shipping</button></div>`;
  } else if(coStep===2){
    inner=`<h3 class="co__title">Shipping</h3>${stepsBar()}
      <form id="coForm" class="co__grid">
        <div class="co__field full"><label>Address</label><input name="address" required value="${coData.address||''}"></div>
        <div class="co__field"><label>City</label><input name="city" required value="${coData.city||''}"></div>
        <div class="co__field"><label>Postal Code</label><input name="zip" required value="${coData.zip||''}"></div>
        <div class="co__field full"><label>Country</label><select name="country">${['France','United Kingdom','United States','Singapore','Indonesia','United Arab Emirates','Japan','Switzerland'].map(c=>`<option ${coData.country===c?'selected':''}>${c}</option>`).join('')}</select></div>
      </form>
      <div class="co__nav"><button class="btn co__back" data-back>Back</button><button class="btn btn--gold" data-next>Continue to Payment</button></div>`;
  } else if(coStep===3){
    inner=`<h3 class="co__title">Payment</h3>${stepsBar()}${summaryBlock()}
      <form id="coForm" class="co__grid">
        <div class="co__field full"><label>Cardholder Name</label><input name="cardName" required value="${coData.cardName||''}"></div>
        <div class="co__field full"><label>Card Number</label><input name="cardNo" placeholder="•••• •••• •••• ••••" maxlength="19" required></div>
        <div class="co__field"><label>Expiry</label><input name="exp" placeholder="MM/YY" maxlength="5" required></div>
        <div class="co__field"><label>CVC</label><input name="cvc" placeholder="•••" maxlength="4" required></div>
      </form>
      <div class="co__nav"><button class="btn co__back" data-back>Back</button><button class="btn btn--gold" data-next>Place Order · $${cartTotal().toLocaleString()}</button></div>`;
  } else {
    const ref='LUM'+Date.now().toString().slice(-8);
    coData.ref=ref;
    inner=`<div class="co__confirm"><div class="cert__mark">&#9670;</div>
      <h3>Merci, ${coData.first||'collector'}.</h3>
      <p>Your order is received. Each piece will arrive hand-set, insured, and accompanied by its origin certificate.</p>
      <p class="co__order">Order ${ref}</p>
      <p style="margin-top:1.4rem;font-size:.8rem;color:#8a887d">A confirmation has been sent to ${coData.email||'your email'}. Track it anytime with this reference.</p>
      <div class="co__nav" style="max-width:340px;margin:1.8rem auto 0"><button class="btn btn--gold" data-finish>Close</button></div></div>`;
    cart=[]; renderCart();
  }
  panel.innerHTML=`<button class="modal__close" data-close>&times;</button><div class="co">${inner}</div>`;
}
function saveForm(){const f=document.getElementById('coForm');if(!f)return true;if(!f.checkValidity()){f.reportValidity();return false;}new FormData(f).forEach((v,k)=>coData[k]=v);return true;}
document.getElementById('checkoutPanel').addEventListener('click',e=>{
  if(e.target.closest('[data-close]')||e.target.closest('[data-finish]'))return closeModal(document.getElementById('checkoutModal'));
  if(e.target.closest('[data-back]')){coStep--;renderCheckout();return;}
  if(e.target.closest('[data-next]')){if(!saveForm())return;coStep++;renderCheckout();}
});

/* ====== VIRTUAL TRY-ON (camera) ====== */
let stream=null, toPiece='necklace', toScale=1;
function openTryon(){
  document.getElementById('tryonPanel').innerHTML=`
    <button class="modal__close" data-close>&times;</button>
    <div class="to">
      <h3>Virtual Try-On</h3>
      <p class="to__sub">Augmented Reality · Camera</p>
      <div class="to__stage" id="toStage">
        <video id="toVideo" autoplay muted playsinline></video>
        <div class="to__jewel" id="toJewel">${SVG[toPiece]}</div>
        <div class="to__hint" id="toHint">Allow camera access to see our pieces in your own light.</div>
      </div>
      <div class="to__controls">
        <div class="to__pieces">
          ${['necklace','earrings','ring','bracelet'].map(k=>`<button class="to__piece ${k===toPiece?'sel':''}" data-piece="${k}">${SVG[k]}</button>`).join('')}
        </div>
        <div class="to__slider"><span>Size</span><input type="range" id="toSize" min="20" max="70" value="38"><span>Position drag ↕</span></div>
        <div class="to__buttons">
          <button class="btn btn--gold" id="toStart">Start Camera</button>
          <button class="btn btn--ghost" id="toCapture">Capture Photo</button>
        </div>
      </div>
      <canvas id="toCanvas"></canvas>
    </div>`;
  openModal('tryonModal');
  bindTryon();
}
function bindTryon(){
  const panel=document.getElementById('tryonPanel');
  panel.querySelector('[data-close]').addEventListener('click',()=>closeModal(document.getElementById('tryonModal')));
  panel.querySelectorAll('.to__piece').forEach(b=>b.addEventListener('click',()=>{
    toPiece=b.dataset.piece;
    panel.querySelectorAll('.to__piece').forEach(x=>x.classList.toggle('sel',x===b));
    document.getElementById('toJewel').innerHTML=SVG[toPiece];
  }));
  document.getElementById('toSize').addEventListener('input',e=>{
    document.getElementById('toJewel').style.width=e.target.value+'%';
    document.getElementById('toJewel').style.left=(50-e.target.value/2)+'%';
  });
  document.getElementById('toStart').addEventListener('click',startCamera);
  document.getElementById('toCapture').addEventListener('click',capturePhoto);
  // draggable jewel
  const jewel=document.getElementById('toJewel'), stage=document.getElementById('toStage');
  let drag=false;
  const move=(cx,cy)=>{const r=stage.getBoundingClientRect();
    jewel.style.left=Math.max(0,Math.min(100,(cx-r.left)/r.width*100)-parseFloat(jewel.style.width||'38')/2)+'%';
    jewel.style.top=Math.max(0,Math.min(100,(cy-r.top)/r.height*100)-19)+'%';};
  jewel.style.pointerEvents='auto';jewel.style.cursor='grab';
  jewel.addEventListener('mousedown',()=>drag=true);
  window.addEventListener('mouseup',()=>drag=false);
  window.addEventListener('mousemove',e=>{if(drag)move(e.clientX,e.clientY);});
  jewel.addEventListener('touchmove',e=>{const t=e.touches[0];move(t.clientX,t.clientY);e.preventDefault();},{passive:false});
}
async function startCamera(){
  try{
    stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user'},audio:false});
    const v=document.getElementById('toVideo'); v.srcObject=stream;
    document.getElementById('toHint').style.display='none';
    toast('Camera ready — drag the jewel to place it');
  }catch(err){
    document.getElementById('toHint').textContent='Camera unavailable. Please grant permission, or try on a device with a camera.';
  }
}
function stopCamera(){ if(stream){stream.getTracks().forEach(t=>t.stop());stream=null;} }
function capturePhoto(){
  const v=document.getElementById('toVideo');
  if(!stream){toast('Start the camera first');return;}
  const c=document.getElementById('toCanvas'),ctx=c.getContext('2d');
  c.width=v.videoWidth||720;c.height=v.videoHeight||960;
  ctx.save();ctx.translate(c.width,0);ctx.scale(-1,1);ctx.drawImage(v,0,0,c.width,c.height);ctx.restore();
  // overlay jewel
  const jewel=document.getElementById('toJewel'),stage=document.getElementById('toStage');
  const jr=jewel.getBoundingClientRect(),sr=stage.getBoundingClientRect();
  const svg=jewel.querySelector('svg');
  const data=new XMLSerializer().serializeToString(svg);
  const img=new Image();
  img.onload=()=>{
    const x=(jr.left-sr.left)/sr.width*c.width, y=(jr.top-sr.top)/sr.height*c.height;
    const w=jr.width/sr.width*c.width, h=jr.height/sr.height*c.height;
    ctx.drawImage(img,x,y,w,h);
    const link=document.createElement('a');
    link.download='lumiere-tryon.png';link.href=c.toDataURL('image/png');link.click();
    toast('Portrait saved');
  };
  img.src='data:image/svg+xml;base64,'+btoa(unescape(encodeURIComponent(data)));
}

/* ====== APPOINTMENT → WhatsApp ====== */
function openAppointment(){
  document.getElementById('appointmentPanel').innerHTML=`
    <button class="modal__close" data-close>&times;</button>
    <div class="ap">
      <h3>Book a Private Appointment</h3>
      <p class="ap__sub">In our salon or by video — a concierge will confirm via WhatsApp.</p>
      <form id="apForm" class="ap__grid">
        <div class="ap__field"><label>Full Name</label><input name="name" required></div>
        <div class="ap__field"><label>Phone</label><input name="phone" required></div>
        <div class="ap__field"><label>Preferred Date</label><input type="date" name="date" required></div>
        <div class="ap__field"><label>Preferred Time</label><input type="time" name="time" required></div>
        <div class="ap__field"><label>Boutique</label><select name="place"><option>Paris · Place Vendôme</option><option>London · Bond Street</option><option>Singapore · Marina Bay</option><option>Video Consultation</option></select></div>
        <div class="ap__field"><label>Interest</label><select name="interest"><option>Engagement & Bridal</option><option>High Jewellery</option><option>Bespoke Commission</option><option>Gift Consultation</option></select></div>
        <div class="ap__field full"><label>A note for your concierge (optional)</label><textarea name="note"></textarea></div>
      </form>
      <div class="ap__wa"><b>◆ WhatsApp</b> — we'll open a pre-filled message to confirm instantly.</div>
      <div class="co__nav"><button class="btn co__back" data-close>Cancel</button><button class="btn btn--gold" id="apSend">Confirm via WhatsApp</button></div>
    </div>`;
  openModal('appointmentModal');
  const panel=document.getElementById('appointmentPanel');
  panel.querySelector('[data-close]').addEventListener('click',()=>closeModal(document.getElementById('appointmentModal')));
  document.getElementById('apSend').addEventListener('click',()=>{
    const f=document.getElementById('apForm');
    if(!f.checkValidity()){f.reportValidity();return;}
    const d={};new FormData(f).forEach((v,k)=>d[k]=v);
    const msg=`Bonjour Lumière, I would like to book a private appointment.%0A%0A`+
      `Name: ${d.name}%0APhone: ${d.phone}%0ADate: ${d.date} at ${d.time}%0A`+
      `Boutique: ${d.place}%0AInterest: ${d.interest}%0A`+(d.note?`Note: ${d.note}`:'');
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`,'_blank');
    toast('Opening WhatsApp…');
    closeModal(document.getElementById('appointmentModal'));
  });
}
// footer whatsapp quick link
document.getElementById('waFooter').href=`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Bonjour Lumière, I have a question about your cultivated diamonds.')}`;

/* ====== ORDER TRACKING ====== */
const TK_STAGES=[
  {h:'Order Placed',p:'We have received your order and certificate request.'},
  {h:'In the Atelier',p:'Your piece is being hand-set by our goldsmiths.'},
  {h:'Quality & Certification',p:'Final inspection and origin certificate issued.'},
  {h:'Shipped',p:'On its way, fully insured, with signature on delivery.'},
  {h:'Delivered',p:'In your hands. We hope it brings you light.'}
];
function openTracking(prefill){
  document.getElementById('trackingPanel').innerHTML=`
    <button class="modal__close" data-close>&times;</button>
    <div class="tk">
      <h3>Track My Order</h3>
      <p class="tk__sub">Enter the reference from your confirmation (e.g. LUM12345678).</p>
      <div class="tk__search"><input id="tkInput" placeholder="LUM00000000" value="${prefill||''}"><button class="btn btn--gold" id="tkGo">Track</button></div>
      <div id="tkResult"></div>
    </div>`;
  openModal('trackingModal');
  const panel=document.getElementById('trackingPanel');
  panel.querySelector('[data-close]').addEventListener('click',()=>closeModal(document.getElementById('trackingModal')));
  document.getElementById('tkGo').addEventListener('click',doTrack);
  document.getElementById('tkInput').addEventListener('keydown',e=>{if(e.key==='Enter')doTrack();});
  if(prefill)doTrack();
}
function doTrack(){
  const ref=(document.getElementById('tkInput').value||'').trim().toUpperCase();
  if(!/^LUM\d{4,}$/.test(ref)){document.getElementById('tkResult').innerHTML='<p style="color:#a04;text-align:center;font-size:.85rem">Please enter a valid reference, e.g. LUM12345678.</p>';return;}
  const sum=ref.split('').reduce((a,ch)=>a+ch.charCodeAt(0),0);
  const stage=sum%TK_STAGES.length; // deterministic demo stage
  const eta=new Date(Date.now()+(TK_STAGES.length-stage)*2*864e5);
  document.getElementById('tkResult').innerHTML=`
    <div class="tk__result">
      <div class="tk__meta"><div><span>Reference</span><b>${ref}</b></div><div style="text-align:right"><span>Estimated Delivery</span><b>${eta.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})}</b></div></div>
      <ul class="tk__track">${TK_STAGES.map((s,i)=>{
        const cls=i<stage?'done':i===stage?'current':'pending';
        return `<li class="tk__stage ${cls}"><div class="tk__dot">${i<stage?'✓':i===stage?'●':''}</div><div><h4>${s.h}</h4><p>${s.p}</p></div></li>`;
      }).join('')}</ul>
    </div>`;
}

/* ====== nav scroll + mobile menu ====== */
const nav=document.getElementById('nav');
const onScroll=()=>nav.classList.toggle('solid',window.scrollY>60);
onScroll();window.addEventListener('scroll',onScroll,{passive:true});
const mm=document.getElementById('mobileMenu'),tog=document.getElementById('navToggle');
tog.addEventListener('click',()=>mm.classList.toggle('open'));
mm.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>mm.classList.remove('open')));

/* ====== film play ====== */
document.getElementById('filmPlay').addEventListener('click',()=>{
  const v=document.getElementById('filmVideo');
  if(v.src){ v.play(); document.getElementById('filmOverlay').classList.add('hide'); }
  else toast('Add a film file at assets/img/film.mp4 to enable playback');
});

/* ====== reveal + counters ====== */
const io=new IntersectionObserver((es)=>{es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}});},{threshold:.16});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
const statIO=new IntersectionObserver((es)=>{es.forEach(en=>{
  if(!en.isIntersecting)return;const el=en.target,target=+el.dataset.count,t0=performance.now(),dur=1600;
  const tick=t=>{const p=Math.min((t-t0)/dur,1);el.textContent=Math.round((1-Math.pow(1-p,3))*target);if(p<1)requestAnimationFrame(tick);};
  requestAnimationFrame(tick);statIO.unobserve(el);
});},{threshold:.6});
document.querySelectorAll('.stat__num').forEach(el=>statIO.observe(el));

/* ====== newsletter ====== */
document.getElementById('newsletterForm').addEventListener('submit',e=>{
  e.preventDefault();e.target.reset();
  document.getElementById('newsletterNote').textContent='Welcome to the Maison. Watch for our next chapter.';
});
