// Tab Switching System
function showSection(sectionId) {
    const sections = document.querySelectorAll('section');
    sections.forEach(sec => sec.style.display = 'none');
    
    document.getElementById(sectionId).style.display = 'block';
}

// Bash Command Copy System
function copyCmd() {
    const codeText = "bash <(curl -sL https://raw.githubusercontent.com/sdgamer8263-sketch/SDGAMER.HOST/main/run.sh)";
    navigator.clipboard.writeText(codeText).then(() => {
        alert("Master Command Copied Successfully! 🔥");
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

// Real-time Command Search System
function searchCommands() {
    let input = document.getElementById("cmdSearch").value.toUpperCase();
    let table = document.getElementById("cmdTable");
    let tr = table.getElementsByTagName("tr");

    for (let i = 1; i < tr.length; i++) {
        let catTd = tr[i].getElementsByTagName("td")[0];
        let titleTd = tr[i].getElementsByTagName("td")[1];
        let cmdTd = tr[i].getElementsByTagName("td")[2];
        
        if (catTd || titleTd || cmdTd) {
            let catText = catTd.textContent || catTd.innerText;
            let titleText = titleTd.textContent || titleTd.innerText;
            let cmdText = cmdTd.textContent || cmdTd.innerText;
            
            // Search match condition
            if (catText.toUpperCase().indexOf(input) > -1 || 
                titleText.toUpperCase().indexOf(input) > -1 || 
                cmdText.toUpperCase().indexOf(input) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

// ==========================================
// FAKE LIVE STATS GENERATOR (Original Feeling)
// ==========================================
setInterval(() => {
    // Randomize CPU between 15% and 45%
    let cpu = Math.floor(Math.random() * 30) + 15;
    document.getElementById('live-cpu').innerText = cpu + '%';

    // Randomize RAM between 5.0GB and 7.5GB
    let ram = (Math.random() * 2.5 + 5.0).toFixed(1);
    document.getElementById('live-ram').innerHTML = ram + 'GB <small>/ 32GB</small>';

    // Randomize Network Speed between 40 Mbps and 90 Mbps
    let net = Math.floor(Math.random() * 50) + 40;
    document.getElementById('live-net').innerText = net + ' Mbps';

    // Subtle changes in Ping for realism (20ms - 25ms)
    let ping = Math.floor(Math.random() * 5) + 20;
    document.getElementById('fake-ping').innerText = ping + 'ms';
    
}, 2500); // System updates every 2.5 seconds
