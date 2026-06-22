// ==========================================
// 1. CONFIGURATION INTERNATIONALE ET PRESTIGE
// ==========================================
// Simulation d'un point d'accès API pour la Haute Joaillerie (Similaire à FakeStoreAPI mais mouché Or)
const APIS_GOLD_SIMULATION_ENABLED = true; 

// Numéro officiel de la boutique pour la réception des commandes
const WHATSAPP_NUMBER = "22379178766"; 

let totalAmount = 0;
let itemsCount = 0;
let selectedProducts = []; 
let ALL_PRODUCTS_STORE = []; 
let currentCategory = 'TOUT';

// Structure du panier pour optimiser les calculs, l'ajustement des quantités et la suppression
let modernCart = {};

// ==========================================
// 2. FAKE GOLD API - CATALOGUE CONTINENTAL D'EXCEPTION
// ==========================================
// Ce catalogue sert de base de données locale (Fake API) haut de gamme prête pour vos médias.
const LOCAL_PRODUCTS = [
    // --- PARURES COMPLÈTES (✨) ---
    { 
        title: "Parure Royale 'Reine de Saba' - Or Pur 22K", 
        price: 2450000, 
        description: "Splendide ensemble comprenant un collier majestueux, des boucles assorties et un bracelet finement ciselé. Idéal pour les grands mariages africains.", 
        image: "./images/parure1.jpg", // Prêt pour vos images finales
        video: "./videos/parure1.mp4", // Prêt pour vos vidéos finales
        category: "PARURES" 
    },
    { 
        title: "Parure Impériale Mandingue - Or Jaune 21K", 
        price: 1850000, 
        description: "Chef-d'œuvre artisanal rendant hommage à l'élégance traditionnelle africaine. Finitions de haute joaillerie faites main.", 
        image: "./images/parure2.jpg", 
        video: "./videos/parure2.mp4", 
        category: "PARURES" 
    },

    // --- BRACELETS & GOURMETTES (👑) ---
    { 
        title: "Bracelet Torsadé Prestige - Or Rose & Jaune 18K", 
        price: 650000, 
        description: "Bracelet rigide au design contemporain entrelacé. Un éclat sans pareil pour sublimer vos poignets lors des cérémonies.", 
        image: "./images/bracelet1.jpg", 
        video: "./videos/bracelet1.mp4", 
        category: "BRACELETS" 
    },
    { 
        title: "Gourmette Souple 'Étoile d'Afrique' - Or 21K", 
        price: 820000, 
        description: "Maillons massifs polis à la perfection avec fermoir de sécurité invisible. Livré dans son écrin de cuir scellé.", 
        image: "./images/bracelet2.jpg", 
        video: "./videos/bracelet2.mp4", 
        category: "BRACELETS" 
    },

    // --- BAGUES & ALLIANCES (💍) ---
    { 
        title: "Alliance de Mariage 'Éternité' - Or Blanc & Jaune 18K", 
        price: 350000, 
        description: "Anneau d'union haut de gamme, ciselure fine au laser avec poinçon d'authenticité certifié. Confort optimal au doigt.", 
        image: "./images/bague1.jpg", 
        video: "./videos/bague1.mp4", 
        category: "BAGUES" 
    },
    { 
        title: "Bague Solitaire 'Princesse de Tombouctou'", 
        price: 480000, 
        description: "Sertissage prestigieux sur monture d'or pur. Une brillance intemporelle pour des fiançailles mémorables.", 
        image: "./images/bague2.jpg", 
        video: "./videos/bague2.mp4", 
        category: "BAGUES" 
    },

    // --- COLLIERS & PENDENTIFS (📿) ---
    { 
        title: "Collier Chaîne Maille Corde - Or Massif 24K", 
        price: 1150000, 
        description: "Chaîne d'investissement en or pur à 99,9%. Un raffinement absolu doublé d'une valeur refuge continentale.", 
        image: "./images/collier1.jpg", 
        video: "./videos/collier1.mp4", 
        category: "COLLIERS" 
    },
    { 
        title: "Pendentif Carte d'Afrique en Or Gravé 21K", 
        price: 290000, 
        description: "Symbole de fierté et d'élégance, relief soigné avec finitions polies miroirs. Chaîne non incluse.", 
        image: "./images/collier2.jpg", 
        video: "./videos/collier2.mp4", 
        category: "COLLIERS" 
    },

    // --- BOUCLES D'OREILLES (💎) ---
    { 
        title: "Boucles d'Oreilles Créoles Pendants - Or Flamboyant 21K", 
        price: 420000, 
        description: "Créoles d'inspiration royale africaine, légères et majestueuses. Captent intensément la lumière.", 
        image: "./images/boucles1.jpg", 
        video: "./videos/boucles1.mp4", 
        category: "BOUCLES" 
    }
];

