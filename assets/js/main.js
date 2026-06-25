/* ============ Lumière — interactions ============ */

/* --- SVG jewelry illustrations (inline, no external assets) --- */
const SVG = {
  ring: `<svg viewBox="0 0 120 120"><defs><linearGradient id="g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fbf6ea"/><stop offset="1" stop-color="#c5a572"/></linearGradient></defs><g fill="none" stroke="url(#g1)" stroke-width="2"><circle cx="60" cy="78" r="30"/><path d="M48 50 L60 30 L72 50 L60 62 Z"/><path d="M48 50 L72 50 M60 30 L54 50 M60 30 L66 50 M54 50 L60 62 M66 50 L60 62"/></g></svg>`,
  necklace: `<svg viewBox="0 0 120 120"><defs><linearGradient id="g2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fbf6ea"/><stop offset="1" stop-color="#c5a572"/></linearGradient></defs><g fill="none" stroke="url(#g2)" stroke-width="2"><path d="M20 28 Q60 78 100 28"/><path d="M52 64 L60 52 L68 64 L60 80 Z"/><path d="M52 64 L68 64 M60 52 L60 80"/></g></svg>`,
  earrings: `<svg viewBox="0 0 120 120"><defs><linearGradient id="g3" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fbf6ea"/><stop offset="1" stop-color="#c5a572"/></linearGradient></defs><g fill="none" stroke="url(#g3)" stroke-width="2"><g><path d="M42 28 a8 8 0 1 1 0 16"/><path d="M34 52 L42 40 L50 52 L42 70 Z"/><path d="M34 52 L50 52"/></g><g><path d="M78 28 a8 8 0 1 1 0 16"/><path d="M70 52 L78 40 L86 52 L78 70 Z"/><path d="M70 52 L86 52"/></g></g></svg>`,
  bracelet: `<svg viewBox="0 0 120 120"><defs><linearGradient id="g4" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fbf6ea"/><stop offset="1" stop-color="#c5a572"/></linearGradient></defs><g fill="none" stroke="url(#g4)" stroke-width="2"><ellipse cx="60" cy="60" rx="40" ry="26"/><path d="M50 48 L60 38 L70 48 L60 56 Z"/><path d="M50 48 L70 48 M60 38 L60 56"/></g></svg>`
};
const mediaBg = {
  rings:'radial-gradient(circle at 50% 40%,#1d2622,#0e0f10)',
  necklaces:'radial-gradient(circle at 50% 40%,#241d22,#0e0f10)',
  earrings:'radial-gradient(circle at 50% 40%,#22201d,#0e0f10)',
  bracelets:'radial-gradient(circle at 50% 40%,#1d2226,#0e0f10)'
};

/* --- catalogue --- */
const PRODUCTS = [
  {id:'r1',name:'Étoile Solitaire',cat:'rings',svg:'ring',price:2850,tag:'Icon',desc:'A single cultivated brilliant rising from a band of recycled platinum — our most enduring expression of light.',carat:'1.00',color:'D',clarity:'VVS1',cut:'Excellent',metal:'Recycled Platinum 950',hall:'Hall A · Chartres',co2:'7 kg'},
  {id:'r2',name:'Aurore Trilogy',cat:'rings',svg:'ring',price:4200,tag:'New',desc:'Three cultivated stones — past, present and future — set in a continuous line of recycled gold.',carat:'1.50',color:'E',clarity:'VVS2',cut:'Excellent',metal:'Recycled Yellow Gold 18k',hall:'Hall A · Chartres',co2:'9 kg'},
  {id:'n1',name:'Goutte de Lumière',cat:'necklaces',svg:'necklace',price:1980,tag:null,desc:'A pear-cut pendant suspended like a single drop of light on a fine recycled-gold chain.',carat:'0.75',color:'F',clarity:'VS1',cut:'Excellent',metal:'Recycled White Gold 18k',hall:'Hall B · Lyon',co2:'6 kg'},
  {id:'n2',name:'Rivière Céleste',cat:'necklaces',svg:'necklace',price:6400,tag:'Icon',desc:'Twenty-two graduated cultivated diamonds flow together in an unbroken river of brilliance.',carat:'5.00',color:'D-F',clarity:'VVS',cut:'Excellent',metal:'Recycled Platinum 950',hall:'Hall B · Lyon',co2:'24 kg'},
  {id:'e1',name:'Rosée Studs',cat:'earrings',svg:'earrings',price:1450,tag:null,desc:'A matched pair of cultivated brilliants, held in four delicate prongs like morning dew.',carat:'1.00',color:'E',clarity:'VVS2',cut:'Excellent',metal:'Recycled Yellow Gold 18k',hall:'Hall C · Antwerp',co2:'8 kg'},
  {id:'e2',name:'Cascade Drops',cat:'earrings',svg:'earrings',price:3300,tag:'New',desc:'Articulated drops that move and catch the light with every turn of the head.',carat:'2.00',color:'E',clarity:'VS1',cut:'Excellent',metal:'Recycled White Gold 18k',hall:'Hall C · Antwerp',co2:'11 kg'},
  {id:'b1',name:'Lien Éternel',cat:'bracelets',svg:'bracelet',price:3950,tag:null,desc:'Fifteen cultivated brilliants linked in a continuous embrace — the classic tennis bracelet, reimagined.',carat:'3.00',color:'F',clarity:'VVS2',cut:'Excellent',metal:'Recycled White Gold 18k',hall:'Hall A · Chartres',co2:'14 kg'},
  {id:'b2',name:'Halo Bangle',cat:'bracelets',svg:'bracelet',price:2600,tag:'New',desc:'A solitary cultivated diamond crowns a polished cuff of solid recycled gold.',carat:'1.00',color:'E',clarity:'VVS1',cut:'Excellent',metal:'Recycled Yellow Gold 18k',hall:'Hall B · Lyon',co2:'9 kg'}
];
const certNo = id => 'LUM-' + id.toUpperCase() + '-' + (2600 + id.charCodeAt(0)*7 + id.charCodeAt(1)*13);

