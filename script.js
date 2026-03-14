// Tab Switching System
function showSection(sectionId, element) {
    document.querySelectorAll('section').forEach(sec => sec.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';
    
    if(element) {
        document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active-tab'));
        element.classList.add('active-tab');
    }

    if(sectionId === 'team') fetchDiscordTeam();
}

// Master Command Copy
function copyCmd() {
    const codeText = "bash <(curl -sL https://raw.githubusercontent.com/sdgamer8263-sketch/SDGAMER.HOST/main/run.sh)";
    navigator.clipboard.writeText(codeText).then(() => {
        alert("Master Command Copied! 🔥");
    });
}

// Live Fake Stats
setInterval(() => {
    document.getElementById('live-cpu').innerText = (Math.floor(Math.random() * 30) + 15) + '%';
    document.getElementById('live-ram').innerHTML = (Math.random() * 2.5 + 5.0).toFixed(1) + 'GB <small>/ 32GB</small>';
    document.getElementById('live-net').innerText = (Math.floor(Math.random() * 50) + 40) + ' Mbps';
    document.getElementById('fake-ping').innerText = (Math.floor(Math.random() * 5) + 20) + 'ms';
}, 2500);

// ==========================================
// TABLE COPY BUTTON AUTOMATION
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const table = document.getElementById('cmdTable');
    if(!table) return;

    const headerRow = table.querySelector('tr');
    if(headerRow) {
        const actionTh = document.createElement('th');
        actionTh.innerText = 'ACTION';
        actionTh.style.textAlign = 'right';
        headerRow.appendChild(actionTh);
    }

    const rows = table.querySelectorAll('tr:not(:first-child)');
    rows.forEach(row => {
        const codeCell = row.querySelectorAll('td')[2];
        if(codeCell) {
            const codeText = codeCell.querySelector('code').innerText;
            const actionTd = document.createElement('td');
            actionTd.style.textAlign = 'right';
            
            const copyBtn = document.createElement('button');
            copyBtn.className = 'tbl-copy-btn';
            copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
            copyBtn.title = "Copy Command";
            
            copyBtn.onclick = function() {
                navigator.clipboard.writeText(codeText).then(() => {
                    copyBtn.innerHTML = '<i class="fas fa-check"></i>';
                    copyBtn.style.background = 'rgba(0, 255, 136, 0.2)';
                    copyBtn.style.color = '#00ff88';
                    copyBtn.style.borderColor = '#00ff88';
                    
                    setTimeout(() => {
                        copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
                        copyBtn.style.background = '';
                        copyBtn.style.color = '';
                        copyBtn.style.borderColor = '';
                    }, 2000);
                });
            };
            
            actionTd.appendChild(copyBtn);
            row.appendChild(actionTd);
        }
    });
});

// ==========================================
// REAL LIVE DISCORD API FETCH
// ==========================================
async function fetchDiscordTeam() {
    const container = document.getElementById('team-container');
    try {
        const res = await fetch('https://discord.com/api/guilds/1472601008998846576/widget.json');
        const data = await res.json();
        
        container.innerHTML = `
            <div class="member-card">
                <img src="ttttttttttttttttttttttttttttt.png" alt="SDGAMER">
                <h3 style="color: #fff;">SDGAMER</h3>
                <p style="color: #ed4245; font-weight: bold; font-size: 0.85rem; margin-top: 5px;">👑 Founder & Owner</p>
            </div>
        `;

        if(data.members && data.members.length > 0) {
            data.members.forEach(member => {
                let statusClass = member.status === 'online' ? 'status-online' : (member.status === 'idle' ? 'status-idle' : 'status-dnd');
                container.innerHTML += `
                    <div class="member-card">
                        <img src="${member.avatar_url}" alt="${member.username}">
                        <h4 style="color: #fff;"><span class="status-dot ${statusClass}"></span> ${member.username}</h4>
                        <p style="color: #aaa; font-size: 0.8rem; margin-top: 5px;">Community Member</p>
                    </div>
                `;
            });
        }
    } catch (e) {
        container.innerHTML = `<p style="color:red;">Error fetching team data.</p>`;
    }
}

