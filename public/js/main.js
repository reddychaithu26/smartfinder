/* ============================================================
   SmartFinder – Lost & Found Tracking System
   public/js/main.js  –  Client-Side JavaScript
   ============================================================ */

/* ── TOAST NOTIFICATIONS ────────────────────────────────── */
function showToast(msg, duration = 3000) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

/* ── READ URL PARAMS AND SHOW TOAST ─────────────────────── */
(function checkQueryMessages() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('success')) showToast('✅ ' + decodeURIComponent(params.get('success')));
  if (params.get('error'))   showToast('❌ ' + decodeURIComponent(params.get('error')));

  // Clean the URL without reload
  if (params.has('success') || params.has('error')) {
    const clean = window.location.pathname + (params.toString() ? '' : '');
    window.history.replaceState({}, '', window.location.pathname);
  }
})();

/* ── MODAL HELPERS ───────────────────────────────────────── */
function openModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.add('open');
}

function closeModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.remove('open');
}

// Close modal when clicking overlay background
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
  }
});

// Close modal on Escape key
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
  }
});

/* ── CLAIM MODAL ─────────────────────────────────────────── */
function openClaimModal(itemId, itemName) {
  const nameEl = document.getElementById('claimItemName');
  const form   = document.getElementById('claimForm');

  if (nameEl) nameEl.textContent = itemName;
  if (form)   form.action = '/claim/' + itemId;

  openModal('claimModal');
}

/* ── PHOTO PREVIEW (Raise a Concern form) ────────────────── */
function previewPhotos(input) {
  const preview = document.getElementById('photoPreview');
  if (!preview) return;
  preview.innerHTML = '';

  Array.from(input.files).slice(0, 5).forEach(file => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img      = document.createElement('img');
      img.src        = e.target.result;
      img.alt        = 'preview';
      img.style.cssText = 'width:64px;height:64px;object-fit:cover;border-radius:8px;border:1px solid #E2E8F0;';
      preview.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
}

/* ── ACTIVE NAV LINK ─────────────────────────────────────── */
(function highlightNav() {
  const path  = window.location.pathname;
  const links = document.querySelectorAll('.nav-link');
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href && path === href) link.classList.add('active');
  });
})();

/* ── CONFIRM RESOLVE FORM ────────────────────────────────── */
document.addEventListener('submit', function (e) {
  const form = e.target;
  if (form.dataset.confirm) {
    if (!confirm(form.dataset.confirm)) {
      e.preventDefault();
    }
  }
});
