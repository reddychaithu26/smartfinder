/* =============================================
   SmartFinder – Lost & Found Tracking System
   app.js
   ============================================= */

/* ── DEMO DATA ── */
const DEMO_USERS = [
  { name: 'Reddy Chaithu', roll: '23881A05GM', email: 'chaithu@college.edu', pass: 'demo123' }
];

let state = {
  user: null,
  items: [
    {
      id: 1,
      name: 'ID Card',
      desc: 'College ID card with blue lanyard tag',
      type: 'lost',
      reporter: '23881A05GM',
      reporterName: 'Reddy Chaithu',
      imgs: [],
      resolved: false,
      date: '10/11/2024'
    },
    {
      id: 2,
      name: 'Skybag Backpack',
      desc: 'Navy blue Skybag with laptop compartment, galaxy print',
      type: 'found',
      reporter: '23881A05GM',
      reporterName: 'Reddy Chaithu',
      imgs: [],
      resolved: false,
      date: '10/11/2024'
    },
    {
      id: 3,
      name: 'Spectacles',
      desc: 'Black rimmed glasses in brown case',
      type: 'lost',
      reporter: 'OTHER',
      reporterName: 'Priya Sharma',
      imgs: [],
      resolved: false,
      date: '09/11/2024'
    }
  ],
  helpers: [
    {
      id: 1,
      item: 'Chain',
      reporterDesc: 'ykjdkfjdf',
      name: 'Riya',
      mobile: 'xyz',
      hostel: 'Near office',
      date: '7/12/2024, 5:51:54 pm'
    },
    {
      id: 2,
      item: 'Keys',
      reporterDesc: 'skdcnalkc',
      name: 'Arjun Mehta',
      mobile: '9876543210',
      hostel: 'Block B Room 102',
      date: '8/12/2024, 3:12:00 pm'
    }
  ],
  claims: [],
  nextId: 10,
  currentClaim: null,
  currentResolve: null,
  allFilter: 'all'
};

/* ── UTILITIES ── */

