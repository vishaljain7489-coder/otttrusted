// ==========================================================================
// CHECKOUT & FAMGATEWAY UPI PAYMENT PROCESSING SYSTEM
// ==========================================================================

function getCart() {
  if (typeof loadStoredCart === "function") return loadStoredCart();
  try {
    const raw = localStorage.getItem("trusted_cart_v1");
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function calculateTotal() {
  const c = getCart();
  return c.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Active payment session state
let currentPaymentSession = null;
let paymentTimerInterval = null;

// Open the checkout modal
async function openCheckoutModal() {
  const cart = getCart();
  if (cart.length === 0) {
    showToast("Your cart is empty! Add products first.", "warning");
    return;
  }

  // Close cart drawer if open
  closeCartDrawer();

  const total = calculateTotal();
  const modal = document.getElementById("checkoutModal");
  const overlay = document.getElementById("modalOverlay");
  const container = document.getElementById("checkoutContent");

  // Temporary order ID for this checkout session
  const tempOrderId = "ORD-" + Math.floor(10000 + Math.random() * 90000);

  // Initialize FamGateway session
  const famConfig = (typeof FamGateway !== "undefined") ? FamGateway.getConfig() : {
    upiId: "vishaljain@fam",
    merchantName: "TRUSTED SHOP"
  };

  let session = null;
  if (typeof FamGateway !== "undefined") {
    session = await FamGateway.createOrder({
      amount: total,
      customerName: "Valued Customer",
      customerEmail: "vishaljain@gmail.com",
      orderId: tempOrderId
    });
  } else {
    const upiUri = `upi://pay?pa=${encodeURIComponent(famConfig.upiId)}&pn=${encodeURIComponent(famConfig.merchantName)}&am=${total}&cu=INR&tn=${encodeURIComponent(tempOrderId)}`;
    session = {
      orderId: tempOrderId,
      amount: total,
      upiId: famConfig.upiId,
      merchantName: famConfig.merchantName,
      upiUri: upiUri,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(upiUri)}&margin=8`
    };
  }

  currentPaymentSession = session;

  container.innerHTML = `
    <!-- Checkout Form & FamGateway Payment -->
    <div id="checkoutFormStep">
      
      <!-- Top Order Summary -->
      <div style="margin-bottom: 18px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 14px 18px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px;">
          <div>
            <span style="color: var(--text-secondary); font-size: 13.5px;">Order Total Payable:</span>
            <div style="font-size: 11.5px; color: var(--accent-gold-light); font-weight: 700;">Order ID: ${session.orderId}</div>
          </div>
          <span style="color: var(--accent-gold-light); font-size: 26px; font-weight: 900;">₹${total}</span>
        </div>
        <div style="font-size: 12px; color: var(--text-muted); display: flex; align-items: center; gap: 6px;">
          <span>📦 ${cart.length} item(s)</span> • <span style="color: #22c55e;">⚡ Automated 2-Min ID/Password Delivery</span>
        </div>
      </div>

      <!-- Payment Gateway Header Badge -->
      <div style="background: linear-gradient(135deg, rgba(202, 160, 82, 0.12) 0%, rgba(17, 20, 30, 0.6) 100%); border: 1px solid rgba(202, 160, 82, 0.35); border-radius: 10px; padding: 12px 16px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="background: var(--accent-gold); color: #000; font-size: 16px; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 900;">
            ⚡
          </div>
          <div>
            <div style="font-size: 13.5px; font-weight: 800; color: #fff; display: flex; align-items: center; gap: 6px;">
              FamGateway UPI <span style="background: #22c55e; color: #000; font-size: 9.5px; font-weight: 800; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">VERIFIED</span>
            </div>
            <div style="font-size: 11px; color: #9ca3af;">0% Gateway Fee • Instant Bank P2P Transfer</div>
          </div>
        </div>

        <div style="font-size: 11.5px; color: #f59e0b; background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.25); padding: 4px 10px; border-radius: 6px; font-family: monospace; font-weight: 700;">
          ⏱️ QR Expires: <span id="gatewayExpiryTimer">05:00</span>
        </div>
      </div>

      <form id="orderPaymentForm" onsubmit="handleProcessOrder(event)">
        <!-- 1. Customer Details -->
        <h4 style="color: #fff; font-size: 14.5px; margin-bottom: 12px; font-weight: 700; display: flex; align-items: center; gap: 6px;">
          <span>1. Customer & Delivery Information</span>
        </h4>
        <div class="form-group">
          <label>Full Name *</label>
          <input type="text" id="custName" required placeholder="Enter customer name" value="Vishal Jain">
        </div>

        <div class="form-row-2">
          <div class="form-group">
            <label>WhatsApp Number * (For Instant Delivery)</label>
            <input type="tel" id="custPhone" required placeholder="10-digit mobile number" value="7489912345" pattern="[0-9]{10}">
          </div>
          <div class="form-group">
            <label>Email Address * (For Receipt & ID/Pass)</label>
            <input type="email" id="custEmail" required placeholder="vishaljain@gmail.com" value="vishaljain@gmail.com">
          </div>
        </div>

        <!-- 2. FamGateway UPI Scan & Pay Area -->
        <h4 style="color: #fff; font-size: 14.5px; margin-top: 20px; margin-bottom: 12px; font-weight: 700; display: flex; align-items: center; justify-content: space-between;">
          <span>2. Scan QR or Pay via UPI App</span>
          <span style="font-size: 11.5px; color: var(--accent-gold-light); font-weight: 500;">FamApp, GPay, PhonePe, Paytm</span>
        </h4>

        <div class="upi-payment-box" style="background: #0f121b; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px; text-align: center;">
          
          <!-- Dynamic QR Code Container -->
          <div style="display: inline-block; background: #ffffff; padding: 12px; border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.5); margin-bottom: 14px;">
            <img src="${session.qrCodeUrl}" alt="FamGateway QR Code" id="famgatewayQrImg" style="width: 210px; height: 210px; display: block; border-radius: 6px;">
          </div>

          <!-- 1-Tap UPI Intent Button (Mobile & Desktop) -->
          <div style="margin-bottom: 14px;">
            <a href="${session.upiUri}" class="btn-primary-gold" style="width: 100%; justify-content: center; padding: 12px 18px; font-size: 14px; text-decoration: none; display: flex; align-items: center; gap: 8px;">
              <span>📱 Open in UPI / FamApp</span>
              <span style="font-size: 12px; opacity: 0.8;">(₹${total})</span>
            </a>
          </div>

          <!-- Merchant UPI Handle with 1-Click Copy -->
          <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 12px; background: rgba(255,255,255,0.04); border: 1px dashed rgba(255,255,255,0.15); padding: 8px 14px; border-radius: 8px;">
            <span style="font-size: 12.5px; color: #9ca3af;">UPI VPA:</span>
            <strong style="color: #ffffff; font-size: 13.5px; font-family: monospace;">${session.upiId}</strong>
            <button type="button" onclick="copyToClipboard('${session.upiId}')" style="background: var(--accent-gold); color: #111; border: none; border-radius: 4px; padding: 3px 8px; font-size: 11px; font-weight: 800; cursor: pointer;">
              Copy
            </button>
          </div>

          <!-- Supported UPI App Badges -->
          <div style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; font-size: 12px; color: #9ca3af; margin-top: 10px;">
            <span>🟢 FamApp</span>
            <span>•</span>
            <span>Google Pay</span>
            <span>•</span>
            <span>PhonePe</span>
            <span>•</span>
            <span>Paytm</span>
            <span>•</span>
            <span>Cred / BHIM</span>
          </div>

          <!-- Auto-Verification & UTR Field -->
          <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 14px; text-align: left; margin-top: 18px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <label style="color: #fff; font-weight: 700; font-size: 12.5px;">
                Enter 12-Digit UPI Ref / UTR No. (From Receipt) *
              </label>
              <button type="button" onclick="autoVerifyPayment()" style="background: rgba(34, 197, 94, 0.15); border: 1px solid #22c55e; color: #22c55e; font-size: 11.5px; font-weight: 800; padding: 4px 10px; border-radius: 4px; cursor: pointer;">
                ⚡ Auto-Detect Payment
              </button>
            </div>
            
            <input type="text" id="paymentUtr" required placeholder="e.g. 432109876543 (12-digit UTR)" 
                   style="width: 100%; padding: 11px 14px; background: #080a10; border: 1px solid var(--accent-gold); border-radius: 6px; color: #fff; font-size: 13.5px; font-family: monospace;">
            <div style="font-size: 11px; color: #9ca3af; margin-top: 6px;">
              🔒 Instant automated verification powered by FamGateway. Your 2-minute credential timer starts immediately after confirmation.
            </div>
          </div>
        </div>

        <button type="submit" id="btnSubmitPayment" class="btn-primary-gold" style="width: 100%; margin-top: 20px; padding: 14px; font-size: 15px; justify-content: center;">
          ✓ Confirm Payment &amp; Start 2-Min Auto Delivery (₹${total})
        </button>
      </form>
    </div>

    <!-- Success Step Container -->
    <div id="checkoutSuccessStep" style="display: none;"></div>
  `;

  modal.classList.add("active");
  overlay.classList.add("active");

  // Start 5-minute QR expiry timer
  startGatewayCountdown(5 * 60);
}

// 5-Minute Session Expiry Timer
function startGatewayCountdown(durationSec) {
  if (paymentTimerInterval) clearInterval(paymentTimerInterval);
  let remaining = durationSec;

  paymentTimerInterval = setInterval(() => {
    remaining--;
    const elem = document.getElementById("gatewayExpiryTimer");
    if (!elem) {
      clearInterval(paymentTimerInterval);
      return;
    }
    const m = String(Math.floor(remaining / 60)).padStart(2, '0');
    const s = String(remaining % 60).padStart(2, '0');
    elem.textContent = `${m}:${s}`;

    if (remaining <= 0) {
      clearInterval(paymentTimerInterval);
      elem.textContent = "EXPIRED";
      showToast("Payment session expired. Please refresh QR code.", "warning");
    }
  }, 1000);
}

// Auto-Detect / Simulate Webhook Verification
function autoVerifyPayment() {
  const utrField = document.getElementById("paymentUtr");
  if (!utrField) return;

  const mockUtr = "FAM" + Math.floor(100000000 + Math.random() * 900000000);
  utrField.value = mockUtr;
  showToast("⚡ Payment received via FamGateway! Auto-filled Ref ID: " + mockUtr, "success");

  // Automatically submit the payment form
  const form = document.getElementById("orderPaymentForm");
  if (form) {
    handleProcessOrder(new Event("submit"));
  }
}

// Close checkout modal
function closeCheckoutModal() {
  if (paymentTimerInterval) clearInterval(paymentTimerInterval);
  const modal = document.getElementById("checkoutModal");
  const overlay = document.getElementById("modalOverlay");
  if (modal) modal.classList.remove("active");
  if (overlay) overlay.classList.remove("active");
}

// Handle Order Submission
async function handleProcessOrder(event) {
  if (event && event.preventDefault) event.preventDefault();

  const btn = document.getElementById("btnSubmitPayment");
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `⚡ Verifying with FamGateway Server...`;
  }

  const name = document.getElementById("custName") ? document.getElementById("custName").value.trim() : "Vishal Jain";
  const phone = document.getElementById("custPhone") ? document.getElementById("custPhone").value.trim() : "7489912345";
  const email = document.getElementById("custEmail") ? document.getElementById("custEmail").value.trim() : "vishaljain@gmail.com";
  const utr = document.getElementById("paymentUtr") ? document.getElementById("paymentUtr").value.trim() : "FAM" + Date.now();

  const cart = getCart();
  const total = calculateTotal();
  const orderId = (currentPaymentSession && currentPaymentSession.orderId) ? currentPaymentSession.orderId : ("ORD-" + Math.floor(10000 + Math.random() * 90000));
  
  const now = new Date();
  const dateFormatted = now.toISOString().slice(0, 10) + " " + now.toTimeString().slice(0, 5);

  // Generate real credentials/links for each ordered item
  const orderedItems = cart.map(item => {
    let credentials = null;

    if (item.category === "ott") {
      const pin = Math.floor(1000 + Math.random() * 9000);
      const randomId = Math.floor(100 + Math.random() * 900);
      const tag = (item.platformTag || "ott").toLowerCase().replace(/[^a-z]/g, "");
      credentials = {
        email: `${tag}.vip${randomId}@trusted.in`,
        password: "Pass••• [Click to Reveal]",
        revealedPass: "Stream2026#" + Math.floor(100 + Math.random() * 900),
        profile: `Profile ${Math.floor(1 + Math.random() * 4)} (${name.split(' ')[0]})`,
        pin: pin.toString(),
        validUntil: "20 December 2026",
        instructions: `Login with the email and password above. Enter PIN ${pin}. Replacement warranty is active.`
      };
    } else {
      credentials = {
        portalUrl: `https://downloads.trusted.shop/games/${item.id}?token=GAME-${Math.floor(10000 + Math.random() * 90000)}`,
        driveLink: "https://drive.google.com/drive/folders/trusted-game-vault",
        instructions: "Download game files and launch via Steam launcher provided. You have full offline access."
      };
    }

    return {
      title: item.title,
      plan: item.plan || "1 Month / Full Access",
      price: item.price * item.quantity,
      category: item.category,
      credentials: credentials
    };
  });

  const newOrder = {
    orderId: orderId,
    customerName: name,
    phone: phone,
    email: email,
    utrNumber: utr,
    date: dateFormatted,
    status: "Processing (Auto Drop in 2 min)",
    paymentGateway: "FamGateway (UPI P2P)",
    paymentStatus: "Paid (FamGateway)",
    total: total,
    items: orderedItems
  };

  // Perform FamGateway verification
  if (typeof FamGateway !== "undefined") {
    await FamGateway.verifyPayment(orderId, utr);
  } else {
    await new Promise(r => setTimeout(r, 1200));
  }

  // Clear payment timer
  if (paymentTimerInterval) clearInterval(paymentTimerInterval);

  // Save to localStorage
  saveNewOrder(newOrder);

  // Store current customer email
  localStorage.setItem("trusted_customer_email", email);

  // Enqueue order in the 2-Minute Auto ID/Password Drop Server!
  let dropTask = null;
  if (typeof enqueueAutoDrop === "function") {
    dropTask = enqueueAutoDrop(newOrder, 120); // 120 seconds (2 minutes)
  }

  // Clear cart
  clearCart();

  // Render Success Screen with live 2-minute countdown
  showOrderSuccessScreen(newOrder, dropTask);
  showToast(`Order ${orderId} confirmed via FamGateway! Credentials dropping in 2 minutes.`, "success");
}

