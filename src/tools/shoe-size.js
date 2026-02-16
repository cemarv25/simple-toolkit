export function render(container) {
    container.innerHTML = `
    <h2>Shoe Size Comparison</h2>
    <div class="tool-content glass">
      <p style="margin-bottom: 20px; opacity: 0.8;">Convert between US, EU, and MX shoe sizes for Men and Women.</p>
      
      <div class="input-group" style="text-align: center; margin-bottom: 20px;">
        <div style="display: inline-flex; background: rgba(0,0,0,0.2); padding: 5px; border-radius: 8px;">
            <button id="gender-men" class="gender-btn active">Men's</button>
            <button id="gender-women" class="gender-btn">Women's</button>
        </div>
      </div>

      <div class="converter-box" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 30px;">
        <div class="input-group">
          <label>US Size</label>
          <select id="size-us"></select>
        </div>
        <div class="input-group">
          <label>EU Size</label>
          <select id="size-eu"></select>
        </div>
        <div class="input-group">
          <label>MX Size (cm)</label>
          <select id="size-mx"></select>
        </div>
      </div>

      <h3 style="margin-bottom: 15px;">Reference Chart</h3>
      <div style="overflow-x: auto;">
        <table id="size-table" style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
          <thead>
            <tr style="background: rgba(255,255,255,0.1);">
              <th style="padding: 10px;">US</th>
              <th style="padding: 10px;">EU</th>
              <th style="padding: 10px;">MX (cm)</th>
              <th style="padding: 10px;">UK</th>
            </tr>
          </thead>
          <tbody id="table-body">
            <!-- Rows injected here -->
          </tbody>
        </table>
      </div>
    </div>
    
    <style>
      .gender-btn {
        background: transparent;
        border: none;
        color: var(--text-secondary);
        padding: 8px 20px;
        cursor: pointer;
        font-weight: 500;
        border-radius: 6px;
        transition: all 0.2s;
      }
      .gender-btn.active {
        background: var(--primary-color, rgba(255,255,255,0.2));
        color: var(--text-primary);
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      }
      .input-group label { display: block; margin-bottom: 5px; font-size: 0.85rem; text-align: center; }
      .input-group select { 
        width: 100%; 
        padding: 10px; 
        border-radius: 8px; 
        border: 1px solid var(--glass-border); 
        background: rgba(255,255,255,0.1); 
        color: var(--text-primary);
        text-align: center;
      }
      table th, table td { padding: 10px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.05); }
      table tr:hover { background: rgba(255,255,255,0.05); }
    </style>
  `;

    setupLogic();
}

// Data Source
const sizeData = {
    men: [
        { us: 6, eu: 39, mx: 24, uk: 5.5 },
        { us: 6.5, eu: 39, mx: 24.5, uk: 6 },
        { us: 7, eu: 40, mx: 25, uk: 6.5 },
        { us: 7.5, eu: 40.5, mx: 25.5, uk: 7 },
        { us: 8, eu: 41, mx: 26, uk: 7.5 },
        { us: 8.5, eu: 42, mx: 26.5, uk: 8 },
        { us: 9, eu: 42.5, mx: 27, uk: 8.5 },
        { us: 9.5, eu: 43, mx: 27.5, uk: 9 },
        { us: 10, eu: 44, mx: 28, uk: 9.5 },
        { us: 10.5, eu: 44.5, mx: 28.5, uk: 10 },
        { us: 11, eu: 45, mx: 29, uk: 10.5 },
        { us: 11.5, eu: 45.5, mx: 29.5, uk: 11 },
        { us: 12, eu: 46, mx: 30, uk: 11.5 },
        { us: 13, eu: 47.5, mx: 31, uk: 12.5 },
        { us: 14, eu: 48.5, mx: 32, uk: 13.5 }
    ],
    women: [
        { us: 5, eu: 35.5, mx: 22, uk: 3 },
        { us: 5.5, eu: 36, mx: 22.5, uk: 3.5 },
        { us: 6, eu: 36.5, mx: 23, uk: 4 },
        { us: 6.5, eu: 37.5, mx: 23.5, uk: 4.5 },
        { us: 7, eu: 38, mx: 24, uk: 5 },
        { us: 7.5, eu: 38.5, mx: 24.5, uk: 5.5 },
        { us: 8, eu: 39, mx: 25, uk: 6 },
        { us: 8.5, eu: 39.5, mx: 25.5, uk: 6.5 },
        { us: 9, eu: 40, mx: 26, uk: 7 },
        { us: 9.5, eu: 40.5, mx: 26.5, uk: 7.5 },
        { us: 10, eu: 41, mx: 27, uk: 8 },
        { us: 10.5, eu: 41.5, mx: 27.5, uk: 8.5 },
        { us: 11, eu: 42, mx: 28, uk: 9 }
    ]
};

let currentGender = 'men';

function setupLogic() {
    const btnMen = document.getElementById('gender-men');
    const btnWomen = document.getElementById('gender-women');

    btnMen.addEventListener('click', () => {
        currentGender = 'men';
        btnMen.classList.add('active');
        btnWomen.classList.remove('active');
        updateUI();
    });

    btnWomen.addEventListener('click', () => {
        currentGender = 'women';
        btnWomen.classList.add('active');
        btnMen.classList.remove('active');
        updateUI();
    });

    updateUI();

    // Change listeners for bidirectional conversion
    document.getElementById('size-us').addEventListener('change', (e) => syncSizes('us', e.target.value));
    document.getElementById('size-eu').addEventListener('change', (e) => syncSizes('eu', e.target.value));
    document.getElementById('size-mx').addEventListener('change', (e) => syncSizes('mx', e.target.value));
}

function updateUI() {
    const data = sizeData[currentGender];
    const tableBody = document.getElementById('table-body');

    // Update Select Options
    const selUS = document.getElementById('size-us');
    const selEU = document.getElementById('size-eu');
    const selMX = document.getElementById('size-mx');

    selUS.innerHTML = '';
    selEU.innerHTML = '';
    selMX.innerHTML = '';

    data.forEach(row => {
        selUS.add(new Option(row.us, row.us));
        selEU.add(new Option(row.eu, row.eu));
        selMX.add(new Option(row.mx, row.mx));
    });

    // Populate Table
    tableBody.innerHTML = '';
    data.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${row.us}</td><td>${row.eu}</td><td>${row.mx}</td><td>${row.uk}</td>`;
        tableBody.appendChild(tr);
    });
}

function syncSizes(sourceType, value) {
    const data = sizeData[currentGender];
    const row = data.find(r => r[sourceType] == value);

    if (row) {
        if (sourceType !== 'us') document.getElementById('size-us').value = row.us;
        if (sourceType !== 'eu') document.getElementById('size-eu').value = row.eu;
        if (sourceType !== 'mx') document.getElementById('size-mx').value = row.mx;
    }
}
