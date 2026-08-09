// name: github-stats.js
// Loads live GitHub metrics for CHENNAMSETTYVIKRAM and replaces github-readme-stats images.
// No token required. Uses api.github.com and computes Top Languages by repository count.

(function () {
  const USER = 'CHENNAMSETTYVIKRAM';
  const REPOS_URL = `https://api.github.com/users/${USER}/repos?per_page=100&type=owner`;
  const CONTAINER_SELECTOR = '.github-stats-grid';
  const GITHUB_README_STATS_HOST = 'github-readme-stats.vercel.app';

  function safeText(s) { return String(s == null ? '' : s); }

  function createBox() {
    const box = document.createElement('div');
    box.className = 'github-widget-box';
    box.innerHTML = '<div style="color:var(--muted);font-family:var(--mono);font-size:13px">Loading&hellip;</div>';
    return box;
  }

  function sanitizeImgSrcs() {
    // Fix cases where an img src accidentally contains Markdown-style text.
    document.querySelectorAll('img').forEach(img => {
      const src = img.getAttribute('src') || '';
      if (!src) return;
      if (src.includes('[') || src.includes(']') || src.includes(')(') || src.includes('](')) {
        // attempt to extract a valid URL inside the string
        const m = src.match(/https?:\/\/[^)'"]\+/);
        if (m) {
          img.src = m[0];
          console.debug('Fixed img src to', m[0]);
        }
      }
    });
  }

  function keepContribGraph(originalBoxes) {
    for (const b of originalBoxes) {
      const img = b.querySelector('img');
      if (!img) continue;
      const s = (img.src || '').toLowerCase();
      if (s.includes('ghchart.rshah.org') || s.includes('contrib') || s.includes('github.com')) {
        return b.cloneNode(true);
      }
    }
    return null;
  }

  function buildStatsHTML(totals) {
    return `
      <div style="text-align:center">
        <div style="font-family:var(--display);font-size:1rem;font-weight:700;margin-bottom:6px">GitHub Stats</div>
        <div style="color:var(--muted);font-size:13px;margin-bottom:12px">Live data from GitHub &mdash; ${USER}</div>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:0.6rem">
          <div style="background:var(--surface2);padding:0.75rem;border-radius:6px">
            <div style="font-family:var(--display);font-weight:800;font-size:1.25rem;background:linear-gradient(135deg,var(--accent),var(--accent-alt));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">${totals.stars}</div>
            <div style="font-family:var(--mono);font-size:11px;color:var(--muted);text-transform:uppercase">Stars</div>
          </div>
          <div style="background:var(--surface2);padding:0.75rem;border-radius:6px">
            <div style="font-family:var(--display);font-weight:800;font-size:1.25rem;background:linear-gradient(135deg,var(--accent),var(--accent-alt));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">${totals.forks}</div>
            <div style="font-family:var(--mono);font-size:11px;color:var(--muted);text-transform:uppercase">Forks</div>
          </div>
          <div style="background:var(--surface2);padding:0.75rem;border-radius:6px">
            <div style="font-family:var(--display);font-weight:800;font-size:1.25rem;background:linear-gradient(135deg,var(--accent),var(--accent-alt));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">${totals.watchers}</div>
            <div style="font-family:var(--mono);font-size:11px;color:var(--muted);text-transform:uppercase">Watchers</div>
          </div>
          <div style="background:var(--surface2);padding:0.75rem;border-radius:6px">
            <div style="font-family:var(--display);font-weight:800;font-size:1.25rem;background:linear-gradient(135deg,var(--accent),var(--accent-alt));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">${totals.repos}</div>
            <div style="font-family:var(--mono);font-size:11px;color:var(--muted);text-transform:uppercase">Repositories</div>
          </div>
        </div>
        <div style="margin-top:10px">
          <a class="action-link action-link--primary" href="https://github.com/${USER}" target="_blank" rel="noopener">Open GitHub profile</a>
        </div>
      </div>
    `;
  }

  function buildLanguagesHTML(langArray) {
    const rows = langArray.slice(0, 6).map(item => {
      const pct = item.pct;
      return `<div style="display:flex;align-items:center;justify-content:space-between;padding:0.4rem 0;border-bottom:1px solid rgba(255,255,255,0.02)">
        <div style="display:flex;gap:0.6rem;align-items:center">
          <div style="width:10px;height:10px;border-radius:2px;background:linear-gradient(135deg,var(--accent),var(--accent-alt))"></div>
          <div style="font-family:var(--mono);font-size:13px;color:var(--text)">${item.lang}</div>
        </div>
        <div style="font-family:var(--mono);font-size:13px;color:var(--muted)">${pct}%</div>
      </div>`;
    }).join('');
    return `
      <div style="text-align:center">
        <div style="font-family:var(--display);font-size:1rem;font-weight:700;margin-bottom:6px">Top Languages</div>
        <div style="color:var(--muted);font-size:13px;margin-bottom:12px">Top languages by repository count</div>
        <div style="background:var(--surface2);border-radius:8px;padding:0.4rem">${rows || '<div style="color:var(--muted);padding:0.6rem">No languages detected</div>'}</div>
        <div style="margin-top:8px">
          <a class="action-link" href="https://github.com/${USER}?tab=repositories" target="_blank" rel="noopener">See repositories</a>
        </div>
      </div>
    `;
  }

  async function fetchRepos() {
    const res = await fetch(REPOS_URL);
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`GitHub API returned ${res.status}: ${text}`);
    }
    return res.json();
  }

  function computeTotals(repos) {
    const totals = { repos: repos.length, stars: 0, forks: 0, watchers: 0 };
    for (const r of repos) {
      totals.stars += (r.stargazers_count || 0);
      totals.forks += (r.forks_count || 0);
      totals.watchers += (r.watchers_count || 0);
    }
    return totals;
  }

  function computeLanguages(repos) {
    const map = {};
    for (const r of repos) {
      const lang = r.language || 'Other';
      map[lang] = (map[lang] || 0) + 1;
    }
    const arr = Object.keys(map).map(k => ({ lang: k, count: map[k] }));
    arr.sort((a, b) => b.count - a.count);
    const total = arr.reduce((s, a) => s + a.count, 0) || 1;
    return arr.map(a => ({ lang: a.lang, count: a.count, pct: Math.round((a.count / total) * 100) }));
  }

  async function init() {
    try {
      sanitizeImgSrcs();

      const container = document.querySelector(CONTAINER_SELECTOR);
      if (!container) {
        console.warn('GitHub stats container not found:', CONTAINER_SELECTOR);
        return;
      }

      const originalBoxes = Array.from(container.querySelectorAll('.github-widget-box'));
      const contribClone = keepContribGraph(originalBoxes);

      originalBoxes.forEach(b => {
        const img = b.querySelector('img');
        if (!img) return;
        const s = (img.src || '').toLowerCase();
        if (s.includes(GITHUB_README_STATS_HOST) || (s.includes('/api?') && s.includes('github-readme-stats'))) {
          b.remove();
        }
      });

      container.innerHTML = '';
      const statsBox = createBox();
      const langsBox = createBox();
      const contribBox = createBox();
      contribBox.classList.add('full-width');

      container.appendChild(statsBox);
      container.appendChild(langsBox);
      if (contribClone) {
        contribBox.innerHTML = '';
        const inner = contribClone.querySelector('*');
        if (inner) {
          contribBox.appendChild(inner.cloneNode(true));
        } else {
          contribBox.appendChild(contribClone.cloneNode(true));
        }
        container.appendChild(contribBox);
      } else {
        contribBox.innerHTML = `<div style="text-align:center;color:var(--muted)"><a class="action-link" href="https://github.com/${USER}" target="_blank" rel="noopener">Open GitHub profile</a></div>`;
        container.appendChild(contribBox);
      }

      const repos = await fetchRepos();
      const totals = computeTotals(repos);
      const langs = computeLanguages(repos);

      statsBox.innerHTML = buildStatsHTML(totals);
      langsBox.innerHTML = buildLanguagesHTML(langs);
    } catch (err) {
      console.error('github-stats.js error:', err);
      const container = document.querySelector(CONTAINER_SELECTOR);
      if (!container) return;
      container.innerHTML = '';
      const errBox1 = createBox(); errBox1.innerHTML = '<div style="color:var(--muted);text-align:center">Unable to load GitHub stats</div>';
      const errBox2 = createBox(); errBox2.innerHTML = '<div style="color:var(--muted);text-align:center">Unable to load languages</div>';
      const errBox3 = createBox(); errBox3.innerHTML = `<div style="color:var(--muted);text-align:center"><a class="action-link" href="https://github.com/${USER}" target="_blank" rel="noopener">Open GitHub profile</a></div>`;
      container.appendChild(errBox1); container.appendChild(errBox2); container.appendChild(errBox3);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
