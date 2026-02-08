const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const calculateStreamSpeed = (bitrate, resolution) => {
    if (bitrate <= 0 || resolution <= 0) return 0;
    return (bitrate / resolution).toFixed(2);
};

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>CodeStream | Professional CI/CD Dashboard</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
            <style>
                body { background-color: #0b1120; color: #e2e8f0; font-family: 'Inter', sans-serif; }
                .status-running { color: #fbbf24; animation: pulse 1.5s infinite; }
                .status-success { color: #10b981; }
                .status-failed { color: #ef4444; }
                @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
                .step-card { transition: all 0.3s ease; border: 1px solid #1e293b; background: rgba(30, 41, 59, 0.5); }
                .active-step { border-color: #3b82f6; box-shadow: 0 0 20px rgba(59, 130, 246, 0.2); }
            </style>
        </head>
        <body class="p-8">
            <div class="max-w-6xl mx-auto">
                <div class="flex justify-between items-end mb-12 border-b border-slate-800 pb-8">
                    <div>
                        <h1 class="text-4xl font-black text-white tracking-tight italic">CODESTREAM <span class="text-blue-500">OPS</span></h1>
                        <p class="text-slate-500 mt-2 font-medium italic">Optimized CI/CD Pipeline Monitoring System</p>
                    </div>
                    <div id="global-status" class="px-6 py-2 rounded-full border border-slate-700 text-sm font-bold bg-slate-900 shadow-xl">
                        FETCHING CLOUD DATA...
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <div id="step-build" class="step-card p-8 rounded-3xl text-center">
                        <i class="fas fa-hammer text-3xl mb-4 text-blue-400"></i>
                        <h3 class="text-xs uppercase tracking-widest text-slate-500 font-bold">Build</h3>
                        <p class="mt-2 font-bold text-lg" id="txt-build">SYNCING</p>
                    </div>
                    <div id="step-test" class="step-card p-8 rounded-3xl text-center">
                        <i class="fas fa-vial text-3xl mb-4 text-emerald-400"></i>
                        <h3 class="text-xs uppercase tracking-widest text-slate-500 font-bold">Testing</h3>
                        <p class="mt-2 font-bold text-lg" id="txt-test">SYNCING</p>
                    </div>
                    <div id="step-security" class="step-card p-8 rounded-3xl text-center">
                        <i class="fas fa-shield-virus text-3xl mb-4 text-yellow-400"></i>
                        <h3 class="text-xs uppercase tracking-widest text-slate-500 font-bold">Security</h3>
                        <p class="mt-2 font-bold text-lg" id="txt-security">SYNCING</p>
                    </div>
                    <div id="step-deploy" class="step-card p-8 rounded-3xl text-center">
                        <i class="fas fa-cloud-upload-alt text-3xl mb-4 text-pink-400"></i>
                        <h3 class="text-xs uppercase tracking-widest text-slate-500 font-bold">Deploy</h3>
                        <p class="mt-2 font-bold text-lg" id="txt-deploy">SYNCING</p>
                    </div>
                </div>

                <div class="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 mb-12">
                    <h3 class="text-white text-xl font-bold mb-8 flex items-center tracking-tight">
                        <i class="fas fa-exclamation-triangle text-yellow-500 mr-3"></i> BÁO CÁO PHÂN TÍCH RỦI RO DỰ ÁN
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="bg-slate-800/50 p-6 rounded-2xl border-l-4 border-red-500 shadow-lg">
                            <h4 class="text-red-500 font-bold text-sm mb-2 uppercase tracking-tighter">Rủi ro 01: Bảo mật (Critical)</h4>
                            <p class="text-slate-400 text-xs leading-relaxed font-medium">Lộ Secret Key. Giải pháp: Sử dụng GitHub Secrets & mã hóa biến môi trường 100%.</p>
                        </div>
                        <div class="bg-slate-800/50 p-6 rounded-2xl border-l-4 border-orange-500 shadow-lg">
                            <h4 class="text-orange-500 font-bold text-sm mb-2 uppercase tracking-tighter">Rủi ro 02: Môi trường (High)</h4>
                            <p class="text-slate-400 text-xs leading-relaxed font-medium">Xung đột thư viện. Giải pháp: Dockerization & Standardized Runtime Environment.</p>
                        </div>
                    </div>
                </div>

                <div class="bg-black/40 rounded-2xl p-6 font-mono text-xs border border-slate-800 flex justify-between items-center">
                    <span id="commit-msg" class="text-blue-400 tracking-tight underline">Connecting to GitHub...</span>
                    <span class="text-slate-600 tracking-widest uppercase">Author: PTA204</span>
                </div>
            </div>

            <script>
                const OWNER = 'pta204';
                const REPO = 'codestream-demo';
                async function updateStatus() {
                    try {
                        const response = await fetch('https://api.github.com/repos/' + OWNER + '/' + REPO + '/actions/runs?per_page=1');
                        const data = await response.json();
                        const run = data.workflow_runs[0];
                        if (!run) return;

                        const statusEl = document.getElementById('global-status');
                        statusEl.innerText = run.status.toUpperCase();
                        statusEl.className = 'px-6 py-2 rounded-full border text-sm font-bold bg-slate-900 ' + (run.status === 'in_progress' ? 'border-yellow-500 text-yellow-500 status-running' : 'border-emerald-500 text-emerald-500');
                        document.getElementById('commit-msg').innerText = "PUSHED: " + run.head_commit.message;

                        ['build', 'test', 'security', 'deploy'].forEach(step => {
                            const txt = document.getElementById('txt-' + step);
                            const card = document.getElementById('step-' + step);
                            if (run.status === 'in_progress') {
                                txt.innerText = 'RUNNING...';
                                txt.className = 'mt-2 font-bold text-sm status-running';
                                card.classList.add('active-step');
                            } else {
                                card.classList.remove('active-step');
                                if (run.conclusion === 'success') {
                                    txt.innerText = 'PASSED ✅';
                                    txt.className = 'mt-2 font-bold text-sm status-success';
                                } else {
                                    txt.innerText = 'FAILED ❌';
                                    txt.className = 'mt-2 font-bold text-sm status-failed';
                                }
                            }
                        });
                    } catch (err) {}
                }
                setInterval(updateStatus, 3000);
                updateStatus();
            </script>
        </body>
        </html>
    `);
});

module.exports = { app, calculateStreamSpeed };

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => console.log(`🚀 DASHBOARD LIVE: http://localhost:${PORT}`));
}