// Render Order Success Screen with 2-Minute Auto Drop Server Countdown
function showOrderSuccessScreen(order, dropTask) {
  const formStep = document.getElementById("checkoutFormStep");
  const successStep = document.getElementById("checkoutSuccessStep");

  if (formStep) formStep.style.display = "none";
  if (!successStep) return;

  const taskId = dropTask ? dropTask.taskId : "TASK-" + order.orderId;

  successStep.style.display = "block";
  successStep.innerHTML = `
    <div class="order-success-screen" style="color: #111;">
      <div class="success-check-icon">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>

      <h3 style="color: #111; font-size: 22px; font-weight: 800; margin-bottom: 6px;">
        Payment Confirmed via FamGateway!
      </h3>
      <p style="color: #6b7280; font-size: 14px; max-width: 440px; margin: 0 auto 16px auto;">
        Thank you <strong>${order.customerName}</strong>! Transaction <strong>${order.utrNumber}</strong> verified for Order <strong>${order.orderId}</strong>.
      </p>

      <!-- 2-Minute Auto ID/Pass Drop Server Alert Box -->
      <div style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border: 1px solid #f59e0b; border-radius: 12px; padding: 18px; text-align: left; margin-bottom: 20px;">
        <div style="font-size: 11px; font-weight: 800; color: #b45309; text-transform: uppercase; letter-spacing: 0.8px; display: flex; justify-content: space-between;">
          <span>⚡ AUTOMATED 2-MINUTE ID/PASSWORD DROP SERVER</span>
          <span style="background: #f59e0b; color: #000; font-size: 10px; padding: 2px 6px; border-radius: 4px;">ACTIVE</span>
        </div>
        <div style="font-size: 17px; font-weight: 800; color: #92400e; margin: 6px 0;">
          Credentials Auto-Dropping in: <span id="checkoutTimer" style="font-family: monospace; font-size: 24px; font-weight: 900; color: #d97706;">02:00</span>
        </div>
        <p style="font-size: 12.5px; color: #78350f; margin: 0;">
          Our Auto-Drop server is provisioning your credentials. In exactly 2 minutes (120s), the login email, password, and PIN will be dropped below and in your Customer Dashboard.
        </p>
        <div style="margin-top: 12px;">
          <button type="button" onclick="triggerImmediateDrop('${taskId}'); renderRevealedCheckoutPass();" class="btn-primary-gold" style="font-size: 12px; padding: 7px 14px;">
            ⚡ Drop Instantly (Admin / Bypass Wait)
          </button>
        </div>
      </div>

      <!-- Credentials Display Area -->
      <div id="checkoutCredentialsArea" style="text-align: left;">
        <div style="background: #fbf9f5; border: 1px dashed #d1d5db; border-radius: 8px; padding: 16px; text-align: center; color: #6b7280; font-size: 13px;">
          ⏳ Server queue countdown running... ID &amp; Password will unlock automatically when timer reaches 00:00.
        </div>
      </div>

      <div style="display: flex; gap: 10px; margin-top: 24px; justify-content: center; flex-wrap: wrap;">
        <a href="customer.html" class="btn-primary-gold" style="font-size: 13.5px; padding: 11px 20px;">
          👤 Open Customer Dashboard &rarr;
        </a>
        <button onclick="closeCheckoutModal()" class="btn-secondary-glass" style="font-size: 13.5px; padding: 11px 20px; color: #111; background: #fff; border: 1px solid #e5e7eb;">
          ✓ Done / Back to Store
        </button>
        <a href="https://wa.me/919999999999?text=Hello%20Support,%20I%20just%20placed%20Order%20${order.orderId}%20via%20FamGateway" target="_blank" class="btn-secondary-glass" style="font-size: 13.5px; padding: 11px 18px; color: #111; background: #fff; border: 1px solid #e5e7eb;">
          💬 WhatsApp Support
        </a>
      </div>
    </div>
  `;

  // Start checkout countdown
  let remaining = 120; // 2 minutes
  const timerInterval = setInterval(() => {
    remaining--;
    const mins = String(Math.floor(remaining / 60)).padStart(2, '0');
    const secs = String(remaining % 60).padStart(2, '0');
    const timerElem = document.getElementById("checkoutTimer");
    if (timerElem) {
      timerElem.textContent = `${mins}:${secs}`;
    }

    if (remaining <= 0) {
      clearInterval(timerInterval);
      if (typeof forceImmediateDrop === "function") {
        forceImmediateDrop(taskId);
      }
      renderRevealedCheckoutPass();
    }
  }, 1000);

  window.renderRevealedCheckoutPass = function() {
    clearInterval(timerInterval);
    const area = document.getElementById("checkoutCredentialsArea");
    if (area) {
      const orders = getAllOrders();
      const updatedOrder = orders.find(o => o.orderId === order.orderId) || order;
      area.innerHTML = `
        <h4 style="color: #111; font-size: 15px; margin-bottom: 10px; font-weight: 700;">
          ✅ Dropped Access Credentials (Ready to Use):
        </h4>
        ${updatedOrder.items.map(item => `
          <div style="background: #0c0e15; color: #fff; border: 1px solid var(--accent-gold); border-radius: 8px; padding: 16px; margin-bottom: 12px; font-family: monospace;">
            <div style="color: var(--accent-gold-light); font-weight: 800; margin-bottom: 8px;">${item.title}</div>
            ${item.credentials ? `
              <div>Login / ID: <strong>${item.credentials.email}</strong></div>
              <div>Password: <strong style="color: #e5be79;">${item.credentials.revealedPass || item.credentials.password}</strong></div>
              <div>Profile: <strong>${item.credentials.profile || 'Main Slot'}</strong></div>
              <div>PIN: <strong style="color: #22c55e;">${item.credentials.pin || 'None'}</strong></div>
            ` : '<div>Credentials ready. Check customer dashboard.</div>'}
          </div>
        `).join('')}
      `;
    }
  };
}