function safeSet(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

function updateStats() {
  const lost     = state.items.filter(i => i.type === 'lost'  && !i.resolved).length;
  const found    = state.items.filter(i => i.type === 'found' && !i.resolved).length;
  const resolved = state.items.filter(i => i.resolved).length;

  ['statLost',  'dashLost'].forEach(id => safeSet(id, lost));
  ['statFound', 'dashFound'].forEach(id => safeSet(id, found));
  ['statResolved', 'dashResolved'].forEach(id => safeSet(id, resolved));
}

/* ── NAVIGATION ── */

function showPage(p) {
  const loggedIn = !!state.user;
  const authPages = ['myitems', 'allitems', 'lost', 'found', 'raise', 'helpers', 'claimers'];

  if (authPages.includes(p) && !loggedIn) {
    showToast('Please sign in first');
    showPage('signin');
    return;
  }

  document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
  const pg = document.getElementById('page-' + p);
  if (pg) pg.classList.add('active');

  updateNav(p, loggedIn);

  if (p === 'myitems')  renderMyItems();
  if (p === 'allitems') renderAllItems();
  if (p === 'lost')     renderList('lostList',  state.items.filter(i => i.type === 'lost'  && !i.resolved), true);
  if (p === 'found')    renderList('foundList', state.items.filter(i => i.type === 'found' && !i.resolved), true);
  if (p === 'helpers')  renderHelpers();
  if (p === 'claimers') renderClaimers();

  if (p === 'home') {
    document.getElementById('heroGuest').style.display = loggedIn ? 'none' : 'flex';
    document.getElementById('heroDash').style.display  = loggedIn ? 'block' : 'none';
    if (loggedIn) {
      document.getElementById('dashName').textContent = state.user.name + ' (' + state.user.roll + ')';
    }
  }

  updateStats();
}

function updateNav(active, loggedIn) {
  const nl = document.getElementById('navLinks');
  const nu = document.getElementById('navUser');

  if (loggedIn) {
    nu.style.display = 'flex';
    document.getElementById('navInitials').textContent =
      state.user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    document.getElementById('navName').textContent = state.user.roll;

    nl.innerHTML = `
      <button class="nav-link ${active === 'home'     ? 'active' : ''}" onclick="showPage('home')">Home</button>
      <button class="nav-link ${active === 'myitems'  ? 'active' : ''}" onclick="showPage('myitems')">My Items</button>
      <button class="nav-link ${active === 'allitems' ? 'active' : ''}" onclick="showPage('allitems')">All Items</button>
      <button class="nav-link ${active === 'lost'     ? 'active' : ''}" onclick="showPage('lost')">Lost</button>
      <button class="nav-link ${active === 'found'    ? 'active' : ''}" onclick="showPage('found')">Found</button>
      <button class="nav-link ${active === 'raise'    ? 'active' : ''}" onclick="showPage('raise')">Raise a Concern</button>
      <button class="nav-link ${active === 'helpers'  ? 'active' : ''}" onclick="showPage('helpers')">Helpers</button>
      <button class="nav-link ${active === 'claimers' ? 'active' : ''}" onclick="showPage('claimers')">Claimers</button>
      <button class="nav-link logout" onclick="doLogout()">Logout</button>
    `;
  } else {
    nu.style.display = 'none';
    nl.innerHTML = `
      <button class="nav-link ${active === 'home'   ? 'active' : ''}" onclick="showPage('home')">Home</button>
      <button class="nav-link ${active === 'signup' ? 'active' : ''}" onclick="showPage('signup')">Sign Up</button>
      <button class="nav-link ${active === 'signin' ? 'active' : ''}" onclick="showPage('signin')">Sign In</button>
    `;
  }
}

/* ── AUTH ── */

function doSignup() {
  const name    = document.getElementById('suName').value.trim();
  const roll    = document.getElementById('suRoll').value.trim();
  const email   = document.getElementById('suEmail').value.trim();
  const pass    = document.getElementById('suPass').value;
  const confirm = document.getElementById('suConfirm').value;

  if (!name || !roll || !email || !pass) { showToast('Please fill all fields'); return; }
  if (pass !== confirm) { showToast('Passwords do not match'); return; }
  if (pass.length < 6)  { showToast('Password must be at least 6 characters'); return; }
  if (DEMO_USERS.find(u => u.roll === roll)) { showToast('Roll number already registered'); return; }

  DEMO_USERS.push({ name, roll, email, pass });
  state.user = { name, roll, email };
  showToast('Account created! Welcome, ' + name + ' 🎉');
  showPage('home');
}

function doSignin() {
  const roll = document.getElementById('siRoll').value.trim();
  const pass = document.getElementById('siPass').value;
  const u    = DEMO_USERS.find(u => u.roll === roll && u.pass === pass);

  if (!u) { showToast('Invalid roll number or password'); return; }

  state.user = { name: u.name, roll: u.roll, email: u.email };
  showToast('Welcome back, ' + u.name + ' 👋');
  showPage('home');
}

function doLogout() {
  state.user = null;
  showToast('Signed out successfully');
  showPage('home');
}

/* ── RENDER HELPERS ── */

function itemCardHTML(item, isMine) {
  const badge = item.resolved
    ? '<span class="badge badge-resolved">✓ Resolved</span>'
    : item.type === 'lost'
      ? '<span class="badge badge-lost">⚠ Lost</span>'
      : '<span class="badge badge-found">✓ Found</span>';

  const imgs = item.imgs.length
    ? `<div class="item-imgs">${item.imgs.map(src =>
        `<img class="item-img" src="${src}" onerror="this.style.display='none'">`
      ).join('')}</div>`
    : '';

  const actions = [];
  if (isMine && !item.resolved) {
    actions.push(`<button class="btn btn-success btn-sm" onclick="openResolve(${item.id})">Mark Resolved</button>`);
  }
  if (!isMine && !item.resolved && item.type === 'found') {
    actions.push(`<button class="btn btn-primary btn-sm" onclick="openClaim(${item.id})">Claim</button>`);
  }

  const actionsHtml = actions.length
    ? `<div class="item-actions">${actions.join('')}</div>`
    : '';

  return `
    <div class="item-card">
      <div class="item-top">
        <div>
          <div class="item-name">${item.name}</div>
          <div class="item-desc" style="margin-top:4px">${item.desc}</div>
          <div style="font-size:12px;color:var(--hint);margin-top:4px">
            Reported by ${item.reporterName} · ${item.date}
          </div>
        </div>
        ${badge}
      </div>
      ${imgs}
      ${actionsHtml}
    </div>`;
}

function emptyState(icon, title, desc) {
  return `<div class="empty">
    <div class="empty-icon">${icon}</div>
    <h3>${title}</h3>
    <p>${desc}</p>
  </div>`;
}

/* ── PAGE RENDERERS ── */

function renderMyItems() {
  const el   = document.getElementById('myItemsList');
  const mine = state.items.filter(i => i.reporter === state.user?.roll);
  if (!mine.length) {
    el.innerHTML = emptyState('📭', 'No items yet', 'Raise a concern to add your first item.');
    return;
  }
  el.innerHTML = mine.map(item => itemCardHTML(item, true)).join('');
}

function renderAllItems() {
  const f = state.allFilter;
  let items = state.items;
  if (f === 'lost')     items = items.filter(i => i.type === 'lost'  && !i.resolved);
  if (f === 'found')    items = items.filter(i => i.type === 'found' && !i.resolved);
  if (f === 'resolved') items = items.filter(i => i.resolved);

  const el = document.getElementById('allItemsList');
  if (!items.length) {
    el.innerHTML = emptyState('🔍', 'No items', 'Nothing matches this filter.');
    return;
  }
  el.innerHTML = items.map(item => itemCardHTML(item, item.reporter === state.user?.roll)).join('');
}

function filterAll(f, btn) {
  state.allFilter = f;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderAllItems();
}

function renderList(elId, items) {
  const el = document.getElementById(elId);
  if (!items.length) {
    el.innerHTML = emptyState('🔍', 'Nothing here', 'No items in this category.');
    return;
  }
  el.innerHTML = items.map(item => itemCardHTML(item, item.reporter === state.user?.roll)).join('');
}

function renderHelpers() {
  const el = document.getElementById('helpersList');
  if (!state.helpers.length) {
    el.innerHTML = emptyState('🤝', 'No helpers yet', 'People who helped return items will appear here.');
    return;
  }
  el.innerHTML = state.helpers.map((h, i) => `
    <div class="helper-card">
      <div class="helper-num">Helper No. ${i + 1}</div>
      <div class="helper-title">Helper Details:</div>
      <div class="helper-row"><span class="helper-key">Item helped for:</span><span class="helper-val">${h.item} – ${h.reporterDesc}</span></div>
      <div class="helper-row"><span class="helper-key">Helper Name:</span><span class="helper-val">${h.name}</span></div>
      <div class="helper-row"><span class="helper-key">Mobile Number:</span><span class="helper-val">${h.mobile}</span></div>
      <div class="helper-row"><span class="helper-key">Hostel Name:</span><span class="helper-val">${h.hostel}</span></div>
      <div class="helper-row"><span class="helper-key">Date:</span><span class="helper-val">${h.date}</span></div>
    </div>`).join('');
}

function renderClaimers() {
  const el = document.getElementById('claimesList');
  if (!state.claims.length) {
    el.innerHTML = emptyState('🙋', 'No claims yet', 'People who claim found items will appear here.');
    return;
  }
  el.innerHTML = state.claims.map((c, i) => `
    <div class="helper-card">
      <div class="helper-num">Claim No. ${i + 1}</div>
      <div class="helper-title">Claimer Details:</div>
      <div class="helper-row"><span class="helper-key">Item claimed:</span><span class="helper-val">${c.itemName}</span></div>
      <div class="helper-row"><span class="helper-key">Claimer Name:</span><span class="helper-val">${c.name}</span></div>
      <div class="helper-row"><span class="helper-key">Mobile Number:</span><span class="helper-val">${c.mobile}</span></div>
      <div class="helper-row"><span class="helper-key">Location:</span><span class="helper-val">${c.hostel}</span></div>
      <div class="helper-row"><span class="helper-key">Date:</span><span class="helper-val">${c.date}</span></div>
    </div>`).join('');
}

/* ── RAISE A CONCERN ── */

function submitRaise() {
  const name = document.getElementById('raiseItemName').value.trim();
  const desc = document.getElementById('raiseDesc').value.trim();
  const type = document.getElementById('raiseType').value;

  if (!name || !desc) { showToast('Please fill in item name and description'); return; }

  const newItem = {
    id: state.nextId++,
    name,
    desc,
    type,
    reporter: state.user.roll,
    reporterName: state.user.name,
    imgs: [],
    resolved: false,
    date: new Date().toLocaleDateString('en-IN')
  };

  state.items.unshift(newItem);

  // Reset form
  document.getElementById('raiseItemName').value = '';
  document.getElementById('raiseDesc').value     = '';
  document.getElementById('photoPreview').innerHTML = '';

  showToast(type === 'lost' ? 'Lost item reported successfully' : 'Found item reported successfully');
  showPage('myitems');
}

function previewFiles(input) {
  const preview = document.getElementById('photoPreview');
  preview.innerHTML = '';
  Array.from(input.files).forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = document.createElement('img');
      img.src   = e.target.result;
      img.style = 'width:56px;height:56px;object-fit:cover;border-radius:6px;border:1px solid var(--border)';
      preview.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
}

/* ── CLAIM ── */

function openClaim(id) {
  state.currentClaim = id;
  document.getElementById('claimName').value   = state.user?.name || '';
  document.getElementById('claimMobile').value = '';
  document.getElementById('claimHostel').value = '';
  document.getElementById('claimModal').classList.add('open');
}

function submitClaim() {
  const name   = document.getElementById('claimName').value.trim();
  const mobile = document.getElementById('claimMobile').value.trim();
  const hostel = document.getElementById('claimHostel').value.trim();

  if (!name || !mobile || !hostel) { showToast('Please fill all claim details'); return; }

  const item = state.items.find(i => i.id === state.currentClaim);
  state.claims.push({
    itemId:   state.currentClaim,
    itemName: item?.name || 'Unknown',
    name,
    mobile,
    hostel,
    date: new Date().toLocaleString('en-IN')
  });

  closeModal('claimModal');
  showToast('Claim submitted! The reporter will contact you 📬');
}

/* ── RESOLVE ── */

function openResolve(id) {
  state.currentResolve = id;
  document.getElementById('resolveModal').classList.add('open');
}

function confirmResolve() {
  const item = state.items.find(i => i.id === state.currentResolve);
  if (item) item.resolved = true;
  closeModal('resolveModal');
  showToast('Item marked as resolved ✓');
  renderMyItems();
  updateStats();
}

/* ── INIT ── */
updateStats();
