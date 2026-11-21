// ==========================================================================
// ORDER MANAGEMENT & TRACKING SYSTEM
// ==========================================================================

const ORDERS_STORAGE_KEY = "trusted_customer_orders_v1";

// Initialize orders in localStorage with default seed data if not present
function initializeOrders() {
  const existing = localStorage.getItem(ORDERS_STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
  }
}

// Retrieve all orders
function getAllOrders() {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_ORDERS;
  } catch (e) {
    console.error("Failed to parse orders:", e);
    return INITIAL_ORDERS;
  }
}

// Save a newly placed order
function saveNewOrder(newOrder) {
  const orders = getAllOrders();
  orders.unshift(newOrder); // Add to the beginning
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  return newOrder;
}

// Search orders by Order ID (case-insensitive) or Phone Number
function findOrders(query) {
  if (!query) return [];
  const clean = query.trim().toLowerCase();
  const all = getAllOrders();
  
  return all.filter(order => {
    const matchId = order.orderId && order.orderId.toLowerCase().includes(clean);
    const matchPhone = order.phone && order.phone.includes(clean);
    const matchEmail = order.email && order.email.toLowerCase().includes(clean);
    return matchId || matchPhone || matchEmail;
  });
}

// Render Order Lookup Details in Modal
function renderOrderLookupResults(results, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!results || results.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px 20px;">
        <div style="font-size: 40px; margin-bottom: 12px;">🔍</div>
        <h4 style="color: #fff; font-size: 18px; margin-bottom: 8px;">No Order Found</h4>
        <p style="color: var(--text-secondary); font-size: 13.5px; max-width: 380px; margin: 0 auto 20px auto;">
          We couldn't find any orders matching your search. Please verify your Order ID (e.g. <strong>ORD-94821</strong>) or 10-digit mobile number.
        </p>
        <a href="https://wa.me/919999999999?text=Hello%20Support,%20I%20need%20help%20tracking%20my%20order" 
           target="_blank" 
           class="btn-primary-gold" 
           style="font-size: 13px; padding: 10px 18px;">
           💬 Contact WhatsApp Support
        </a>
      </div>
    `;
    return;
  }

  container.innerHTML = results.map(order => `
    <div style="background: #151824; border: 1px solid var(--border-gold); border-radius: var(--radius-md); padding: 22px; margin-bottom: 20px;">
      <!-- Order Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px; margin-bottom: 16px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 14px;">
        <div>
          <span style="font-size: 11px; text-transform: uppercase; color: var(--text-muted); font-weight: 700;">Order ID</span>
          <div style="font-size: 18px; font-weight: 800; color: #fff; display: flex; align-items: center; gap: 8px;">
            ${order.orderId}
            <button onclick="copyToClipboard('${order.orderId}')" style="background: none; color: var(--accent-gold); font-size: 12px; text-decoration: underline;">Copy</button>
          </div>
          <div style="font-size: 12.5px; color: var(--text-muted); margin-top: 2px;">Placed on ${order.date}</div>
        </div>
        <div style="text-align: right;">
          <span style="display: inline-block; background: rgba(34, 197, 94, 0.15); border: 1px solid #22c55e; color: #22c55e; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 999px;">
            ✓ ${order.status.toUpperCase()}
          </span>
          <div style="font-size: 13px; font-weight: 700; color: var(--accent-gold-light); margin-top: 4px;">
            ₹${order.total} • ${order.paymentStatus}
          </div>
        </div>
      </div>

      <!-- Customer Summary -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-bottom: 18px; background: rgba(0,0,0,0.3); padding: 12px 14px; border-radius: var(--radius-sm); font-size: 12.5px;">
        <div><strong style="color: var(--text-muted);">Customer:</strong> <span style="color:#fff;">${order.customerName}</span></div>
        <div><strong style="color: var(--text-muted);">Phone:</strong> <span style="color:#fff;">${order.phone}</span></div>
        <div><strong style="color: var(--text-muted);">Email:</strong> <span style="color:#fff;">${order.email}</span></div>
      </div>

      <!-- Items & Delivered Credentials -->
      <h5 style="color: #fff; font-size: 14px; margin-bottom: 12px; font-weight: 700;">Purchased Items & Digital Delivery:</h5>
      ${order.items.map(item => `
        <div style="background: #0d0f17; border: 1px solid rgba(255,255,255,0.08); border-radius: var(--radius-sm); padding: 14px; margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px;">
            <strong style="color: #fff; font-size: 14.5px;">${item.title}</strong>
            <span style="color: var(--accent-gold); font-size: 12.5px; font-weight: 700;">${item.plan}</span>
          </div>

          ${item.credentials ? renderCredentialCard(item.credentials, item.category) : '<p style="color: var(--text-muted); font-size: 12px;">Your digital credentials are being verified and will be delivered shortly via WhatsApp.</p>'}
        </div>
      `).join('')}

      <!-- Help Actions -->
      <div style="margin-top: 14px; display: flex; justify-content: flex-end; gap: 10px;">
        <a href="https://wa.me/919999999999?text=Hello%20Support,%20I%20have%20an%20inquiry%20regarding%20my%20Order%20${order.orderId}" 
           target="_blank"
           class="btn-secondary-glass" 
           style="font-size: 12.5px; padding: 8px 14px;">
           💬 Help with this Order
        </a>
      </div>
    </div>
  `).join('');
}

// Render credentials box depending on category (OTT vs E-Book vs Video)
function renderCredentialCard(creds, category) {
  if (creds.portalUrl || creds.driveLink) {
    // E-Book or Video Course
    return `
      <div style="background: rgba(207, 163, 88, 0.08); border: 1px dashed var(--border-gold); padding: 12px; border-radius: 6px; font-size: 13px;">
        <div style="color: #fff; font-weight: 600; margin-bottom: 8px;">🚀 Instant Access Links:</div>
        ${creds.portalUrl ? `
          <div style="margin-bottom: 6px;">
            <a href="${creds.portalUrl}" target="_blank" class="btn-primary-gold" style="font-size: 12px; padding: 6px 14px; text-decoration: none; display: inline-flex; align-items: center; gap: 6px;">
              ▶ Open Course Portal
            </a>
          </div>
        ` : ''}
        ${creds.driveLink ? `
          <div style="margin-top: 6px;">
            <a href="${creds.driveLink}" target="_blank" style="color: var(--accent-gold-light); font-weight: 700; text-decoration: underline;">
              📥 Download Course / E-Book Files (Google Drive)
            </a>
          </div>
        ` : ''}
        ${creds.instructions ? `<div style="color: var(--text-secondary); font-size: 12px; margin-top: 8px;">ℹ️ ${creds.instructions}</div>` : ''}
      </div>
    `;
  }

  // OTT Subscription Credentials
  return `
    <div style="background: #07080c; border: 1px solid var(--border-subtle); padding: 12px; border-radius: 6px; font-size: 12.5px; line-height: 1.6;">
      <div style="display: grid; grid-template-columns: auto 1fr; gap: 4px 12px; font-family: monospace;">
        <span style="color: var(--text-muted);">Email / ID:</span>
        <span style="color: #fff; font-weight: 700; user-select: all;">${creds.email}</span>
        
        <span style="color: var(--text-muted);">Password:</span>
        <span style="color: var(--accent-gold-light); font-weight: 700; user-select: all;">${creds.revealedPass || creds.password}</span>
        
        ${creds.profile ? `
          <span style="color: var(--text-muted);">Profile:</span>
          <span style="color: #fff; font-weight: 700;">${creds.profile}</span>
        ` : ''}
        
        ${creds.pin ? `
          <span style="color: var(--text-muted);">PIN:</span>
          <span style="color: #22c55e; font-weight: 800;">${creds.pin}</span>
        ` : ''}
        
        ${creds.validUntil ? `
          <span style="color: var(--text-muted);">Validity:</span>
          <span style="color: var(--text-secondary);">${creds.validUntil}</span>
        ` : ''}
      </div>

      ${creds.instructions ? `
        <div style="margin-top: 10px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.06); color: var(--text-secondary); font-size: 11.5px;">
          📌 <strong>Important Rule:</strong> ${creds.instructions}
        </div>
      ` : ''}
    </div>
  `;
}

// Helper to copy text to clipboard with instant toast
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    if (typeof showToast === "function") {
      showToast("Copied to clipboard: " + text, "success");
    } else {
      alert("Copied: " + text);
    }
  });
}
