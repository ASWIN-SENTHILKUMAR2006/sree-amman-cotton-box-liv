/* ============================================
   SREE AMMAN PACKERS — JavaScript Application
   ============================================ */

// ==========================================
// PRODUCT DATA
// ==========================================
let products = [];
let _backendError = false;
async function fetchProducts() {
  try {
    const res = await fetch('api.php?action=products');
    if (!res.ok) throw new Error('Server error: ' + res.status);
    const data = await res.json();
    products = data.map(p => ({
      id: parseInt(p.id),
      name: p.name,
      ply_type: p.ply_type + ' Ply',
      ply_num: parseInt(p.ply_type),
      length: parseFloat(p.length),
      width: parseFloat(p.width),
      height: parseFloat(p.height),
      color: p.color,
      image: p.image_url,
      description: p.name + ' packaging solution.',
      load_capacity: '10 kg',
      moq: 25,
      custom_branding: true,
      prices: {
        25: Math.round(p.price_estimate * 1.5),
        100: Math.round(p.price_estimate * 1.3),
        250: Math.round(p.price_estimate * 1.1),
        500: Math.round(p.price_estimate * 1.0),
        1000: Math.round(p.price_estimate * 0.9)
      }
    }));
  } catch (err) {
    console.error('Failed to fetch products from backend', err);
    _backendError = true;
  }
}

