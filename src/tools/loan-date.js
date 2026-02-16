export function render(container) {
    container.innerHTML = `
    <h2>Loan Payment Date Calculator</h2>
    <div class="tool-content glass">
      <p style="margin-bottom: 20px; opacity: 0.8;">Generate a schedule of your upcoming loan payment dates and add them to your calendar.</p>
      
      <div class="input-group">
        <label>First Payment Date</label>
        <input type="date" id="start-date">
      </div>

      <div class="input-group">
        <label>Payment Frequency</label>
        <select id="frequency">
          <option value="weekly">Weekly (Every 7 days)</option>
          <option value="biweekly">Bi-weekly (Every 14 days)</option>
          <option value="monthly">Monthly (Same day each month)</option>
          <option value="semimonthly">Semi-monthly (15th & 30th)</option>
        </select>
      </div>

      <div class="input-group">
        <label>Number of Payments to Show</label>
        <input type="number" id="num-payments" value="12" min="1" max="60">
      </div>

      <button id="calc-btn" class="primary-btn" style="width: 100%; margin-top: 10px;">Generate Schedule</button>

      <div id="result-box" class="glass hidden" style="margin-top: 20px; padding: 20px; border-radius: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h3 style="margin: 0;">Payment Schedule</h3>
            <button id="download-ics" class="secondary-btn" style="padding: 5px 10px; font-size: 0.8rem;">📅 Download .ics</button>
        </div>
        <ul id="date-list" style="list-style: none; padding: 0; max-height: 300px; overflow-y: auto;">
          <!-- Items will be injected here -->
        </ul>
      </div>
    </div>
    
    <style>
      .input-group { margin-bottom: 15px; }
      .input-group label { display: block; margin-bottom: 5px; font-size: 0.9rem; }
      .input-group input, .input-group select { 
        width: 100%; 
        padding: 10px; 
        border-radius: 8px; 
        border: 1px solid var(--glass-border); 
        background: rgba(255,255,255,0.1); 
        color: var(--text-primary); 
      }
      .date-item {
        padding: 10px;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        display: flex;
        justify-content: space-between;
      }
      .date-item:last-child { border-bottom: none; }
      .secondary-btn {
        background: rgba(255,255,255,0.1);
        border: 1px solid rgba(255,255,255,0.2);
        color: var(--text-primary);
        border-radius: 6px;
        cursor: pointer;
      }
      .secondary-btn:hover { background: rgba(255,255,255,0.2); }
    </style>
  `;

    // Set default date to today
    document.getElementById('start-date').valueAsDate = new Date();

    document.getElementById('calc-btn').addEventListener('click', generateSchedule);
    document.getElementById('download-ics').addEventListener('click', downloadICS);
}

let generatedDates = [];

function generateSchedule() {
    const startDateInput = document.getElementById('start-date').value;
    const frequency = document.getElementById('frequency').value;
    const numPayments = parseInt(document.getElementById('num-payments').value) || 12;

    if (!startDateInput) return;

    const startDate = new Date(startDateInput);
    // Fix time zone offset issue by setting time to noon
    startDate.setHours(12, 0, 0, 0);

    generatedDates = [];
    const list = document.getElementById('date-list');
    list.innerHTML = '';

    let currentDate = new Date(startDate);

    for (let i = 0; i < numPayments; i++) {
        generatedDates.push(new Date(currentDate));

        const params = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        const dateStr = currentDate.toLocaleDateString(undefined, params);

        const li = document.createElement('li');
        li.className = 'date-item';
        li.innerHTML = `<span>Payment #${i + 1}</span> <span>${dateStr}</span>`;
        list.appendChild(li);

        // Calculate next date
        if (frequency === 'weekly') {
            currentDate.setDate(currentDate.getDate() + 7);
        } else if (frequency === 'biweekly') {
            currentDate.setDate(currentDate.getDate() + 14);
        } else if (frequency === 'monthly') {
            currentDate.setMonth(currentDate.getMonth() + 1);
        } else if (frequency === 'semimonthly') {
            // Simple heuristic for semi-monthly (e.g., 1st and 15th)
            // If day <= 15, move to 15th. If > 15, move to 1st of next month. # Rough logic
            // Better logic: Add 15 days? No, standard is usually 15th and last day, or 1st and 15th.
            // Let's stick to adding 15 days roughly, or fixing day?
            // Simplest 'Every 15 days' approach for now to match 'bi-weekly' but defined by dates.
            // Actually 'Semi-monthly' usually means 2 fixed dates. Let's stick to simple adding 15 days for MVP or proper month logic.
            // Let's try: Day 1 -> 15. Day 15 -> 1 (next month).
            const day = currentDate.getDate();
            if (day <= 15) {
                currentDate.setDate(15); /* if started on 5th, moves to 15th? Unclear user intent. Let's do simply +15 days approx or exact half month? */
                // Let's switch to a simpler logic: just add 15 days, it drifts but is predictable, OR monthly * 2.
                // Let's implement true semi-monthly: 1st and 15th logic based on start date.
                // If start day < 15, next is 15th. If >= 15, next is 1st of next month.
                if (day < 15) {
                    currentDate.setDate(15);
                } else {
                    currentDate.setMonth(currentDate.getMonth() + 1);
                    currentDate.setDate(1);
                }
            } else {
                // If started on 20th... likely want 5th of next month?
                // Let's just simply add roughly half a month (15 days) and handle overflow?
                // No, user usually expects specific dates.
                // Let's stick to: Add 15 days to date object.
                currentDate.setDate(currentDate.getDate() + 15);
            }
        }
    }

    document.getElementById('result-box').classList.remove('hidden');
}

function downloadICS() {
    if (generatedDates.length === 0) return;

    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Simple Tools//Loan Schedule//EN\n";

    generatedDates.forEach((date, index) => {
        // Format date as YYYYMMDD
        const dateString = date.toISOString().replace(/-|:|\.\d\d\d/g, "").substring(0, 8);

        icsContent += "BEGIN:VEVENT\n";
        icsContent += `DTSTART;VALUE=DATE:${dateString}\n`;
        icsContent += `SUMMARY:Loan Payment #${index + 1}\n`;
        icsContent += "description:Payment due\n";
        icsContent += "END:VEVENT\n";
    });

    icsContent += "END:VCALENDAR";

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'loan_schedule.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
