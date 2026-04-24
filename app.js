  const ADMIN_PW = 'butty2025';
  const CONTACT_EMAIL = 'hello@butty.kr';

  /* ── DRAWER ── */
  function openDrawer() {
    document.getElementById('drawer').classList.add('open');
    document.getElementById('drawer-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    document.getElementById('drawer').classList.remove('open');
    document.getElementById('drawer-overlay').classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ── PAGE ROUTING ── */
  let pageStack = ['view-main'];

  function showOnly(id) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    window.scrollTo(0, 0);
  }

  function openPage(name) {
    const id = 'page-' + name;
    pageStack.push(id);
    showOnly(id);
    if (name === 'letter') renderLetterList();
  }

  function closePage() {
    pageStack.pop();
    const prev = pageStack[pageStack.length - 1] || 'view-main';
    showOnly(prev);
    if (prev === 'page-letter') renderLetterList();
  }

  function goHome() {
    pageStack = ['view-main'];
    showOnly('view-main');
    window.scrollTo(0, 0);
  }

  function goToMain() {
    pageStack = ['view-main'];
    showOnly('view-main');
    setTimeout(() => document.getElementById('collab-contact')?.scrollIntoView({behavior:'smooth'}), 100);
  }

  /* ── COLLAB PAGE TAB FILTER ── */
  function collabFilter(btn, filter) {
    document.querySelectorAll('.collab-tab').forEach(t => {
      t.style.color = 'var(--text-hint)';
      t.style.borderBottomColor = 'transparent';
    });
    btn.style.color = 'var(--text)';
    btn.style.borderBottomColor = '#1A1A1A';
    const secs = ['b2b','ad'];
    secs.forEach(s => {
      const el = document.getElementById('csec-' + s);
      if (el) el.style.display = (filter === 'all' || filter === s) ? 'block' : 'none';
    });
  }

  /* ── PRODUCT SUB PAGES ── */
  function openSub(id) {
    pageStack.push('sub-' + id);
    showOnly('sub-' + id);
  }
  function closeSub() {
    pageStack.pop();
    const prev = pageStack[pageStack.length - 1] || 'view-main';
    showOnly(prev);
  }

  /* ── MAILTO ── */
  function mailTo(product) {
    const subject = encodeURIComponent('[BUTTY] ' + product + ' 문의드립니다');
    const body = encodeURIComponent('안녕하세요, BUTTY 팀!\n\n[' + product + '] 관련하여 문의드립니다.\n\n회사명:\n담당자명:\n연락처:\n\n문의 내용:\n');
    window.location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + subject + '&body=' + body;
  }

  /* ── TAB FILTER ── */
  const tabs = document.querySelectorAll('.nav-tab');
  const sectionMap = { b2b:['sec-b2b'], ad:['sec-ad'], book:['sec-book'] };
  const allSections = ['sec-b2b', 'sec-ad', 'sec-book'];

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;
      if (filter === 'all') {
        allSections.forEach(id => document.getElementById(id).classList.remove('hidden'));
      } else {
        allSections.forEach(id => document.getElementById(id).classList.add('hidden'));
        (sectionMap[filter] || []).forEach(id => document.getElementById(id).classList.remove('hidden'));
      }
    });
  });

  function scrollToProducts() {
    tabs.forEach(t => t.classList.remove('active'));
    document.querySelector('[data-filter="all"]').classList.add('active');
    allSections.forEach(id => document.getElementById(id).classList.remove('hidden'));
    setTimeout(() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' }), 50);
  }
  function scrollToContact() {
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
  }

  /* ── LETTER DATA (localStorage) ── */
  function getLetters() {
    try { return JSON.parse(localStorage.getItem('butty_letters') || '[]'); } catch(e) { return []; }
  }
  function saveLetters(arr) {
    localStorage.setItem('butty_letters', JSON.stringify(arr));
  }

  function renderLetterList() {
    const letters = getLetters();
    const list  = document.getElementById('letter-list');
    const empty = document.getElementById('letter-empty');
    if (!list) return;
    if (letters.length === 0) {
      list.innerHTML = '';
      empty.style.display = 'block';
      return;
    }
    empty.style.display = 'none';
    list.innerHTML = letters.slice().reverse().map((l, ri) => {
      const i = letters.length - 1 - ri;
      return `
        <div onclick="openLetterDetail(${i})" style="background:var(--bg-card);border-radius:16px;padding:18px 20px;margin-bottom:10px;border:1px solid var(--border);cursor:pointer;position:relative;">
          <div style="font-size:10px;font-weight:700;letter-spacing:1.5px;color:var(--accent);background:var(--bg-hero);display:inline-block;padding:3px 10px;border-radius:100px;margin-bottom:10px;">Vol.${i+1}</div>
          <div style="font-size:15px;font-weight:700;color:var(--text);margin-bottom:6px;padding-right:24px;">${l.title}</div>
          <div style="font-size:12px;color:var(--text-muted);line-height:1.6;margin-bottom:10px;">${l.desc || ''}</div>
          <div style="font-size:11px;color:var(--text-hint);">${l.date || ''}</div>
          <div style="position:absolute;top:18px;right:18px;color:var(--text-hint);font-size:16px;">›</div>
        </div>`;
    }).join('');
  }

  function renderHomeLetters() {
    const letters = getLetters();
    const el = document.getElementById('home-letter-list');
    if (!el) return;
    if (letters.length === 0) {
      el.innerHTML = `<div style="background:#fff;border-radius:16px;padding:20px;border:1px solid var(--border);text-align:center;color:var(--text-hint);font-size:13px;line-height:1.7;">아직 등록된 레터가 없습니다.<br>리더십레터에서 구독해 보세요.</div>`;
      return;
    }
    const recent = letters.slice(-2).reverse();
    el.innerHTML = recent.map((l, ri) => {
      const i = letters.length - 1 - ri;
      return `
        <div onclick="openPage('letter'); setTimeout(()=>openLetterDetail(${i}),50)" style="background:#fff;border-radius:16px;padding:16px 18px;margin-bottom:8px;border:1px solid var(--border);cursor:pointer;position:relative;box-shadow:0 1px 4px rgba(0,0,0,0.05);">
          <div style="font-size:10px;font-weight:700;letter-spacing:1.5px;color:var(--accent);background:#1A1A1A;display:inline-block;padding:2px 9px;border-radius:100px;margin-bottom:8px;">Vol.${i+1}</div>
          <div style="font-size:14px;font-weight:700;color:var(--text);margin-bottom:4px;padding-right:20px;">${l.title}</div>
          <div style="font-size:12px;color:var(--text-muted);line-height:1.5;margin-bottom:6px;">${l.desc || ''}</div>
          <div style="font-size:11px;color:var(--text-hint);">${l.date || ''}</div>
          <div style="position:absolute;top:16px;right:16px;color:var(--text-hint);font-size:15px;">›</div>
        </div>`;
    }).join('');
  }

  // 홈 진입 시 레터 렌더
  renderHomeLetters();

  let currentLetterIndex = -1;

  function openLetterDetail(i) {
    currentLetterIndex = i;
    const letters = getLetters();
    const l = letters[i];
    if (!l) return;
    document.getElementById('letter-detail-label').textContent = `Vol.${i+1}`;
    document.getElementById('letter-detail-content').innerHTML = `
      <div style="background:var(--bg-hero);padding:32px 24px 28px;position:relative;overflow:hidden;">
        <div style="position:absolute;top:-60px;right:-60px;width:200px;height:200px;border-radius:50%;background:radial-gradient(circle,rgba(200,240,117,0.15) 0%,transparent 65%);pointer-events:none;"></div>
        <div style="font-size:10px;font-weight:700;letter-spacing:2px;color:var(--accent);margin-bottom:10px;">Vol.${i+1} · ${l.date||''}</div>
        <div style="font-family:'DM Serif Display',serif;font-size:24px;color:#FAF8F5;line-height:1.3;margin-bottom:10px;">${l.title}</div>
        <div style="font-size:13px;color:rgba(250,248,245,0.5);line-height:1.7;">${l.desc||''}</div>
      </div>
      <div style="padding:28px 24px 16px;">
        <div style="font-size:14px;color:#1A1A1A;line-height:1.9;">${l.body||''}</div>
        <div style="margin-top:32px;padding-top:20px;border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;">
          <div style="font-size:12px;color:var(--text-hint);">이 레터가 도움이 됐나요?</div>
          <a href="https://leader.stibee.com/" target="_blank" style="font-size:12px;font-weight:700;color:var(--c-b2b);text-decoration:none;">구독하기 →</a>
        </div>
      </div>
      ${adminUnlocked ? `
      <div style="padding:0 24px 52px;display:flex;flex-direction:column;gap:10px;">
        <button onclick="openEditLetter(${i})" style="width:100%;background:#1A1A1A;color:#fff;border:none;padding:13px;border-radius:100px;font-size:13px;font-weight:700;font-family:'Noto Sans KR',sans-serif;cursor:pointer;">이 레터 수정하기</button>
        <button onclick="deleteLetterConfirm(${i})" style="width:100%;background:none;border:1px solid rgba(220,50,50,0.25);color:#d43232;padding:13px;border-radius:100px;font-size:13px;font-weight:500;font-family:'Noto Sans KR',sans-serif;cursor:pointer;">이 레터 삭제하기</button>
      </div>` : ''}`;
    pageStack.push('page-letter-detail');
    showOnly('page-letter-detail');
  }

  let pendingDeleteIndex = -1;

  function deleteLetterConfirm(i) {
    pendingDeleteIndex = i;
    document.getElementById('delete-confirm-overlay').style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeDeleteConfirm() {
    document.getElementById('delete-confirm-overlay').style.display = 'none';
    document.body.style.overflow = '';
    pendingDeleteIndex = -1;
  }

  function confirmDelete() {
    if (pendingDeleteIndex < 0) return;
    const letters = getLetters();
    letters.splice(pendingDeleteIndex, 1);
    saveLetters(letters);
    closeDeleteConfirm();
    renderHomeLetters();
    closePage();
  }

  /* ── RICH EDITOR ── */
  function editorCmd(cmd) {
    document.getElementById('letter-body-editor').focus();
    document.execCommand(cmd, false, null);
  }

  function editorFontSize(size) {
    const map = { large: '20px', normal: '14px', small: '12px' };
    document.getElementById('letter-body-editor').focus();
    document.execCommand('fontSize', false, '7'); // placeholder index
    // 브라우저가 font size=7 태그 삽입 → 직접 px로 교체
    const editor = document.getElementById('letter-body-editor');
    editor.querySelectorAll('font[size="7"]').forEach(el => {
      el.removeAttribute('size');
      el.style.fontSize = map[size];
    });
  }

  function insertHr() {
    document.getElementById('letter-body-editor').focus();
    document.execCommand('insertHTML', false, '<hr>');
  }

  /* ── ADMIN ── */
  let adminUnlocked = false;
  let editingIndex = -1; // -1 = 새 등록, 0+ = 수정 모드

  function openLetterAdmin(idx) {
    editingIndex = (idx !== undefined) ? idx : -1;
    const overlay = document.getElementById('admin-overlay');
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    if (adminUnlocked) {
      showWriteScreen();
    } else {
      document.getElementById('admin-pw-screen').style.display = 'block';
      document.getElementById('admin-write-screen').style.display = 'none';
      document.getElementById('admin-pw-error').style.display = 'none';
      document.getElementById('admin-pw-input').value = '';
      setTimeout(() => document.getElementById('admin-pw-input').focus(), 100);
    }
  }

  function openEditLetter(i) {
    editingIndex = i;
    openLetterAdmin(i);
  }

  function closeAdmin() {
    document.getElementById('admin-overlay').style.display = 'none';
    document.body.style.overflow = '';
  }

  function checkAdminPw() {
    const val = document.getElementById('admin-pw-input').value;
    if (val === ADMIN_PW) {
      adminUnlocked = true;
      showWriteScreen();
    } else {
      document.getElementById('admin-pw-error').style.display = 'block';
    }
  }

  function showWriteScreen() {
    document.getElementById('admin-pw-screen').style.display = 'none';
    document.getElementById('admin-write-screen').style.display = 'block';

    if (editingIndex >= 0) {
      // 수정 모드 — 기존 데이터 로드
      const l = getLetters()[editingIndex];
      document.getElementById('admin-write-title').textContent = '레터 수정';
      document.getElementById('admin-save-btn').textContent = '수정 저장';
      document.getElementById('letter-title-input').value = l.title || '';
      document.getElementById('letter-date-input').value = l.date || '';
      document.getElementById('letter-desc-input').value = l.desc || '';
      document.getElementById('letter-body-editor').innerHTML = l.body || '';
    } else {
      // 신규 등록 모드
      document.getElementById('admin-write-title').textContent = '새 레터 등록';
      document.getElementById('admin-save-btn').textContent = '등록하기';
      document.getElementById('letter-title-input').value = '';
      document.getElementById('letter-date-input').value = new Date().toISOString().slice(0,10);
      document.getElementById('letter-desc-input').value = '';
      document.getElementById('letter-body-editor').innerHTML = '';
    }
  }

  function saveLetter() {
    const title = document.getElementById('letter-title-input').value.trim();
    const date  = document.getElementById('letter-date-input').value;
    const desc  = document.getElementById('letter-desc-input').value.trim();
    const body  = document.getElementById('letter-body-editor').innerHTML.trim();
    if (!title || !body) { alert('제목과 본문을 입력해 주세요.'); return; }

    const letters = getLetters();
    if (editingIndex >= 0) {
      letters[editingIndex] = { title, date, desc, body };
      saveLetters(letters);
      closeAdmin();
      renderHomeLetters();
      openLetterDetail(editingIndex);
    } else {
      letters.push({ title, date, desc, body });
      saveLetters(letters);
      closeAdmin();
      renderLetterList();
      renderHomeLetters();
      alert('레터가 등록되었습니다!');
    }
  }

  // 엔터키로 비밀번호 확인
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter'
      && document.getElementById('admin-pw-screen').style.display !== 'none'
      && document.getElementById('admin-overlay').style.display === 'flex') {
      checkAdminPw();
    }
  });

  // 오버레이 배경 클릭 닫기
  document.getElementById('admin-overlay').addEventListener('click', function(e) {
    if (e.target === this) closeAdmin();
  });