document.addEventListener('DOMContentLoaded', () => {
    loadStoreData();
});

// ==========================================
// 3. RECUPERATION VIA FAKE GOLD API
// ==========================================
async function loadStoreData() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;

    productsGrid.innerHTML = `
        <div class="col-span-full text-center py-24 text-yellow-400 gold-font animate-pulse tracking-widest text-xs">
            ✨ SYNCHRONISATION AVEC L'API DE LA MAISON DE HAUTE JOAILLERIE... <br>
            <span class="text-[10px] text-zinc-500 block mt-2">CHARGEMENT DES ENVOIS SÉCURISÉS PANAFRICAINS VIA REQUÊTE</span>
        </div>
    `;

    // Hydratation globale depuis notre Fake API Or locale
    ALL_PRODUCTS_STORE = [...LOCAL_PRODUCTS];

    // Note : Si vous déployez un jour un vrai API de cours de l'or, le bloc de fetch ci-dessous le gérera dynamiquement
    if (!APIS_GOLD_SIMULATION_ENABLED) {
        try {
            const response = await fetch('https://api.votre-fake-gold-market.com/products');
            const data = await response.json();
            // Intégration dynamique possible ici
        } catch (e) {
            console.log("Flux API Secouru : Utilisation du Fake Store Or local.");
        }
    }

    // Petite temporisation pour simuler la réactivité du réseau API
    setTimeout(() => {
        renderProducts();
    }, 400);
}

// ==========================================
// 4. GÉNÉRATION DE LA GRILLE DES BIJOUX D'EXCEPTION
// ==========================================
function renderProducts() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;

    productsGrid.innerHTML = '';

    const filtered = ALL_PRODUCTS_STORE.filter(p => {
        if (currentCategory === 'TOUT') return true;
        return p.category === currentCategory;
    });

    if (filtered.length === 0) {
        productsGrid.innerHTML = `
            <div class="col-span-full text-center py-16 text-zinc-500 gold-font text-xs uppercase tracking-widest">
                Aucune pièce de joaillerie disponible dans cette catégorie actuellement.
            </div>
        `;
        return;
    }

    filtered.forEach(product => {
        const formattedPrice = new Intl.NumberFormat('fr-FR').format(product.price);
        const safeTitle = product.title.replace(/'/g, "\\'").replace(/"/g, '&quot;');

        const card = document.createElement('div');
        card.className = "group bg-zinc-900/30 backdrop-blur-md rounded-3xl p-5 border border-yellow-500/5 hover:border-yellow-500/30 transition-all duration-300 flex flex-col justify-between hover:shadow-[0_0_30px_rgba(234,179,8,0.1)] hover:scale-[1.01]";

        // Structure HTML haut de gamme intégrant l'emplacement Média (Image / Vidéo en fallback)
        card.innerHTML = `
            <div>
                <div class="h-60 rounded-2xl mb-4 bg-zinc-950 flex items-center justify-center relative overflow-hidden shadow-inner border border-zinc-800">
                    <img src="${product.image}" alt="${product.title}" onerror="this.src='https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600'" class="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-500">
                    
                    <div class="absolute top-3 right-3 bg-zinc-950/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[9px] text-yellow-400 gold-font border border-yellow-500/20 uppercase tracking-widest">
                        👑 ${product.category}
                    </div>
                </div>
                <h3 class="text-sm font-bold text-slate-50 line-clamp-1 group-hover:text-yellow-400 transition duration-300 mb-2 gold-font">${product.title}</h3>
                <p class="text-xs text-slate-400 line-clamp-2 mb-4 h-8 overflow-hidden leading-relaxed">${product.description}</p>
            </div>
            <div class="mt-auto pt-3 border-t border-yellow-500/10">
                <div class="flex items-center justify-between mb-4">
                    <span class="text-[10px] text-yellow-500 tracking-widest font-bold gold-font">VALEUR OR</span>
                    <span class="text-base font-black text-yellow-400 gold-font tracking-wide">${formattedPrice} FCFA</span>
                </div>
                <button onclick="addToCart('${safeTitle}', ${product.price})" class="w-full bg-gradient-to-r from-yellow-500 via-amber-600 to-yellow-600 hover:opacity-90 text-zinc-950 font-bold py-3 px-4 rounded-xl text-xs transition duration-300 transform active:scale-95 shadow-md tracking-widest uppercase gold-font">
                    Placer dans l'écrin ✨
                </button>
            </div>
        `;
        productsGrid.appendChild(card);
    });
}

