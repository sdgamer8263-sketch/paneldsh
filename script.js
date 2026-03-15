// ==========================================
// AUTO INITIALIZATION & FETCHING COMMANDS.TXT
// ==========================================
// FIXED: "document" needs to be lowercase
document.addEventListener("DOMContentLoaded", () => {
    loadYouTubeVideos();
    loadCommandsFromFile();
});

async function loadCommandsFromFile() {
    const table = document.getElementById('cmdTable');
    if(!table) return;

    try {
        const response = await fetch('commands.txt');
        const text = await response.text();
        const lines = text.split('\n');

        let tableHTML = `<tr><th>CATEGORY</th><th>TITLE</th><th>COMMAND</th><th style="text-align: right;">ACTION</th></tr>`;

        lines.forEach(line => {
            line = line.trim();
            if(!line) return;

            // Matches format: Category-Title-'Command' or Category - Title - 'Command'
            const match = line.match(/^([^-]+)-(.*?)-?\s*'(.*)'\s*$/);
            
            if(match) {
                const category = match[1].trim().toUpperCase();
                const title = match[2].trim();
                const command = match[3].trim();
                const badgeClass = category.toLowerCase();

                // FIXED: Escaped quotes so inline onclick doesn't break
                const safeCommand = command.replace(/'/g, "\\'").replace(/"/g, "&quot;");

                tableHTML += `
                <tr>
                    <td><span class="badge ${badgeClass}">${category}</span></td>
                    <td>${title}</td>
                    <td><code>${command}</code></td>
                    <td style="text-align: right;">
                        <button class="tbl-copy-btn" onclick="copyTableCmd(this, '${safeCommand}')">
                            <i class="fas fa-copy"></i>
                        </button>
                    </td>
                </tr>`;
            }
        });
        
        table.innerHTML = tableHTML;
    } catch(e) {
        table.innerHTML = `<tr><td colspan="4" style="color:red; text-align:center;">Failed to load commands.txt file. Make sure it's uploaded!</td></tr>`;
    }
}

// Function triggered when action copy button is clicked
function copyTableCmd(btn, cmd) {
    navigator.clipboard.writeText(cmd).then(() => {
        btn.innerHTML = '<i class="fas fa-check"></i>';
        btn.style.color = '#00ff88';
        btn.style.borderColor = '#00ff88';
        btn.style.background = 'rgba(0,255,136,0.1)';
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-copy"></i>';
            btn.style.color = '#aaa';
            btn.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            btn.style.background = 'rgba(255, 255, 255, 0.05)';
        }, 2000);
    });
}