/* --- render products --- */
const grid = document.getElementById('productGrid');
grid.innerHTML = PRODUCTS.map(p => `
  <article class="card" data-cat="${p.cat}">
    <div class="card__media" style="background:${mediaBg[p.cat]}">
      ${p.tag ? `<span class="card__tag">${p.tag}</span>` : ''}
      ${SVG[p.svg]}
      <div class="card__view" data-view="${p.id}"><span>Quick View</span></div>
    </div>
    <div class="card__body">
      <h3 class="card__name">${p.name}</h3>
      <p class="card__desc">${p.desc}</p>
      <p class="card__price">$${p.price.toLocaleString()}</p>
      <button class="card__add" data-id="${p.id}">Add to Bag</button>
    </div>
  </article>`).join('');

/* --- filters --- */
document.getElementById('filters').addEventListener('click', e => {
  const btn = e.target.closest('.filter'); if(!btn) return;
  document.querySelectorAll('.filter').forEach(f=>f.classList.remove('is-active'));
  btn.classList.add('is-active');
  const f = btn.dataset.filter;
  document.querySelectorAll('.card').forEach(c=>{
    c.classList.toggle('hide', f!=='all' && c.dataset.cat!==f);
  });
});

/* --- cart state --- */
let cart = {};
const cartEl=document.getElementById('cart'), overlay=document.getElementById('overlay');
const openCart=()=>{cartEl.classList.add('open');overlay.classList.add('show')};
const closeCart=()=>{cartEl.classList.remove('open');overlay.classList.remove('show')};

document.getElementById('cartBtn').addEventListener('click',openCart);
document.getElementById('cartClose').addEventListener('click',closeCart);
overlay.addEventListener('click',closeCart);

grid.addEventListener('click',e=>{
  const add=e.target.closest('.card__add');
  if(add){ addToCart(add.dataset.id); toast('Added to your bag'); return; }
  const view=e.target.closest('[data-view]');
  if(view){ openProduct(view.dataset.view); }
});

function addToCart(id){ cart[id]=(cart[id]||0)+1; renderCart(); }
function changeQty(id,d){ cart[id]+=d; if(cart[id]<=0) delete cart[id]; renderCart(); }
function removeItem(id){ delete cart[id]; renderCart(); }

function renderCart(){
  const items=document.getElementById('cartItems');
  const ids=Object.keys(cart);
  let count=0,total=0;
  if(!ids.length){
    items.innerHTML='<p class="cart__empty">Your bag awaits its first treasure.</p>';
  } else {
    items.innerHTML=ids.map(id=>{
      const p=PRODUCTS.find(x=>x.id===id),q=cart[id];
      count+=q; total+=p.price*q;
      return `<div class="cart-item">
        <div class="cart-item__media">${SVG[p.svg]}</div>
        <div class="cart-item__info">
          <div class="cart-item__name">${p.name}</div>
          <div class="cart-item__price">$${p.price.toLocaleString()}</div>
          <div class="cart-item__qty">
            <button data-act="dec" data-id="${id}">&minus;</button><span>${q}</span>
            <button data-act="inc" data-id="${id}">+</button>
          </div>
          <button class="cart-item__remove" data-act="rm" data-id="${id}">Remove</button>
        </div></div>`;
    }).join('');
  }
  document.getElementById('cartCount').textContent=count;
  document.getElementById('cartTotal').textContent='$'+total.toLocaleString();
}
document.getElementById('cartItems').addEventListener('click',e=>{
  const b=e.target.closest('[data-act]'); if(!b) return;
  const {act,id}=b.dataset;
  if(act==='inc') changeQty(id,1);
  if(act==='dec') changeQty(id,-1);
  if(act==='rm') removeItem(id);
});
document.getElementById('checkoutBtn').addEventListener('click',()=>{
  if(!Object.keys(cart).length){toast('Your bag is empty');return;}
  closeCart(); openCheckout();
});
renderCart();