// ==========================================
// 5. FILTRES HAUTE COUTURE VIA API
// ==========================================
function filterCategory(categoryName) {
    currentCategory = categoryName;
    const categories = ['TOUT', 'PARURES', 'BRACELETS', 'BAGUES', 'COLLIERS', 'BOUCLES'];
    const ids = { 
        'TOUT': 'btn-tout', 'PARURES': 'btn-parures', 'BRACELETS': 'btn-bracelets', 
        'BAGUES': 'btn-bagues', 'COLLIERS': 'btn-colliers', 'BOUCLES': 'btn-boucles' 
    };

    categories.forEach(cat => {
        const btn = document.getElementById(ids[cat]);
        if (!btn) return;
        if (cat === categoryName) {
            btn.className = "gold-font text-xs px-5 py-2.5 rounded-xl transition duration-300 font-bold tracking-wider bg-gradient-to-r from-yellow-500 to-amber-600 text-zinc-950 shadow-lg";
        } else {
            btn.className = "gold-font text-xs px-5 py-2.5 rounded-xl transition duration-300 font-bold tracking-wider text-slate-400 hover:text-yellow-400 hover:bg-white/5";
        }
    });

    renderProducts();
    const catalogSection = document.getElementById('catalog-section');
    if (catalogSection) catalogSection.scrollIntoView({ behavior: 'smooth' });
}

// ==========================================
// 6. INTERACTION PANIER (ÉCRIN DE SÉLECTION)
// ==========================================
function addToCart(productName, price) {
    if (modernCart[productName]) {
        modernCart[productName].quantity += 1;
    } else {
        modernCart[productName] = { price: price, quantity: 1 };
    }
    syncAndRenderCart();
}

function updateQuantity(productName, amount) {
    if (modernCart[productName]) {
        modernCart[productName].quantity += amount;
        if (modernCart[productName].quantity <= 0) {
            delete modernCart[productName];
        }
        syncAndRenderCart();
    }
}

function removeProductEntirely(productName) {
    if (modernCart[productName]) {
        delete modernCart[productName];
        syncAndRenderCart();
    }
}

