// ==========================================
// 🚀 100% DYNAMIC PAGE CONFIGURATION
// ==========================================
let sitePages = []; 
let statIntervals = []; 
let trafficChart = null; 

document.addEventListener("DOMContentLoaded", async () => {
    await initAppConfig();
});

// Auto fetch pages.json
async function initAppConfig() {
    try {
        const response = await fetch('pages.json');
        if (!response.ok) throw new Error("pages.json not found!");
        
        sitePages = await response.json(); 
        buildNavigationBar();
        loadPage(sitePages[0].id); 
    } catch (error) {
        console.error("Configuration Load Error:", error);
        document.getElementById('content-area').innerHTML = `<h2 style="color:red; text-align:center; margin-top:50px;">Critical Error: Could not load pages.json!</h2>`;
    }
}

function openProfile() { document.getElementById('profileModal').style.display = 'flex'; }
function closeProfile(e) {
    if(!e || e.target.classList.contains('modal-overlay') || e.target.classList.contains('close-btn') || e.target.classList.contains('modal-close-btn')) {
        document.getElementById('profileModal').style.display = 'none';
    }
}

function buildNavigationBar() {
    const navContainer = document.getElementById('dynamic-nav');
    navContainer.innerHTML = ''; 
    sitePages.forEach(page => {
        const li = document.createElement('li');
        li.innerHTML = `<a id="nav-${page.id}" onclick="loadPage('${page.id}')"><i class="${page.icon}"></i> ${page.title}</a>`;
        navContainer.appendChild(li);
    });
}

async function loadPage(pageId) {
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
        contentArea.innerHTML = await response.text();

        // Post-load Init
        if (pageId === 'commands') loadCommandsFromFile();
        if (pageId === 'stats') initStatsPage();
        if (pageId === 'hosting') initHostingPage();
    } catch (error) {
        contentArea.innerHTML = `<h2 style="color:red; text-align:center; margin-top:50px;">Error: ${pageConfig.file} not found!</h2>`;
    }
}

// --- COMMANDS LOGIC ---
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
    } catch(e) { tableBody.innerHTML = `<tr><td colspan="4" style="color:red; text-align:center;">Failed to load commands.txt</td></tr>`; }
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

// --- STATS LOGIC ---
function initStatsPage() {
    const ctx = document.getElementById('trafficChart');
    if(!ctx) return;
    if(trafficChart) trafficChart.destroy(); 
    let dataPoints = Array.from({length: 30}, () => Math.floor(Math.random() * 80) + 20);
    trafficChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({length: 30}, (_, i) => i),
            datasets: [{ label: 'Traffic (Mbps)', data: dataPoints, borderColor: '#00d2ff', backgroundColor: 'rgba(0, 210, 255, 0.1)', borderWidth: 2, fill: true, tension: 0.3, pointRadius: 0 }]
        },
        options: { responsive: true, maintainAspectRatio: false, animation: { duration: 0 }, scales: { x: { display: false }, y: { display: false, min: 0, max: 120 } }, plugins: { legend: { display: false } } }
    });

    let statTimer = setInterval(() => {
        document.getElementById('cpu-val').innerText = (Math.floor(Math.random() * 20) + 15) + '%';
        document.getElementById('ram-val').innerText = (Math.random() * 1.5 + 4.0).toFixed(1);
        let netSpeed = Math.floor(Math.random() * 50) + 40;
        document.getElementById('net-val').innerText = netSpeed;
        document.getElementById('m-temp').innerText = (Math.floor(Math.random() * 10) + 35) + '°C';
        document.getElementById('m-read').innerText = (Math.random() * 15 + 25).toFixed(1) + ' MB/s';
        document.getElementById('m-write').innerText = (Math.random() * 10 + 10).toFixed(1) + ' MB/s';
        document.getElementById('m-api').innerText = Math.floor(Math.random() * 100) + 300;
        let currentData = trafficChart.data.datasets[0].data;
        currentData.shift(); currentData.push(netSpeed); trafficChart.update();
    }, 2000);

    const logBox = document.getElementById('sys-logs');
    const logMessages = ["User Login: 192.168.x.x", "API GET /status [200]", "Cache Hit (12ms)", "DB Query (15ms)", "Docker container 'nginx' restarted", "Warning: High memory usage detected"];
    let logTimer = setInterval(() => {
        let time = new Date().toLocaleTimeString('en-US', {hour12:false});
        let msg = logMessages[Math.floor(Math.random() * logMessages.length)];
        let isErr = msg.includes("Warning");
        logBox.insertAdjacentHTML('afterbegin', `<div class="log-line"><span class="log-time">[${time}]</span><span class="log-msg ${isErr ? 'log-err' : ''}">${msg}</span></div>`);
        if(logBox.children.length > 20) logBox.removeChild(logBox.lastChild);
    }, 3500);

    statIntervals.push(statTimer, logTimer);
}

