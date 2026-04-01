// ==========================================
// 🚀 DYNAMIC AUTO-NAVIGATION BAR SYSTEM
// ==========================================
const navPages = [
    { name: 'Home', file: 'index.html', icon: 'fas fa-home' },
    { name: 'Team', file: 'team.html', icon: 'fas fa-users' },
    { name: 'Hosting', file: 'hosting.html', icon: 'fas fa-server' },
    { name: 'Tutorials', file: 'tutorials.html', icon: 'fas fa-video' },
    { name: 'Commands', file: 'commands.html', icon: 'fas fa-terminal' },
    { name: 'Codes', file: 'code.html', icon: 'fas fa-file-code' }, 
    { name: 'Downloads', file: 'download.html', icon: 'fas fa-download' },
    { name: 'MCPE Addon', file: 'mcpe addon.html', icon: 'fas fa-download' },
    { name: 'Tools', file: 'tools.html', icon: 'fas fa-wrench' },
    { name: 'Stats', file: 'stats.html', icon: 'fas fa-chart-line' },
    { name: 'About', file: 'about.html', icon: 'fas fa-info-circle' }
];

function forceLoadNavbar() {
    const container = document.getElementById('navbar-container');
    if(!container) return;

    let currentPath = window.location.pathname.toLowerCase();
    let activePage = navPages.find(p => currentPath.endsWith(p.file.toLowerCase()));
    if(!activePage || currentPath.endsWith('/') || currentPath.trim() === '') {
        activePage = navPages[0]; 
    }

    let navHTML = `
    <nav class="navbar">
        <div class="logo">
            <video src="gemini_generated_video_3ccd85b2.mp4" autoplay loop muted playsinline class="logo-video"></video>
            <div class="logo-text">
                <span class="main-title">SKA HOST</span>
                <span class="sub-title">DASHBOARD</span>
            </div>
        </div>
        <ul class="nav-links">`;

    navPages.forEach(page => {
        let activeClass = (page.name === activePage.name) ? 'active-tab' : '';
        navHTML += `<li><a href="${page.file}" class="${activeClass}"><i class="${page.icon}"></i> ${page.name}</a></li>`;
    });

    navHTML += `
        </ul>
        <div class="user-profile" onclick="toggleProfileModal()">
            <div class="user-text">
                <span class="user-name">SDGAMER</span>
                <span class="user-role">Owner</span>
            </div>
            <video src="gemini_generated_video_3ccd85b2.mp4" autoplay loop muted playsinline class="user-profile-video"></video>
        </div>
    </nav>`;

    container.innerHTML = navHTML;
    createProfileModal();
}

