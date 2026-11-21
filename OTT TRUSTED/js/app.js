// ==========================================================================
// TRUSTED.SHOP - APPLICATION CONTROLLER & ROUTER
// Matching Video Flow, Dynamic Views & Card Interactions
// ==========================================================================

const CART_STORAGE_KEY = "trusted_cart_v1";

// Global State
const appState = {
  currentPage: "home",
  cart: [],
  selectedOttPlan: {},
  ottFilters: {
    types: [],
    inStockOnly: false,
    minPrice: 0,
    maxPrice: 1000,
    sort: "newest"
  },
  gameFilters: {
    platforms: ["Steam"],
    minPrice: 0,
    maxPrice: 5000,
    sort: "popular"
  }
};

// --------------------------------------------------------------------------
// Initialization
// --------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  if (typeof initializeOrders === "function") {
    initializeOrders();
  }

  // Load Cart
  appState.cart = loadStoredCart();
  updateCartBadge();

  // Initial renders
  renderHomeSections();
  renderFaqs();
  renderOttCatalog();
  renderGamingCatalog();
  renderBlogGrid();

  // Setup search input
  setupGlobalSearch();

  // Setup mobile nav toggle
  const mobileToggle = document.getElementById("mobileNavToggle");
  const mobileMenu = document.getElementById("mobileNavMenu");
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener("click", () => {
      mobileMenu.style.display = mobileMenu.style.display === "block" ? "none" : "block";
    });
  }
});

