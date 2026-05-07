/**
 * SITTA - Sistem Informasi Transaksi & Tracking Bahan Ajar
 * Universitas Terbuka
 * js/script.js — Logika utama aplikasi
 */

// ============================================================
// AUTH CHECK
// ============================================================
if (sessionStorage.getItem('loggedIn') !== 'true') {
  window.location.href = 'index.html';
}

document.getElementById('logoutBtn').addEventListener('click', function (e) {
  e.preventDefault();
  sessionStorage.clear();
  window.location.href = 'index.html';
});

// ============================================================
// DROPDOWN NAVBAR
// ============================================================
function toggleDropdown(e) {
  e.preventDefault();
  document.getElementById('laporanDropdown').classList.toggle('show');
}

document.addEventListener('click', function (e) {
  const dd = document.getElementById('laporanDropdown');
  if (dd && !e.target.closest('#laporanDropdown')) {
    dd.classList.remove('show');
  }
});

// ============================================================
// LOCAL STORAGE HELPERS
// ============================================================
function getStock() {
  const stored = JSON.parse(localStorage.getItem('stockStore'));
  if (!stored) return dataBahanAjar;
  
  // Merge covers and prices from default data if they are missing in storage
  return stored.map(item => {
    const defaultItem = dataBahanAjar.find(d => d.kodeBarang === item.kodeBarang);
    if (defaultItem) {
      if (!item.cover) item.cover = defaultItem.cover;
      if (item.harga === undefined || item.harga === null) item.harga = defaultItem.harga;
    }
    return item;
  });
}

function saveStock(data) {
  localStorage.setItem('stockStore', JSON.stringify(data));
}

function getHistory() {
  return JSON.parse(localStorage.getItem('historyStore')) || dataHistory;
}

function saveHistory(data) {
  localStorage.setItem('historyStore', JSON.stringify(data));
}

function getCart() {
  const cart = JSON.parse(localStorage.getItem('cartStore')) || [];
  // Merge prices if missing
  return cart.map(item => {
    if (item.harga === undefined || item.harga === null) {
      const stockItem = dataBahanAjar.find(d => d.kodeBarang === item.kode);
      if (stockItem) item.harga = stockItem.harga;
    }
    return item;
  });
}

function saveCart(data) {
  localStorage.setItem('cartStore', JSON.stringify(data));
}

function getTracking() {
  return JSON.parse(localStorage.getItem('trackingStore')) || dataTracking;
}

function saveTracking(data) {
  localStorage.setItem('trackingStore', JSON.stringify(data));
}

// ============================================================
// TOAST NOTIFICATION
// ============================================================
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const icon = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-times-circle' : 'fa-exclamation-triangle';
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fas ${icon}" style="font-size:18px;"></i> ${message}`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

// ============================================================
// MODAL HELPERS
// ============================================================
function openModal(id) {
  document.getElementById(id).classList.add('show');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('show');
}

// Close modal on backdrop click
document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', function (e) {
    if (e.target === this) this.classList.remove('show');
  });
});

// ============================================================
// VIEW TOGGLE (Grid / Table)
// ============================================================
let currentView = 'grid';

function setView(view) {
  currentView = view;
  const gridView  = document.getElementById('gridView');
  const tableView = document.getElementById('tableView');
  const gridBtn   = document.getElementById('viewGridBtn');
  const tableBtn  = document.getElementById('viewTableBtn');

  if (view === 'grid') {
    gridView.style.display  = 'block';
    tableView.style.display = 'none';
    gridBtn.style.background  = 'linear-gradient(135deg,var(--primary),#1d4ed8)';
    gridBtn.style.color       = '#fff';
    tableBtn.style.background = 'var(--surface)';
    tableBtn.style.color      = 'var(--text-main)';
  } else {
    gridView.style.display  = 'none';
    tableView.style.display = 'block';
    tableBtn.style.background = 'linear-gradient(135deg,var(--primary),#1d4ed8)';
    tableBtn.style.color      = '#fff';
    gridBtn.style.background  = 'var(--surface)';
    gridBtn.style.color       = 'var(--text-main)';
  }
  renderStockGrid();
}

