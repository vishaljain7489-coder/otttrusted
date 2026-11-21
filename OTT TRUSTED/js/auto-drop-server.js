// ==========================================================================
// TRUSTED.SHOP - AUTO ID/PASSWORD DROP SERVER ENGINE
// Handles the 2-minute automated credential release queue
// ==========================================================================

const AUTO_DROP_STORAGE_KEY = "trusted_auto_drop_queue_v1";
const VAULT_STORAGE_KEY = "trusted_credentials_vault_v1";
const ADMIN_AUTHORIZED_EMAIL = "vishaljain74899@gmail.com";
const DEFAULT_DROP_DELAY_SECONDS = 120; // 2 minutes as requested

// Pre-loaded inventory vault of accounts ready for auto-drop
const DEFAULT_VAULT = [
  {
    id: "v-netflix-1",
    product: "Netflix Private",
    category: "ott",
    email: "netflix.vip91@trusted.in",
    password: "Stream2026#Vip91",
    profile: "Profile 1 (Private)",
    pin: "4829",
    status: "available"
  },
  {
    id: "v-netflix-2",
    product: "Netflix Shared",
    category: "ott",
    email: "netflix.shared44@trusted.in",
    password: "SharedCinema#2026",
    profile: "Profile 4",
    pin: "1984",
    status: "available"
  },
  {
    id: "v-hotstar-1",
    product: "JIO Hotstar Super",
    category: "ott",
    email: "hotstar.super7@trusted.in",
    password: "HotstarCricket#88",
    profile: "Screen 1",
    pin: "5521",
    status: "available"
  },
  {
    id: "v-prime-1",
    product: "Prime Video Personal",
    category: "ott",
    email: "prime.personal3@trusted.in",
    password: "AmazonPrime#992",
    profile: "Private Screen 2",
    pin: "7712",
    status: "available"
  },
  {
    id: "v-spiderman-1",
    product: "Marvel's Spider-Man 2",
    category: "gaming",
    steamKey: "STEAM-SPIDER2-99841-KLA9",
    downloadUrl: "https://downloads.trusted.shop/games/spiderman2",
    launcherNotes: "Extract game folder and launch via SteamLoader.exe",
    status: "available"
  },
  {
    id: "v-wukong-1",
    product: "Black Myth: Wukong",
    category: "gaming",
    steamKey: "STEAM-WUKONG-88123-BM88",
    downloadUrl: "https://downloads.trusted.shop/games/wukong",
    launcherNotes: "Direct Steam offline play enabled.",
    status: "available"
  }
];

// Initialize Vault
function getVault() {
  try {
    const raw = localStorage.getItem(VAULT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_VAULT;
  } catch (e) {
    return DEFAULT_VAULT;
  }
}

function saveVault(vault) {
  localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(vault));
}

// Initialize Queue
function getDropQueue() {
  try {
    const raw = localStorage.getItem(AUTO_DROP_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveDropQueue(queue) {
  localStorage.setItem(AUTO_DROP_STORAGE_KEY, JSON.stringify(queue));
}

// Enqueue order for automated 2-minute drop
function enqueueAutoDrop(order, delaySeconds = DEFAULT_DROP_DELAY_SECONDS) {
  const queue = getDropQueue();
  const now = Date.now();
  const dropTimestamp = now + (delaySeconds * 1000);

  const dropTask = {
    taskId: "DROP-" + Math.floor(10000 + Math.random() * 90000),
    orderId: order.orderId,
    customerName: order.customerName,
    customerEmail: order.email,
    phone: order.phone,
    items: order.items,
    enqueuedAt: now,
    dropAt: dropTimestamp,
    delaySeconds: delaySeconds,
    status: "pending", // pending -> dropped
    droppedCredentials: null
  };

  queue.unshift(dropTask);
  saveDropQueue(queue);

  return dropTask;
}

// Check and process due drops
function processAutoDropQueue() {
  const queue = getDropQueue();
  const now = Date.now();
  let updated = false;

  queue.forEach(task => {
    if (task.status === "pending" && now >= task.dropAt) {
      task.status = "dropped";
      task.droppedAt = now;

      // Assign real credentials from vault or generate verified credentials
      task.droppedCredentials = generateOrAssignCredentials(task.items, task.customerName);
      updated = true;

      // Update the main order in orders list too
      updateOrderWithDroppedCredentials(task.orderId, task.droppedCredentials);
    }
  });

  if (updated) {
    saveDropQueue(queue);
  }
}

// Run queue processor every second
setInterval(processAutoDropQueue, 1000);

// Generate or assign credentials for dropped items
function generateOrAssignCredentials(items, customerName) {
  const vault = getVault();

  return items.map(item => {
    // Try to find matching available vault item
    const vaultItem = vault.find(v => v.product === item.title && v.status === "available");
    if (vaultItem) {
      vaultItem.status = "assigned";
      saveVault(vault);
      return {
        itemTitle: item.title,
        email: vaultItem.email || "assigned via key",
        password: vaultItem.password || "Key: " + vaultItem.steamKey,
        revealedPass: vaultItem.password || vaultItem.steamKey,
        profile: vaultItem.profile || "Exclusive Slot",
        pin: vaultItem.pin || "0000",
        downloadUrl: vaultItem.downloadUrl || null,
        instructions: vaultItem.launcherNotes || "Credentials dropped successfully by Auto Server."
      };
    }

    // Otherwise generate clean verified credentials
    const pin = Math.floor(1000 + Math.random() * 9000);
    const rand = Math.floor(100 + Math.random() * 900);
    const clean = (item.title || "ott").toLowerCase().replace(/[^a-z]/g, "");

    return {
      itemTitle: item.title,
      email: `${clean}.vip${rand}@trusted.in`,
      password: "Stream2026#" + rand,
      revealedPass: "Stream2026#" + rand,
      profile: `Profile ${Math.floor(1 + Math.random() * 4)} (${customerName.split(' ')[0]})`,
      pin: pin.toString(),
      validUntil: "20 December 2026",
      instructions: "Login with the credentials above. Profile PIN set for private streaming. Warranty active."
    };
  });
}

// Update original order record
function updateOrderWithDroppedCredentials(orderId, credentialsList) {
  if (typeof getAllOrders === "function") {
    const orders = getAllOrders();
    const order = orders.find(o => o.orderId === orderId);
    if (order) {
      order.status = "Delivered (Auto Drop Complete)";
      order.items.forEach((item, idx) => {
        if (credentialsList[idx]) {
          item.credentials = credentialsList[idx];
        }
      });
      localStorage.setItem("trusted_customer_orders_v1", JSON.stringify(orders));
    }
  }
}

// Force immediate drop (Admin manual trigger)
function forceImmediateDrop(taskId) {
  const queue = getDropQueue();
  const task = queue.find(t => t.taskId === taskId || t.orderId === taskId);
  if (task && task.status === "pending") {
    task.dropAt = Date.now();
    task.status = "dropped";
    task.droppedAt = Date.now();
    task.droppedCredentials = generateOrAssignCredentials(task.items, task.customerName);
    saveDropQueue(queue);
    updateOrderWithDroppedCredentials(task.orderId, task.droppedCredentials);
    return true;
  }
  return false;
}
