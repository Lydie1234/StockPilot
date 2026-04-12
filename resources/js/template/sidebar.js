const sidebar = document.getElementById('sidebar');
const content = document.getElementById('content');
const topbar = document.getElementById('topbar');
const toggleBtn = document.getElementById('toggleBtn');
const mobileBtn = document.getElementById('mobileBtn');
const overlay = document.getElementById('overlay');

const desktopMedia = window.matchMedia('(min-width: 992px)');
const COLLAPSE_KEY = 'stockpilot.sidebar.collapsed';

const applyCollapsedState = (collapsed) => {
  if (!sidebar) return;

  sidebar.classList.toggle('collapsed', collapsed);
  if (content) content.classList.toggle('full', collapsed);
  if (topbar) topbar.classList.toggle('full', collapsed);
  if (toggleBtn) toggleBtn.setAttribute('aria-expanded', String(!collapsed));
};

const closeMobileSidebar = () => {
  if (sidebar) sidebar.classList.remove('mobile-show');
  if (overlay) overlay.classList.remove('show');
};

if (desktopMedia.matches) {
  const savedState = window.localStorage.getItem(COLLAPSE_KEY) === '1';
  applyCollapsedState(savedState);
}

if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    if (!sidebar) return;

    const nextCollapsed = !sidebar.classList.contains('collapsed');
    applyCollapsedState(nextCollapsed);

    if (desktopMedia.matches) {
      window.localStorage.setItem(COLLAPSE_KEY, nextCollapsed ? '1' : '0');
    }
  });
}

if (mobileBtn) {
  mobileBtn.addEventListener('click', () => {
    if (sidebar) sidebar.classList.add('mobile-show');
    if (overlay) overlay.classList.add('show');
  });
}

if (overlay) {
  overlay.addEventListener('click', closeMobileSidebar);
}

const sidebarLinks = document.querySelectorAll('.sidebar .nav-link');
if (sidebarLinks.length > 0) {
  sidebarLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 992) {
        closeMobileSidebar();
      }
    });
  });
}

window.addEventListener('resize', () => {
  if (desktopMedia.matches) {
    closeMobileSidebar();
    const savedState = window.localStorage.getItem(COLLAPSE_KEY) === '1';
    applyCollapsedState(savedState);
    return;
  }

  applyCollapsedState(false);
});