// ============================================================
// RENDER STOCK (GRID & TABLE)
// ============================================================
function renderStockGrid() {
  const stock   = getStock();
  const search  = (document.getElementById('searchInput') ? document.getElementById('searchInput').value : '').toLowerCase();
  const jenis   = document.getElementById('filterJenis') ? document.getElementById('filterJenis').value : '';

  const filtered = stock.filter(s => {
    const matchSearch = !search ||
      s.namaBarang.toLowerCase().includes(search) ||
      s.kodeBarang.toLowerCase().includes(search);
    const matchJenis = !jenis || s.jenisBarang === jenis;
    return matchSearch && matchJenis;
  });

  // --- GRID ---
  const grid = document.getElementById('stockGrid');
  if (grid) {
    if (!filtered.length) {
      grid.innerHTML = `<p style="color:var(--text-muted); grid-column:1/-1; text-align:center; padding:40px;">
        <i class="fas fa-inbox" style="font-size:32px; display:block; margin-bottom:8px;"></i>
        Tidak ada data bahan ajar.
      </p>`;
    } else {
      grid.innerHTML = filtered.map((b, idx) => {
        const pct   = Math.min(Math.round((b.stok / b.limit) * 100), 100);
        const color = pct < 30 ? '#ef4444' : pct < 60 ? '#eab308' : '#10b981';
        const statusBadge = pct < 30
          ? '<span class="badge badge-danger">Stok Kritis</span>'
          : pct < 60
            ? '<span class="badge badge-warning">Stok Rendah</span>'
            : '<span class="badge badge-success">Stok Aman</span>';

        return `
          <div class="stock-card" style="animation-delay:${idx * 0.05}s;">
            <div class="stock-cover">
              <img src="${b.cover || 'https://via.placeholder.com/150?text=No+Cover'}" alt="${b.namaBarang}">
            </div>
            <div class="stock-header">
              <h4>${b.kodeBarang} &middot; ${b.jenisBarang}</h4>
              <h3>${b.namaBarang}</h3>
            </div>
            <div class="stock-body">
              <div class="stock-row">
                <span class="stock-label">Kode Lokasi</span>
                <span class="stock-value">${b.kodeLokasi}</span>
              </div>
              <div class="stock-row">
                <span class="stock-label">Edisi</span>
                <span class="stock-value">${b.edisi}</span>
              </div>
              <div class="stock-row">
                <span class="stock-label">Stok Tersedia</span>
                <span class="stock-value" style="color:${color}; font-size:18px;">${b.stok}</span>
              </div>
              <div class="stock-row">
                <span class="stock-label">Harga per Eks</span>
                <span class="stock-value" style="color:var(--secondary);">Rp ${b.harga ? b.harga.toLocaleString('id-ID') : '0'}</span>
              </div>
              <div style="margin: 8px 0 12px;">
                <div style="display:flex; justify-content:space-between; font-size:12px; color:var(--text-muted); margin-bottom:4px;">
                  <span>Progress Stok</span><span>${pct}%</span>
                </div>
                <div class="progress-container">
                  <div class="progress-bar" style="width:${pct}%; background:${color};"></div>
                </div>
              </div>
              <div style="margin-bottom:14px;">${statusBadge}</div>
              <div class="stock-actions">
                <button class="btn btn-small" onclick="addToCart('${b.kodeBarang}')" ${b.stok === 0 ? 'disabled style="opacity:0.5;"' : ''}>
                  <i class="fas fa-cart-plus"></i> Pesan
                </button>
                <button class="btn btn-small btn-secondary" onclick="openDeleteModal('${b.kodeBarang}')">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>`;
      }).join('');
    }
  }

  // --- TABLE ---
  const tbody = document.getElementById('stockTable');
  if (tbody) {
    if (!filtered.length) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:var(--text-muted);">Tidak ada data</td></tr>`;
    } else {
      tbody.innerHTML = filtered.map(b => {
        const pct   = Math.min(Math.round((b.stok / b.limit) * 100), 100);
        const color = pct < 30 ? '#ef4444' : pct < 60 ? '#eab308' : '#10b981';
        const badgeClass = pct < 30 ? 'badge-danger' : pct < 60 ? 'badge-warning' : 'badge-success';
        const badgeLabel = pct < 30 ? 'Kritis' : pct < 60 ? 'Rendah' : 'Aman';
        return `
          <tr>
            <td><code style="color:var(--secondary); font-size:12px;">${b.kodeBarang}</code></td>
            <td>
              <div style="display:flex; align-items:center; gap:10px;">
                <img src="${b.cover || 'https://via.placeholder.com/50?text=No'}" style="width:36px; height:48px; object-fit:cover; border-radius:4px; border:1px solid var(--border);">
                <strong>${b.namaBarang}</strong>
              </div>
            </td>
            <td><span class="badge badge-info">${b.jenisBarang}</span></td>
            <td>${b.edisi}</td>
            <td style="color:${color}; font-weight:700;">${b.stok}</td>
            <td>${b.limit}</td>
            <td><span class="badge ${badgeClass}">${badgeLabel}</span></td>
            <td style="display:flex; gap:6px;">
              <button class="btn btn-small" onclick="addToCart('${b.kodeBarang}')" ${b.stok === 0 ? 'disabled style="opacity:0.5;"' : ''}>
                <i class="fas fa-cart-plus"></i> Pesan
              </button>
              <button class="btn btn-small btn-secondary" onclick="openDeleteModal('${b.kodeBarang}')">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>`;
      }).join('');
    }
  }
}