function createProfileModal() {
    if(document.getElementById('profileModal')) return;
    const modalHTML = `
    <div id="profileModal" class="modal-overlay" style="display:none;" onclick="closeProfileModal(event)">
        <div class="modal-content" onclick="event.stopPropagation()">
            <div class="modal-header">
                <video src="gemini_generated_video_3ccd85b2.mp4" autoplay loop muted playsinline class="modal-avatar-video"></video>
                <button class="close-btn" onclick="toggleProfileModal()"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
                <h2>SDGAMER</h2>
                <p class="status-text"><span class="dot" style="background:#00ff88; box-shadow:0 0 5px #00ff88;"></span> Online</p>
                <div class="info-box mt-20">
                    <p class="label">PLAYING</p>
                    <p class="value"><i class="fas fa-code" style="color:#00d2ff;"></i> VS Code</p>
                </div>
                <div class="grid-2-col mt-10">
                    <div class="info-box">
                        <p class="label">USER ID</p>
                        <p class="value" style="font-family:monospace; font-size:0.8rem;">123456789</p>
                    </div>
                    <div class="info-box">
                        <p class="label">JOINED</p>
                        <p class="value" style="font-size:0.8rem;">SKA HOST</p>
                    </div>
                </div>
                <button class="full-btn" onclick="toggleProfileModal()">Close Profile</button>
            </div>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function toggleProfileModal() {
    const modal = document.getElementById('profileModal');
    if(modal) modal.style.display = modal.style.display === 'none' ? 'flex' : 'none';
}
function closeProfileModal(e) {
    if(e.target.id === 'profileModal') toggleProfileModal();
}

// 🌊 SCROLL NAVBAR EFFECT
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 40) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    }
});

// ==========================================
// 🛠️ ALL LOADERS & INITIALIZERS
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    if(!document.querySelector('.navbar')) forceLoadNavbar();
    if(document.getElementById('yt-container')) loadYouTubeVideos();
    if(document.getElementById('cmdTable')) loadCommandsFromFile();
    if(document.getElementById('real-discord-members')) fetchDiscordTeam();
    if(document.getElementById('code-container')) loadGitHubCodes();
    
    // Download File Manager start path: 'Df'
    if(document.getElementById('download-container')) loadDownloadFiles('Df');
    
    if(document.getElementById('custom-chat-box')) {
        fetchCustomDiscordChat();
        setInterval(fetchCustomDiscordChat, 5000); 
    }
});

// ==========================================
// 🚀 CUSTOM DISCORD LIVE CHAT FETCHER
// ==========================================
async function fetchCustomDiscordChat() {
    const chatBox = document.getElementById('custom-chat-box');
    if(!chatBox) return;

    const renderApiUrl = 'https://ska-discord-bot.onrender.com/api/chat';

    try {
        const res = await fetch(renderApiUrl);
        if(!res.ok) throw new Error("API failed");
        const messages = await res.json();

        chatBox.innerHTML = ''; 

        if(messages.length === 0) {
            chatBox.innerHTML = '<p style="color: #8e9297; text-align: center;">No messages yet.</p>';
            return;
        }

        messages.forEach(msg => {
            const date = new Date(msg.time);
            const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            const msgHTML = `
            <div style="display: flex; gap: 15px; margin-bottom: 10px;">
                <img src="${msg.avatar}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 1px solid rgba(0,255,136,0.3);">
                <div>
                    <div style="display: flex; align-items: baseline; gap: 10px;">
                        <span style="color: #00ff88; font-weight: bold; font-size: 0.95rem;">${msg.user}</span>
                        <span style="color: #72767d; font-size: 0.75rem;">Today at ${timeString}</span>
                    </div>
                    <div style="color: #dcddde; font-size: 0.9rem; margin-top: 2px; line-height: 1.4;">
                        ${msg.text}
                    </div>
                </div>
            </div>`;
            chatBox.innerHTML += msgHTML;
        });
        chatBox.scrollTop = chatBox.scrollHeight;
    } catch(e) {
        // Silent error handling for smooth UX
    }
}

// ==========================================
// 📥 GITHUB DOWNLOAD FILE MANAGER (Subfolders Support) - PRO LEVEL 🔥
// ==========================================
async function loadDownloadFiles(currentPath) {
    const container = document.getElementById('download-container');
    if(!container) return;

    // Loading Animation
    container.innerHTML = `
    <div class="glass-panel text-center" style="padding: 40px;">
        <p style="color: #00ff88; font-size: 1.2rem;"><i class="fas fa-spinner fa-spin"></i> Fetching /${currentPath}...</p>
    </div>`;

    try {
        const res = await fetch(`https://api.github.com/repos/sdgamer8263-sketch/paneldsh/contents/${currentPath}`);
        if (!res.ok) throw new Error("API Limit ba path pawa jacche na.");
        
        const items = await res.json();
        
        // Folder ar File ke alada kora
        const folders = items.filter(f => f.type === 'dir');
        const files = items.filter(f => f.type === 'file');

        let html = '';

        // ✅ Back Button System (Jodi Df er theke bhitore dhuke jay)
        if (currentPath !== 'Df') {
            const pathParts = currentPath.split('/');
            pathParts.pop(); // Last folder ta kete dilam
            const parentPath = pathParts.join('/'); // Pura path toiri
            
            html += `
            <div style="margin-bottom: 20px; display: flex; align-items: center; gap: 15px;">
                <button onclick="loadDownloadFiles('${parentPath}')" class="filter-btn active" style="padding: 10px 20px;">
                    <i class="fas fa-arrow-left"></i> BACK
                </button>
                <span style="color: #a8e6cf; font-size: 0.9rem; font-family: monospace;">Path: /${currentPath}</span>
            </div>`;
        } else {
            html += `
            <div style="margin-bottom: 20px;">
                <span style="color: #a8e6cf; font-size: 0.9rem; font-family: monospace;"><i class="fas fa-home"></i> Root: /Df</span>
            </div>`;
        }

        if(folders.length === 0 && files.length === 0) {
            html += '<div class="glass-panel text-center"><p style="color: #aaa;">This folder is empty.</p></div>';
        }

        // ✅ 1. Render Folders (Clickable to open)
        for(let folder of folders) {
            html += `
            <div class="glass-panel" style="padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; border-left: 4px solid #00d2ff; margin-bottom: 15px; cursor: pointer; transition: 0.3s;" onclick="loadDownloadFiles('${folder.path}')" onmouseover="this.style.background='rgba(0, 210, 255, 0.1)'" onmouseout="this.style.background='rgba(20, 20, 25, 0.85)'">
                <div style="text-align: left;">
                    <h3 style="color: #fff; margin: 0; font-size: 1.1rem;"><i class="fas fa-folder" style="color: #00d2ff; margin-right: 8px;"></i> ${folder.name}</h3>
                </div>
                <button style="background: rgba(0, 210, 255, 0.1); color: #00d2ff; border: 1px solid rgba(0, 210, 255, 0.3); padding: 8px 15px; border-radius: 6px; font-weight: bold; cursor: pointer; pointer-events: none;">
                    OPEN
                </button>
            </div>`;
        }

        // ✅ 2. Render Files (Downloadable)
        for(let file of files) {
            const fileSize = (file.size / 1024).toFixed(2) + ' KB';
            html += `
            <div class="glass-panel" style="padding: 20px; display: flex; justify-content: space-between; align-items: center; border-left: 4px solid #00ff88; margin-bottom: 15px;">
                <div style="text-align: left;">
                    <h3 style="color: #fff; margin: 0; font-size: 1.1rem;"><i class="fas fa-file-alt" style="color: #a8e6cf; margin-right: 8px;"></i> ${file.name}</h3>
                    <p style="color: #a8e6cf; font-size: 0.8rem; margin-top: 5px;">Size: ${fileSize}</p>
                </div>
                <button onclick="forceDownloadFile('${file.download_url}', '${file.name}', this)" class="copy-btn" style="padding: 10px 20px; border-radius: 6px;">
                    <i class="fas fa-download"></i> DOWNLOAD
                </button>
            </div>`;
        }

        container.innerHTML = html;

    } catch(e) { 
        container.innerHTML = '<p style="color: #ff3232; text-align:center; font-weight: bold;">Error Loading Folder. API limits reached.</p>'; 
    }
}

