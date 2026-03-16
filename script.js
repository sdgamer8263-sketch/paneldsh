// ==========================================
// 🚀 DYNAMIC AUTO-NAVIGATION BAR SYSTEM
// ==========================================
// Future a kono page add korte hole shudhu ekhane add korben!
const navPages = [
    { name: 'Home', file: 'index.html', icon: 'fas fa-home' },
    { name: 'Team', file: 'team.html', icon: 'fas fa-users' },
    { name: 'Tools', file: 'tools.html', icon: 'fas fa-wrench' },
    { name: 'Tutorials', file: 'tutorials.html', icon: 'fas fa-video' },
    { name: 'Commands', file: 'commands.html', icon: 'fas fa-terminal' },
    { name: 'Stats', file: 'stats.html', icon: 'fas fa-chart-line' },
    { name: 'Hosting', file: 'Hosting.html', icon: 'fas fa-server' }
];

function loadNavbar(activePageName) {
    const container = document.getElementById('navbar-container');
    if(!container) return;

    let navHTML = `
    <nav class="navbar">
        <div class="logo">
            <img src="ttttttttttttttttttttttttttttt.png" alt="Logo" class="logo-img">
            <span>SKA HOST (SDGAMER)</span>
        </div>
        <ul class="nav-links">`;

    navPages.forEach(page => {
        let activeClass = page.name === activePageName ? 'active-tab' : '';
        navHTML += `<li><a href="${page.file}" class="${activeClass}"><i class="${page.icon}"></i> ${page.name}</a></li>`;
    });

    navHTML += `
        </ul>
        <div class="user-profile">
            <img src="ttttttttttttttttttttttttttttt.png" alt="User">
        </div>
    </nav>`;

    container.innerHTML = navHTML;
}

// ==========================================
// 🛠️ AUTO INITIALIZATION
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    // Check if functions exist before running them on specific pages
    if(document.getElementById('yt-container')) loadYouTubeVideos();
    if(document.getElementById('cmdTable')) loadCommandsFromFile();
    if(document.getElementById('discord-members')) fetchDiscordTeam();
});

// ==========================================
// 📄 COMMANDS PARSER (commands.txt)
// ==========================================
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

            const match = line.match(/^([^-]+)-(.*?)-?\s*'(.*)'\s*$/);
            if(match) {
                const category = match[1].trim().toUpperCase();
                const title = match[2].trim();
                const command = match[3].trim();
                const badgeClass = category.toLowerCase();
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
        table.innerHTML = `<tr><td colspan="4" style="color:red; text-align:center;">Failed to load commands.txt file.</td></tr>`;
    }
}

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
// 📺 YOUTUBE VIDEOS (DDOS PROTECTED)
// ==========================================
async function loadYouTubeVideos() {
    const container = document.getElementById('yt-container');
    if(!container) return;
    container.innerHTML = '<p style="color: #aaa;">Fetching videos... <i class="fas fa-spinner fa-spin"></i></p>';
    try {
        const channelId = 'UCCGkhiwOobIoOqvGSlB1v8Q'; 
        const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
        const finalUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}&api_key=00000000000000000000000000000000&_=${Math.random()}`;
        const res = await fetch(finalUrl);
        const data = await res.json();
        if(data.status === 'ok' && data.items.length > 0) {
            container.innerHTML = ''; 
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
    } catch(e) { container.innerHTML = '<p style="color: red;">Error loading YouTube videos. Refresh the page.</p>'; }
}

// ==========================================
// 🤖 DISCORD MEMBERS
// ==========================================
async function fetchDiscordTeam() {
    const container = document.getElementById('discord-members');
    if(!container) return;
    try {
        const res = await fetch('https://discord.com/api/guilds/1472601008998846576/widget.json');
        const data = await res.json();
        container.innerHTML = '';
        if(data.members && data.members.length > 0) {
            data.members.forEach(m => {
                let statusClass = m.status === 'online' ? 'status-online' : (m.status === 'idle' ? 'status-idle' : 'status-dnd');
                container.innerHTML += `<div class="member-card"><img src="${m.avatar_url}" alt="${m.username}"><h4 style="color: #fff;"><span class="status-dot ${statusClass}"></span> ${m.username}</h4><p style="color: #aaa; font-size: 0.8rem; margin-top: 5px;">Community Member</p></div>`;
            });
        }
    } catch (e) { container.innerHTML = `<p style="color:red;">Error fetching team data.</p>`; }
}

// ==========================================
// 📊 TOOLS & UTILS
// ==========================================
function copyCmd() {
    navigator.clipboard.writeText("bash <(curl -sL https://raw.githubusercontent.com/sdgamer8263-sketch/SDGAMER.HOST/main/run.sh)").then(() => alert("Master Command Copied! 🔥"));
}

if(document.getElementById('live-cpu')) {
    setInterval(() => {
        document.getElementById('live-cpu').innerText = (Math.floor(Math.random() * 30) + 15) + '%';
        document.getElementById('live-ram').innerHTML = (Math.random() * 2.5 + 5.0).toFixed(1) + 'GB <small>/ 32GB</small>';
        document.getElementById('live-net').innerText = (Math.floor(Math.random() * 50) + 40) + ' Mbps';
        document.getElementById('fake-ping').innerText = (Math.floor(Math.random() * 5) + 20) + 'ms';
    }, 2500);
}