// ============================================================
// CART LOGIC
// ============================================================
function updateCartBadge() {
  const cart  = getCart();
  const total = cart.reduce((s, i) => s + i.qty, 0);
  const badge = document.getElementById('cartBadge');
  if (badge) badge.textContent = total;
}

function addToCart(kodeBarang) {
  const stock = getStock();
  const item  = stock.find(s => s.kodeBarang === kodeBarang);
  if (!item) return;

  let cart = getCart();
  const existing = cart.find(c => c.kode === kodeBarang);

  if (existing) {
    if (existing.qty >= item.stok) {
      showToast('Stok tidak cukup!', 'error');
      return;
    }
    existing.qty++;
  } else {
    cart.push({ 
      kode: kodeBarang, 
      nama: item.namaBarang, 
      qty: 1, 
      stokMax: item.stok,
      harga: item.harga || 0
    });
  }

  saveCart(cart);
  updateCartBadge();
  showToast(`"${item.namaBarang}" ditambahkan ke keranjang!`, 'success');
}

function openCartModal() {
  renderCartContent();
  openModal('cartModal');
}

function renderCartContent() {
  const cart    = getCart();
  const content = document.getElementById('cartContent');
  const footer  = document.getElementById('cartFooter');

  if (!cart.length) {
    content.innerHTML = `
      <div style="text-align:center; padding:30px; color:var(--text-muted);">
        <i class="fas fa-shopping-cart" style="font-size:40px; margin-bottom:12px; display:block; opacity:0.3;"></i>
        Keranjang masih kosong.
      </div>`;
    if (footer) footer.style.display = 'none';
    return;
  }

  let totalItem = 0;
  let totalPrice = 0;
  
  content.innerHTML = cart.map(item => {
    totalItem += item.qty;
    const subtotal = item.qty * item.harga;
    totalPrice += subtotal;
    
    return `
      <div class="cart-item">
        <div class="cart-item-info">
          <h4>${item.nama}</h4>
          <p><code style="color:var(--secondary); font-size:11px;">${item.kode}</code> &middot; Rp ${item.harga.toLocaleString('id-ID')}</p>
        </div>
        <div class="cart-qty">
          <button onclick="changeQty('${item.kode}', -1)">−</button>
          <span>${item.qty}</span>
          <button onclick="changeQty('${item.kode}', 1)">+</button>
        </div>
        <div style="min-width:80px; text-align:right; font-size:13px; font-weight:600;">
          Rp ${subtotal.toLocaleString('id-ID')}
        </div>
        <button onclick="removeFromCart('${item.kode}')" style="background:none; border:none; color:var(--danger); cursor:pointer; font-size:16px; padding:4px;">
          <i class="fas fa-times"></i>
        </button>
      </div>`;
  }).join('');

  content.innerHTML += `
    <div style="margin-top:16px; padding-top:16px; border-top:1px solid var(--border);">
      <div style="display:flex; justify-content:space-between; font-size:13px; color:var(--text-muted); margin-bottom:4px;">
        <span>Total Item</span>
        <span>${totalItem} eksemplar</span>
      </div>
      <div style="display:flex; justify-content:space-between; font-size:16px; font-weight:800; color:var(--secondary);">
        <span>Total Bayar</span>
        <span>Rp ${totalPrice.toLocaleString('id-ID')}</span>
      </div>
    </div>`;

  if (footer) footer.style.display = 'block';
}

