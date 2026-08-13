/* ============================================================
   JUNAID Editorial Portfolio — Core Client Logic
   - Admin Mode Handler (?admin=1)
   - Dynamic Portfolio Grid & Category Filtering
   - YouTube Embed URL Converter
   - Admin Add / Delete Work Handlers (API + localStorage Sync)
   - Mobile Navigation Toggle
   ============================================================ */

const isLocalEnv = window.location.hostname === 'localhost' || 
                   window.location.hostname === '127.0.0.1' || 
                   window.location.port === '8080';

const API_ENDPOINT = isLocalEnv 
  ? (window.location.port === '8080' ? '/api/works' : 'http://localhost:8080/api/works')
  : null;

const LOCAL_STORAGE_KEY = 'junaid_portfolio_works_v1';

let allWorks = [];
let activeCategory = 'All';
let isAdminMode = false;

document.addEventListener('DOMContentLoaded', () => {
  initAdminMode();
  initMobileNav();
  loadWorks();
  setupFormListener();
});

/* ── Check URL query param for ?admin=1 ── */
function initAdminMode() {
  const params = new URLSearchParams(window.location.search);
  isAdminMode = params.get('admin') === '1';

  if (isAdminMode) {
    const adminBar = document.getElementById('admin-bar');
    const adminPanel = document.getElementById('admin-panel-section');

    if (adminBar) adminBar.classList.add('visible');
    if (adminPanel) adminPanel.classList.add('visible');
  }
}

/* ── Mobile Nav Toggle ── */
function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  hamburger?.addEventListener('click', () => {
    if (navLinks.style.display === 'flex') {
      navLinks.style.display = 'none';
    } else {
      navLinks.style.display = 'flex';
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '80px';
      navLinks.style.left = '0';
      navLinks.style.right = '0';
      navLinks.style.background = '#FFFFFF';
      navLinks.style.padding = '1.5rem';
      navLinks.style.borderBottom = '1px solid #E4E4E7';
    }
  });
}

/* ── YouTube / Vimeo Embed URL Formatter ── */
function getEmbedUrl(url) {
  if (!url) return '';

  // YouTube match
  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&?\s]+)/);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }

  // Vimeo match
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  return url;
}

/* ── Load Works from API or localStorage Backup ── */
async function loadWorks() {
  let loaded = false;

  if (API_ENDPOINT) {
    try {
      const res = await fetch(API_ENDPOINT);
      if (res.ok) {
        allWorks = await res.json();
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(allWorks));
        loaded = true;
      }
    } catch (err) {
      console.warn("API server not reachable, attempting localStorage backup...", err);
    }
  }

  if (!loaded) {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        allWorks = JSON.parse(stored);
      } catch (e) {
        console.error("Error parsing stored works:", e);
      }
    }
  }

  // Fallback initial default array if empty
  if (!allWorks || allWorks.length === 0) {
    allWorks = [
      {
        id: "work-101",
        title: "Commercial Brand Reel 2026",
        category: "Editing",
        videoUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
        tools: "Adobe Premiere Pro, After Effects, DaVinci Resolve",
        desc: "High-energy commercial cut featuring fast-paced transitions, precise rhythmic sound design, and custom color grading."
      },
      {
        id: "work-102",
        title: "Kerala Cinematic Journey",
        category: "Videography",
        videoUrl: "https://www.youtube.com/watch?v=L_LUpnjgPso",
        tools: "Sony FX3, Gimbal, Premiere Pro",
        desc: "Atmospheric 4K videography highlighting the lush landscapes, backwaters, and vibrant culture of Kerala."
      },
      {
        id: "work-103",
        title: "Urban Motion Graphics & Title Intro",
        category: "Motion Graphics",
        videoUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
        tools: "Adobe After Effects, Element 3D",
        desc: "Sleek 3D motion typography, fluid title animations, and visual effects package crafted for brand campaign intros."
      },
      {
        id: "work-104",
        title: "Social Media Viral Reel",
        category: "Reels",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        tools: "Premiere Pro, Kinetic Captions, Sound FX",
        desc: "Vertical format reel optimized for Instagram & TikTok with dynamic punch-in cuts and engaging sound effects."
      }
    ];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(allWorks));
  }

  renderGrid();
}