// ==========================================
// ADVANCED MINECRAFT SERVER STATUS (IP + PORT)
// ==========================================
async function checkMCStatus() {
    let ip = document.getElementById("mc-ip").value;
    let port = document.getElementById("mc-port").value;
    let resultDiv = document.getElementById("mc-result");
    
    if(!ip) {
        resultDiv.style.display = "block";
        return resultDiv.innerText = "Please enter Server IP.";
    }

    let fullAddress = port ? `${ip}:${port}` : ip;
    
    resultDiv.style.display = "block";
    resultDiv.innerHTML = "Fetching Server Data... <i class='fas fa-spinner fa-spin'></i>";
    
    try {
        let res = await fetch(`https://api.mcsrvstat.us/3/${fullAddress}`);
        let data = await res.json();
        
        if(data.online) {
            let cleanMotd = data.motd.clean.join('<br>');
            resultDiv.innerHTML = `
                <div style="margin-bottom: 8px;"><strong>Status:</strong> <span style="color:#00ff88;">ONLINE</span></div>
                <div style="margin-bottom: 8px;"><strong>IP:</strong> <span style="color:#00d2ff;">${data.ip}:${data.port}</span></div>
                <div style="margin-bottom: 8px;"><strong>Players:</strong> <span style="color:#ffcc00;">${data.players.online} / ${data.players.max}</span></div>
                <div style="margin-bottom: 8px;"><strong>Version:</strong> <span style="color:#fff;">${data.version}</span></div>
                ${data.software ? `<div style="margin-bottom: 8px;"><strong>Software:</strong> <span style="color:#aaa;">${data.software}</span></div>` : ''}
                <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.1);">
                    <strong>MOTD:</strong><br>
                    <span style="color: #ccc; font-family: monospace; font-size: 0.85rem;">${cleanMotd}</span>
                </div>
            `;
        } else {
            resultDiv.innerHTML = `<strong>Status:</strong> <span style="color:#ff3232;">OFFLINE or INVALID</span>`;
        }
    } catch(e) {
        resultDiv.innerHTML = "<span style='color:red;'>Error connecting to API.</span>";
    }
}

// ==========================================
// REAL PAPERMC LATEST BUILD FETCHER
// ==========================================
async function checkPaperBuild() {
    let ver = document.getElementById("paper-ver").value;
    let resultDiv = document.getElementById("paper-result");
    if(!ver) return resultDiv.innerText = "Please enter version (e.g., 1.20.4).";

    resultDiv.style.display = "block";
    resultDiv.innerHTML = "Fetching...";
    try {
        let res = await fetch(`https://api.papermc.io/v2/projects/paper/versions/${ver}`);
        if(res.status === 404) return resultDiv.innerHTML = `<span style="color:#ff3232;">Version not found.</span>`;
        let data = await res.json();
        let latestBuild = data.builds[data.builds.length - 1];
        resultDiv.innerHTML = `Latest Build for ${ver}: <span style="color:#00ffcc; font-weight:bold;">#${latestBuild}</span>`;
    } catch(e) {
        resultDiv.innerHTML = "Error fetching build.";
    }
}

// ==========================================
// REAL HTTP PING TESTER
// ==========================================
async function runPingTest() {
    let url = document.getElementById("ping-ip").value;
    let resultDiv = document.getElementById("ping-result");
    if(!url) return resultDiv.innerText = "Enter URL (https://...)";
    if(!url.startsWith('http')) url = 'https://' + url;

    resultDiv.style.display = "block";
    resultDiv.innerHTML = "Pinging...";
    let start = Date.now();
    try {
        await fetch(url, { mode: 'no-cors', cache: 'no-store' });
        let latency = Date.now() - start;
        let color = latency < 100 ? '#00ff88' : (latency < 300 ? 'orange' : '#ff3232');
        resultDiv.innerHTML = `Response Time: <span style="color:${color}; font-weight:bold;">${latency}ms</span>`;
    } catch(e) {
        resultDiv.innerHTML = `<span style="color:#ff3232;">Ping Failed.</span>`;
    }
}

// Commands Search
function searchCommands() {
    let input = document.getElementById("cmdSearch").value.toUpperCase();
    let tr = document.getElementById("cmdTable").getElementsByTagName("tr");
    for (let i = 1; i < tr.length; i++) {
        let display = false;
        let tds = tr[i].getElementsByTagName("td");
        for(let j=0; j<tds.length; j++) {
            if(tds[j].innerText.toUpperCase().indexOf(input) > -1) display = true;
        }
        tr[i].style.display = display ? "" : "none";
    }
}