/* const products = [
  {
    id: 1,
    name: "Standard Shipping Box – 3 Ply",
    ply_type: "3 Ply",
    ply_num: 3,
    length: 12,
    width: 10,
    height: 8,
    color: "Brown",
    image: "<img src='images/machine-main.jpg' alt='Box' style='width:100%;height:100%;object-fit:cover;border-radius:var(--radius-sm);'>",
    description: "A reliable single-wall corrugated box ideal for lightweight shipments. Made from premium cotton-based corrugated board for extra strength and eco-friendliness.",
    load_capacity: "8 kg",
    moq: 25,
    custom_branding: true,
    prices: { 25: 28, 100: 24, 250: 20, 500: 17, 1000: 14 }
  },
  {
    id: 2,
    name: "Heavy Duty Box – 5 Ply",
    ply_type: "5 Ply",
    ply_num: 5,
    length: 18,
    width: 14,
    height: 12,
    color: "Brown",
    image: "<img src='images/machine-2.jpg' alt='Box' style='width:100%;height:100%;object-fit:cover;border-radius:var(--radius-sm);'>",
    description: "Double-wall corrugated box designed for heavy items. Features superior crush resistance and stacking strength, perfect for industrial shipments.",
    load_capacity: "20 kg",
    moq: 25,
    custom_branding: true,
    prices: { 25: 52, 100: 45, 250: 38, 500: 32, 1000: 27 }
  },
  {
    id: 3,
    name: "Premium White Box – 3 Ply",
    ply_type: "3 Ply",
    ply_num: 3,
    length: 10,
    width: 8,
    height: 6,
    color: "White",
    image: "<img src='images/storage-unit.jpg' alt='Box' style='width:100%;height:100%;object-fit:cover;border-radius:var(--radius-sm);'>",
    description: "Clean white-finish corrugated box perfect for retail packaging and gift items. Premium cotton-based material ensures structural integrity.",
    load_capacity: "6 kg",
    moq: 25,
    custom_branding: true,
    prices: { 25: 32, 100: 27, 250: 23, 500: 19, 1000: 16 }
  },
  {
    id: 4,
    name: "Custom Printed Box – 5 Ply",
    ply_type: "5 Ply",
    ply_num: 5,
    length: 16,
    width: 12,
    height: 10,
    color: "Custom Printed",
    image: "<img src='images/jump-machine.jpg' alt='Box' style='width:100%;height:100%;object-fit:cover;border-radius:var(--radius-sm);'>",
    description: "Fully customizable printed corrugated box with your brand logo and design. Double-wall construction with vibrant print quality on cotton-based board.",
    load_capacity: "18 kg",
    moq: 100,
    custom_branding: true,
    prices: { 25: 68, 100: 58, 250: 48, 500: 40, 1000: 34 }
  },
  {
    id: 5,
    name: "Industrial Crate Box – 7 Ply",
    ply_type: "7 Ply",
    ply_num: 7,
    length: 24,
    width: 18,
    height: 16,
    color: "Brown",
    image: "<img src='images/working-employee.jpg' alt='Box' style='width:100%;height:100%;object-fit:cover;border-radius:var(--radius-sm);'>",
    description: "Triple-wall heavy-duty corrugated crate for industrial use. Maximum protection for machinery parts, electronics, and fragile goods during transit.",
    load_capacity: "40 kg",
    moq: 25,
    custom_branding: true,
    prices: { 25: 95, 100: 82, 250: 70, 500: 58, 1000: 48 }
  },
  {
    id: 6,
    name: "Compact Mailer Box – 3 Ply",
    ply_type: "3 Ply",
    ply_num: 3,
    length: 8,
    width: 6,
    height: 4,
    color: "Brown",
    image: "<img src='images/machine-image.jpg' alt='Box' style='width:100%;height:100%;object-fit:cover;border-radius:var(--radius-sm);'>",
    description: "Compact and sturdy mailer box for small items and e-commerce orders. Self-locking design with easy assembly. Cotton-based for sustainability.",
    load_capacity: "4 kg",
    moq: 50,
    custom_branding: true,
    prices: { 25: 18, 100: 15, 250: 12, 500: 10, 1000: 8 }
  },
  {
    id: 7,
    name: "Large Storage Box – 5 Ply",
    ply_type: "5 Ply",
    ply_num: 5,
    length: 22,
    width: 16,
    height: 14,
    color: "Brown",
    image: "<img src='images/storage-unit.jpg' alt='Box' style='width:100%;height:100%;object-fit:cover;border-radius:var(--radius-sm);'>",
    description: "Extra-large storage box for warehousing and bulk storage. Double-wall construction prevents moisture damage and maintains structural integrity over time.",
    load_capacity: "25 kg",
    moq: 25,
    custom_branding: true,
    prices: { 25: 72, 100: 62, 250: 52, 500: 44, 1000: 36 }
  },
  {
    id: 8,
    name: "Fragile Item Box – 7 Ply",
    ply_type: "7 Ply",
    ply_num: 7,
    length: 14,
    width: 14,
    height: 14,
    color: "White",
    image: "<img src='images/jump-machine.jpg' alt='Box' style='width:100%;height:100%;object-fit:cover;border-radius:var(--radius-sm);'>",
    description: "Triple-wall cube box specifically engineered for fragile items. Internal cushioning grooves and reinforced corners provide maximum protection.",
    load_capacity: "35 kg",
    moq: 25,
    custom_branding: true,
    prices: { 25: 88, 100: 76, 250: 64, 500: 54, 1000: 45 }
  },
  {
    id: 9,
    name: "E-Commerce Box – 3 Ply",
    ply_type: "3 Ply",
    ply_num: 3,
    length: 14,
    width: 10,
    height: 6,
    color: "White",
    image: "<img src='images/machine-2.jpg' alt='Box' style='width:100%;height:100%;object-fit:cover;border-radius:var(--radius-sm);'>",
    description: "Perfect for online retailers. Clean white finish with tear-strip opening for enhanced customer unboxing experience. Eco-friendly cotton-based material.",
    load_capacity: "7 kg",
    moq: 50,
    custom_branding: true,
    prices: { 25: 26, 100: 22, 250: 18, 500: 15, 1000: 12 }
  },
  {
    id: 10,
    name: "Archive Document Box – 5 Ply",
    ply_type: "5 Ply",
    ply_num: 5,
    length: 16,
    width: 12,
    height: 10,
    color: "Brown",
    image: "<img src='images/working-employee.jpg' alt='Box' style='width:100%;height:100%;object-fit:cover;border-radius:var(--radius-sm);'>",
    description: "Acid-free cotton-based archive box for long-term document storage. Features hand-hold die-cuts and label window. Moisture-resistant construction.",
    load_capacity: "15 kg",
    moq: 25,
    custom_branding: false,
    prices: { 25: 42, 100: 36, 250: 30, 500: 25, 1000: 21 }
  },
  {
    id: 11,
    name: "Electronics Packaging – 7 Ply",
    ply_type: "7 Ply",
    ply_num: 7,
    length: 20,
    width: 16,
    height: 12,
    color: "Custom Printed",
    image: "<img src='images/machine-image.jpg' alt='Box' style='width:100%;height:100%;object-fit:cover;border-radius:var(--radius-sm);'>",
    description: "Specially designed triple-wall box for electronics with anti-static lining option. Custom print ready for brand packaging with maximum impact resistance.",
    load_capacity: "30 kg",
    moq: 50,
    custom_branding: true,
    prices: { 25: 105, 100: 90, 250: 76, 500: 64, 1000: 52 }
  },
  {
    id: 12,
    name: "Food Grade Box – 3 Ply",
    ply_type: "3 Ply",
    ply_num: 3,
    length: 12,
    width: 12,
    height: 8,
    color: "White",
    image: "<img src='images/machine-main.jpg' alt='Box' style='width:100%;height:100%;object-fit:cover;border-radius:var(--radius-sm);'>",
    description: "Food-safe certified corrugated box made from pure cotton fibers. Suitable for bakery, confectionery, and dry food packaging with no chemical residues.",
    load_capacity: "5 kg",
    moq: 100,
    custom_branding: true,
    prices: { 25: 34, 100: 29, 250: 24, 500: 20, 1000: 17 }
  }
]; */

// ==========================================
// CART SYSTEM
// ==========================================
class Cart {
  constructor() {
    this.items = JSON.parse(localStorage.getItem('acb_cart')) || [];
    this.updateBadge();
  }

  save() {
    localStorage.setItem('acb_cart', JSON.stringify(this.items));
    this.updateBadge();
    this.renderCartSidebar();
  }

