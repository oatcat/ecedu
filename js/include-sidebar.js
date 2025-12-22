(async function () {
  const slot = document.getElementById("sidebar-slot");
  if (!slot) return;

  // Detect whether we're running under /ecedu/ (NetBeans localhost) or domain root (production)
  const SITE_BASE = location.pathname.startsWith("/ecedu/") ? "/ecedu/" : "/";

  // Load the sidebar from the right base
  const sidebarUrl = SITE_BASE + "partials/sidebar.html";
  const res = await fetch(sidebarUrl, { cache: "no-cache" });

  if (!res.ok) {
    console.error("Failed to load sidebar:", res.status, res.statusText, sidebarUrl);
    return;
  }

  slot.innerHTML = await res.text();

  // Rewrite sidebar links so they always point to SITE_BASE + href
  document.querySelectorAll("#mySidebar a[href]").forEach(a => {
    const href = a.getAttribute("href");
    if (!href) return;

    // ignore absolute/external links
    if (/^(https?:|mailto:|tel:|#)/.test(href)) return;

    // Remove leading "./"
    const cleaned = href.replace(/^\.\//, "");

    // If it starts with "/", treat as site-rooted and prefix SITE_BASE
    if (cleaned.startsWith("/")) {
      a.setAttribute("href", SITE_BASE.replace(/\/$/, "") + cleaned);
    } else {
      a.setAttribute("href", SITE_BASE + cleaned);
    }
  });
})();