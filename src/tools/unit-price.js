export function render(container) {
    container.innerHTML = `
    <h2>Unit Price Calculator</h2>
    <div class="tool-content glass">
      <p style="margin-bottom: 20px; opacity: 0.8;">Compare two items to find out which one offers better value for money.</p>
      
      <div class="comparison-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
        <!-- Item A -->
        <div class="item-card" style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 12px;">
          <h3 style="margin-top: 0;">Item A</h3>
          <div class="input-group">
            <label>Price ($)</label>
            <input type="number" id="price-a" placeholder="0.00" step="0.01">
          </div>
          <div class="input-group">
            <label>Quantity / Weight</label>
            <div style="display: flex; gap: 10px;">
              <input type="number" id="qty-a" placeholder="0" step="any">
              <select id="unit-a" style="width: 80px;">
                <option value="1">Units</option>
                <option value="1">g</option>
                <option value="1000">kg</option>
                <option value="1">ml</option>
                <option value="1000">L</option>
                <option value="28.3495">oz</option>
                <option value="453.592">lb</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Item B -->
        <div class="item-card" style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 12px;">
          <h3 style="margin-top: 0;">Item B</h3>
          <div class="input-group">
            <label>Price ($)</label>
            <input type="number" id="price-b" placeholder="0.00" step="0.01">
          </div>
          <div class="input-group">
            <label>Quantity / Weight</label>
            <div style="display: flex; gap: 10px;">
              <input type="number" id="qty-b" placeholder="0" step="any">
              <select id="unit-b" style="width: 80px;">
                <option value="1">Units</option>
                <option value="1">g</option>
                <option value="1000">kg</option>
                <option value="1">ml</option>
                <option value="1000">L</option>
                <option value="28.3495">oz</option>
                <option value="453.592">lb</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <button id="calc-btn" class="primary-btn" style="width: 100%;">Calculate Best Value</button>

      <div id="result-box" class="glass hidden" style="margin-top: 20px; padding: 20px; border-radius: 12px; text-align: center;">
        <h3 id="winner-text" style="font-size: 1.5rem; color: var(--success-color);">Item A is Cheaper!</h3>
        <p id="savings-text" style="margin: 10px 0; font-size: 1.1rem;"></p>
        <div style="display: flex; justify-content: space-around; margin-top: 15px; font-size: 0.9rem; opacity: 0.8;">
          <div>Item A: <span id="unit-price-a"></span> / unit</div>
          <div>Item B: <span id="unit-price-b"></span> / unit</div>
        </div>
      </div>
    </div>
    
    <style>
      .input-group { margin-bottom: 15px; }
      .input-group label { display: block; margin-bottom: 5px; font-size: 0.9rem; }
      .input-group input, .input-group select { 
        width: 100%; 
        padding: 8px; 
        border-radius: 8px; 
        border: 1px solid var(--glass-border); 
        background: rgba(255,255,255,0.1); 
        color: var(--text-primary); 
      }
      @media (max-width: 600px) {
        .comparison-grid { grid-template-columns: 1fr !important; }
      }
    </style>
  `;

    document.getElementById('calc-btn').addEventListener('click', calculate);
}

function calculate() {
    const priceA = parseFloat(document.getElementById('price-a').value);
    const qtyA = parseFloat(document.getElementById('qty-a').value);
    const unitA = parseFloat(document.getElementById('unit-a').value);

    const priceB = parseFloat(document.getElementById('price-b').value);
    const qtyB = parseFloat(document.getElementById('qty-b').value);
    const unitB = parseFloat(document.getElementById('unit-b').value);

    if (!priceA || !qtyA || !priceB || !qtyB) return;

    // Normalize quantity (e.g. convert kg to g equivalent base)
    // Unit value represents multiplier to base unit (1 for g/ml, 1000 for kg/L)
    const normQtyA = qtyA * unitA;
    const normQtyB = qtyB * unitB;

    const unitPriceA = priceA / normQtyA;
    const unitPriceB = priceB / normQtyB;

    const resultBox = document.getElementById('result-box');
    const winnerText = document.getElementById('winner-text');
    const savingsText = document.getElementById('savings-text');

    resultBox.classList.remove('hidden');

    let baseMultiplier = 1;
    // If base unit is very small (like 1g), unit price matches will be tiny ($0.0005). 
    // Maybe show price per 100 or 1000 units if numbers are small?
    // For simplicity, let's keep raw unit calculation but format nicely.

    document.getElementById('unit-price-a').textContent = '$' + unitPriceA.toFixed(4);
    document.getElementById('unit-price-b').textContent = '$' + unitPriceB.toFixed(4);

    if (unitPriceA < unitPriceB) {
        winnerText.textContent = "Item A is the Best Value! 🏆";
        const percent = ((unitPriceB - unitPriceA) / unitPriceB * 100).toFixed(1);
        savingsText.textContent = `Save ${percent}% compared to Item B`;
    } else if (unitPriceB < unitPriceA) {
        winnerText.textContent = "Item B is the Best Value! 🏆";
        const percent = ((unitPriceA - unitPriceB) / unitPriceA * 100).toFixed(1);
        savingsText.textContent = `Save ${percent}% compared to Item A`;
    } else {
        winnerText.textContent = "Both items have the same value! 🤝";
        savingsText.textContent = "There is no price difference per unit.";
    }
}
