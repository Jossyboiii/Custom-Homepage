// ── Default bookmarks ──────────────────────────────────────────────────────────
const DEFAULTS = [
  {
    id: 'entertainment', name: 'Entertainment', color: '#FFB401',
    links: [
      { label: 'aniwatchtv',  url: 'https://aniwatchtv.to' },
      { label: 'twitch',      url: 'https://www.twitch.tv/' },
      { label: 'youtube',     url: 'https://www.youtube.com/' },
      { label: 'kisscartoon', url: 'https://kisscartoon.sh/kisscartoon.html' },
      { label: 'flixmomo',    url: 'https://flixmomo.org/' },
    ]
  },
  {
    id: 'social', name: 'Social', color: '#F39A05',
    links: [
      { label: 'facebook',  url: 'https://www.facebook.com/?locale=fr_FR' },
      { label: 'instagram', url: 'https://www.instagram.com/' },
      { label: 'snapchat',  url: 'https://web.snapchat.com/' },
      { label: 'twitter',   url: 'https://twitter.com/home/' },
    ]
  },
  {
    id: 'google', name: 'Google', color: '#D34B08',
    links: [
      { label: 'docs',   url: 'https://docs.google.com/document/u/0/' },
      { label: 'drive',  url: 'https://drive.google.com/drive/my-drive' },
      { label: 'gmail',  url: 'https://mail.google.com/mail/u/0/#inbox/' },
      { label: 'photos', url: 'https://photos.google.com/' },
    ]
  },
  {
    id: 'utility', name: 'Utility', color: '#C2240B',
    links: [
      { label: 'ASCII',     url: 'https://patorjk.com/software/taag/#p=display&f=Alpha&t=Jossyboiii/' },
      { label: 'bitwarden', url: 'https://vault.bitwarden.com/#/login' },
      { label: 'canva',     url: 'https://www.canva.com/' },
      { label: 'chatgpt',   url: 'https://chat.openai.com/' },
      { label: 'claude',    url: 'https://claude.ai/' },
      { label: 'github',    url: 'https://github.com/Jossyboiii/' },
    ]
  },
  {
    id: 'school', name: 'School', color: '#B70B0D',
    links: [
      { label: 'ucas', url: 'https://www.ucas.com/dashboard#/' },
      { label: 'uob',  url: 'https://evsipr.brighton.ac.uk/urd/sits.urd/run/siw_portal.url?OZOEKEGIWI5XNOBH46arS2w4c_fLkJkoI0ADnGS0hyRK0CYTHgdehhDJggLFn3Af5xdx2QIysjYsl8nDhwnKz4Pq3WIUTy9HzjBEglCRqDcMUe6wg7mgprVRxrMTslfvevyXrS3AfbUihnGOxlgRVRoLKcvqc2PiKgUX70V6ZUAWHDlO0bsZnXKHykjkv2NVmgQTHvuBLcc0Z1_3IH4Tscb_NXm2EUfOEveBZ2KwNecUPu6r' },
    ]
  },
];

const COLORS = ['#FFB401','#F39A05','#D34B08','#C2240B','#B70B0D','#8B0000','#5C4033'];

// ── Storage ────────────────────────────────────────────────────────────────────
function loadCategories() {
  const stored = localStorage.getItem('bookmarks');
  return stored ? JSON.parse(stored) : JSON.parse(JSON.stringify(DEFAULTS));
}

function saveCategories(cats) {
  localStorage.setItem('bookmarks', JSON.stringify(cats));
}

// ── Nav ────────────────────────────────────────────────────────────────────────
function renderNav() {
  const cats = loadCategories();
  const nav  = document.getElementById('nav');
  nav.innerHTML = '';
  nav.style.gridTemplateColumns = cats.map(() => 'auto').join(' ');

  cats.forEach(cat => {
    const ul = document.createElement('ul');

    const header = document.createElement('li');
    header.textContent = cat.name;
    header.style.color = cat.color;
    header.style.fontWeight = 'bold';
    ul.appendChild(header);

    cat.links.forEach(link => {
      const li = document.createElement('li');
      li.className = 'nav-item';
      const a = document.createElement('a');
      a.href = link.url;
      a.textContent = link.label;
      li.appendChild(a);
      ul.appendChild(li);
      li.addEventListener('mouseenter', () => { a.style.color = cat.color; });
      li.addEventListener('mouseleave', () => { a.style.color = ''; });
    });

    ul.addEventListener('mouseenter', () => {
      ul.querySelectorAll('.nav-item').forEach(li => li.style.opacity = '1');
    });
    ul.addEventListener('mouseleave', () => {
      ul.querySelectorAll('.nav-item').forEach(li => li.style.opacity = '0.2');
    });

    nav.appendChild(ul);
  });
}

// ── Greeting + clock ───────────────────────────────────────────────────────────
function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 6  && hour < 12) return 'Good Morning, Jay >';
  if (hour >= 12 && hour < 18) return 'Good Afternoon, Jay >';
  if (hour >= 18 && hour < 24) return 'Good Evening, Jay >';
  return 'Good Night, Jay >';
}

function typeGreeting() {
  const el     = document.getElementById('greeting');
  const cursor = document.getElementById('cursor');
  const text   = getGreeting();
  let i = 0;

  el.textContent = '';
  cursor.style.animation = 'none';

  const interval = setInterval(() => {
    el.textContent += text[i];
    i++;
    if (i >= text.length) {
      clearInterval(interval);
      cursor.style.animation = 'blink 1s step-start infinite';
    }
  }, 60);
}

