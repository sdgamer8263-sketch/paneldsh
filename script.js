// Tab Switching System
function showSection(sectionId, element) {
    document.querySelectorAll('section').forEach(sec => sec.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';
    
    // Update active tab style
    if(element) {
        document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active-tab'));
        element.classList.add('active-tab');
    }

    // Load Discord Team Data dynamically when Team tab is clicked
    if(sectionId === 'team') {
        fetchDiscordTeam();
    }
}

// Command Copy
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
// REAL LIVE DISCORD API FETCH (For Team Page)
// ==========================================
async function fetchDiscordTeam() {
    const container = document.getElementById('team-container');
    try {
        const res = await fetch('https://discord.com/api/guilds/1472601008998846576/widget.json');
        const data = await res.json();
        
        container.innerHTML = ''; // Clear loading text

        // Add Hardcoded Owner First
        container.innerHTML += `
            <div class="member-card">
                <img src="ttttttttttttttttttttttttttttt.png" alt="SDGAMER">
                <h3 style="color: #fff;">SDGAMER</h3>
                <p style="color: #ed4245; font-weight: bold; font-size: 0.85rem; margin-top: 5px;">👑 Founder & Owner</p>
            </div>
        `;

        // Loop through real online members from JSON
        if(data.members && data.members.length > 0) {
            data.members.forEach(member => {
                let statusClass = member.status === 'online' ? 'status-online' : (member.status === 'idle' ? 'status-idle' : 'status-dnd');
                
                // Discord Widget API doesn't provide exact roles, so we label them automatically based on the community.
                let roleLabel = "Community Member"; 
                let roleColor = "#aaa";

                container.innerHTML += `
                    <div class="member-card">
                        <img src="${member.avatar_url}" alt="${member.username}">
                        <h4 style="color: #fff;"><span class="status-dot ${statusClass}"></span> ${member.username}</h4>
                        <p style="color: ${roleColor}; font-size: 0.8rem; margin-top: 5px;">${roleLabel}</p>
                    </div>
                `;
            });
        } else {
            container.innerHTML += `<p style="grid-column: 1/-1; color:#aaa;">No other members online right now.</p>`;
        }
    } catch (e) {
        container.innerHTML = `<p style="color:red;">Error fetching team data. Make sure Widget is Enabled in Server Settings.</p>`;
    }
}

// ==========================================
// REAL MINECRAFT SERVER STATUS (API)
// ==========================================
async function checkMCStatus() {
    let ip = document.getElementById("mc-ip").value;
    let resultDiv = document.getElementById("mc-result");
    if(!ip) return resultDiv.innerText = "Please enter an IP.";
    
    resultDiv.innerHTML = "Checking...";
    try {
        let res = await fetch(`https://api.mcsrvstat.us/3/${ip}`);
        let data = await res.json();
        
        if(data.online) {
            resultDiv.innerHTML = `<span style="color:#00ff88;">ONLINE</span> | Players: ${data.players.online}/${data.players.max} <br> Version: ${data.version}`;
        } else {
            resultDiv.innerHTML = `<span style="color:#ff3232;">OFFLINE</span>`;
        }
    } catch(e) {
        resultDiv.innerHTML = "Error fetching status.";
    }
}

// ==========================================
// REAL PAPERMC LATEST BUILD FETCHER
// ==========================================
async function checkPaperBuild() {
    let ver = document.getElementById("paper-ver").value;
    let resultDiv = document.getElementById("paper-result");
    if(!ver) return resultDiv.innerText = "Please enter version (e.g., 1.20.4).";

    resultDiv.innerHTML = "Fetching...";
    try {
        let res = await fetch(`https://api.papermc.io/v2/projects/paper/versions/${ver}`);
        if(res.status === 404) {
            return resultDiv.innerHTML = `<span style="color:#ff3232;">Version not found.</span>`;
        }
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

    resultDiv.innerHTML = "Pinging...";
    let start = Date.now();
    try {
        // We use mode: 'no-cors' to ping any website without browser blocking it
        await fetch(url, { mode: 'no-cors', cache: 'no-store' });
        let latency = Date.now() - start;
        let color = latency < 100 ? '#00ff88' : (latency < 300 ? 'orange' : '#ff3232');
        resultDiv.innerHTML = `Response Time: <span style="color:${color}; font-weight:bold;">${latency}ms</span>`;
    } catch(e) {
        resultDiv.innerHTML = `<span style="color:#ff3232;">Ping Failed (Host unreachable or invalid).</span>`;
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