async function forceDownloadFile(url, filename, btnElement) {
    const originalText = btnElement.innerHTML;
    btnElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i> DOWNLOADING...';
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none'; a.href = blobUrl; a.download = filename;
        document.body.appendChild(a); a.click();
        window.URL.revokeObjectURL(blobUrl); document.body.removeChild(a);
        btnElement.innerHTML = '<i class="fas fa-check"></i> SUCCESS!';
        btnElement.style.background = '#00ff88'; btnElement.style.color = '#000';
    } catch (e) { alert("Download failed!"); }
    setTimeout(() => { btnElement.innerHTML = originalText; btnElement.style.background = '#fff'; btnElement.style.color = '#000'; }, 2000);
}

// ==========================================
// 📄 GITHUB .TEXT FILE LOADER
// ==========================================
async function loadGitHubCodes() {
    const container = document.getElementById('code-container');
    if(!container) return;

    try {
        const res = await fetch(`https://api.github.com/repos/sdgamer8263-sketch/paneldsh/contents/`);
        if (!res.ok) throw new Error("API limits.");
        const files = await res.json();
        const textFiles = files.filter(f => f.name.toLowerCase().endsWith('.text'));

        if(textFiles.length === 0) return container.innerHTML = '<p style="color:#aaa;text-align:center;">No .text files found.</p>';
        container.innerHTML = ''; 

        for(let file of textFiles) {
            const textRes = await fetch(file.download_url);
            const textContent = await textRes.text();
            const displayName = file.name.replace(/\.text$/i, '').toUpperCase();
            const safeContent = textContent.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            const safeId = file.name.replace(/\./g, '-');

            const fileHTML = `
            <div class="glass-panel" style="margin-bottom: 25px; padding: 20px; text-align: left;">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(0,255,136,0.2); padding-bottom: 15px; margin-bottom: 15px;">
                    <h3 style="color: #00ff88; font-weight: bold; margin: 0; font-size: 1.2rem;"><i class="fas fa-file-code"></i> ${displayName}</h3>
                    <button class="copy-btn" onclick="copyDynamicText(this, 'txt-${safeId}')" style="padding: 8px 15px; border-radius: 6px;">
                        <i class="fas fa-copy"></i> COPY
                    </button>
                </div>
                <pre style="background: rgba(0,0,0,0.6); padding: 15px; border-radius: 8px; overflow-x: auto; color: #00ffcc; font-family: monospace; font-size: 0.95rem;" id="txt-${safeId}">${safeContent}</pre>
            </div>`;
            container.innerHTML += fileHTML;
        }
    } catch(e) { container.innerHTML = '<p style="color:red;text-align:center;">API Fetch Error.</p>'; }
}

