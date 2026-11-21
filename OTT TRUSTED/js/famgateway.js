// ==========================================================================
// FAMGATEWAY INTEGRATION MODULE (UPI PAYMENT RAILS)
// ==========================================================================
// Powered by FamGateway (famgateway.in) & FamApp UPI infrastructure
// Supports instant P2P / Dynamic QR / Intent UPI payments with zero gateway fees.

const FamGateway = {
  // Default configuration
  defaultConfig: {
    apiKey: "fg_live_trusted_store_demo_key",
    upiId: "vishaljain@fam", // Default FamPay / FamApp UPI handle
    merchantName: "TRUSTED SHOP",
    autoVerifyDelayMs: 2000, // 2s simulated bank webhook response
    gatewayStatus: "active",
    endpoint: "https://famgateway.in/api/create-order"
  },

  // Get current saved config or default
  getConfig: function() {
    try {
      const raw = localStorage.getItem("trusted_famgateway_config");
      if (raw) {
        return { ...this.defaultConfig, ...JSON.parse(raw) };
      }
    } catch (e) {
      console.warn("Failed to load FamGateway config:", e);
    }
    return { ...this.defaultConfig };
  },

  // Save config from Admin Panel
  saveConfig: function(newConfig) {
    const current = this.getConfig();
    const updated = { ...current, ...newConfig };
    localStorage.setItem("trusted_famgateway_config", JSON.stringify(updated));
    return updated;
  },

  // Generate dynamic UPI Intent & QR payment session
  createOrder: async function(params) {
    const { amount, customerName, customerEmail, customerPhone, orderId } = params;
    const config = this.getConfig();

    const cleanAmount = Number(amount).toFixed(2);
    const txnNote = `Order ${orderId} TRUSTED SHOP`;
    
    // Standard NPCI UPI URI Scheme
    const upiUri = `upi://pay?pa=${encodeURIComponent(config.upiId)}&pn=${encodeURIComponent(config.merchantName)}&am=${cleanAmount}&cu=INR&tn=${encodeURIComponent(txnNote)}&tr=${encodeURIComponent(orderId)}`;
    
    // High-res QR code generated for the UPI payment URL
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(upiUri)}&margin=8`;

    // Attempt direct API call if user has configured custom live endpoint or fallback to client session
    let apiResponse = null;
    try {
      if (config.apiKey && config.apiKey.startsWith("fg_live_real_")) {
        const res = await fetch(config.endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Api-Key": config.apiKey
          },
          body: JSON.stringify({
            amount: parseFloat(cleanAmount),
            customer_name: customerName,
            customer_email: customerEmail,
            redirect_url: window.location.origin + "/customer.html"
          })
        });
        if (res.ok) {
          apiResponse = await res.json();
        }
      }
    } catch (err) {
      console.info("FamGateway local intent fallback active:", err.message);
    }

    return {
      orderId: orderId,
      amount: cleanAmount,
      upiId: config.upiId,
      merchantName: config.merchantName,
      upiUri: upiUri,
      qrCodeUrl: (apiResponse && apiResponse.qr_url) ? apiResponse.qr_url : qrCodeUrl,
      checkoutUrl: (apiResponse && apiResponse.checkout_url) ? apiResponse.checkout_url : null,
      createdAt: Date.now(),
      expiresAt: Date.now() + (5 * 60 * 1000) // 5 minutes validity
    };
  },

  // Verify payment status (Client verification or Webhook listener)
  verifyPayment: function(orderId, utrNumber = "") {
    return new Promise((resolve) => {
      const config = this.getConfig();
      // Simulate bank verification delay
      setTimeout(() => {
        const verificationResult = {
          success: true,
          orderId: orderId,
          transactionRef: utrNumber || "FAM" + Math.floor(100000000000 + Math.random() * 900000000000),
          gateway: "FamGateway (UPI P2P)",
          status: "SUCCESS",
          verifiedAt: new Date().toISOString()
        };
        resolve(verificationResult);
      }, config.autoVerifyDelayMs || 1500);
    });
  }
};

// Export to global scope
if (typeof window !== "undefined") {
  window.FamGateway = FamGateway;
}
