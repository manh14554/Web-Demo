(function () {
    const video       = document.getElementById('qrVideo');
    const canvas      = document.getElementById('captureCanvas');
    const ctx         = canvas.getContext('2d');
    const viewfinder  = document.getElementById('viewfinder');
    const qrStatus    = document.getElementById('qrStatus');
    const qrStatusUrl = document.getElementById('qrStatusUrl');
    const btnScan     = document.getElementById('btnScan');
    const btnClear    = document.getElementById('btnClear');

    let stream     = null;
    let rafId      = null;
    let isScanning = false;
    let lastResult = null;

    async function startScan() {
        if (isScanning) return;
        try {
            stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 960 } }
            });
        } catch {
            try { stream = await navigator.mediaDevices.getUserMedia({ video: true }); }
            catch (err) {
                console.error(err);
                alert(err.message || 'Camera access denied or not available.');
                return;
}
        }
        video.srcObject = stream;
        await video.play();
        isScanning = true;
        video.classList.add('active');
        viewfinder.classList.add('scanning');
        btnScan.textContent = 'Stop';
        tick();
    }

    function tick() {
        if (!isScanning) return;
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvas.width  = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: 'attemptBoth' });
            if (code && code.data !== lastResult) { lastResult = code.data; showResult(code.data); }
        }
        rafId = requestAnimationFrame(tick);
    }

    function showResult(data) {
    const finalUrl = /^https?:\/\//i.test(data)
        ? data
        : `https://${data}`;
    qrStatus.classList.add('visible');
    qrStatusUrl.textContent = finalUrl;
    viewfinder.classList.add('success');
    viewfinder.classList.remove('scanning');
    qrStatusUrl.onclick = () => {
        window.open(finalUrl, '_blank', 'noopener,noreferrer');
        qrStatus.classList.remove('visible');
        qrStatusUrl.textContent = '';
        qrStatusUrl.onclick = null;
        lastResult = null;
    };
    setTimeout(() => {
        if (isScanning) {
            viewfinder.classList.remove('success');
            viewfinder.classList.add('scanning');
        }
    }, 1500);
}

    function stopScan() {
        isScanning = false;
        cancelAnimationFrame(rafId);
        if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; }
        video.srcObject = null;
        video.classList.remove('active');
        viewfinder.classList.remove('scanning', 'success');
        btnScan.textContent = 'Scan';
    }

    function clearAll() {
        stopScan();
        lastResult = null;
        qrStatus.classList.remove('visible');
        qrStatusUrl.textContent = '';
        qrStatusUrl.onclick = null;
    }

    btnScan.addEventListener('click', () => { isScanning ? stopScan() : (clearAll(), startScan()); });
    btnClear.addEventListener('click', clearAll);
})();