function copyDynamicText(btn, elementId) {
    const textElement = document.getElementById(elementId);
    if(textElement) {
        navigator.clipboard.writeText(textElement.innerText).then(() => {
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> COPIED!';
            btn.style.background = '#00ff88'; btn.style.color = '#000';
            setTimeout(() => { btn.innerHTML = originalText; btn.style.background = '#fff'; }, 2000);
        });
    }
}

// ==========================================
// 📄 COMMANDS PARSER
// ==========================================
async function loadCommandsFromFile() {
    const table = document.getElementById('cmdTable');
    if(!table) return;
    try {
        const response = await fetch('commands.txt?v=' + new Date().getTime());
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
                        <button class="tbl-copy-btn" onclick="copyTableCmd(this, '${safeCommand}')"><i class="fas fa-copy"></i></button>
                    </td>
                </tr>`;
            }
        });
        table.innerHTML = tableHTML;
    } catch(e) { table.innerHTML = `<tr><td colspan="4" style="color:red; text-align:center;">Failed to load commands.txt</td></tr>`; }
}

function copyTableCmd(btn, cmd) {
    navigator.clipboard.writeText(cmd).then(() => {
        btn.innerHTML = '<i class="fas fa-check"></i>'; btn.style.color = '#00ff88'; btn.style.borderColor = '#00ff88'; btn.style.background = 'rgba(0,255,136,0.1)';
        setTimeout(() => { btn.innerHTML = '<i class="fas fa-copy"></i>'; btn.style.color = '#a8e6cf'; btn.style.borderColor = 'rgba(0,255,136,0.2)'; btn.style.background = 'rgba(0,255,136,0.05)'; }, 2000);
    });
}

function filterCategory(category, btnElement) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    btnElement.classList.add('active');
    document.getElementById("cmdSearch").value = "";
    let tr = document.getElementById("cmdTable").getElementsByTagName("tr");
    for (let i = 1; i < tr.length; i++) {
        let catTd = tr[i].getElementsByTagName("td")[0];
        if (catTd) tr[i].style.display = (category === 'ALL' || catTd.innerText.toUpperCase().trim() === category) ? "" : "none";
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
// 📺 YOUTUBE VIDEOS 
// ==========================================
async function loadYouTubeVideos() {
    const container = document.getElementById('yt-container');
    if(!container) return;
    container.innerHTML = '<p style="color: #aaa;">Fetching videos... <i class="fas fa-spinner fa-spin"></i></p>';
    try {
        const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=UCCGkhiwOobIoOqvGSlB1v8Q`;
        const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
        const data = await res.json();
        if(data.status === 'ok' && data.items.length > 0) {
            container.innerHTML = ''; 
            data.items.slice(0, 15).forEach(video => {
                let videoId = video.link.split('v=')[1];
                if(videoId && videoId.includes('&')) videoId = videoId.split('&')[0]; 
                if(videoId) {
                    container.innerHTML += `<div class="video-embed">
                        <iframe width="100%" height="200" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen style="border-radius: 8px; border: 1px solid rgba(0,255,136,0.2);"></iframe>
                        <h4 class="mt-10" style="color: #fff; font-size: 0.95rem;">${video.title}</h4>
                    </div>`;
                }
            });
        }
    } catch(e) { container.innerHTML = '<p style="color: red;">Error loading YouTube videos.</p>'; }
}

// ==========================================
// 🤖 REAL DISCORD MEMBERS ONLY
// ==========================================
async function fetchDiscordTeam() {
    const container = document.getElementById('real-discord-members');
    if(!container) return;
    try {
        const res = await fetch('https://discord.com/api/guilds/1472601008998846576/widget.json');
        const data = await res.json();
        container.innerHTML = '';
        if(data.members && data.members.length > 0) {
            data.members.forEach(m => {
                let statusClass = m.status === 'online' ? 'status-online' : (m.status === 'idle' ? 'status-idle' : 'status-dnd');
                container.innerHTML += `<div class="member-card"><img src="${m.avatar_url}" alt="${m.username}"><h4 style="color: #fff;"><span class="status-dot ${statusClass}"></span> ${m.username}</h4><p style="color: #a8e6cf; font-size: 0.8rem; margin-top: 5px;">Server Member</p></div>`;
            });
        }
    } catch (e) { container.innerHTML = `<p style="color:red;">Error fetching team data.</p>`; }
}

