const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>CodeStream | Live CI/CD Monitor</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
            <style>
                body { background-color: #0b0f1a; color: #e2e8f0; font-family: 'Segoe UI', sans-serif; }
                .status-running { color: #fbbf24; animation: pulse 1.5s infinite; }
                .status-success { color: #10b981; }
                .status-failed { color: #ef4444; }
                @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
                .step-card { transition: all 0.3s ease; border: 1px solid #1e293b; }
                .active-step { border-color: #3b82f6; box-shadow: 0 0 15px rgba(59, 130, 246, 0.3); }
            </style>
        </head>
        <body class="p-10">
            <div class="max-w-5xl mx-auto">
                <!-- Header -->
                <div class="flex justify-between items-end mb-10">
                    <div>
                        <h1 class="text-3xl font-black tracking-tighter text-white">CODESTREAM <span class="text-blue-500">OPS</span></h1>
                        <p class="text-slate-500 font-medium">Real-time Pipeline Monitoring (GitHub Sync)</p>
                    </div>
                    <div id="global-status" class="px-4 py-1 rounded-full border border-slate-700 text-sm font-bold">
                        FETCHING DATA...
                    </div>
                </div>

                <!-- Pipeline Steps -->
                <div class="grid grid-cols-4 gap-4 mb-10">
                    <div id="step-build" class="step-card bg-slate-900/50 p-6 rounded-2xl text-center">
                        <i class="fas fa-hammer text-2xl mb-3"></i>
                        <h3 class="text-xs uppercase tracking-widest text-slate-500">Build</h3>
                        <p class="mt-2 font-bold text-sm" id="txt-build">-</p>
                    </div>
                    <div id="step-test" class="step-card bg-slate-900/50 p-6 rounded-2xl text-center">
                        <i class="fas fa-vial text-2xl mb-3"></i>
                        <h3 class="text-xs uppercase tracking-widest text-slate-500">Testing</h3>
                        <p class="mt-2 font-bold text-sm" id="txt-test">-</p>
                    </div>
                    <div id="step-security" class="step-card bg-slate-900/50 p-6 rounded-2xl text-center">
                        <i class="fas fa-shield-virus text-2xl mb-3"></i>
                        <h3 class="text-xs uppercase tracking-widest text-slate-500">Security</h3>
                        <p class="mt-2 font-bold text-sm" id="txt-security">-</p>
                    </div>
                    <div id="step-deploy" class="step-card bg-slate-900/50 p-6 rounded-2xl text-center">
                        <i class="fas fa-cloud-upload-alt text-2xl mb-3"></i>
                        <h3 class="text-xs uppercase tracking-widest text-slate-500">Deploy</h3>
                        <p class="mt-2 font-bold text-sm" id="txt-deploy">-</p>
                    </div>
                </div>

                <!-- Commit Info -->
                <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h3 class="text-slate-400 text-xs font-bold uppercase mb-4 tracking-widest">Latest Commit Info</h3>
                    <div class="flex items-center gap-4">
                        <div id="user-avatar" class="w-12 h-12 rounded-full bg-slate-800 border border-slate-700"></div>
                        <div>
                            <p id="commit-msg" class="font-bold text-white">Loading latest commit...</p>
                            <p id="commit-meta" class="text-sm text-slate-500">Waiting for sync...</p>
                        </div>
                    </div>
                </div>
            </div>

            <script>
                // THAY THÔNG TIN CỦA BẠN VÀO ĐÂY
                const OWNER = 'pta204';
                const REPO = 'codestream-demo';

                async function updateStatus() {
                    try {
                        const response = await fetch(\`https://api.github.com/repos/\${OWNER}/\${REPO}/actions/runs?per_page=1\`);
                        const data = await response.json();
                        const run = data.workflow_runs[0];

                        if (!run) return;

                        // Cập nhật Header Status
                        const statusEl = document.getElementById('global-status');
                        statusEl.innerText = run.status.toUpperCase();
                        statusEl.className = \`px-4 py-1 rounded-full border text-sm font-bold \${run.status === 'queued' || run.status === 'in_progress' ? 'border-yellow-500 text-yellow-500 status-running' : 'border-emerald-500 text-emerald-500'}\`;

                        // Cập nhật Thông tin Commit
                        document.getElementById('commit-msg').innerText = run.head_commit.message;
                        document.getElementById('commit-meta').innerText = \`By \${run.head_commit.author.name} • \${new Date(run.created_at).toLocaleTimeString()}\`;
                        document.getElementById('user-avatar').style.backgroundImage = \`url('\${run.actor.avatar_url}')\`;
                        document.getElementById('user-avatar').style.backgroundSize = 'cover';

                        // Giả lập trạng thái từng bước dựa trên Global Status
                        updateStep('step-build', 'txt-build', run.status, run.conclusion);
                        updateStep('step-test', 'txt-test', run.status, run.conclusion);
                        updateStep('step-security', 'txt-security', run.status, run.conclusion);
                        updateStep('step-deploy', 'txt-deploy', run.status, run.conclusion);

                    } catch (err) {
                        console.error("Lỗi fetch API:", err);
                    }
                }

                function updateStep(id, txtId, status, conclusion) {
                    const el = document.getElementById(id);
                    const txt = document.getElementById(txtId);
                    
                    if (status === 'in_progress' || status === 'queued') {
                        el.classList.add('active-step');
                        txt.innerText = 'RUNNING...';
                        txt.className = 'mt-2 font-bold text-sm status-running';
                    } else if (conclusion === 'success') {
                        el.classList.remove('active-step');
                        txt.innerText = 'PASSED ✅';
                        txt.className = 'mt-2 font-bold text-sm status-success';
                    } else if (conclusion === 'failure') {
                        el.classList.remove('active-step');
                        txt.innerText = 'FAILED ❌';
                        txt.className = 'mt-2 font-bold text-sm status-failed';
                    }
                }

                // Cập nhật mỗi 3 giây
                setInterval(updateStatus, 3000);
                updateStatus();
            </script>
        </body>
        </html>
    `);
});

// ... (Giữ nguyên phần code giao diện Dashboard của bạn)

// THÊM ĐOẠN NÀY VÀO CUỐI FILE index.js
const calculateStreamSpeed = (bitrate, resolution) => {
    if (bitrate <= 0 || resolution <= 0) return 0;
    return (bitrate / resolution).toFixed(2);
};

// Dòng này là quan trọng nhất để CI/CD hoạt động đúng:
module.exports = { calculateStreamSpeed };

app.listen(PORT, () => {
    console.log("🚀 Dashboard Live tại http://localhost:3000");
});

