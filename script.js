// ==========================================
// 🚀 DYNAMIC PAGE CONFIGURATION
// ==========================================
const sitePages = [
    { id: 'home', title: 'About', icon: 'fas fa-info-circle', file: 'home.html' },
    { id: 'team', title: 'Team', icon: 'fas fa-users', file: 'team.html' },
    { id: 'commands', title: 'Commands', icon: 'fas fa-terminal', file: 'commands.html' },
    { id: 'stats', title: 'Stats', icon: 'fas fa-chart-line', file: 'stats.html' }
];

let statIntervals = []; // To clear intervals when switching pages
let trafficChart = null; // Store chart instance

document.addEventListener("DOMContentLoaded", () => {
    buildNavigationBar();
    loadPage('home'); 
});

// Profile Modal Logic
function openProfile() {
    document.getElementById('profileModal').style.display = 'flex';
}
function closeProfile(e) {
    if(!e || e.target.classList.contains('modal-overlay') || e.target.classList.contains('close-btn') || e.target.classList.contains('modal-close-btn')) {
        document.getElementById('profileModal').style.display = 'none';
    }
}

// ==========================================
// 📑 AUTO NAVBAR BUILDER
// ==========================================
function buildNavigationBar() {
    const navContainer = document.getElementById('dynamic-nav');
    navContainer.innerHTML = ''; 

    sitePages.forEach(page => {
        const li = document.createElement('li');
        li.innerHTML = `<a id="nav-${page.id}" onclick="loadPage('${page.id}')">
                            <i class="${page.icon}"></i> ${page.title}
                        </a>`;
        navContainer.appendChild(li);
    });
}

// ==========================================
// 🔄 PAGE LOADER (Fetches individual HTML files)
// ==========================================
async function loadPage(pageId) {
    // Clear any running stat intervals if leaving Stats page
    statIntervals.forEach(clearInterval);
    statIntervals = [];

    const contentArea = document.getElementById('content-area');
    const pageConfig = sitePages.find(p => p.id === pageId);
    if (!pageConfig) return;

    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active-tab'));
    document.getElementById(`nav-${pageId}`).classList.add('active-tab');

    try {
        contentArea.innerHTML = `<h2 style="text-align:center; margin-top: 50px;"><i class="fas fa-spinner fa-spin"></i> Loading...</h2>`;
        
        const response = await fetch(pageConfig.file);
        if (!response.ok) throw new Error("File not found");
        
        const html = await response.text();
        contentArea.innerHTML = html;

        // Post-load Initialization
        if (pageId === 'commands') loadCommandsFromFile();
        if (pageId === 'stats') initStatsPage();

    } catch (error) {
        contentArea.innerHTML = `<h2 style="color:red; text-align:center; margin-top:50px;">Error: ${pageConfig.file} not found!</h2>`;
    }
}

// ==========================================
// 📄 COMMANDS PARSER
// ==========================================
async function loadCommandsFromFile() {
    const tableBody = document.querySelector('#cmdTable tbody');
    if(!tableBody) return;

    try {
        const response = await fetch('commands.txt');
        const text = await response.text();
        const lines = text.split('\n');
        let tbodyHTML = '';

        lines.forEach(line => {
            line = line.trim();
            if(!line) return;
            const match = line.match(/^([^-]+)-(.*?)-?\s*'(.*)'\s*$/);
            if(match) {
                const category = match[1].trim().toUpperCase();
                const title = match[2].trim();
                const command = match[3].trim();
                const badgeClass = category.toLowerCase().replace(/\s+/g, '-');
                const safeCommand = command.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/"/g, "&quot;");

                tbodyHTML += `<tr>
                    <td><span class="badge ${badgeClass}">${category}</span></td>
                    <td>${title}</td>
                    <td><code>${command}</code></td>
                    <td style="text-align: right;">
                        <button class="tbl-copy-btn" onclick="copyTableCmd(this, '${safeCommand}')"><i class="fas fa-copy"></i></button>
                    </td>
                </tr>`;
            }
        });
        tableBody.innerHTML = tbodyHTML;
    } catch(e) {
        tableBody.innerHTML = `<tr><td colspan="4" style="color:red; text-align:center;">Failed to load commands.txt file.</td></tr>`;
    }
}

