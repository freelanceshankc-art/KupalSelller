// ============================================
// MAIN APPLICATION LOGIC
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('report-form');
  const resultSection = document.getElementById('result-section');
  const resultContent = document.getElementById('result-content');
  const submitBtn = document.getElementById('submit-btn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const supplierUsername = document.getElementById('supplier-username').value.trim();
    const platform = document.getElementById('platform').value;

    if (!email || !password || !supplierUsername || !platform) {
      showResult('error', 'Please fill in all fields.');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    try {
      if (!supabase || !supabase.from) {
        throw new Error('Supabase not initialized. Please refresh the page.');
      }

      // Check if this email already exists in the system
      const { data: existingReports, error: matchError } = await supabase
        .from('reports')
        .select('*')
        .eq('email', email);

      if (matchError) throw matchError;

      // Insert the new report
      const { data: newReport, error: insertError } = await supabase
        .from('reports')
        .insert([
          {
            email: email,
            password: password,
            supplier_username: supplierUsername,
            platform: platform
          }
        ])
        .select();

      if (insertError) throw insertError;

      // If there are existing matches, show them
      if (existingReports && existingReports.length > 0) {
        let matchHTML = `
          <div class="match-found">
            <h3>Match Found!</h3>
            <p>This subscription has been reported before:</p>
            <table class="match-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Supplier</th>
                  <th>Platform</th>
                  <th>Reported On</th>
                </tr>
              </thead>
              <tbody>
        `;

        existingReports.forEach(report => {
          const date = new Date(report.created_at).toLocaleDateString();
          matchHTML += `
            <tr>
              <td>${escapeHTML(report.email)}</td>
              <td>${escapeHTML(report.supplier_username)}</td>
              <td>${escapeHTML(report.platform)}</td>
              <td>${date}</td>
            </tr>
          `;
        });

        matchHTML += `
              </tbody>
            </table>
            <p class="warning-text">This seller has been reported ${existingReports.length} time(s) before your report.</p>
          </div>
        `;

        showResult('match', matchHTML);
      } else {
        showResult('success', `
          <div class="no-match">
            <h3>Report Submitted Successfully</h3>
            <p>Your report has been recorded. This is the first report for this subscription.</p>
            <div class="report-summary">
              <p><strong>Email:</strong> ${escapeHTML(email)}</p>
              <p><strong>Supplier:</strong> ${escapeHTML(supplierUsername)}</p>
              <p><strong>Platform:</strong> ${escapeHTML(platform)}</p>
            </div>
          </div>
        `);
      }

      form.reset();
    } catch (error) {
      console.error('Error:', error);
      showResult('error', `<p>Something went wrong: ${escapeHTML(error.message)}</p>`);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Report';
    }
  });

  function showResult(type, content) {
    resultSection.className = `result-section ${type}`;
    resultContent.innerHTML = content;
    resultSection.style.display = 'block';
    resultSection.scrollIntoView({ behavior: 'smooth' });
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }
});
