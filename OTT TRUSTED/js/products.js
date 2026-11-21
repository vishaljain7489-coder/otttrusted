// ==========================================================================
// TRUSTED.SHOP - MASTER DIGITAL PRODUCTS CATALOG
// Extracted and replicated directly from reference video & store layout
// ==========================================================================

const OTT_PRODUCTS = [
  {
    id: "netflix-private",
    category: "ott",
    title: "Netflix Private",
    tagline: "Netflix 4K Ultra HD with a private profile, personal 4-digit PIN.",
    platformTag: "NETFLIX",
    badge: "1 Month",
    price: 200,
    mrp: 649,
    discount: "69% OFF",
    type: "Private Profile",
    image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&auto=format&fit=crop&q=80",
    gradient: "#ffffff",
    logoText: "NETFLIX",
    logoColor: "#e50914",
    plans: [
      { id: "1m", label: "1 Month", price: 200, mrp: 649 },
      { id: "3m", label: "3 Months", price: 549, mrp: 1947 },
      { id: "6m", label: "6 Months", price: 999, mrp: 3894 },
      { id: "12m", label: "1 Year", price: 1799, mrp: 7788 }
    ],
    features: ["Private Profile + PIN", "4K Ultra HD Streaming", "All Devices Supported", "Full Replacement Warranty"]
  },
  {
    id: "netflix-shared",
    category: "ott",
    title: "Netflix Shared",
    tagline: "Netflix 4K UHD shared account with instant access and warranty.",
    platformTag: "NETFLIX",
    badge: "1 Month",
    price: 150,
    mrp: 499,
    discount: "70% OFF",
    type: "Shared Profile",
    image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=500&auto=format&fit=crop&q=80",
    gradient: "#000000",
    logoText: "N",
    logoColor: "#e50914",
    plans: [
      { id: "1m", label: "1 Month", price: 150, mrp: 499 },
      { id: "3m", label: "3 Months", price: 399, mrp: 1499 }
    ],
    features: ["Shared Profile", "Full HD / 4K playback", "Instant delivery", "Active warranty"]
  },
  {
    id: "jiohotstar-super",
    category: "ott",
    title: "JIO Hotstar Super",
    tagline: "JioHotstar Super Private Plan with 1080p Full HD playback.",
    platformTag: "HOTSTAR",
    badge: "1 Month",
    price: 60,
    mrp: 149,
    discount: "60% OFF",
    type: "Super Plan",
    image: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=500&auto=format&fit=crop&q=80",
    gradient: "linear-gradient(135deg, #113ccf 0%, #081a5c 100%)",
    logoText: "JioHotstar",
    logoColor: "#ffffff",
    plans: [
      { id: "1m", label: "1 Month", price: 60, mrp: 149 },
      { id: "3m", label: "3 Months", price: 150, mrp: 449 }
    ],
    features: ["Live Cricket & IPL", "Disney & Marvel Movies", "1080p Full HD", "Direct Login Activation"]
  },
  {
    id: "jiohotstar-premium",
    category: "ott",
    title: "JIO Hotstar Premium",
    tagline: "JioHotstar Premium Private Plan with 4K UHD and zero ads.",
    platformTag: "HOTSTAR",
    badge: "1 Month",
    price: 100,
    mrp: 299,
    discount: "66% OFF",
    type: "Premium Plan",
    image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=500&auto=format&fit=crop&q=80",
    gradient: "linear-gradient(135deg, #3b82f6 0%, #e11d48 100%)",
    logoText: "JioHotstar",
    logoColor: "#ffffff",
    plans: [
      { id: "1m", label: "1 Month", price: 100, mrp: 299 },
      { id: "3m", label: "3 Months", price: 270, mrp: 899 },
      { id: "12m", label: "1 Year", price: 799, mrp: 1499 }
    ],
    features: ["4K Ultra HD + Dolby Atmos", "Ad-Free Streaming", "Live Sports All Matches", "Instant Access"]
  },
  {
    id: "prime-shared",
    category: "ott",
    title: "Prime Video Shared",
    tagline: "Enjoy Prime Video 4K Ultra HD streaming with full warranty.",
    platformTag: "PRIME",
    badge: "1 Month",
    price: 50,
    mrp: 149,
    discount: "66% OFF",
    type: "Shared Profile",
    image: "https://images.unsplash.com/photo-1518173946687-a4c8a383392e?w=500&auto=format&fit=crop&q=80",
    gradient: "linear-gradient(135deg, #00a8e1 0%, #007399 100%)",
    logoText: "prime video",
    logoColor: "#ffffff",
    plans: [
      { id: "1m", label: "1 Month", price: 50, mrp: 149 },
      { id: "3m", label: "3 Months", price: 120, mrp: 449 }
    ],
    features: ["4K Ultra HD playback", "All Amazon Originals", "Multi-language audio", "Instant delivery"]
  },
  {
    id: "prime-personal",
    category: "ott",
    title: "Prime Video Personal",
    tagline: "Prime Video 4K Ultra HD with a private screen & Prime Music.",
    platformTag: "PRIME",
    badge: "6 Months",
    price: 250,
    mrp: 799,
    discount: "68% OFF",
    type: "Personal Screen",
    image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=500&auto=format&fit=crop&q=80",
    gradient: "linear-gradient(135deg, #00a8e1 0%, #005a78 100%)",
    logoText: "prime video",
    logoColor: "#ffffff",
    plans: [
      { id: "1m", label: "1 Month", price: 90, mrp: 299 },
      { id: "6m", label: "6 Months", price: 250, mrp: 799 },
      { id: "12m", label: "1 Year", price: 449, mrp: 1499 }
    ],
    features: ["Private Personal Screen", "Prime Music included", "TV & Mobile login", "Full period warranty"]
  },
  {
    id: "youtube-premium",
    category: "ott",
    title: "YouTube Premium",
    tagline: "YouTube Premium Private Plan with ad-free videos & background play.",
    platformTag: "YOUTUBE",
    badge: "4 Plans",
    price: 70,
    mrp: 149,
    discount: "53% OFF",
    type: "On Your Email",
    image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=500&auto=format&fit=crop&q=80",
    gradient: "#ffffff",
    logoText: "▶ Premium",
    logoColor: "#111111",
    plans: [
      { id: "1m", label: "1 Month", price: 70, mrp: 149 },
      { id: "3m", label: "3 Months", price: 180, mrp: 399 },
      { id: "6m", label: "6 Months", price: 320, mrp: 799 },
      { id: "12m", label: "1 Year", price: 549, mrp: 1490 }
    ],
    features: ["Activated on YOUR OWN Gmail", "Zero ads on all devices", "YouTube Music Premium", "Background Play"]
  },
  {
    id: "sonyliv-private",
    category: "ott",
    title: "Sony LIV Private",
    tagline: "Sony LIV Premium Private Plan with live sports and TV shows.",
    platformTag: "SONY LIV",
    badge: "12 Months / 1 Year",
    price: 300,
    mrp: 999,
    discount: "70% OFF",
    type: "Private Profile",
    image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=500&auto=format&fit=crop&q=80",
    gradient: "linear-gradient(135deg, #18002e 0%, #ff5e00 100%)",
    logoText: "SONY liv",
    logoColor: "#ffffff",
    plans: [
      { id: "6m", label: "6 Months", price: 180, mrp: 699 },
      { id: "12m", label: "1 Year", price: 300, mrp: 999 }
    ],
    features: ["Live UEFA & WWE Champions", "Shark Tank India & Originals", "1080p Full HD", "Official warranty"]
  },
  {
    id: "zee5-premium",
    category: "ott",
    title: "ZEE 5 Premium",
    tagline: "ZEE5 Premium Private Plan with 1080p full regional content.",
    platformTag: "ZEE5",
    badge: "12 Months / 1 Year",
    price: 250,
    mrp: 899,
    discount: "72% OFF",
    type: "Private Profile",
    image: "https://images.unsplash.com/photo-1518173946687-a4c8a383392e?w=500&auto=format&fit=crop&q=80",
    gradient: "#0a0a0c",
    logoText: "Z5",
    logoColor: "#f59e0b",
    plans: [
      { id: "6m", label: "6 Months", price: 150, mrp: 599 },
      { id: "12m", label: "1 Year", price: 250, mrp: 899 }
    ],
    features: ["2800+ Bollywood & Regional Movies", "Ad-Free Streaming", "2 Devices Simultaneous", "Instant Delivery"]
  }
];