/* ============ modals (generic open/close) ============ */
function openModal(id){ const m=document.getElementById(id); m.classList.add('open'); m.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; }
function closeModal(m){ m.classList.remove('open'); m.setAttribute('aria-hidden','true'); if(!document.querySelector('.modal.open')) document.body.style.overflow=''; }
document.querySelectorAll('.modal').forEach(m=>{
  m.addEventListener('click',e=>{ if(e.target===m) closeModal(m); });
});
document.addEventListener('keydown',e=>{ if(e.key==='Escape'){ const open=document.querySelector('.modal.open'); if(open) closeModal(open); else closeCart(); } });

/* ============ product quick-view ============ */
function openProduct(id){
  const p=PRODUCTS.find(x=>x.id===id);
  document.getElementById('productPanel').innerHTML=`
    <button class="modal__close" data-close>&times;</button>
    <div class="pm">
      <div class="pm__media" style="background:${mediaBg[p.cat]}">${SVG[p.svg]}</div>
      <div class="pm__body">
        <p class="pm__tag">${p.tag||'Lumière'} · Cultivated Diamond</p>
        <h3 class="pm__name">${p.name}</h3>
        <p class="pm__price">$${p.price.toLocaleString()}</p>
        <p class="pm__desc">${p.desc}</p>
        <ul class="pm__specs">
          <li><span>Carat</span><span>${p.carat}</span></li>
          <li><span>Colour</span><span>${p.color}</span></li>
          <li><span>Clarity</span><span>${p.clarity}</span></li>
          <li><span>Cut</span><span>${p.cut}</span></li>
          <li><span>Metal</span><span>${p.metal}</span></li>
        </ul>
        <div class="pm__actions">
          <button class="btn btn--gold" data-add="${p.id}">Add to Bag — $${p.price.toLocaleString()}</button>
          <button class="pm__cert" data-cert="${p.id}">View Origin Certificate ◇</button>
        </div>
      </div>
    </div>`;
  openModal('productModal');
}
document.getElementById('productPanel').addEventListener('click',e=>{
  if(e.target.closest('[data-close]')) return closeModal(document.getElementById('productModal'));
  const add=e.target.closest('[data-add]');
  if(add){ addToCart(add.dataset.add); toast('Added to your bag'); return; }
  const cert=e.target.closest('[data-cert]');
  if(cert){ openCertificate(cert.dataset.cert); }
});