/* ── Render Portfolio Cards Grid ── */
function renderGrid() {
  const grid = document.getElementById('portfolio-grid');
  if (!grid) return;

  grid.innerHTML = '';

  const filtered = activeCategory === 'All' 
    ? allWorks 
    : allWorks.filter(w => {
        if (!w.category) return false;
        const cat = w.category.toLowerCase().trim();
        const target = activeCategory.toLowerCase().trim();
        if (target === 'motion graphics') {
          return cat.includes('motion');
        }
        return cat.includes(target) || target.includes(cat);
      });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: #888892;">
        <i class="fa-solid fa-film" style="font-size: 2rem; margin-bottom: 0.75rem; display: block; opacity: 0.4;"></i>
        <p style="font-weight: 600;">No work items published under "${activeCategory}" category yet.</p>
      </div>
    `;
    return;
  }

  filtered.forEach(work => {
    const card = document.createElement('div');
    card.className = 'work-card';
    const embedUrl = getEmbedUrl(work.videoUrl);

    card.innerHTML = `
      <div>
        <div class="card-media">
          <iframe 
            src="${embedUrl}" 
            title="${escapeHtml(work.title)}" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
          </iframe>
        </div>
        <div class="card-content">
          <div class="card-top-row">
            <h3 class="card-title">${escapeHtml(work.title)}</h3>
            <span class="category-tag">${escapeHtml(work.category || 'Editing')}</span>
          </div>
          <p class="card-desc">${escapeHtml(work.desc || '')}</p>
          <div class="card-tools">
            <i class="fa-solid fa-laptop-code"></i> ${escapeHtml(work.tools || 'Adobe Premiere Pro & After Effects')}
          </div>
        </div>
      </div>
      ${isAdminMode ? `
        <div class="card-admin-footer">
          <button class="btn-delete" onclick="deleteWork('${work.id}')">
            <i class="fa-solid fa-trash-can"></i> Delete Work
          </button>
        </div>
      ` : ''}
    `;

    grid.appendChild(card);
  });
}

/* ── Category Filter Controller ── */
function filterCategory(categoryName, event) {
  activeCategory = categoryName;

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  if (event && event.currentTarget) {
    event.currentTarget.classList.add('active');
  }

  renderGrid();
}

/* ── Admin Add Work Handler ── */
function setupFormListener() {
  const form = document.getElementById('add-work-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const titleInput = document.getElementById('work-title');
    const categoryInput = document.getElementById('work-category');
    const videoUrlInput = document.getElementById('work-video');
    const toolsInput = document.getElementById('work-tools');
    const descInput = document.getElementById('work-desc');

    const newWork = {
      id: `work-${Date.now()}`,
      title: titleInput.value.trim(),
      category: categoryInput.value,
      videoUrl: videoUrlInput.value.trim(),
      tools: toolsInput.value.trim() || 'Adobe Premiere Pro & After Effects',
      desc: descInput.value.trim()
    };

    // 1. Local state update
    allWorks.unshift(newWork);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(allWorks));
    renderGrid();

    // Reset form
    form.reset();

    // 2. Sync with Python API backend if accessible
    if (API_ENDPOINT) {
      try {
        await fetch(API_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newWork)
        });
      } catch (err) {
        console.log("Posted to local state & localStorage backup. Backend API notice:", err);
      }
    }

    alert(`✨ "${newWork.title}" published successfully to portfolio!`);
  });
}

/* ── Admin Delete Work Handler ── */
async function deleteWork(id) {
  if (!confirm('Are you sure you want to delete this portfolio project?')) return;

  // 1. Update local state
  allWorks = allWorks.filter(w => String(w.id) !== String(id));
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(allWorks));
  renderGrid();

  // 2. Sync delete with API backend if accessible
  if (API_ENDPOINT) {
    try {
      await fetch(`${API_ENDPOINT}/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.log("Deleted from local state & localStorage backup. API notice:", err);
    }
  }
}

/* ── Utility: HTML Escaper ── */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