  addItem(productId, qty) {
    qty = parseInt(qty) || 1;
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const existing = this.items.find(i => i.id === productId);
    if (existing) {
      existing.qty += qty;
    } else {
      this.items.push({ id: productId, qty: qty });
    }
    this.save();
    this.showNotification(product.name);
  }

  removeItem(productId) {
    this.items = this.items.filter(i => i.id !== productId);
    this.save();
  }

  updateQty(productId, qty) {
    qty = parseInt(qty) || 1;
    if (qty < 1) { this.removeItem(productId); return; }
    const item = this.items.find(i => i.id === productId);
    if (item) { item.qty = qty; this.save(); }
  }

  getPrice(product, qty) {
    const tiers = [1000, 500, 250, 100, 25];
    for (const t of tiers) {
      if (qty >= t) return product.prices[t];
    }
    return product.prices[25];
  }

  getSubtotal() {
    return this.items.reduce((sum, item) => {
      const product = products.find(p => p.id === item.id);
      if (!product) return sum;
      return sum + this.getPrice(product, item.qty) * item.qty;
    }, 0);
  }

  getTotalItems() {
    return this.items.reduce((sum, item) => sum + item.qty, 0);
  }

  updateBadge() {
    const badges = document.querySelectorAll('.cart-badge');
    const count = this.items.length;
    badges.forEach(b => {
      b.textContent = count;
      b.classList.toggle('hidden', count === 0);
    });
  }

  showNotification(name) {
    const n = document.createElement('div');
    n.style.cssText = `
      position:fixed;top:90px;right:24px;background:#22C55E;color:#fff;
      padding:14px 22px;border-radius:8px;font-size:.9rem;font-weight:600;
      z-index:3000;box-shadow:0 4px 16px rgba(0,0,0,.15);
      animation:fadeInUp .3s ease;max-width:300px;
    `;
    n.textContent = `✓ ${name} added to cart`;
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 2500);
  }

  checkout() {
    if (this.items.length === 0) {
      alert('Your cart is empty! Add products first.');
      return;
    }
    window.location.href = 'quote.html';
  }

  renderCartSidebar() {
    const container = document.getElementById('cartItems');
    const subtotalEl = document.getElementById('cartSubtotal');
    if (!container) return;

    if (this.items.length === 0) {
      container.innerHTML = `
        <div class="cart-empty">
          <div class="empty-icon">🛒</div>
          <p>Your cart is empty</p>
        </div>`;
      if (subtotalEl) subtotalEl.textContent = '₹0.00';
      return;
    }

    container.innerHTML = this.items.map(item => {
      const p = products.find(pr => pr.id === item.id);
      if (!p) return '';
      const price = this.getPrice(p, item.qty);
      const total = price * item.qty;
      return `
        <div class="cart-item">
          <div class="cart-item-img">${p.image}</div>
          <div class="cart-item-details">
            <h4>${p.name}</h4>
            <div class="cart-item-meta">${p.ply_type} · ${p.length}×${p.width}×${p.height} in</div>
            <div class="cart-item-qty">
              <button onclick="cart.updateQty(${p.id},${item.qty - 1})">−</button>
              <span>${item.qty}</span>
              <button onclick="cart.updateQty(${p.id},${item.qty + 1})">+</button>
            </div>
          </div>
          <div style="text-align:right;display:flex;flex-direction:column;justify-content:space-between;align-items:flex-end;">
            <button class="cart-item-remove" onclick="cart.removeItem(${p.id})">✕</button>
            <div class="cart-item-price">₹${total.toFixed(2)}</div>
          </div>
        </div>`;
    }).join('');

    if (subtotalEl) subtotalEl.textContent = `₹${this.getSubtotal().toFixed(2)}`;
  }
}

const cart = new Cart();

