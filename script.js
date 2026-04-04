// ── Inlined defaults ───────────────────────────────────────────────────────────
// No fetch('./data.json') — file:// blocks it. Everything lives here.
// To update defaults for new installs, edit these constants and push to GitHub.

const DEFAULT_SETTINGS = { name: 'Jay', backgroundUrl: '' };

const DEFAULT_CATEGORIES = [
  {
    id: 'general', name: 'General', color: '#FFB401',
    links: [
      { label: 'youtube', url: 'https://www.youtube.com/' },
      { label: 'twitch',  url: 'https://www.twitch.tv/' },
      { label: 'gmail',   url: 'https://mail.google.com/mail/u/0/#inbox/' },
      { label: 'canva',   url: 'https://www.canva.com/' },
      { label: 'github',  url: 'https://github.com/Jossyboiii/' },
    ]
  }
];

// Your full saved config — seeded into localStorage on first load.
// After making changes via /bookmarks, use /export to download a new data.json,
// then copy the "saved.categories" block back here to keep Git in sync.
const SAVED_CATEGORIES = [
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

const SAVED_SETTINGS = { name: 'Jay', backgroundUrl: '' };

// ── Bootstrap ──────────────────────────────────────────────────────────────────
function bootstrap() {
  if (!localStorage.getItem('bookmarks')) {
    localStorage.setItem('bookmarks', JSON.stringify(SAVED_CATEGORIES));
  }
  if (!localStorage.getItem('userSettings')) {
    localStorage.setItem('userSettings', JSON.stringify(SAVED_SETTINGS));
  }
}

// ── Storage ────────────────────────────────────────────────────────────────────
function loadCategories() {
  const stored = localStorage.getItem('bookmarks');
  return stored ? JSON.parse(stored) : JSON.parse(JSON.stringify(SAVED_CATEGORIES));
}

function saveCategories(cats) {
  localStorage.setItem('bookmarks', JSON.stringify(cats));
}

function loadUserSettings() {
  const stored = localStorage.getItem('userSettings');
  return stored ? JSON.parse(stored) : { ...DEFAULT_SETTINGS };
}

function saveUserSettings(settings) {
  localStorage.setItem('userSettings', JSON.stringify(settings));
}

// ── Export ─────────────────────────────────────────────────────────────────────
// Downloads current localStorage state as data.json.
// To make changes permanent on Git: open the file, copy the "saved" block,
// and paste it into SAVED_CATEGORIES / SAVED_SETTINGS above.
function exportConfig() {
  const payload = {
    defaults: { settings: DEFAULT_SETTINGS, categories: DEFAULT_CATEGORIES },
    saved:    { settings: loadUserSettings(), categories: loadCategories() }
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = 'data.json'; a.click();
  URL.revokeObjectURL(url);
  showCmdOutput('exported data.json');
}

// ── Import ─────────────────────────────────────────────────────────────────────
function importConfig() {
  const input = document.createElement('input');
  input.type = 'file'; input.accept = '.json';
  input.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const json = JSON.parse(ev.target.result);
        const src  = json.saved || json.defaults;
        if (!src || !src.categories) throw new Error('invalid');
        localStorage.setItem('bookmarks',    JSON.stringify(src.categories));
        localStorage.setItem('userSettings', JSON.stringify(src.settings || { ...DEFAULT_SETTINGS }));
        applyBackground(); typeGreeting(); renderNav();
        showCmdOutput('config imported');
      } catch {
        showCmdOutput('err: invalid data.json', true);
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

// ── Reset ──────────────────────────────────────────────────────────────────────
function resetToDefaults() {
  localStorage.setItem('bookmarks',    JSON.stringify(DEFAULT_CATEGORIES));
  localStorage.setItem('userSettings', JSON.stringify(DEFAULT_SETTINGS));
  applyBackground(); typeGreeting(); renderNav();
  showCmdOutput('reset to defaults');
}

// ── Background ─────────────────────────────────────────────────────────────────
function applyBackground() {
  const { backgroundUrl } = loadUserSettings();
  const video = document.getElementById('bg-video');
  const img   = document.getElementById('bg-image');

  if (!backgroundUrl) {
    video.style.display = ''; img.style.display = 'none'; return;
  }

  const isVideo = /\.(mp4|webm|ogg)(\?.*)?$/i.test(backgroundUrl);
  if (isVideo) {
    img.style.display = 'none'; video.style.display = '';
    const source = video.querySelector('source');
    if (source.src !== backgroundUrl) {
      source.src = backgroundUrl; video.load(); video.play().catch(() => {});
    }
  } else {
    video.style.display = 'none'; img.style.display = ''; img.src = backgroundUrl;
  }
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
      a.href = link.url; a.textContent = link.label;
      li.appendChild(a); ul.appendChild(li);
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
  const { name } = loadUserSettings();
  const hour = new Date().getHours();
  if (hour >= 6  && hour < 12) return `Good Morning, ${name} >`;
  if (hour >= 12 && hour < 18) return `Good Afternoon, ${name} >`;
  if (hour >= 18 && hour < 24) return `Good Evening, ${name} >`;
  return `Good Night, ${name} >`;
}

function typeGreeting() {
  const el     = document.getElementById('greeting');
  const cursor = document.getElementById('cursor');
  const text   = getGreeting();
  let i = 0;
  el.textContent = ''; cursor.style.animation = 'none';
  const interval = setInterval(() => {
    el.textContent += text[i]; i++;
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

// ── Command output ─────────────────────────────────────────────────────────────
let cmdOutputTimeout = null;

function showCmdOutput(text, isError = false) {
  const el = document.getElementById('cmd-output');
  el.textContent = text;
  el.className   = 'cmd-output' + (isError ? ' error' : '');
  el.style.display = 'block';
  clearTimeout(cmdOutputTimeout);
  cmdOutputTimeout = setTimeout(() => {
    el.style.display = 'none'; el.textContent = '';
  }, 4000);
}

function clearCmdOutput() {
  clearTimeout(cmdOutputTimeout);
  const el = document.getElementById('cmd-output');
  el.style.display = 'none'; el.textContent = '';
}

// ── /calc ──────────────────────────────────────────────────────────────────────
function evalCalc(expr) {
  const sanitised = expr.trim();
  if (!/^[\d\s\+\-\*\/\%\^\(\)\.]+$/.test(sanitised)) {
    return { ok: false, msg: 'err: invalid characters' };
  }
  const jsExpr = sanitised.replace(/\^/g, '**');
  try {
    // eslint-disable-next-line no-new-func
    const result = Function('"use strict"; return (' + jsExpr + ')')();
    if (typeof result !== 'number' || !isFinite(result)) {
      return { ok: false, msg: 'err: not a finite number' };
    }
    return { ok: true, msg: `= ${parseFloat(result.toPrecision(12))}` };
  } catch {
    return { ok: false, msg: 'err: invalid expression' };
  }
}

// ── /timer ─────────────────────────────────────────────────────────────────────
let timerInterval  = null;
let timerTotal     = 0;
let timerRemaining = 0;

function startTimer(minutes) {
  stopTimer();
  timerTotal = minutes * 60; timerRemaining = timerTotal;
  showTimerUI(); updateTimerDisplay();
  timerInterval = setInterval(() => {
    timerRemaining--; updateTimerDisplay();
    if (timerRemaining <= 0) { stopTimer(); timerDone(); }
  }, 1000);
}

function stopTimer() {
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
  hideTimerUI();
}

function timerDone() {
  const bar  = document.getElementById('timer-bar-fill');
  const disp = document.getElementById('timer-display');
  if (bar)  bar.style.width = '100%';
  if (disp) disp.textContent = '00:00';
  const notif = document.getElementById('timer-notif');
  if (notif) {
    notif.style.display = 'block';
    setTimeout(() => { notif.style.display = 'none'; }, 5000);
  }
}

function showTimerUI() { document.getElementById('timer-section').style.display = 'block'; }
function hideTimerUI() {
  document.getElementById('timer-section').style.display = 'none';
  const notif = document.getElementById('timer-notif');
  if (notif) notif.style.display = 'none';
}

function updateTimerDisplay() {
  const mm = Math.floor(timerRemaining / 60).toString().padStart(2, '0');
  const ss = (timerRemaining % 60).toString().padStart(2, '0');
  const disp = document.getElementById('timer-display');
  const bar  = document.getElementById('timer-bar-fill');
  if (disp) disp.textContent = `${mm}:${ss}`;
  if (bar) {
    const pct = timerTotal > 0 ? ((timerTotal - timerRemaining) / timerTotal) * 100 : 0;
    bar.style.width = `${pct}%`;
  }
}

// ── /settings panel ────────────────────────────────────────────────────────────
function openUserSettings() {
  const { name, backgroundUrl } = loadUserSettings();
  document.getElementById('us-name').value = name;
  document.getElementById('us-bg').value   = backgroundUrl;
  document.getElementById('user-settings-overlay').classList.add('open');
}

function closeUserSettings() {
  document.getElementById('user-settings-overlay').classList.remove('open');
}

function saveUserSettingsFromPanel() {
  const name          = document.getElementById('us-name').value.trim() || 'Jay';
  const backgroundUrl = document.getElementById('us-bg').value.trim();
  saveUserSettings({ name, backgroundUrl });
  applyBackground(); typeGreeting(); closeUserSettings();
}

// ── Command input ──────────────────────────────────────────────────────────────
function initCmd() {
  const cursor = document.getElementById('cursor');
  const cmd    = document.getElementById('cmd');

  cmd.addEventListener('input', () => {
    cursor.style.visibility = cmd.value.length > 0 ? 'hidden' : 'visible';
  });

  cmd.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const val  = cmd.value.trim();
      const clear = () => { cmd.value = ''; cursor.style.visibility = 'visible'; };

      if (val === '/bookmarks') { clear(); openSettings(); return; }
      if (val === '/settings')  { clear(); openUserSettings(); return; }
      if (val === '/export')    { clear(); exportConfig(); return; }
      if (val === '/import')    { clear(); importConfig(); return; }
      if (val === '/reset') {
        clear();
        if (confirm('Reset to defaults?')) resetToDefaults();
        return;
      }
      if (val.startsWith('/calc ')) {
        const result = evalCalc(val.slice(6));
        showCmdOutput(result.msg, !result.ok);
        clear(); return;
      }
      if (val === '/timer stop') {
        stopTimer(); showCmdOutput('timer stopped'); clear(); return;
      }
      if (val.startsWith('/timer ')) {
        const mins = parseFloat(val.slice(7).trim());
        if (!isNaN(mins) && mins > 0 && mins <= 1440) {
          startTimer(mins); showCmdOutput(`timer started: ${mins}m`);
        } else {
          showCmdOutput('err: usage /timer <minutes>', true);
        }
        clear(); return;
      }
    }

    if (e.key === 'Escape') {
      cmd.value = ''; document.getElementById('cursor').style.visibility = 'visible';
      clearCmdOutput();
    }
  });
}

// ── Bookmarks manager ──────────────────────────────────────────────────────────
const COLORS = ['#FFB401','#F39A05','#D34B08','#C2240B','#B70B0D','#8B0000','#5C4033'];
let editingCatIndex = null;
let dragSrcIndex    = null;
let dragContext     = null;

function openSettings()  { document.getElementById('settings-overlay').classList.add('open'); showCatList(); }
function closeSettings() { document.getElementById('settings-overlay').classList.remove('open'); }

function showCatList() {
  editingCatIndex = null;
  document.getElementById('cat-list-section').classList.remove('hidden');
  document.getElementById('link-editor').classList.add('hidden');
  renderCatList();
}

function makeDraggable(row, index, context, onReorder) {
  row.setAttribute('draggable', true);
  row.addEventListener('dragstart', e => {
    dragSrcIndex = index; dragContext = context;
    row.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setDragImage(row, 16, row.offsetHeight / 2);
  });
  row.addEventListener('dragend', () => {
    dragSrcIndex = null; dragContext = null; row.classList.remove('dragging');
    document.querySelectorAll('.drag-over').forEach(r => r.classList.remove('drag-over'));
  });
  row.addEventListener('dragover', e => {
    e.preventDefault();
    if (dragContext === context && dragSrcIndex !== index) {
      document.querySelectorAll('.drag-over').forEach(r => r.classList.remove('drag-over'));
      row.classList.add('drag-over');
    }
  });
  row.addEventListener('dragleave', () => row.classList.remove('drag-over'));
  row.addEventListener('drop', e => {
    e.preventDefault(); row.classList.remove('drag-over');
    if (dragContext === context && dragSrcIndex !== null && dragSrcIndex !== index) {
      onReorder(dragSrcIndex, index);
    }
  });
}

function renderCatList() {
  const cats      = loadCategories();
  const container = document.getElementById('cat-list');
  container.innerHTML = '';

  cats.forEach((cat, i) => {
    const row    = document.createElement('div'); row.className = 'settings-row';
    const handle = document.createElement('span'); handle.className = 'drag-handle'; handle.textContent = '⠿';
    const nameEl = document.createElement('span'); nameEl.className = 'cat-name';
    nameEl.textContent = cat.name; nameEl.style.color = cat.color; nameEl.title = 'Click to rename';
    nameEl.addEventListener('click', () => startRenameCategory(i, nameEl, cat.color));

    const linksBtn = document.createElement('button'); linksBtn.className = 'icon-btn';
    linksBtn.textContent = 'links'; linksBtn.onclick = () => showLinkEditor(i);

    const delBtn = document.createElement('button'); delBtn.className = 'icon-btn danger';
    delBtn.textContent = 'del';
    delBtn.onclick = () => {
      if (!confirm(`Delete "${cat.name}"?`)) return;
      const c = loadCategories(); c.splice(i, 1);
      saveCategories(c); renderCatList(); renderNav();
    };

    row.appendChild(handle); row.appendChild(nameEl);
    row.appendChild(linksBtn); row.appendChild(delBtn);
    container.appendChild(row);

    makeDraggable(row, i, 'cats', (from, to) => {
      const c = loadCategories();
      const [moved] = c.splice(from, 1); c.splice(to, 0, moved);
      saveCategories(c); renderCatList(); renderNav();
    });
  });
}

function startRenameCategory(i, nameEl, color) {
  const input = document.createElement('input');
  input.type = 'text'; input.value = nameEl.textContent;
  input.className = 'inline-input rename-input'; input.style.color = color;
  nameEl.replaceWith(input); input.focus(); input.select();

  const commit = () => {
    const val = input.value.trim();
    if (val) {
      const c = loadCategories(); c[i].name = val;
      c[i].id = val.toLowerCase().replace(/\s+/g, '-');
      saveCategories(c); renderNav();
    }
    renderCatList();
  };
  input.addEventListener('blur', commit);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter')  { e.preventDefault(); input.blur(); }
    if (e.key === 'Escape') { renderCatList(); }
  });
}

function addCategory() {
  const nameInput = document.getElementById('new-cat-name');
  const name = nameInput.value.trim(); if (!name) return;
  const cats = loadCategories();
  const color = COLORS[cats.length % COLORS.length];
  cats.push({ id: name.toLowerCase().replace(/\s+/g, '-'), name, color, links: [] });
  saveCategories(cats); nameInput.value = '';
  renderCatList(); renderNav();
}

function showLinkEditor(catIndex) {
  editingCatIndex = catIndex;
  const cats = loadCategories();
  document.getElementById('cat-list-section').classList.add('hidden');
  document.getElementById('link-editor').classList.remove('hidden');
  const nameEl = document.getElementById('editing-cat-name');
  nameEl.textContent = cats[catIndex].name; nameEl.style.color = cats[catIndex].color;
  renderLinkList(catIndex);
}

function renderLinkList(catIndex) {
  const cats = loadCategories(); const cat = cats[catIndex];
  const container = document.getElementById('link-list'); container.innerHTML = '';

  cat.links.forEach((link, li) => {
    const row    = document.createElement('div'); row.className = 'settings-row';
    const handle = document.createElement('span'); handle.className = 'drag-handle'; handle.textContent = '⠿';

    const labelInput = document.createElement('input');
    labelInput.type = 'text'; labelInput.value = link.label;
    labelInput.className = 'inline-input'; labelInput.placeholder = 'label';
    labelInput.onchange = () => {
      const c = loadCategories(); c[catIndex].links[li].label = labelInput.value;
      saveCategories(c); renderNav();
    };

    const urlInput = document.createElement('input');
    urlInput.type = 'text'; urlInput.value = link.url;
    urlInput.className = 'inline-input url-input'; urlInput.placeholder = 'https://...';
    urlInput.onchange = () => {
      const c = loadCategories(); c[catIndex].links[li].url = urlInput.value;
      saveCategories(c); renderNav();
    };

    const delBtn = document.createElement('button'); delBtn.className = 'icon-btn danger';
    delBtn.textContent = 'del';
    delBtn.onclick = () => {
      const c = loadCategories(); c[catIndex].links.splice(li, 1);
      saveCategories(c); renderLinkList(catIndex); renderNav();
    };

    row.appendChild(handle); row.appendChild(labelInput);
    row.appendChild(urlInput); row.appendChild(delBtn);
    container.appendChild(row);

    makeDraggable(row, li, 'links', (from, to) => {
      const c = loadCategories();
      const [moved] = c[catIndex].links.splice(from, 1);
      c[catIndex].links.splice(to, 0, moved);
      saveCategories(c); renderLinkList(catIndex); renderNav();
    });
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
  renderLinkList(editingCatIndex); renderNav();
}

// ── Init ───────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  bootstrap();
  applyBackground();
  typeGreeting();
  updateClock();
  renderNav();
  initCmd();
  hideTimerUI();

  document.getElementById('settings-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('settings-overlay')) closeSettings();
  });
  document.getElementById('user-settings-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('user-settings-overlay')) closeUserSettings();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeSettings(); closeUserSettings(); }
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
  document.getElementById('us-save-btn').addEventListener('click', saveUserSettingsFromPanel);
  document.getElementById('us-cancel-btn').addEventListener('click', closeUserSettings);
});