const GAMING_PRODUCTS = [
  {
    id: "game-spiderman2",
    category: "gaming",
    title: "Marvel's Spider-Man 2",
    tagline: "Full PC game with offline story mode and high FPS unlock.",
    platformTag: "STEAM",
    badge: "Full Game",
    price: 200,
    mrp: 3999,
    discount: "95% OFF",
    platform: "Steam",
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&auto=format&fit=crop&q=80",
    plans: [{ id: "full", label: "Full Game", price: 200, mrp: 3999 }]
  },
  {
    id: "game-re-requiem",
    category: "gaming",
    title: "Resident Evil Requiem",
    tagline: "Survival horror masterpiece with all DLC chapters included.",
    platformTag: "STEAM",
    badge: "Full Game",
    price: 200,
    mrp: 3499,
    discount: "94% OFF",
    platform: "Steam",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80",
    plans: [{ id: "full", label: "Full Game", price: 200, mrp: 3499 }]
  },
  {
    id: "game-cyberpunk",
    category: "gaming",
    title: "Cyberpunk 2077: Ultimate Edition",
    tagline: "Includes Phantom Liberty expansion and Ray Tracing Overdrive.",
    platformTag: "STEAM",
    badge: "Full Game",
    price: 200,
    mrp: 4499,
    discount: "95% OFF",
    platform: "Steam",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80",
    plans: [{ id: "full", label: "Full Game", price: 200, mrp: 4499 }]
  },
  {
    id: "game-007",
    category: "gaming",
    title: "007 First Light",
    tagline: "Tactical espionage action adventure with full campaign.",
    platformTag: "STEAM",
    badge: "Full Game",
    price: 200,
    mrp: 2999,
    discount: "93% OFF",
    platform: "Steam",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=80",
    plans: [{ id: "full", label: "Full Game", price: 200, mrp: 2999 }]
  },
  {
    id: "game-wukong",
    category: "gaming",
    title: "Black Myth: Wukong",
    tagline: "Action RPG rooted in Chinese mythology. Full PC edition.",
    platformTag: "STEAM",
    badge: "Full Game",
    price: 200,
    mrp: 3599,
    discount: "94% OFF",
    platform: "Steam",
    image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=500&auto=format&fit=crop&q=80",
    plans: [{ id: "full", label: "Full Game", price: 200, mrp: 3599 }]
  },
  {
    id: "game-ac-shadows",
    category: "gaming",
    title: "Assassin's Creed Shadows",
    tagline: "Feudal Japan open world dual-protagonist samurai adventure.",
    platformTag: "STEAM",
    badge: "Full Game",
    price: 200,
    mrp: 4999,
    discount: "96% OFF",
    platform: "Steam",
    image: "https://images.unsplash.com/photo-1563089145-599997674d42?w=500&auto=format&fit=crop&q=80",
    plans: [{ id: "full", label: "Full Game", price: 200, mrp: 4999 }]
  },
  {
    id: "game-re-village",
    category: "gaming",
    title: "Resident Evil Village",
    tagline: "Experience survival horror like never before in 4K HDR.",
    platformTag: "STEAM",
    badge: "Full Game",
    price: 200,
    mrp: 2999,
    discount: "93% OFF",
    platform: "Steam",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&auto=format&fit=crop&q=80",
    plans: [{ id: "full", label: "Full Game", price: 200, mrp: 2999 }]
  },
  {
    id: "game-pragmata",
    category: "gaming",
    title: "Pragmata",
    tagline: "Dystopian sci-fi lunar adventure game by Capcom.",
    platformTag: "STEAM",
    badge: "Full Game",
    price: 200,
    mrp: 3999,
    discount: "95% OFF",
    platform: "Steam",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80",
    plans: [{ id: "full", label: "Full Game", price: 200, mrp: 3999 }]
  },
  {
    id: "game-godofwar",
    category: "gaming",
    title: "God of War Ragnarök",
    tagline: "Kratos & Atreus Norse saga journey. 60 FPS unlocked.",
    platformTag: "STEAM",
    badge: "Full Game",
    price: 200,
    mrp: 3999,
    discount: "95% OFF",
    platform: "Steam",
    image: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=500&auto=format&fit=crop&q=80",
    plans: [{ id: "full", label: "Full Game", price: 200, mrp: 3999 }]
  },
  {
    id: "game-lastofus2",
    category: "gaming",
    title: "The Last of Us Part II Remastered",
    tagline: "Emotional gripping journey with No Return rogue-like mode.",
    platformTag: "STEAM",
    badge: "Full Game",
    price: 200,
    mrp: 4499,
    discount: "95% OFF",
    platform: "Steam",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80",
    plans: [{ id: "full", label: "Full Game", price: 200, mrp: 4499 }]
  },
  {
    id: "game-dmc5",
    category: "gaming",
    title: "Devil May Cry 5",
    tagline: "Fast paced stylish action combat with Dante, Nero & V.",
    platformTag: "STEAM",
    badge: "Full Game",
    price: 200,
    mrp: 1999,
    discount: "90% OFF",
    platform: "Steam",
    image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80",
    plans: [{ id: "full", label: "Full Game", price: 200, mrp: 1999 }]
  },
  {
    id: "game-hogwarts",
    category: "gaming",
    title: "Hogwarts Legacy",
    tagline: "Immersive open world Harry Potter RPG set in 1800s Hogwarts.",
    platformTag: "STEAM",
    badge: "Full Game",
    price: 200,
    mrp: 3999,
    discount: "95% OFF",
    platform: "Steam",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80",
    plans: [{ id: "full", label: "Full Game", price: 200, mrp: 3999 }]
  },
  {
    id: "game-wwe2k25",
    category: "gaming",
    title: "WWE 2K25",
    tagline: "The biggest roster in WWE history with 40 Years of WrestleMania.",
    platformTag: "STEAM",
    badge: "Full Game",
    price: 200,
    mrp: 4499,
    discount: "95% OFF",
    platform: "Steam",
    image: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=500&auto=format&fit=crop&q=80",
    plans: [{ id: "full", label: "Full Game", price: 200, mrp: 4499 }]
  }
];