function changeQty(kode, delta) {
  const stock = getStock();
  let cart    = getCart();
  const item  = cart.find(c => c.kode === kode);
  const stokItem = stock.find(s => s.kodeBarang === kode);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(c => c.kode !== kode);
  } else if (stokItem && item.qty > stokItem.stok) {
    showToast('Melebihi stok tersedia!', 'error');
    item.qty = stokItem.stok;
  }

  saveCart(cart);
  updateCartBadge();
  renderCartContent();
}

function removeFromCart(kode) {
  let cart = getCart().filter(c => c.kode !== kode);
  saveCart(cart);
  updateCartBadge();
  renderCartContent();
}

// ============================================================
// CHECKOUT
// ============================================================
function checkout() {
  const cart = getCart();
  if (!cart.length) {
    showToast('Keranjang kosong!', 'error');
    return;
  }

  let stock   = getStock();
  let history = getHistory();
  const tracking = getTracking();

  // Generate nomor DO & billing
  const noDO      = Date.now().toString().slice(-10);
  const noBilling = 'BL-' + Math.random().toString(36).substr(2, 8).toUpperCase();
  const tanggal   = new Date().toLocaleDateString('id-ID', { year:'numeric', month:'2-digit', day:'2-digit' }).split('/').reverse().join('-');
  const userName  = sessionStorage.getItem('userName') || 'Pengguna';

  // Kurangi stok & tambah history per item
  cart.forEach(item => {
    const stokItem = stock.find(s => s.kodeBarang === item.kode);
    if (stokItem) stokItem.stok = Math.max(0, stokItem.stok - item.qty);

    history.push({
      id: 'TRX' + Date.now() + Math.floor(Math.random() * 1000),
      tanggal,
      do: noDO,
      pengguna: userName,
      bahanAjar: item.nama,
      jumlah: item.qty,
      status: 'Proses'
    });
  });

  // Tambah data tracking dinamis
  tracking[noDO] = {
    nomorDO: noDO,
    nama: userName,
    status: 'Diproses',
    ekspedisi: 'JNE',
    tanggalKirim: tanggal,
    paket: cart.map(c => c.kode).join(', '),
    total: `${cart.reduce((s, c) => s + c.qty, 0)} eksemplar`,
    progress: 10,
    perjalanan: [
      { waktu: new Date().toLocaleString('id-ID'), keterangan: 'Pesanan diterima dan sedang diproses oleh Universitas Terbuka.' }
    ]
  };

  saveStock(stock);
  saveHistory(history);
  saveTracking(tracking);
  saveCart([]);
  updateCartBadge();
  renderStockGrid();

  const totalHarga = cart.reduce((s, c) => s + (c.qty * c.harga), 0);

  // Tampilkan struk
  const itemList = cart.map(c => `
    <div class="struk-row">
      <span>${c.nama} (${c.qty} eks)</span>
      <span>Rp ${(c.qty * c.harga).toLocaleString('id-ID')}</span>
    </div>`).join('');

  document.getElementById('strukContent').innerHTML = `
    <div class="struk">
      <i class="fas fa-check-circle" style="font-size:40px; color:var(--success); margin-bottom:12px;"></i>
      <h3>SITTA UNIVERSITAS TERBUKA</h3>
      <p style="color:var(--text-muted); font-size:12px; margin:0;">Sistem Informasi Transaksi &amp; Tracking Bahan Ajar</p>
      <hr class="struk-divider"/>
      <p style="font-size:11px; color:var(--text-muted); margin:0 0 4px;">STRUK PENGIRIMAN RESMI</p>
      <p style="font-size:11px; font-weight:700; margin:0 0 16px; color:var(--secondary);">BARANG DALAM PROSES KIRIM</p>
      <div class="struk-row">
        <span style="color:var(--text-muted);">No. Billing</span>
        <span style="font-weight:700;">${noBilling}</span>
      </div>
      <div class="struk-row">
        <span style="color:var(--text-muted);">No. DO / Resi</span>
        <span style="font-weight:700; color:var(--secondary);">${noDO}</span>
      </div>
      <div class="struk-row">
        <span style="color:var(--text-muted);">Pengguna</span>
        <span>${userName}</span>
      </div>
      <div class="struk-row">
        <span style="color:var(--text-muted);">Tanggal</span>
        <span>${tanggal}</span>
      </div>
      <hr class="struk-divider"/>
      ${itemList}
      <hr class="struk-divider"/>
      <div class="struk-row" style="font-size:12px; color:var(--text-muted);">
        <span>Total Item</span>
        <span>${cart.reduce((s, c) => s + c.qty, 0)} eksemplar</span>
      </div>
      <div class="struk-row total" style="margin-top:8px;">
        <span>Total Pembayaran</span>
        <span>Rp ${totalHarga.toLocaleString('id-ID')}</span>
      </div>
      <p style="font-size:11px; color:var(--text-muted); margin-top:14px;">
        Silakan pantau nomor resi di menu <strong>Tracking</strong>.<br/>
        Waktu: ${new Date().toLocaleString('id-ID')}
      </p>
    </div>`;

  closeModal('cartModal');
  openModal('strukModal');
  showToast('Checkout berhasil! Struk sedang ditampilkan.', 'success');
}