// ==========================================
// YOUTUBE VIDEOS (SKA HOSTING)
// ==========================================
async function loadYouTubeVideos() {
    const container = document.getElementById('yt-container');
    if(!container) return;
    try {
        const channelId = 'UCCGkhiwOobIoOqvGSlB1v8Q'; 
        const rssUrl = encodeURIComponent(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);
        const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`);
        const data = await res.json();
        
        if(data.items && data.items.length > 0) {
            container.innerHTML = ''; 
            // Gets max 15 videos
            data.items.slice(0, 15).forEach(video => {
                let videoId = video.link.split('v=')[1];
                if(videoId && videoId.includes('&')) videoId = videoId.split('&')[0]; 
                
                if(videoId) {
                    container.innerHTML += `<div class="video-embed">
                        <iframe width="100%" height="200" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen style="border-radius: 8px;"></iframe>
                        <h4 class="mt-10" style="color: #fff; font-size: 0.95rem;">${video.title}</h4>
                    </div>`;
                }
            });
        } else { container.innerHTML = '<p style="color: #aaa;">No videos found.</p>'; }
    } catch(e) { container.innerHTML = '<p style="color: red;">Error loading YouTube videos.</p>'; }
}

// ==========================================
// TABS & SYSTEM
// ==========================================
function showSection(sectionId, element) {
    document.querySelectorAll('section').forEach(sec => sec.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';
    if(element) {
        document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active-tab'));
        element.classList.add('active-tab');
    }
    if(sectionId === 'team') fetchDiscordTeam();
}

function copyCmd() {
    navigator.clipboard.writeText("bash <(curl -sL https://raw.githubusercontent.com/sdgamer8263-sketch/SDGAMER.HOST/main/run.sh)").then(() => alert("Master Command Copied! 🔥"));
}

setInterval(() => {
    document.getElementById('live-cpu').innerText = (Math.floor(Math.random() * 30) + 15) + '%';
    document.getElementById('live-ram').innerHTML = (Math.random() * 2.5 + 5.0).toFixed(1) + 'GB <small>/ 32GB</small>';
    document.getElementById('live-net').innerText = (Math.floor(Math.random() * 50) + 40) + ' Mbps';
    document.getElementById('fake-ping').innerText = (Math.floor(Math.random() * 5) + 20) + 'ms';
}, 2500);

// ==========================================
// CATEGORY FILTER & SEARCH
// ==========================================
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
    
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.filter-btn').classList.add('active'); 
    
    for (let i = 1; i < tr.length; i++) {
        let display = false;
        let tds = tr[i].getElementsByTagName("td");
        for(let j=0; j<tds.length; j++) if(tds[j] && tds[j].innerText.toUpperCase().indexOf(input) > -1) display = true;
        tr[i].style.display = display ? "" : "none";
    }
}

// ==========================================
// DISCORD & TOOLS APIs
// ==========================================
async function fetchDiscordTeam() {
    const container = document.getElementById('team-container');
    try {
        const res = await fetch('https://discord.com/api/guilds/1472601008998846576/widget.json');
        const data = await res.json();
        container.innerHTML = `<div class="member-card"><img src="ttttttttttttttttttttttttttttt.png" alt="SDGAMER"><h3 style="color: #fff;">SDGAMER</h3><p style="color: #ed4245; font-weight: bold; font-size: 0.85rem; margin-top: 5px;">👑 Founder</p></div>`;
        if(data.members && data.members.length > 0) {
            data.members.forEach(m => {
                let statusClass = m.status === 'online' ? 'status-online' : (m.status === 'idle' ? 'status-idle' : 'status-dnd');
                container.innerHTML += `<div class="member-card"><img src="${m.avatar_url}" alt="${m.username}"><h4 style="color: #fff;"><span class="status-dot ${statusClass}"></span> ${m.username}</h4><p style="color: #aaa; font-size: 0.8rem; margin-top: 5px;">Community Member</p></div>`;
            });
        }
    } catch (e) { container.innerHTML = `<p style="color:red;">Error fetching team data.</p>`; }
}

async function checkMCStatus() {
    let ip = document.getElementById("mc-ip").value;
    let port = document.getElementById("mc-port").value;
    let resultDiv = document.getElementById("mc-result");
    if(!ip) { resultDiv.style.display = "block"; return resultDiv.innerText = "Please enter Server IP."; }
    let fullAddress = port ? `${ip}:${port}` : ip;
    resultDiv.style.display = "block"; resultDiv.innerHTML = "Fetching... <i class='fas fa-spinner fa-spin'></i>";
    try {
        let res = await fetch(`https://api.mcsrvstat.us/3/${fullAddress}`);
        let data = await res.json();
        if(data.online) {
            let cleanMotd = data.motd.clean.join('<br>');
            resultDiv.innerHTML = `<div><strong>Status:</strong> <span style="color:#00ff88;">ONLINE</span></div><div><strong>IP:</strong> <span style="color:#00d2ff;">${data.ip}:${data.port}</span></div><div><strong>Players:</strong> <span style="color:#ffcc00;">${data.players.online}/${data.players.max}</span></div><div><strong>Version:</strong> <span style="color:#fff;">${data.version}</span></div><div style="margin-top:10px; border-top:1px solid #333; padding-top:10px;"><strong>MOTD:</strong><br><span style="color:#ccc; font-family:monospace;">${cleanMotd}</span></div>`;
        } else { resultDiv.innerHTML = `<strong>Status:</strong> <span style="color:#ff3232;">OFFLINE</span>`; }
    } catch(e) { resultDiv.innerHTML = `<span style="color:red;">Error connecting.</span>`; }
}

async function checkPaperBuild() {
    let ver = document.getElementById("paper-ver").value;
    let resultDiv = document.getElementById("paper-result");
    if(!ver) return resultDiv.innerText = "Please enter version.";
    resultDiv.style.display = "block"; resultDiv.innerHTML = "Fetching...";
    try {
        let res = await fetch(`https://api.papermc.io/v2/projects/paper/versions/${ver}`);
        if(res.status === 404) return resultDiv.innerHTML = `<span style="color:#ff3232;">Not found.</span>`;
        let data = await res.json();
        resultDiv.innerHTML = `Latest Build for ${ver}: <span style="color:#00ffcc; font-weight:bold;">#${data.builds[data.builds.length - 1]}</span>`;
    } catch(e) { resultDiv.innerHTML = "Error fetching."; }
}

async function runPingTest() {
    let url = document.getElementById("ping-ip").value;
    let resultDiv = document.getElementById("ping-result");
    if(!url) { resultDiv.style.display="block"; return resultDiv.innerText = "Enter URL (https://...)"; }
    if(!url.startsWith('http')) url = 'https://' + url;
    resultDiv.style.display = "block"; resultDiv.innerHTML = "Pinging...";
    let start = Date.now();
    try {
        await fetch(url, { mode: 'no-cors', cache: 'no-store' });
        let latency = Date.now() - start;
        let color = latency < 100 ? '#00ff88' : (latency < 300 ? 'orange' : '#ff3232');
        resultDiv.innerHTML = `Response Time: <span style="color:${color}; font-weight:bold;">${latency}ms</span>`;
    } catch(e) { resultDiv.innerHTML = `<span style="color:#ff3232;">Ping Failed.</span>`; }
        }