// Combine all catalog products
const ALL_CATALOG_PRODUCTS = [...OTT_PRODUCTS, ...GAMING_PRODUCTS];

// Support Topics
const SUPPORT_TOPICS = [
  { id: "order", icon: "📋", title: "Order Issues", desc: "Problems with your order, missing items, or incorrect products.", actionText: "Create Ticket" },
  { id: "delivery", icon: "⚡", title: "Delivery Issues", desc: "Did not receive credentials, activation failed, or access problems.", actionText: "Get Help" },
  { id: "payment", icon: "💳", title: "Payment Issues", desc: "Payment failed, double charge, or refund request.", actionText: "Get Help" },
  { id: "account", icon: "👤", title: "Account Issues", desc: "Login problems, profile updates, or account security.", actionText: "Get Help" }
];

// FAQs matching video
const FAQS_DATA = [
  {
    q: "What are shared and private OTT profiles?",
    a: "A private profile gives you your own exclusive screen with a personal 4-digit PIN where only you watch and save watch history. A shared profile is a cost-effective account shared with verified users where each person has an assigned slot."
  },
  {
    q: "How quickly will I receive my product?",
    a: "Deliveries are 100% automated! As soon as payment is confirmed via UPI, your login email, password, and profile PIN (or direct download links) are displayed on your screen instantly and also sent to your WhatsApp and Email within 60 seconds."
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all Indian UPI payment apps including Google Pay, PhonePe, Paytm, Cred, and BHIM, as well as direct UPI transfers."
  },
  {
    q: "What is your refund policy?",
    a: "We provide a 100% replacement warranty across the entire duration of your plan. If your subscription ever faces downtime or credentials issues, our support team replaces it immediately or provides a prorated refund."
  },
  {
    q: "Can I renew my subscription before it expires?",
    a: "Yes! You can renew your subscription on the same account/profile without losing your watchlist, playlists, or progress."
  }
];