/* ============ origin certificate ============ */
function openCertificate(id){
  const p=PRODUCTS.find(x=>x.id===id);
  document.getElementById('certPanel').innerHTML=`
    <button class="modal__close" data-close>&times;</button>
    <div class="cert">
      <div class="cert__head">
        <div class="cert__mark">&#9670;</div>
        <div class="cert__brand">LUMIÈRE</div>
        <div class="cert__sub">Certificate of Cultivated Origin</div>
      </div>
      <p class="cert__title">${p.name}</p>
      <p class="cert__no">No. ${certNo(id)}</p>
      <ul class="cert__rows">
        <li><span>Diamond Type</span><span>Laboratory-Grown (CVD)</span></li>
        <li><span>Carat Weight</span><span>${p.carat} ct</span></li>
        <li><span>Colour Grade</span><span>${p.color}</span></li>
        <li><span>Clarity Grade</span><span>${p.clarity}</span></li>
        <li><span>Cut Grade</span><span>${p.cut}</span></li>
        <li><span>Setting</span><span>${p.metal}</span></li>
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
  document.getElementById('certPanel').querySelector('[data-close]')
    .addEventListener('click',()=>closeModal(document.getElementById('certModal')));
}

/* ============ multi-step checkout ============ */
let coStep=1;
const coData={};
function openCheckout(){ coStep=1; renderCheckout(); openModal('checkoutModal'); }
function orderTotal(){ return Object.keys(cart).reduce((s,id)=>s+PRODUCTS.find(p=>p.id===id).price*cart[id],0); }

function stepsBar(){
  const labels=['Information','Shipping','Payment'];
  return `<div class="co__steps">${labels.map((l,i)=>{
    const n=i+1, cls=n<coStep?'done':n===coStep?'active':'';
    return `<div class="co__step ${cls}"><b>${n<coStep?'✓':n}</b><span>${l}</span></div>${i<2?'<i class="co__bar"></i>':''}`;
  }).join('')}</div>`;
}
function summaryBlock(){
  const total=orderTotal();
  const lines=Object.keys(cart).map(id=>{const p=PRODUCTS.find(x=>x.id===id);
    return `<div class="co__line"><span>${p.name} × ${cart[id]}</span><span>$${(p.price*cart[id]).toLocaleString()}</span></div>`;}).join('');
  return `<div class="co__summary">${lines}
    <div class="co__line"><span>Insured Delivery</span><span>Complimentary</span></div>
    <div class="co__line co__line--total"><span>Total</span><span>$${total.toLocaleString()}</span></div></div>`;
}
function renderCheckout(){
  const panel=document.getElementById('checkoutPanel');
  let inner='';
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
        <div class="co__field full"><label>Country</label>
          <select name="country">${['France','United Kingdom','United States','Singapore','Indonesia','United Arab Emirates','Japan','Switzerland'].map(c=>`<option ${coData.country===c?'selected':''}>${c}</option>`).join('')}</select></div>
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
      <div class="co__nav"><button class="btn co__back" data-back>Back</button><button class="btn btn--gold" data-next>Place Order · $${orderTotal().toLocaleString()}</button></div>`;
  } else {
    const ref='LUM'+Date.now().toString().slice(-8);
    inner=`<div class="co__confirm">
      <div class="cert__mark">&#9670;</div>
      <h3>Merci, ${coData.first||'collector'}.</h3>
      <p>Your order is received. Each piece will arrive hand-set, insured, and accompanied by its origin certificate — traceable to the atom.</p>
      <p class="co__order">Order ${ref}</p>
      <p style="margin-top:1.4rem;font-size:.8rem;color:#8a887d">A confirmation has been sent to ${coData.email||'your email'}.</p>
      <div class="co__nav" style="max-width:280px;margin:1.8rem auto 0"><button class="btn btn--gold" data-finish>Close</button></div>
    </div>`;
    cart={}; renderCart();
  }
  panel.innerHTML=`<button class="modal__close" data-close>&times;</button><div class="co">${inner}</div>`;
}
function saveForm(){
  const f=document.getElementById('coForm'); if(!f) return true;
  if(!f.checkValidity()){ f.reportValidity(); return false; }
  new FormData(f).forEach((v,k)=>coData[k]=v); return true;
}
document.getElementById('checkoutPanel').addEventListener('click',e=>{
  if(e.target.closest('[data-close]')) return closeModal(document.getElementById('checkoutModal'));
  if(e.target.closest('[data-finish]')) return closeModal(document.getElementById('checkoutModal'));
  if(e.target.closest('[data-back]')){ coStep--; renderCheckout(); return; }
  if(e.target.closest('[data-next]')){ if(!saveForm()) return; coStep++; renderCheckout(); }
});

/* --- toast --- */
let toastTimer;
function toast(msg){
  const t=document.getElementById('toast');
  t.textContent=msg; t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>t.classList.remove('show'),2200);
}

/* --- nav scroll state --- */
const nav=document.getElementById('nav');
const onScroll=()=>nav.classList.toggle('solid',window.scrollY>60);
onScroll(); window.addEventListener('scroll',onScroll,{passive:true});

/* --- mobile menu --- */
const mm=document.getElementById('mobileMenu'), tog=document.getElementById('navToggle');
tog.addEventListener('click',()=>mm.classList.toggle('open'));
mm.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>mm.classList.remove('open')));

/* --- reveal on scroll --- */
const io=new IntersectionObserver((entries)=>{
  entries.forEach(en=>{ if(en.isIntersecting){en.target.classList.add('in'); io.unobserve(en.target);} });
},{threshold:.16});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

/* --- animated stat counters --- */
const statIO=new IntersectionObserver((entries)=>{
  entries.forEach(en=>{
    if(!en.isIntersecting) return;
    const el=en.target, target=+el.dataset.count;
    let cur=0; const dur=1600, t0=performance.now();
    const tick=(t)=>{
      const p=Math.min((t-t0)/dur,1);
      el.textContent=Math.round((1-Math.pow(1-p,3))*target);
      if(p<1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    statIO.unobserve(el);
  });
},{threshold:.6});
document.querySelectorAll('.stat__num').forEach(el=>statIO.observe(el));

/* --- newsletter --- */
document.getElementById('newsletterForm').addEventListener('submit',e=>{
  e.preventDefault();
  e.target.reset();
  document.getElementById('newsletterNote').textContent='Welcome to the Maison. Watch for our next chapter.';
});