// --- HOSTING UI LOGIC ---
const hostingPanels = [
    { name: "HuggingFace Vps", text: `File Download Link:\nhttps://drive.google.com/file/d/1s7dLBOjpVERkewuQ5uIe1DkpKypkkYoX/view?usp=drivesdk\n\n------------------------------------------------------\n\nVPS INSTALL AND CREATE CMD:\n\nbash <(curl -s https://ptero.nobitahost.in)`, link: "https://youtu.be/cV0tyddLcMY" },
    { name: "Platit.GG Alternative", text: `bash <(curl -sL https://raw.githubusercontent.com/sdgamer8263-sketch/SDGAMER.HOST/main/run.sh)`, link: "https://youtu.be/Z97hyH8t3NA" },
    { name: "VPS / VDS Control Panel", text: `bash <(curl -sL https://raw.githubusercontent.com/sdgamer8263-sketch/SDGAMER.HOST/main/run.sh)`, link: "https://youtu.be/ymYQdANL5UQ" },
    { name: "Pterodactyl Extention (One Line)", text: `Extention File Download Link:\nhttps://drive.google.com/drive/folders/1-omcJP6NZAOe8JEsIkUOBYkOXBUkWcoA\n\nCOMMAND:\n\ncd /var/www/pterodactyl/\nbash <(curl -fsSL https://raw.githubusercontent.com/sdgamer8263-sketch/pterodactyl_extention/main/install.sh)\n\nPASTE THIS:\n\nbash <(curl -fsSL https://raw.githubusercontent.com/hopingboyz/blueprint/main/addon-installer.sh)`, noLink: true },
    { name: "Hydra Panel + Dashboard", text: `Panel install:\n\nsudo su\nbash <(curl -s https://raw.githubusercontent.com/JishnuTheGamer/dashboard/refs/heads/main/dash)\n\nNode install:\ngit clone https://github.com/hydren-dev/HydraDAEMON\ncd HydraDAEMON\nnpm install\npaste your configure of node\nnode`, link: "https://youtu.be/iYV1f5FGdqU" },
    { name: "Skyport Panel", text: `PANEL INSTALL:\nsudo su\nbash <(curl -s https://raw.githubusercontent.com/JishnuTheGamer/skyport/refs/heads/main/panel)\n\nWINGS/NODE INSTALL:\nsudo su\nbash <(curl -s https://raw.githubusercontent.com/JishnuTheGamer/skyport/refs/heads/main/wings)\ncd skyportd\npm2 start .`, link: "https://youtu.be/wDGOeEu6tuI" },
    { name: "Puffer Panel 2", text: `bash <(curl -s https://raw.githubusercontent.com/JishnuTheGamer/puffer-panel/refs/heads/main/install)\n\nAdmin user create:\nsudo pufferpanel user add\nsudo systemctl enable --now pufferpanel`, link: "https://youtu.be/wDGOeEu6tuI" }
];

function initHostingPage() {
    const cardsBox = document.getElementById("hosting-cards");
    if(!cardsBox) return;
    cardsBox.innerHTML = '';
    hostingPanels.forEach(p => {
        const d = document.createElement("div");
        d.className = "hosting-card";
        d.innerHTML = `<span>${p.name}</span> <i class="fas fa-chevron-right" style="color:#00d2ff;"></i>`;
        d.onclick = () => showHostingPanel(p);
        cardsBox.appendChild(d);
    });
}

function showHostingPanel(data) {
    const out = document.getElementById("hosting-output");
    out.innerHTML = "";
    let lines = data.text.split("\n");
    let li = 0;
    const typingSpeed = 15;

    function type() {
        if (li >= lines.length) {
            if (!data.noLink && data.link) {
                const btn = document.createElement("a");
                btn.className = "hosting-guide-btn"; btn.href = data.link; btn.target = "_blank";
                btn.innerHTML = "<i class='fab fa-youtube'></i> Guide Video";
                out.appendChild(btn);
            }
            return;
        }

        const row = document.createElement("div"); row.className = "hosting-line";
        const span = document.createElement("span"); span.className = "hosting-command-text";
        const copyBtn = document.createElement("button"); copyBtn.className = "hosting-copy";
        copyBtn.innerHTML = "<i class='fas fa-copy'></i> COPY";
        
        const currentLineText = lines[li];
        copyBtn.onclick = () => {
            navigator.clipboard.writeText(currentLineText);
            copyBtn.innerHTML = "<i class='fas fa-check'></i> DONE"; copyBtn.style.background = "#00ff88";
            setTimeout(() => { copyBtn.innerHTML = "<i class='fas fa-copy'></i> COPY"; copyBtn.style.background = "#00d2ff"; }, 1200);
        };

        if (currentLineText.trim() === "") { copyBtn.style.display = "none"; row.style.border = "none"; row.style.marginBottom = "5px"; }
        row.appendChild(span); row.appendChild(copyBtn); out.appendChild(row);
        
        let charIdx = 0;
        function typeChar() {
            if (charIdx < currentLineText.length) { span.textContent += currentLineText[charIdx++]; setTimeout(typeChar, typingSpeed); } 
            else { li++; setTimeout(type, 100); }
        }
        typeChar();
    }
    type();
}

function filterHostingCards() {
    const v = document.getElementById("hostingSearch").value.toLowerCase();
    document.querySelectorAll(".hosting-card").forEach(c => { c.style.display = c.innerText.toLowerCase().includes(v) ? "flex" : "none"; });
}