// Pre-seeded Demo Orders for Customer Lookup
const INITIAL_ORDERS = [
  {
    orderId: "ORD-94821",
    customerName: "Rahul Sharma",
    phone: "9876543210",
    email: "rahul.sharma@example.com",
    date: "2026-11-20 18:42",
    status: "Delivered",
    paymentStatus: "Paid (UPI)",
    total: 200,
    items: [
      {
        title: "Netflix Private",
        plan: "1 Month",
        price: 200,
        category: "ott",
        credentials: {
          email: "netflix.vip482@trusted.in",
          password: "Pass••• [Click to Reveal]",
          revealedPass: "Cinema2026#Vip",
          profile: "Profile 3 (Rahul)",
          pin: "7492",
          validUntil: "20 December 2026",
          instructions: "Login on netflix.com or app. Select Profile 3 and enter PIN 7492. Do not change profile name."
        }
      }
    ]
  },
  {
    orderId: "ORD-83190",
    customerName: "Aman Verma",
    phone: "9123456780",
    email: "aman.verma@example.com",
    date: "2026-11-21 10:15",
    status: "Delivered",
    paymentStatus: "Paid (UPI)",
    total: 200,
    items: [
      {
        title: "Marvel's Spider-Man 2",
        plan: "Full Game",
        price: 200,
        category: "gaming",
        credentials: {
          portalUrl: "https://downloads.trusted.shop/games/spiderman2?token=ST-98213",
          driveLink: "https://drive.google.com/drive/folders/trusted-game-vault",
          assetPackSize: "85 GB High-Speed Steam",
          instructions: "Download game files and launch via Steam offline launcher provided."
        }
      }
    ]
  }
];