// --------------------------------------------------------------------------
// Navigation / View Switching (From Video)
// --------------------------------------------------------------------------
function navigateTo(pageId) {
  appState.currentPage = pageId;

  // List of page container IDs
  const pages = ["home", "ott", "games", "blog", "support"];
  pages.forEach(p => {
    const el = document.getElementById(`page-${p}`);
    if (el) el.style.display = (p === pageId) ? "block" : "none";

    const navLink = document.getElementById(`nav-${p}`);
    if (navLink) {
      if (p === pageId) {
        navLink.classList.add("active-pill");
      } else {
        navLink.classList.remove("active-pill");
      }
    }
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function closeMobileNav() {
  const menu = document.getElementById("mobileNavMenu");
  if (menu) menu.style.display = "none";
}

// --------------------------------------------------------------------------
// Home Page Section Renders
// --------------------------------------------------------------------------
function renderHomeSections() {
  // 1. Featured OTT Plans (8 cards)
  const ottContainer = document.getElementById("homeOttGrid");
  if (ottContainer) {
    ottContainer.innerHTML = OTT_PRODUCTS.slice(0, 8).map(prod => renderStoreCard(prod)).join("");
  }

  // 2. Gaming Products (4 cards)
  const gamingContainer = document.getElementById("homeGamingGrid");
  if (gamingContainer) {
    gamingContainer.innerHTML = GAMING_PRODUCTS.slice(0, 4).map(prod => renderStoreCard(prod)).join("");
  }

  // 3. Trending Products (combination)
  const trendingContainer = document.getElementById("homeTrendingGrid");
  if (trendingContainer) {
    const trending = [
      GAMING_PRODUCTS[4], // Wukong
      GAMING_PRODUCTS[5], // Shadows
      GAMING_PRODUCTS[6], // RE Village
      GAMING_PRODUCTS[8]  // God of War
    ];
    trendingContainer.innerHTML = trending.map(prod => renderStoreCard(prod)).join("");
  }
}

// --------------------------------------------------------------------------
// Universal Product Card Component (Matching Video 00:01 - 00:08)
// --------------------------------------------------------------------------
function renderStoreCard(product) {
  const isOtt = product.category === "ott";
  const durationLabel = product.badge || (isOtt ? "1 Month" : "Full Game");
  const platformTag = product.platformTag || (isOtt ? "OTT" : "STEAM");
  const unitText = isOtt ? `/ ${product.plans ? product.plans[0].label : 'Month'}` : "";

  return `
    <article class="store-card" id="card-${product.id}">
      <!-- Poster Image -->
      <div class="card-poster-frame" style="background-image: url('${product.image}');">
        ${product.logoText ? `
          <div style="background: rgba(0,0,0,0.55); width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(2px);">
            <span class="card-poster-logo-text" style="color: ${product.logoColor || '#ffffff'};">${product.logoText}</span>
          </div>
        ` : ''}
      </div>

      <!-- Category Tag & Duration Badge -->
      <div class="card-meta-row">
        <span class="card-cat-tag">${platformTag}</span>
        <span class="card-duration-badge">${durationLabel}</span>
      </div>

      <!-- Title & Tagline -->
      <h3 class="card-item-title">${product.title}</h3>
      <p class="card-item-desc">${product.tagline}</p>

      <!-- Price Row -->
      <div class="card-price-row">
        <span class="card-price-val">₹${product.price}</span>
        <span class="card-price-unit">${unitText}</span>
      </div>

      <!-- Action Buttons -->
      <div class="card-action-row">
        <button class="btn-card-buy" onclick="handleBuyNow('${product.id}')">
          Buy Now
        </button>
        <button class="btn-card-cart" onclick="handleAddToCart('${product.id}')" title="Add to Cart">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
        </button>
      </div>
    </article>
  `;
}

// --------------------------------------------------------------------------
// OTT Catalog Page & Filter System (Video 00:20 - 00:33)
// --------------------------------------------------------------------------
function renderOttCatalog() {
  const container = document.getElementById("ottCatalogGrid");
  const countText = document.getElementById("ottCountText");
  if (!container) return;

  let filtered = [...OTT_PRODUCTS];

  // Filter by Type checkboxes
  const checkedBoxes = Array.from(document.querySelectorAll(".ott-type-filter:checked")).map(cb => cb.value);
  if (checkedBoxes.length > 0) {
    filtered = filtered.filter(p => checkedBoxes.includes(p.type));
  }

  // Filter by Price
  const minP = parseInt(document.getElementById("ottMinPrice")?.value) || 0;
  const maxP = parseInt(document.getElementById("ottMaxPrice")?.value) || 10000;
  filtered = filtered.filter(p => p.price >= minP && p.price <= maxP);

  // Sort
  const sortVal = document.getElementById("ottSortSelect")?.value || "newest";
  if (sortVal === "price-asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortVal === "price-desc") {
    filtered.sort((a, b) => b.price - a.price);
  }

  if (countText) countText.textContent = `Showing ${filtered.length} products`;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 50px 20px; background: #fff; border-radius: 12px; border: 1px dashed var(--border-card);">
        <p style="color: var(--text-muted);">No OTT subscriptions match your filter criteria.</p>
        <button onclick="resetFilters()" class="btn-primary-gold" style="margin-top: 12px; padding: 8px 18px; font-size: 13px;">Reset Filters</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(prod => renderStoreCard(prod)).join("");
}

function filterOttCards() {
  renderOttCatalog();
}

function sortOttProducts(val) {
  renderOttCatalog();
}

function resetFilters() {
  document.querySelectorAll(".ott-type-filter").forEach(cb => cb.checked = false);
  const min = document.getElementById("ottMinPrice");
  const max = document.getElementById("ottMaxPrice");
  if (min) min.value = "50";
  if (max) max.value = "500";
  renderOttCatalog();
}

// --------------------------------------------------------------------------
// Gaming Catalog Page & Filter System (Video 00:35 - 00:59)
// --------------------------------------------------------------------------
function renderGamingCatalog() {
  const container = document.getElementById("gamingCatalogGrid");
  const countText = document.getElementById("gameCountText");
  if (!container) return;

  let filtered = [...GAMING_PRODUCTS];

  const minP = parseInt(document.getElementById("gameMinPrice")?.value) || 0;
  const maxP = parseInt(document.getElementById("gameMaxPrice")?.value) || 10000;
  filtered = filtered.filter(p => p.price >= minP && p.price <= maxP);

  if (countText) countText.textContent = `Showing ${filtered.length} products`;

  container.innerHTML = filtered.map(prod => renderStoreCard(prod)).join("");
}

function filterGamesGrid() {
  renderGamingCatalog();
}

function sortGames(val) {
  renderGamingCatalog();
}

function resetGameFilters() {
  const min = document.getElementById("gameMinPrice");
  const max = document.getElementById("gameMaxPrice");
  if (min) min.value = "100";
  if (max) max.value = "500";
  renderGamingCatalog();
}

// --------------------------------------------------------------------------
// Blog Section
// --------------------------------------------------------------------------
function renderBlogGrid() {
  const container = document.getElementById("fullBlogGrid");
  if (!container) return;

  const blogs = [
    { title: "YouTube Premium for Just ₹70 in India | Trusted.shop", date: "12 Nov 2026", img: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=500&auto=format&fit=crop&q=80" },
    { title: "Cheap PC Games Under ₹200 - Best Budget Gaming Deals", date: "10 Nov 2026", img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80" },
    { title: "How Shared OTT Profiles Work and Why They Save You Thousands", date: "08 Nov 2026", img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80" }
  ];

  container.innerHTML = blogs.map(b => `
    <article class="blog-card">
      <div class="blog-thumb" style="background-image: url('${b.img}');"></div>
      <div class="blog-body">
        <div class="blog-meta-date">${b.date} &bull; 8 min read</div>
        <h3 class="blog-title">${b.title}</h3>
        <a href="javascript:void(0)" onclick="showToast('Full blog article coming soon!', 'info')" class="blog-read-link">Read More &rarr;</a>
      </div>
    </article>
  `).join("");
}

// --------------------------------------------------------------------------
// FAQ Accordion (From Video 00:14)
// --------------------------------------------------------------------------
function renderFaqs() {
  const homeContainer = document.getElementById("faqAccordionContainer");
  const supportContainer = document.getElementById("supportFaqAccordion");

  const html = FAQS_DATA.map((item, idx) => `
    <div class="faq-item" id="faq-${idx}">
      <div class="faq-question" onclick="toggleFaq(${idx})">
        <span>${item.q}</span>
        <span class="faq-chevron">▼</span>
      </div>
      <div class="faq-answer">
        ${item.a}
      </div>
    </div>
  `).join("");

  if (homeContainer) homeContainer.innerHTML = html;
  if (supportContainer) supportContainer.innerHTML = html;
}

function toggleFaq(idx) {
  const item = document.getElementById(`faq-${idx}`);
  if (item) {
    item.classList.toggle("active");
  }
}

// --------------------------------------------------------------------------
// Support Center Ticket Form (From Video 01:03)
// --------------------------------------------------------------------------
function focusTicketCategory(catName) {
  const select = document.getElementById("ticketCategory");
  if (select) {
    select.value = catName;
    select.scrollIntoView({ behavior: "smooth" });
  }
}

function handleTicketSubmit(event) {
  event.preventDefault();
  const name = document.getElementById("ticketName").value;
  const orderId = document.getElementById("ticketOrderId").value;
  const category = document.getElementById("ticketCategory").value;

  const ticketNo = "TKT-" + Math.floor(10000 + Math.random() * 90000);

  showToast(`Support Ticket ${ticketNo} created successfully! Our team will respond via WhatsApp.`, "success");

  // Reset form
  document.getElementById("supportTicketForm").reset();
}

// --------------------------------------------------------------------------
// Newsletter Subscription
// --------------------------------------------------------------------------
function handleNewsletter(event) {
  event.preventDefault();
  showToast("Thank you for subscribing! Exclusive deals will arrive in your inbox.", "success");
  event.target.reset();
}

// --------------------------------------------------------------------------
// Cart & Checkout Mechanics
// --------------------------------------------------------------------------
function loadStoredCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  appState.cart = cart;
  updateCartBadge();
  renderCartDrawer();
}

function clearCart() {
  localStorage.removeItem(CART_STORAGE_KEY);
  appState.cart = [];
  updateCartBadge();
  renderCartDrawer();
}

function updateCartBadge() {
  const count = appState.cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.getElementById("cartCountBadge");
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? "flex" : "none";
  }
}

function handleAddToCart(productId) {
  const product = ALL_CATALOG_PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const cart = loadStoredCart();
  const existingIdx = cart.findIndex(item => item.id === productId);

  if (existingIdx > -1) {
    cart[existingIdx].quantity += 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      category: product.category,
      quantity: 1,
      platformTag: product.platformTag || "PRODUCT"
    });
  }

  saveCart(cart);
  showToast(`Added ${product.title} to cart!`, "success");
}

function handleBuyNow(productId) {
  handleAddToCart(productId);
  openCheckoutModal();
}

function openCartDrawer() {
  renderCartDrawer();
  const drawer = document.getElementById("cartDrawer");
  const overlay = document.getElementById("modalOverlay");
  if (drawer) drawer.classList.add("open");
  if (overlay) overlay.classList.add("active");
}

function closeCartDrawer() {
  const drawer = document.getElementById("cartDrawer");
  const overlay = document.getElementById("modalOverlay");
  if (drawer) drawer.classList.remove("open");
  if (overlay && !document.getElementById("checkoutModal").classList.contains("active") && !document.getElementById("orderLookupModal").classList.contains("active")) {
    overlay.classList.remove("active");
  }
}

function renderCartDrawer() {
  const body = document.getElementById("cartDrawerBody");
  const footer = document.getElementById("cartDrawerFooter");
  const cart = loadStoredCart();

  if (!body) return;

  if (cart.length === 0) {
    body.innerHTML = `
      <div style="text-align: center; padding: 60px 20px; color: var(--text-muted);">
        <div style="font-size: 42px; margin-bottom: 12px;">🛒</div>
        <h4 style="color: var(--text-dark); font-size: 16px; margin-bottom: 6px;">Your cart is empty</h4>
        <p style="font-size: 13px;">Browse OTT plans and games to add to your order.</p>
      </div>
    `;
    if (footer) footer.style.display = "none";
    return;
  }

  if (footer) footer.style.display = "block";

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  body.innerHTML = cart.map((item, idx) => `
    <div style="display: flex; gap: 12px; background: #fff; border: 1px solid var(--border-card); border-radius: var(--radius-sm); padding: 12px;">
      <div style="width: 50px; height: 50px; border-radius: 8px; background-image: url('${item.image}'); background-size: cover; background-position: center; flex-shrink: 0;"></div>
      <div style="flex: 1;">
        <h4 style="font-size: 13.5px; font-weight: 700; color: var(--text-dark); line-height: 1.3;">${item.title}</h4>
        <div style="font-size: 13px; font-weight: 800; color: #a67c33; margin-top: 4px;">₹${item.price * item.quantity}</div>
      </div>
      <div style="display: flex; flex-direction: column; align-items: flex-end; justify-content: space-between;">
        <button onclick="removeCartItem(${idx})" style="background: none; color: #ef4444; font-size: 12px;">✕</button>
        <div style="font-size: 12px; font-weight: 700; color: var(--text-muted);">Qty: ${item.quantity}</div>
      </div>
    </div>
  `).join("");

  footer.innerHTML = `
    <div style="display: flex; justify-content: space-between; font-size: 17px; font-weight: 800; color: var(--text-dark); margin-bottom: 14px;">
      <span>Total Payable:</span>
      <span style="color: #a67c33;">₹${total}</span>
    </div>
    <button class="btn-primary-gold" onclick="openCheckoutModal()" style="width: 100%; justify-content: center; padding: 12px; font-size: 14px;">
      Proceed to Checkout (₹${total}) &rarr;
    </button>
  `;
}

function removeCartItem(idx) {
  const cart = loadStoredCart();
  cart.splice(idx, 1);
  saveCart(cart);
}

// --------------------------------------------------------------------------
// Search Listener
// --------------------------------------------------------------------------
function setupGlobalSearch() {
  const input = document.getElementById("headerSearchInput");
  if (input) {
    input.addEventListener("input", (e) => {
      handleGlobalSearch(e.target.value);
    });
  }
}

function handleGlobalSearch(query) {
  const q = query.trim().toLowerCase();
  if (!q) {
    renderHomeSections();
    return;
  }

  // Switch to home view to show search matches
  navigateTo("home");

  const matches = ALL_CATALOG_PRODUCTS.filter(p => 
    p.title.toLowerCase().includes(q) || 
    p.tagline.toLowerCase().includes(q) ||
    (p.platformTag && p.platformTag.toLowerCase().includes(q))
  );

  const container = document.getElementById("homeOttGrid");
  if (container) {
    container.innerHTML = matches.map(p => renderStoreCard(p)).join("");
  }
}

// --------------------------------------------------------------------------
// Hero Carousel Switcher (OTT vs Gaming)
// --------------------------------------------------------------------------
function switchHeroSlide(slide) {
  const art = document.querySelector(".hero-showcase-art");
  const dotOtt = document.getElementById("dot-ott");
  const dotGaming = document.getElementById("dot-gaming");

  if (slide === "gaming") {
    if (art) art.style.backgroundImage = "url('assets/hero_gaming_showcase.png')";
    if (dotGaming) dotGaming.classList.add("active");
    if (dotOtt) dotOtt.classList.remove("active");
  } else {
    if (art) art.style.backgroundImage = "url('assets/hero_squidgame_ott_showcase.png')";
    if (dotOtt) dotOtt.classList.add("active");
    if (dotGaming) dotGaming.classList.remove("active");
  }
}

// --------------------------------------------------------------------------
// Toast Utility
// --------------------------------------------------------------------------
function showToast(message, type = "info") {
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast`;
  toast.innerHTML = `
    <span style="color: var(--accent-gold); font-size: 16px;">✓</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}