// ==========================================
// NAVIGATION
// ==========================================
function initNavigation() {
  // Hamburger toggle
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // Header scroll effect
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    });
  }

  // Cart sidebar toggle
  const cartBtns = document.querySelectorAll('.cart-btn');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartSidebar = document.getElementById('cartSidebar');
  const cartClose = document.getElementById('cartClose');

  function openCart() {
    cart.renderCartSidebar();
    cartOverlay?.classList.add('active');
    cartSidebar?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeCart() {
    cartOverlay?.classList.remove('active');
    cartSidebar?.classList.remove('active');
    document.body.style.overflow = '';
  }

  cartBtns.forEach(b => b.addEventListener('click', openCart));
  cartOverlay?.addEventListener('click', closeCart);
  cartClose?.addEventListener('click', closeCart);

  // Active page highlighting
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ==========================================
// PRODUCTS PAGE LOGIC
// ==========================================
function initProductsPage() {
  const productList = document.getElementById('productList');
  const productCount = document.getElementById('productCount');
  if (!productList) return;

  let activeFilters = {
    ply: [],
    color: [],
    lengthMin: null, lengthMax: null,
    widthMin: null, widthMax: null,
    heightMin: null, heightMax: null
  };

  // Render products
  function renderProducts(filtered) {
    if (productCount) productCount.textContent = filtered.length;

    if (_backendError) {
      productList.innerHTML = `
        <div class="no-results" style="border:2px solid #f87171;background:#fff5f5;border-radius:12px;padding:32px;">
          <div class="icon">⚠️</div>
          <p style="color:#b91c1c;font-weight:600;">Cannot connect to the server.</p>
          <p style="color:#555;font-size:.9rem;">Ensure XAMPP Apache & MySQL are running,<br>then refresh this page.</p>
        </div>`;
      return;
    }

    if (filtered.length === 0) {
      productList.innerHTML = `
        <div class="no-results">
          <div class="icon">📦</div>
          <p>No products match your filters. Try adjusting your criteria.</p>
        </div>`;
      return;
    }

    productList.innerHTML = filtered.map(p => {
      const defaultQty = p.moq || 25;
      return `
        <div class="product-row animate-in visible" data-id="${p.id}">
          <a href="product-detail.html?id=${p.id}" class="product-thumb">${p.image}</a>
          <div class="product-info">
            <div class="product-info-header">
              <h3><a href="product-detail.html?id=${p.id}">${p.name}</a></h3>
            </div>
            <div class="product-tags">
              <span class="tag tag-ply">${p.ply_type}</span>
              <span class="tag tag-size">${p.length} × ${p.width} × ${p.height} in</span>
              <span class="tag tag-color">${p.color}</span>
              ${p.custom_branding ? '<span class="tag tag-custom">✦ Customizable</span>' : ''}
            </div>
            <table class="pricing-table">
              <thead>
                <tr>
                  <th>Qty</th>
                  <th>25+</th>
                  <th>100+</th>
                  <th>250+</th>
                  <th>500+</th>
                  <th>1000+</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="font-weight:700;background:var(--beige)">Price</td>
                  <td>₹${p.prices[25]}</td>
                  <td>₹${p.prices[100]}</td>
                  <td>₹${p.prices[250]}</td>
                  <td>₹${p.prices[500]}</td>
                  <td>₹${p.prices[1000]}</td>
                </tr>
              </tbody>
            </table>
            <div class="product-actions">
              <div class="qty-input">
                <button onclick="changeQty(this,-1)">−</button>
                <input type="number" value="${defaultQty}" min="1" data-product-id="${p.id}" onchange="updateUnitPrice(this)">
                <button onclick="changeQty(this,1)">+</button>
              </div>
              <div class="unit-price">
                Unit: <strong>₹${cart.getPrice(p, defaultQty)}</strong>/pc
              </div>
              <button class="btn btn-primary btn-sm" onclick="addFromRow(${p.id},this)">
                ADD
              </button>
            </div>
          </div>
        </div>`;
    }).join('');

    // Highlight active price tiers
    productList.querySelectorAll('.product-row').forEach(row => {
      const input = row.querySelector('.qty-input input');
      if (input) highlightPriceTier(row, parseInt(input.value));
    });
  }

  // Highlight active price column
  function highlightPriceTier(row, qty) {
    const cells = row.querySelectorAll('.pricing-table tbody td');
    cells.forEach(c => c.classList.remove('active-price'));
    let idx;
    if (qty >= 1000) idx = 5;
    else if (qty >= 500) idx = 4;
    else if (qty >= 250) idx = 3;
    else if (qty >= 100) idx = 2;
    else idx = 1;
    if (cells[idx]) cells[idx].classList.add('active-price');
  }

  // Quantity change
  window.changeQty = function (btn, delta) {
    const input = btn.parentElement.querySelector('input');
    let val = parseInt(input.value) || 1;
    val = Math.max(1, val + delta);
    input.value = val;
    updateUnitPrice(input);
  };

  window.updateUnitPrice = function (input) {
    const pid = parseInt(input.dataset.productId);
    const product = products.find(p => p.id === pid);
    if (!product) return;
    const qty = parseInt(input.value) || 1;
    const price = cart.getPrice(product, qty);
    const row = input.closest('.product-row');
    const unitEl = row.querySelector('.unit-price strong');
    if (unitEl) unitEl.textContent = `₹${price}`;
    highlightPriceTier(row, qty);
  };

  window.addFromRow = function (pid, btn) {
    const row = btn.closest('.product-row');
    const input = row.querySelector('.qty-input input');
    const qty = parseInt(input.value) || 1;
    cart.addItem(pid, qty);
  };

  // Filter logic
  function applyFilters() {
    let filtered = [...products];

    if (activeFilters.ply.length > 0) {
      filtered = filtered.filter(p => activeFilters.ply.includes(p.ply_num));
    }
    if (activeFilters.color.length > 0) {
      filtered = filtered.filter(p => activeFilters.color.includes(p.color));
    }
    if (activeFilters.lengthMin) filtered = filtered.filter(p => p.length >= activeFilters.lengthMin);
    if (activeFilters.lengthMax) filtered = filtered.filter(p => p.length <= activeFilters.lengthMax);
    if (activeFilters.widthMin) filtered = filtered.filter(p => p.width >= activeFilters.widthMin);
    if (activeFilters.widthMax) filtered = filtered.filter(p => p.width <= activeFilters.widthMax);
    if (activeFilters.heightMin) filtered = filtered.filter(p => p.height >= activeFilters.heightMin);
    if (activeFilters.heightMax) filtered = filtered.filter(p => p.height <= activeFilters.heightMax);

    renderProducts(filtered);
  }

  // Collapsible filters
  document.querySelectorAll('.filter-header').forEach(header => {
    header.addEventListener('click', () => {
      header.classList.toggle('collapsed');
      const body = header.nextElementSibling;
      if (body) body.classList.toggle('collapsed');
    });
  });

  // Category checkboxes
  document.querySelectorAll('.filter-ply').forEach(cb => {
    cb.addEventListener('change', () => {
      activeFilters.ply = [];
      document.querySelectorAll('.filter-ply:checked').forEach(c => {
        activeFilters.ply.push(parseInt(c.value));
      });
      applyFilters();
    });
  });

  // Color checkboxes
  document.querySelectorAll('.filter-color').forEach(cb => {
    cb.addEventListener('change', () => {
      activeFilters.color = [];
      document.querySelectorAll('.filter-color:checked').forEach(c => {
        activeFilters.color.push(c.value);
      });
      applyFilters();
    });
  });

  // Dimension filters
  const dimFields = [
    { min: 'filterLengthMin', max: 'filterLengthMax', keyMin: 'lengthMin', keyMax: 'lengthMax' },
    { min: 'filterWidthMin', max: 'filterWidthMax', keyMin: 'widthMin', keyMax: 'widthMax' },
    { min: 'filterHeightMin', max: 'filterHeightMax', keyMin: 'heightMin', keyMax: 'heightMax' }
  ];
  dimFields.forEach(df => {
    const minEl = document.getElementById(df.min);
    const maxEl = document.getElementById(df.max);
    if (minEl) minEl.addEventListener('input', () => {
      activeFilters[df.keyMin] = parseFloat(minEl.value) || null;
      applyFilters();
    });
    if (maxEl) maxEl.addEventListener('input', () => {
      activeFilters[df.keyMax] = parseFloat(maxEl.value) || null;
      applyFilters();
    });
  });

  // Search by size
  const searchGoBtn = document.getElementById('searchGo');
  if (searchGoBtn) {
    searchGoBtn.addEventListener('click', () => {
      const sl = parseFloat(document.getElementById('searchLength')?.value) || null;
      const sw = parseFloat(document.getElementById('searchWidth')?.value) || null;
      const sh = parseFloat(document.getElementById('searchHeight')?.value) || null;

      let filtered = [...products];
      if (sl) filtered = filtered.filter(p => p.length === sl);
      if (sw) filtered = filtered.filter(p => p.width === sw);
      if (sh) filtered = filtered.filter(p => p.height === sh);

      // If exact match fails, try close matches (±2)
      if (filtered.length === 0 && (sl || sw || sh)) {
        filtered = [...products];
        if (sl) filtered = filtered.filter(p => Math.abs(p.length - sl) <= 2);
        if (sw) filtered = filtered.filter(p => Math.abs(p.width - sw) <= 2);
        if (sh) filtered = filtered.filter(p => Math.abs(p.height - sh) <= 2);
      }

      renderProducts(filtered);
    });
  }

  // Initial render
  renderProducts(products);
}

// ==========================================
// PRODUCT DETAIL PAGE
// ==========================================
function initProductDetail() {
  const detailContainer = document.getElementById('productDetail');
  if (!detailContainer) return;

  const params = new URLSearchParams(window.location.search);
  const pid = parseInt(params.get('id'));
  const product = products.find(p => p.id === pid);

  if (!product) {
    detailContainer.innerHTML = `
      <div class="no-results">
        <div class="icon">📦</div>
        <p>Product not found. <a href="products.html" style="color:var(--dark-blue);font-weight:600;">Browse all products</a></p>
      </div>`;
    return;
  }

  const defaultQty = product.moq || 25;
  const defaultPrice = cart.getPrice(product, defaultQty);

  detailContainer.innerHTML = `
    <div class="detail-grid">
      <div class="detail-image">${product.image}</div>
      <div class="detail-content">
        <h1>${product.name}</h1>
        <div class="detail-tags">
          <span class="tag tag-ply">${product.ply_type}</span>
          <span class="tag tag-size">${product.length} × ${product.width} × ${product.height} in</span>
          <span class="tag tag-color">${product.color}</span>
          ${product.custom_branding ? '<span class="tag tag-custom">✦ Customizable</span>' : ''}
        </div>
        <p class="detail-desc">${product.description}</p>
        <h3 style="font-size:1rem;font-weight:700;margin-bottom:12px;">Technical Specifications</h3>
        <table class="specs-table">
          <tr><th>Ply Type</th><td>${product.ply_type} (${product.ply_num === 3 ? 'Single Wall' : product.ply_num === 5 ? 'Double Wall' : 'Triple Wall'})</td></tr>
          <tr><th>Dimensions (L × W × H)</th><td>${product.length} × ${product.width} × ${product.height} inches</td></tr>
          <tr><th>Color</th><td>${product.color}</td></tr>
          <tr><th>Load Capacity</th><td>${product.load_capacity}</td></tr>
          <tr><th>Minimum Order Qty</th><td>${product.moq} pcs</td></tr>
          <tr><th>Custom Branding</th><td>${product.custom_branding ? 'Available – Logo, design, and color printing' : 'Not available'}</td></tr>
          <tr><th>Material</th><td>Cotton-based corrugated board</td></tr>
        </table>
        <div class="detail-pricing">
          <h3>Bulk Pricing</h3>
          <table class="pricing-table" id="detailPricingTable">
            <thead>
              <tr>
                <th>Qty</th><th>25+</th><th>100+</th><th>250+</th><th>500+</th><th>1000+</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="font-weight:700;background:var(--beige)">Price/pc</td>
                <td>₹${product.prices[25]}</td>
                <td>₹${product.prices[100]}</td>
                <td>₹${product.prices[250]}</td>
                <td>₹${product.prices[500]}</td>
                <td>₹${product.prices[1000]}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="detail-actions">
          <div class="qty-input">
            <button onclick="changeDetailQty(-1)">−</button>
            <input type="number" id="detailQty" value="${defaultQty}" min="1" onchange="updateDetailPrice()">
            <button onclick="changeDetailQty(1)">+</button>
          </div>
          <div class="unit-price">
            Unit: <strong id="detailUnitPrice">₹${defaultPrice}</strong>/pc ·
            Total: <strong id="detailTotalPrice">₹${(defaultPrice * defaultQty).toFixed(2)}</strong>
          </div>
          <button class="btn btn-primary" onclick="cart.addItem(${product.id}, parseInt(document.getElementById('detailQty').value))">
            Add to Cart
          </button>
        </div>
      </div>
    </div>`;

  // Highlight initial tier
  highlightDetailTier(defaultQty);

  window.changeDetailQty = function (delta) {
    const input = document.getElementById('detailQty');
    let val = parseInt(input.value) || 1;
    val = Math.max(1, val + delta);
    input.value = val;
    updateDetailPrice();
  };

  window.updateDetailPrice = function () {
    const qty = parseInt(document.getElementById('detailQty').value) || 1;
    const price = cart.getPrice(product, qty);
    document.getElementById('detailUnitPrice').textContent = `₹${price}`;
    document.getElementById('detailTotalPrice').textContent = `₹${(price * qty).toFixed(2)}`;
    highlightDetailTier(qty);
  };

  function highlightDetailTier(qty) {
    const cells = document.querySelectorAll('#detailPricingTable tbody td');
    cells.forEach(c => c.classList.remove('active-price'));
    let idx;
    if (qty >= 1000) idx = 5;
    else if (qty >= 500) idx = 4;
    else if (qty >= 250) idx = 3;
    else if (qty >= 100) idx = 2;
    else idx = 1;
    if (cells[idx]) cells[idx].classList.add('active-price');
  }
}

// ==========================================
// CHATBOT
// ==========================================
function initChatbot() {
  const toggle = document.getElementById('chatbotToggle');
  const window_ = document.getElementById('chatbotWindow');
  const closeBtn = document.getElementById('chatbotClose');
  const input = document.getElementById('chatbotInput');
  const sendBtn = document.getElementById('chatbotSend');
  const messages = document.getElementById('chatbotMessages');
  const suggestions = document.getElementById('chatbotSuggestions');

  if (!toggle || !window_) return;

  let isOpen = false;

  toggle.addEventListener('click', () => {
    isOpen = !isOpen;
    window_.classList.toggle('active', isOpen);
    toggle.innerHTML = isOpen ? '✕' : '💬';
  });

  closeBtn?.addEventListener('click', () => {
    isOpen = false;
    window_.classList.remove('active');
    toggle.innerHTML = '💬';
  });

  function addMessage(text, type) {
    const msg = document.createElement('div');
    msg.className = `chat-message ${type}`;
    msg.innerHTML = text;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  function getBotResponse(input) {
    const q = input.toLowerCase().trim();

    // Size-based product suggestion
    const sizeMatch = q.match(/(\d+)\s*[x×]\s*(\d+)\s*[x×]\s*(\d+)/);
    if (sizeMatch) {
      const [_, l, w, h] = sizeMatch.map(Number);
      const match = products.find(p => p.length === l && p.width === w && p.height === h);
      if (match) {
        return `I found a match! <b>${match.name}</b> (${match.ply_type}, ${match.color}). Price starts at ₹${match.prices[1000]}/pc for 1000+ units. <a href="product-detail.html?id=${match.id}" style="color:var(--dark-blue);font-weight:600;">View Product →</a>`;
      }
      const close = products.filter(p => Math.abs(p.length - l) <= 4 && Math.abs(p.width - w) <= 4 && Math.abs(p.height - h) <= 4);
      if (close.length > 0) {
        return `No exact match for ${l}×${w}×${h}, but here are similar sizes:<br>` +
          close.slice(0, 3).map(p => `• <b>${p.name}</b> (${p.length}×${p.width}×${p.height}in) — from ₹${p.prices[1000]}/pc`).join('<br>') +
          `<br><a href="products.html" style="color:var(--dark-blue);font-weight:600;">Browse All →</a>`;
      }
      return `No products match ${l}×${w}×${h}. We offer custom sizes! Contact us for a quote or <a href="products.html" style="color:var(--dark-blue);font-weight:600;">browse available sizes</a>.`;
    }

    // Ply recommendations
    if (q.includes('ply') || q.includes('wall') || q.includes('which') || q.includes('recommend')) {
      return `Here's our ply guide:<br>
        • <b>3 Ply (Single Wall)</b> — Lightweight items up to 8kg<br>
        • <b>5 Ply (Double Wall)</b> — Medium/heavy items up to 25kg<br>
        • <b>7 Ply (Triple Wall)</b> — Heavy/fragile items up to 40kg<br>
        What weight do you need to pack?`;
    }

    // Pricing
    if (q.includes('price') || q.includes('cost') || q.includes('rate') || q.includes('cheap')) {
      return `Our prices depend on ply type, size, and quantity. Bulk orders get the best rates!<br>
        • 3 Ply: from ₹8/pc<br>
        • 5 Ply: from ₹21/pc<br>
        • 7 Ply: from ₹45/pc<br>
        <a href="products.html" style="color:var(--dark-blue);font-weight:600;">View All Prices →</a>`;
    }

    // Custom printing
    if (q.includes('custom') || q.includes('print') || q.includes('brand') || q.includes('logo')) {
      return `Yes! We offer full custom branding 🎨<br>
        • Logo printing<br>
        • Custom colors & designs<br>
        • MOQ: 100 pcs for printed boxes<br>
        <a href="products.html" style="color:var(--dark-blue);font-weight:600;">View Custom Options →</a>`;
    }

    // MOQ
    if (q.includes('moq') || q.includes('minimum') || q.includes('order')) {
      return `Our minimum order quantities:<br>
        • Standard boxes: 25 pcs<br>
        • Custom printed: 100 pcs<br>
        Higher quantities unlock better pricing!`;
    }

    // Material
    if (q.includes('cotton') || q.includes('material') || q.includes('eco') || q.includes('sustain')) {
      return `All our boxes use <b>cotton-based corrugated board</b> 🌱<br>
        • 100% recyclable<br>
        • Sourced from Grade A cotton<br>
        • Stronger than standard kraft<br>
        <a href="sourcing.html" style="color:var(--dark-blue);font-weight:600;">Learn About Our Sourcing →</a>`;
    }

    // Shipping / delivery
    if (q.includes('deliver') || q.includes('ship') || q.includes('time') || q.includes('days')) {
      return `Typical delivery timelines:<br>
        • Standard orders: 5-7 business days<br>
        • Custom printed: 10-14 business days<br>
        • Express available on request<br>
        Contact us for exact timelines.`;
    }

    // Greetings
    if (q.includes('hi') || q.includes('hello') || q.includes('hey')) {
      return `Hello! 👋 Welcome to SREE AMMAN PACKERS. How can I help you today? I can assist with:<br>
        • Finding the right box size<br>
        • Recommending ply type<br>
        • Pricing information<br>
        • Custom branding options`;
    }

    // Thanks
    if (q.includes('thank') || q.includes('thanks')) {
      return `You're welcome! 😊 Feel free to ask if you need anything else. You can also <a href="products.html" style="color:var(--dark-blue);font-weight:600;">browse our products</a> or contact us for a custom quote.`;
    }

    // Default
    return `I can help with:<br>
      • Finding boxes by size (e.g., "12×10×8")<br>
      • Ply type recommendations<br>
      • Pricing information<br>
      • Custom branding options<br>
      • Material & sustainability info<br>
      Try asking one of these, or <a href="products.html" style="color:var(--dark-blue);font-weight:600;">browse our products</a>.`;
  }

  function handleSend() {
    const text = input.value.trim();
    if (!text) return;
    addMessage(text, 'user');
    input.value = '';
    setTimeout(() => {
      addMessage(getBotResponse(text), 'bot');
    }, 500);
  }

  sendBtn?.addEventListener('click', handleSend);
  input?.addEventListener('keydown', e => { if (e.key === 'Enter') handleSend(); });

  // Suggestion buttons
  suggestions?.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      input.value = btn.textContent;
      handleSend();
    });
  });
}

