document.getElementById('start').addEventListener('click', async () => {
  const pixels = parseInt(document.getElementById('pixels').value);
  const interval = parseInt(document.getElementById('interval').value);
  const behavior = document.getElementById('behavior').value;

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: (pixels, interval, behavior) => {
      if (window.autoScrollInterval) clearInterval(window.autoScrollInterval);

      // Tambahkan tombol melayang jika belum ada
      if (!document.getElementById('autoScrollButton')) {
        const btn = document.createElement('button');
        btn.id = 'autoScrollButton';
        btn.textContent = 'Pause';
        btn.style.position = 'fixed';
        btn.style.bottom = '20px';
        btn.style.right = '20px';
        btn.style.padding = '10px 15px';
        btn.style.zIndex = 9999;
        btn.style.background = '#007bff';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '5px';
        btn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
        btn.style.cursor = 'pointer';
        btn.style.fontSize = '14px';
        btn.style.opacity = 0.2;
        btn.style.transition = 'opacity 0.5s';
        btn.onmouseenter = () => (btn.style.opacity = 0.8);
        btn.onmouseleave = () => (btn.style.opacity = 0.2);

        document.body.appendChild(btn);

        btn.addEventListener('click', () => {
          if (window.autoScrollPaused) {
            window.autoScrollInterval = setInterval(() => {
              window.scrollBy({ top: pixels, behavior: behavior });
            }, interval);
            btn.textContent = 'Pause';
            window.autoScrollPaused = false;
          } else {
            clearInterval(window.autoScrollInterval);
            btn.textContent = 'Resume';
            window.autoScrollPaused = true;
          }
        });
      }

      window.autoScrollPixels = pixels;
      window.autoScrollIntervalMs = interval;
      window.autoScrollPaused = false;

      window.autoScrollInterval = setInterval(() => {
        window.scrollBy({ top: pixels, behavior: behavior });
      }, interval);
    },
    args: [pixels, interval, behavior],
  });
});

document.getElementById('stop').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      if (window.autoScrollInterval) {
        clearInterval(window.autoScrollInterval);
        window.autoScrollInterval = null;
      }

      const btn = document.getElementById('autoScrollButton');
      if (btn) btn.remove();
    },
  });
});