// ==========================================
// 📊 SERVER TOOLS API
// ==========================================
function copyCmd() {
    navigator.clipboard.writeText("bash <(curl -sL https://raw.githubusercontent.com/skahost/code/main/run.sh)").then(() => alert("Master Command Copied! 🔥"));
}

async function runPingTest() {
    let url = document.getElementById("ping-ip").value.trim();
    let resultDiv = document.getElementById("ping-result");
    if(!url) return resultDiv.innerHTML = "<span style='color:orange;'>Please enter a URL.</span>", resultDiv.style.display="block";
    if(!url.startsWith('http')) url = 'https://' + url;
    resultDiv.style.display = "block"; resultDiv.innerHTML = "Pinging...";
    let start = Date.now();
    try {
        await fetch(url, { mode: 'no-cors', cache: 'no-store' });
        let latency = Date.now() - start;
        let color = latency < 200 ? '#00ff88' : (latency < 600 ? 'orange' : '#ff3232');
        resultDiv.innerHTML = `<span style="color:#aaa;">Status:</span> <span style="color:#00ff88;">ONLINE</span> <br> <span style="color:#aaa;">Response:</span> <span style="color:${color}; font-weight:bold;">${latency}ms</span>`;
    } catch(e) { resultDiv.innerHTML = `<span style="color:#ff3232; font-weight:bold;">Ping Failed.</span>`; }
}

async function checkMCStatus() {
    let ip = document.getElementById("mc-ip").value.trim();
    let port = document.getElementById("mc-port").value.trim();
    let resultDiv = document.getElementById("mc-result");
    if(!ip) return resultDiv.innerHTML = "<span style='color:orange;'>Enter Server IP.</span>", resultDiv.style.display="block";
    let fullAddress = port ? `${ip}:${port}` : ip;
    resultDiv.style.display = "block"; resultDiv.innerHTML = "Fetching...";
    try {
        let res = await fetch(`https://api.mcsrvstat.us/3/${fullAddress}`);
        let data = await res.json();
        if(data.online) resultDiv.innerHTML = `<div><strong>Status:</strong> <span style="color:#00ff88;">ONLINE</span></div><div><strong>Players:</strong> <span style="color:#ffcc00;">${data.players.online}/${data.players.max}</span></div><div><strong>Version:</strong> <span style="color:#fff;">${data.version || 'Unknown'}</span></div>`;
        else resultDiv.innerHTML = `<strong>Status:</strong> <span style="color:#ff3232;">OFFLINE</span>`;
    } catch(e) { resultDiv.innerHTML = `<span style="color:red;">Error.</span>`; }
}

async function checkPaperBuild() {
    let ver = document.getElementById("paper-ver").value.trim();
    let resultDiv = document.getElementById("paper-result");
    if(!ver) return resultDiv.innerHTML = "<span style='color:orange;'>Enter version.</span>", resultDiv.style.display="block";
    resultDiv.style.display = "block"; resultDiv.innerHTML = "Fetching...";
    try {
        let res = await fetch(`https://api.papermc.io/v2/projects/paper/versions/${ver}`);
        if(res.status === 404) return resultDiv.innerHTML = `<span style="color:#ff3232;">Version not found.</span>`;
        let data = await res.json();
        resultDiv.innerHTML = `Latest Build: <br><span style="color:#00ffcc; font-size:1.5rem; font-weight:bold;">#${data.builds[data.builds.length - 1]}</span>`;
    } catch(e) { resultDiv.innerHTML = `<span style="color:red;">Error fetching data.</span>`; }
}
document.addEventListener("DOMContentLoaded", function() {
    // EKHANE APNAR DRIVE FILE ID-TI BOSAN
    const fileID = "1uc3Tple8vadOwZhOhGAtqj1__e6Rwm1s"; 

    // Preview Link Setup
    const previewFrame = document.getElementById("drivePreview");
    previewFrame.src = `https://drive.google.com/file/d/${fileID}/preview`;

    // Download Button Setup
    const downloadBtn = document.getElementById("driveDownload");
    downloadBtn.addEventListener("click", function() {
        const directLink = `https://drive.google.com/uc?export=download&id=${fileID}`;
        
        downloadBtn.innerText = "Processing...";
        window.location.href = directLink;

        setTimeout(() => {
            downloadBtn.innerText = "Download Now";
        }, 3000);
    });
});