// ============================================================
// TAMBAH BAHAN AJAR
// ============================================================
function openAddModal() {
  document.getElementById('addForm').reset();
  openModal('addModal');
}

document.getElementById('addForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const fileInput = document.getElementById('addCover');
  let coverData = '';

  if (fileInput.files && fileInput.files[0]) {
    const file = fileInput.files[0];
    // Helper to read file as DataURL
    coverData = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
    });
  }

  const newItem = {
    kodeLokasi: document.getElementById('addLokasi').value.trim(),
    kodeBarang:  document.getElementById('addKode').value.trim().toUpperCase(),
    namaBarang:  document.getElementById('addNama').value.trim(),
    jenisBarang: document.getElementById('addJenis').value,
    edisi:       document.getElementById('addEdisi').value.trim(),
    stok:        parseInt(document.getElementById('addStok').value),
    limit:       parseInt(document.getElementById('addLimit').value),
    cover:       coverData
  };

  if (!newItem.kodeLokasi || !newItem.kodeBarang || !newItem.namaBarang || isNaN(newItem.stok) || isNaN(newItem.limit)) {
    showToast('Lengkapi semua field!', 'error');
    return;
  }

  const stock = getStock();
  if (stock.find(s => s.kodeBarang === newItem.kodeBarang)) {
    showToast('Kode barang sudah ada!', 'error');
    return;
  }

  stock.push(newItem);
  saveStock(stock);
  renderStockGrid();
  closeModal('addModal');
  showToast(`"${newItem.namaBarang}" berhasil ditambahkan!`, 'success');
});

// ============================================================
// HAPUS BAHAN AJAR
// ============================================================
let deleteTarget = null;

function openDeleteModal(kode) {
  deleteTarget = kode;
  openModal('deleteModal');
}

document.getElementById('confirmDeleteBtn').addEventListener('click', function () {
  if (!deleteTarget) return;
  let stock = getStock().filter(s => s.kodeBarang !== deleteTarget);
  saveStock(stock);
  renderStockGrid();
  closeModal('deleteModal');
  showToast('Bahan ajar berhasil dihapus.', 'success');
  deleteTarget = null;
});

// ============================================================
// INIT
// ============================================================
renderStockGrid();
updateCartBadge();