function syncAndRenderCart() {
    totalAmount = 0;
    itemsCount = 0;
    selectedProducts = [];

    Object.keys(modernCart).forEach(name => {
        const item = modernCart[name];
        totalAmount += (item.price * item.quantity);
        itemsCount += item.quantity;
        for (let i = 0; i < item.quantity; i++) {
            selectedProducts.push(name);
        }
    });

    if(document.getElementById('cart-count')) document.getElementById('cart-count').innerText = itemsCount;
    if(document.getElementById('total-price')) document.getElementById('total-price').innerText = totalAmount.toLocaleString('fr-FR') + " FCFA";

    const cartContainer = document.getElementById('cart-items-container');

    if (cartContainer) {
        cartContainer.innerHTML = '';

        const items = Object.keys(modernCart);
        if (items.length === 0) {
            cartContainer.innerHTML = `<p id="empty-cart-message" class="text-zinc-500 italic py-4">Votre écrin est vide. Choisissez des pièces d'exception pour les ajouter ici.</p>`;
            return;
        }

        items.forEach(name => {
            const item = modernCart[name];
            const safeName = name.replace(/'/g, "\\'");

            const row = document.createElement('div');
            row.className = "flex items-center justify-between bg-zinc-950/80 p-3 rounded-xl border border-yellow-500/5 text-xs text-slate-200 mt-2";
            row.innerHTML = `
                <span class="truncate pr-2 font-semibold flex-1 gold-font text-[11px]">${name} (x${item.quantity})</span>
                <div class="flex items-center space-x-1 flex-shrink-0">
                    <button onclick="updateQuantity('${safeName}', -1)" class="w-5 h-5 bg-zinc-800 rounded flex items-center justify-center text-zinc-400 hover:text-white font-bold text-xs">-</button>
                    <button onclick="addToCart('${safeName}', ${item.price})" class="w-5 h-5 bg-zinc-800 rounded flex items-center justify-center text-zinc-400 hover:text-white font-bold text-xs">+</button>
                    <button onclick="removeProductEntirely('${safeName}')" class="w-5 h-5 bg-amber-950/40 text-yellow-600 rounded flex items-center justify-center hover:bg-yellow-600 hover:text-zinc-950 text-[10px]" title="Supprimer">🗑️</button>
                </div>
            `;
            cartContainer.appendChild(row);
        });
    }
}

// ==========================================
// 7. BORDEREAU DE COMMANDE SECURISE ET AFRIQUE GLOBAL
// ==========================================
function submitCosmicOrder(event) {
    event.preventDefault();

    if (totalAmount === 0 || selectedProducts.length === 0) {
        alert("⚠️ Votre écrin est vide. Veuillez sélectionner des bijoux précieux avant de soumettre la demande de convoi.");
        return;
    }

    const nomClient = document.getElementById('customer-name').value.trim();
    const telephoneClient = document.getElementById('customer-phone').value.trim();
    const adresseClient = document.getElementById('customer-address').value.trim();

    // Construction du bordereau diplomatique sécurisé
    let messageTxt = `👑 *ORDRE DE CONVOI PRÉCIEUX - DOUMDELI GOLD AFRIQUE* 👑\n`;
    messageTxt += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    messageTxt += `👤 *DÉTAILS SECRÈTS DE L'ACQUÉREUR :*\n`;
    messageTxt += `▪️ *Nom Complet :* ${nomClient}\n`;
    messageTxt += `▪️ *Ligne Sécurisée :* ${telephoneClient}\n`;
    messageTxt += `▪️ *Destination Continentale :* ${adresseClient}\n\n`;

    messageTxt += `📦 *MANIFESTE DE LA JOAILLERIE EMBARQUÉE :*\n`;
    messageTxt += `------------------------------------------------------------\n`;

    Object.keys(modernCart).forEach(name => {
        const item = modernCart[name];
        messageTxt += `⚜️ _${name}_ \n    *Quantité :* Lot de x${item.quantity}\n    *Estimation :* ${(item.price * item.quantity).toLocaleString('fr-FR')} FCFA\n`;
    });

    messageTxt += `------------------------------------------------------------\n\n`;
    messageTxt += `💰 *VALEUR TOTALE DÉCLARÉE :* ${totalAmount.toLocaleString('fr-FR')} FCFA\n\n`;
    messageTxt += `✈️ *LOGISTIQUE EXPÉDITION :* Transit transfrontalier prioritaire activé. Traitement sécurisé des colis de haute valeur.\n\n`;
    messageTxt += `🛸 _Maison Doumdeli Gold Core v5.0 - Réseau Panafricain._`;

    const encodedMessage = encodeURIComponent(messageTxt);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
}

// ==========================================
// 8. ENREGISTREMENT DU SERVICE WORKER (OFFLINE AFRICA SESSIONS)
// ==========================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Service Worker Continental Doumdeli Gold activé !'))
            .catch(err => console.log('SW Gold Integration Error', err));
    });
}