function copyTableCmd(btn, cmd) {
    navigator.clipboard.writeText(cmd).then(() => {
        btn.innerHTML = '<i class="fas fa-check" style="color:#00ff88"></i>';
        setTimeout(() => btn.innerHTML = '<i class="fas fa-copy"></i>', 2000);
    });
}

function filterCategory(category, btnElement) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    btnElement.classList.add('active');
    document.getElementById("cmdSearch").value = "";
    
    let tr = document.getElementById("cmdTable").getElementsByTagName("tr");
    for (let i = 1; i < tr.length; i++) {
        let catTd = tr[i].getElementsByTagName("td")[0];
        if (catTd) {
            let catText = catTd.innerText.toUpperCase().trim();
            tr[i].style.display = (category === 'ALL' || catText === category) ? "" : "none";
        }
    }
}

function searchCommands() {
    let input = document.getElementById("cmdSearch").value.toUpperCase();
    let tr = document.getElementById("cmdTable").getElementsByTagName("tr");
    for (let i = 1; i < tr.length; i++) {
        let display = false;
        let tds = tr[i].getElementsByTagName("td");
        for(let j=0; j<tds.length; j++) if(tds[j] && tds[j].innerText.toUpperCase().indexOf(input) > -1) display = true;
        tr[i].style.display = display ? "" : "none";
    }
}

// ==========================================
// 📊 STATS & ANALYTICS PAGE LOGIC
// ==========================================
function initStatsPage() {
    // 1. Initialize Chart
    const ctx = document.getElementById('trafficChart');
    if(!ctx) return;

    if(trafficChart) trafficChart.destroy(); // Clear old chart

    // Create initial data points
    let dataPoints = Array.from({length: 30}, () => Math.floor(Math.random() * 80) + 20);

    trafficChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({length: 30}, (_, i) => i),
            datasets: [{
                label: 'Traffic (Mbps)',
                data: dataPoints,
                borderColor: '#00d2ff',
                backgroundColor: 'rgba(0, 210, 255, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.3,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            animation: { duration: 0 },
            scales: { x: { display: false }, y: { display: false, min: 0, max: 120 } },
            plugins: { legend: { display: false } }
        }
    });

    // 2. Set Intervals for Fake Data Updates
    let statTimer = setInterval(() => {
        // Top Cards
        document.getElementById('cpu-val').innerText = (Math.floor(Math.random() * 20) + 15) + '%';
        document.getElementById('ram-val').innerText = (Math.random() * 1.5 + 4.0).toFixed(1);
        let netSpeed = Math.floor(Math.random() * 50) + 40;
        document.getElementById('net-val').innerText = netSpeed;
        
        // Extended Metrics
        document.getElementById('m-temp').innerText = (Math.floor(Math.random() * 10) + 35) + '°C';
        document.getElementById('m-read').innerText = (Math.random() * 15 + 25).toFixed(1) + ' MB/s';
        document.getElementById('m-write').innerText = (Math.random() * 10 + 10).toFixed(1) + ' MB/s';
        document.getElementById('m-api').innerText = Math.floor(Math.random() * 100) + 300;

        // Update Chart
        let currentData = trafficChart.data.datasets[0].data;
        currentData.shift(); // remove first
        currentData.push(netSpeed); // add new
        trafficChart.update();

    }, 2000);

    // 3. System Logs Generator
    const logBox = document.getElementById('sys-logs');
    const logMessages = [
        "User Login: 192.168.x.x", "API GET /status [200]", "Cache Hit (12ms)", 
        "DB Query (15ms)", "Docker container 'nginx' restarted", "Warning: High memory usage detected"
    ];

    let logTimer = setInterval(() => {
        let time = new Date().toLocaleTimeString('en-US', {hour12:false});
        let msg = logMessages[Math.floor(Math.random() * logMessages.length)];
        let isErr = msg.includes("Warning");
        
        let logHTML = `<div class="log-line">
            <span class="log-time">[${time}]</span>
            <span class="log-msg ${isErr ? 'log-err' : ''}">${msg}</span>
        </div>`;
        
        logBox.insertAdjacentHTML('afterbegin', logHTML);
        if(logBox.children.length > 20) logBox.removeChild(logBox.lastChild);
    }, 3500);

    statIntervals.push(statTimer, logTimer);
}