// ==========================================
// SCROLL ANIMATIONS
// ==========================================
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animate-in').forEach(el => observer.observe(el));
}

// ==========================================
// 3D BOX VIEWER
// ==========================================
function init3DBox() {
  const cube = document.getElementById('box3dCube');
  const stage = document.getElementById('box3dStage');
  const scene = document.querySelector('.box3d-scene');
  if (!cube || !stage) return;

  let rotX = -25, rotY = -35;
  let isDragging = false;
  let startX = 0, startY = 0;
  let resumeTimer = null;

  // Start with auto-rotate
  cube.classList.add('auto-rotating');

  function stopAutoRotate() {
    cube.classList.remove('auto-rotating');
    // Capture current rotation from animation
    const st = getComputedStyle(cube);
    const tr = st.transform;
    if (tr && tr !== 'none') {
      const matrix = new DOMMatrix(tr);
      rotY = Math.atan2(matrix.m13, matrix.m33) * (180 / Math.PI);
      rotX = Math.atan2(-matrix.m23, Math.sqrt(matrix.m21 * matrix.m21 + matrix.m22 * matrix.m22)) * (180 / Math.PI);
    }
    cube.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  }

  function scheduleResume() {
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => {
      cube.style.transform = '';
      cube.classList.add('auto-rotating');
    }, 3000);
  }

  // Mouse drag
  stage.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    clearTimeout(resumeTimer);
    if (cube.classList.contains('auto-rotating')) stopAutoRotate();
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    rotY += dx * 0.6;
    rotX -= dy * 0.6;
    rotX = Math.max(-90, Math.min(90, rotX));
    cube.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    startX = e.clientX;
    startY = e.clientY;
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) { isDragging = false; scheduleResume(); }
  });

  // Touch drag
  stage.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    clearTimeout(resumeTimer);
    if (cube.classList.contains('auto-rotating')) stopAutoRotate();
    e.preventDefault();
  }, { passive: false });

  stage.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const dx = e.touches[0].clientX - startX;
    const dy = e.touches[0].clientY - startY;
    rotY += dx * 0.6;
    rotX -= dy * 0.6;
    rotX = Math.max(-90, Math.min(90, rotX));
    cube.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    e.preventDefault();
  }, { passive: false });

  stage.addEventListener('touchend', () => {
    if (isDragging) { isDragging = false; scheduleResume(); }
  });

  // Scroll wheel zoom
  if (scene) {
    let zoom = 100;
    stage.addEventListener('wheel', (e) => {
      e.preventDefault();
      zoom -= Math.sign(e.deltaY) * 5;
      zoom = Math.max(60, Math.min(140, zoom));
      const size = Math.round(220 * zoom / 100);
      scene.style.width = size + 'px';
      scene.style.height = size + 'px';
    }, { passive: false });
  }
}

