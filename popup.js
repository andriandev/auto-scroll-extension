document.getElementById('start').addEventListener('click', async () => {
  const pixels = parseInt(document.getElementById('pixels').value);
  const interval = parseInt(document.getElementById('interval').value);
  const behavior = document.getElementById('behavior').value;
  const position = document.getElementById('position').value;

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: (pixels, interval, behavior, position) => {
      if (window.autoScrollInterval) clearInterval(window.autoScrollInterval);

      // Check button if exist
      const btnControl = document.getElementById('autoScrollButton');
      if (btnControl) btnControl.remove();

      // Create button
      const btn = document.createElement('button');
      btn.id = 'autoScrollButton';
      btn.textContent = 'Pause';
      btn.onmouseenter = () => (btn.style.opacity = 0.8);
      btn.onmouseleave = () => (btn.style.opacity = 0.2);

      // Set button position
      function setButtonPosition(button, position) {
        const styles = {
          position: 'fixed',
          zIndex: 9999,
          padding: '10px 15px',
          background: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          cursor: 'pointer',
          fontSize: '14px',
          opacity: 0.2,
          transition: 'opacity 0.5s',
        };

        switch (position) {
          case 'top-left':
            Object.assign(styles, { top: '10px', left: '10px' });
            break;
          case 'top-right':
            Object.assign(styles, { top: '10px', right: '10px' });
            break;
          case 'bottom-left':
            Object.assign(styles, { bottom: '10px', left: '10px' });
            break;
          case 'bottom-right':
            Object.assign(styles, { bottom: '10px', right: '10px' });
            break;
          case 'top-center':
            Object.assign(styles, {
              top: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
            });
            break;
          case 'bottom-center':
            Object.assign(styles, {
              bottom: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
            });
            break;
        }

        Object.assign(button.style, styles);
      }
      setButtonPosition(btn, position);

      // Add button in body html
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

      window.autoScrollPixels = pixels;
      window.autoScrollIntervalMs = interval;
      window.autoScrollPaused = false;

      window.autoScrollInterval = setInterval(() => {
        window.scrollBy({ top: pixels, behavior: behavior });
      }, interval);
    },
    args: [pixels, interval, behavior, position],
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

      const btnControl = document.getElementById('autoScrollButton');
      if (btnControl) btnControl.remove();
    },
  });
});
