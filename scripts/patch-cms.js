const fs = require('fs');
const path = require('path');

const cmsPath = path.join(__dirname, '..', 'admin', 'cms.html');
let html = fs.readFileSync(cmsPath, 'utf8');

const target = '<!-- Beginner-Friendly Quick Start & Guided Tour Card -->';
if (html.includes(target) && !html.includes('supabase-cloud-bar')) {
  const bar = `<!-- =========================================================================
       SUPABASE CLOUD DATABASE REAL-TIME STATUS & SYNC STRIP
       ========================================================================= -->
  <div class="cms-card supabase-cloud-bar" style="padding:1.15rem 1.5rem; margin-bottom:1.5rem; background:#ffffff; border:1px solid #e2e8f0; border-left:4px solid var(--admin-gold, #966e36); border-radius:var(--radius-md); box-shadow:0 2px 10px rgba(0,0,0,0.03); display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem;">
    <div style="display:flex; align-items:center; gap:0.85rem;">
      <div style="width:40px; height:40px; border-radius:10px; background:var(--admin-gold-surface, #fdf8ee); display:flex; align-items:center; justify-content:center; color:var(--admin-gold, #966e36);">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
        </svg>
      </div>
      <div>
        <div style="display:flex; align-items:center; gap:0.5rem;">
          <strong style="color:#0f172a; font-size:0.95rem;">Supabase PostgreSQL Cloud Database</strong>
          <span id="sbLiveStatusBadge" style="display:inline-flex; align-items:center; gap:0.35rem; font-size:0.75rem; font-weight:700; padding:0.2rem 0.6rem; border-radius:20px; background:#ecfdf5; color:#059669; border:1px solid #a7f3d0;">
            <span style="width:7px; height:7px; border-radius:50%; background:#059669;"></span>
            <span id="sbLiveStatusText">Cloud Database Ready</span>
          </span>
        </div>
        <span style="font-size:0.8rem; color:#64748b;" id="sbConnectionSubtitle">
          Real-time database connected. Published books and articles automatically sync live.
        </span>
      </div>
    </div>
    <div style="display:flex; gap:0.6rem; align-items:center; flex-wrap:wrap;">
      <button type="button" class="btn-action-secondary" id="btnSyncAllToCloud" style="font-size:0.82rem; padding:0.45rem 0.85rem; display:inline-flex; align-items:center; gap:0.4rem; background:var(--admin-gold-surface, #fdf8ee); color:var(--admin-gold, #966e36); border:1px solid rgba(150,110,54,0.3);">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
        <span>Sync Content to Cloud</span>
      </button>
      <button type="button" class="btn-action-primary" onclick="document.getElementById('supabaseModal').showModal()" style="font-size:0.82rem; padding:0.45rem 0.85rem; display:inline-flex; align-items:center; gap:0.4rem; background:var(--admin-gold, #966e36); color:#ffffff;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
        <span>Database Settings</span>
      </button>
    </div>
  </div>\n\n  `;
  html = html.replace(target, bar + target);
}

const scriptTag = `
  <script>
    (function() {
      const modal = document.getElementById('supabaseModal');
      const form = document.getElementById('supabaseConfigForm');
      const urlInput = document.getElementById('sbProjectUrl');
      const keyInput = document.getElementById('sbAnonKey');
      const testBtn = document.getElementById('btnTestSupabase');
      const feedback = document.getElementById('sbStatusFeedback');
      const syncBtn = document.getElementById('btnSyncAllToCloud');
      const liveBadge = document.getElementById('sbLiveStatusBadge');
      const liveText = document.getElementById('sbLiveStatusText');

      function updateStatusUI() {
        if (!liveBadge || !liveText) return;
        const creds = (window.PVS_Supabase && window.PVS_Supabase.getCredentials)
          ? window.PVS_Supabase.getCredentials()
          : { url: localStorage.getItem('pvsrv_supabase_url') || '', key: localStorage.getItem('pvsrv_supabase_anon_key') || '' };

        if (creds.url && creds.key) {
          liveBadge.style.background = '#ecfdf5';
          liveBadge.style.color = '#059669';
          liveBadge.style.borderColor = '#a7f3d0';
          liveText.textContent = 'Supabase Cloud Connected';
          if (urlInput) urlInput.value = creds.url;
          if (keyInput) keyInput.value = creds.key;
        } else {
          liveBadge.style.background = '#fffbeb';
          liveBadge.style.color = '#b45309';
          liveBadge.style.borderColor = '#fde68a';
          liveText.textContent = 'Demo Mode (Click to Connect Cloud)';
        }
      }

      if (testBtn) {
        testBtn.addEventListener('click', async () => {
          const testUrl = urlInput.value.trim();
          const testKey = keyInput.value.trim();
          feedback.style.display = 'block';
          feedback.style.background = '#eff6ff';
          feedback.style.color = '#1d4ed8';
          feedback.textContent = 'Testing connection to Supabase PostgreSQL...';

          if (window.PVS_Supabase) {
            const res = await window.PVS_Supabase.testConnection(testUrl, testKey);
            feedback.style.background = res.success ? '#ecfdf5' : '#fef2f2';
            feedback.style.color = res.success ? '#15803d' : '#b91c1c';
            feedback.textContent = res.message;
          } else {
            feedback.textContent = 'Supabase library loading...';
          }
        });
      }

      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const u = urlInput.value.trim();
          const k = keyInput.value.trim();
          if (window.PVS_Supabase) {
            window.PVS_Supabase.setCredentials(u, k);
          } else {
            localStorage.setItem('pvsrv_supabase_url', u);
            localStorage.setItem('pvsrv_supabase_anon_key', k);
          }
          updateStatusUI();
          if (typeof showToast === 'function') {
            showToast('Supabase PostgreSQL database connected successfully!', 'gold');
          }
          modal.close();
        });
      }

      if (syncBtn) {
        syncBtn.addEventListener('click', async () => {
          syncBtn.disabled = true;
          syncBtn.innerHTML = 'Syncing Content...';
          if (window.PVS_Supabase) {
            const res = await window.PVS_Supabase.syncAllToCloud();
            if (typeof showToast === 'function') {
              showToast(res.message, res.success ? 'gold' : 'error');
            }
          }
          syncBtn.disabled = false;
          syncBtn.innerHTML = '<span>Sync Content to Cloud</span>';
        });
      }

      setTimeout(updateStatusUI, 300);
    })();
  </script>
`;

if (!html.includes('updateStatusUI')) {
  html = html.replace('</body>', scriptTag + '\n</body>');
}

fs.writeFileSync(cmsPath, html, 'utf8');
console.log('Successfully patched admin/cms.html with Supabase status bar and controller!');