// ==========================================
// INIT
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
  await fetchProducts();
  document.querySelectorAll('.cart-footer .btn-primary').forEach(btn => {
    if (btn.textContent.includes('Request Quote')) {
      btn.addEventListener('click', () => cart.checkout());
    }
  });
  initNavigation();
  initProductsPage();
  initProductDetail();
  initChatbot();
  initScrollAnimations();
  init3DBox();
  cart.renderCartSidebar();
});

// ==========================================
// COUNTER ANIMATIONS (hero stats)
// ==========================================
function initCounterAnimations() {
  const counters = document.querySelectorAll('.hero-stat h3, .stat-num');
  if (!counters.length) return;
  const parseVal = str => {
    const clean = str.replace(/[^0-9.KM+]/g, '');
    let num = parseFloat(clean);
    if (clean.includes('M')) num *= 1000000;
    if (clean.includes('K')) num *= 1000;
    return num;
  };
  const formatVal = (num, original) => {
    if (original.includes('M')) return (num / 1000000).toFixed(0) + 'M+';
    if (original.includes('K')) return (num / 1000).toFixed(0) + 'K+';
    return Math.round(num) + (original.includes('+') ? '+' : '');
  };
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting || entry.target.dataset.counted) return;
      entry.target.dataset.counted = '1';
      const el = entry.target;
      const original = el.textContent;
      const target = parseVal(original);
      if (!target) return;
      const dur = 1800, startTime = performance.now();
      const update = now => {
        const p = Math.min((now - startTime) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = formatVal(target * eased, original);
        if (p < 1) requestAnimationFrame(update); else el.textContent = original;
      };
      requestAnimationFrame(update);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => obs.observe(c));
}

// ==========================================
// STAGGER CARD ANIMATIONS
// ==========================================
function initStaggerAnimations() {
  const selector = '.why-card, .sustain-card, .sourcing-card, .testimonial-card, .timeline-item, .process-step';
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const siblings = Array.from(entry.target.parentElement.children);
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, idx * 90);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(selector).forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
    obs.observe(el);
  });
  // Micro-lift on primary buttons
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('mouseenter', () => { btn.style.transform = 'translateY(-2px) scale(1.02)'; });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initCounterAnimations();
  initStaggerAnimations();
});