function updateClock() {
  const now = new Date();
  const hh  = now.getHours()  .toString().padStart(2, '0');
  const mm  = now.getMinutes().toString().padStart(2, '0');
  const ss  = now.getSeconds().toString().padStart(2, '0');
  document.getElementById('clock').textContent = `${hh}:${mm}:${ss}`;
  setTimeout(updateClock, 1000);
}

// ── Command input ──────────────────────────────────────────────────────────────
function initCmd() {
  const cursor = document.getElementById('cursor');
  const mirror = document.getElementById('cmd-mirror');
  const cmd    = document.getElementById('cmd');

  cmd.addEventListener('input', () => {
    cursor.style.visibility = cmd.value.length > 0 ? 'hidden' : 'visible';
  });

  cmd.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const val = cmd.value.trim();
      if (val === '/settings') {
        cmd.value = '';
        cursor.style.visibility = 'visible';
        openSettings();
      }
    }
    if (e.key === 'Escape') {
      cmd.value = '';
      cursor.style.visibility = 'visible';
    }
  });
}

// ── Settings ───────────────────────────────────────────────────────────────────
let editingCatIndex = null;

function openSettings() {
  document.getElementById('settings-overlay').classList.add('open');
  showCatList();
}

function closeSettings() {
  document.getElementById('settings-overlay').classList.remove('open');
}

function showCatList() {
  editingCatIndex = null;
  document.getElementById('cat-list-section').classList.remove('hidden');
  document.getElementById('link-editor').classList.add('hidden');
  renderCatList();
}

function renderCatList() {
  const cats      = loadCategories();
  const container = document.getElementById('cat-list');
  container.innerHTML = '';

  cats.forEach((cat, i) => {
    const row = document.createElement('div');
    row.className = 'settings-row';

    const name = document.createElement('span');
    name.className = 'cat-name';
    name.textContent = cat.name;
    name.style.color = cat.color;

    const editBtn = document.createElement('button');
    editBtn.className = 'icon-btn';
    editBtn.textContent = 'edit';
    editBtn.onclick = () => showLinkEditor(i);

    const delBtn = document.createElement('button');
    delBtn.className = 'icon-btn danger';
    delBtn.textContent = 'del';
    delBtn.onclick = () => {
      const cats = loadCategories();
      cats.splice(i, 1);
      saveCategories(cats);
      renderCatList();
      renderNav();
    };

    row.appendChild(name);
    row.appendChild(editBtn);
    row.appendChild(delBtn);
    container.appendChild(row);
  });
}

function addCategory() {
  const nameInput = document.getElementById('new-cat-name');
  const name = nameInput.value.trim();
  if (!name) return;

  const cats  = loadCategories();
  const color = COLORS[cats.length % COLORS.length];
  cats.push({ id: name.toLowerCase().replace(/\s+/g, '-'), name, color, links: [] });
  saveCategories(cats);
  nameInput.value = '';
  renderCatList();
  renderNav();
}

function showLinkEditor(catIndex) {
  editingCatIndex = catIndex;
  const cats = loadCategories();
  document.getElementById('cat-list-section').classList.add('hidden');
  document.getElementById('link-editor').classList.remove('hidden');
  document.getElementById('editing-cat-name').textContent = cats[catIndex].name;
  renderLinkList(catIndex);
}

function renderLinkList(catIndex) {
  const cats      = loadCategories();
  const cat       = cats[catIndex];
  const container = document.getElementById('link-list');
  container.innerHTML = '';

  cat.links.forEach((link, li) => {
    const row = document.createElement('div');
    row.className = 'settings-row';

    const labelInput = document.createElement('input');
    labelInput.type      = 'text';
    labelInput.value     = link.label;
    labelInput.className = 'inline-input';
    labelInput.onchange  = () => {
      const cats = loadCategories();
      cats[catIndex].links[li].label = labelInput.value;
      saveCategories(cats);
      renderNav();
    };

    const urlInput = document.createElement('input');
    urlInput.type      = 'text';
    urlInput.value     = link.url;
    urlInput.className = 'inline-input url-input';
    urlInput.onchange  = () => {
      const cats = loadCategories();
      cats[catIndex].links[li].url = urlInput.value;
      saveCategories(cats);
      renderNav();
    };

    const delBtn = document.createElement('button');
    delBtn.className = 'icon-btn danger';
    delBtn.textContent = 'del';
    delBtn.onclick = () => {
      const cats = loadCategories();
      cats[catIndex].links.splice(li, 1);
      saveCategories(cats);
      renderLinkList(catIndex);
      renderNav();
    };

    row.appendChild(labelInput);
    row.appendChild(urlInput);
    row.appendChild(delBtn);
    container.appendChild(row);
  });
}

function addLink() {
  const label = document.getElementById('new-link-label').value.trim();
  const url   = document.getElementById('new-link-url').value.trim();
  if (!label || !url) return;

  const cats = loadCategories();
  cats[editingCatIndex].links.push({ label, url });
  saveCategories(cats);

  document.getElementById('new-link-label').value = '';
  document.getElementById('new-link-url').value   = '';

  renderLinkList(editingCatIndex);
  renderNav();
}

// ── Init ───────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  typeGreeting();
  updateClock();
  renderNav();
  initCmd();

  document.getElementById('settings-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('settings-overlay')) closeSettings();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeSettings();
  });

  document.getElementById('add-cat-btn').addEventListener('click', addCategory);
  document.getElementById('new-cat-name').addEventListener('keydown', e => {
    if (e.key === 'Enter') addCategory();
  });

  document.getElementById('add-link-btn').addEventListener('click', addLink);
  document.getElementById('new-link-url').addEventListener('keydown', e => {
    if (e.key === 'Enter') addLink();
  });

  document.getElementById('back-btn').addEventListener('click', showCatList);
});
