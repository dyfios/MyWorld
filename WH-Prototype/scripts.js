const themeToggle = document.getElementById('themeToggle');
const header = document.getElementById('header');
const body = document.body;

let activeWorldInfo = null; // To track the active world-info panel
let activeWorldInfoButton = null; // To track the active world-info button

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  body.classList.add(savedTheme);
  if (savedTheme === 'dark-mode') {
    header.classList.replace('navbar-light', 'navbar-dark');
    header.classList.replace('bg-light', 'bg-dark');
    themeToggle.textContent = '☀️';
  }
}

themeToggle.addEventListener('click', () => {
  if (body.classList.contains('dark-mode')) {
    body.classList.remove('dark-mode');
    header.classList.replace('navbar-dark', 'navbar-light');
    header.classList.replace('bg-dark', 'bg-light');
    themeToggle.textContent = '🌙';
    localStorage.setItem('theme', 'light-mode');
  } else {
    body.classList.add('dark-mode');
    header.classList.replace('navbar-light', 'navbar-dark');
    header.classList.replace('bg-light', 'bg-dark');
    themeToggle.textContent = '☀️';
    localStorage.setItem('theme', 'dark-mode');
  }
});

function showWorldInfo(button) {console.log("hey");
    restoreWorldButton();
    const container = button.parentElement; // Get the container div
    const worldId = button.getAttribute("data-world-id");
  
    // Replace the button with world info
    container.innerHTML = `
      <div class="world-info">
        <img src="world-${worldId}.jpg" alt="World ${worldId}">
        <h4>World ${worldId}</h4>
        <p>This is a description of World ${worldId}. It's a fascinating place!</p>
        <button class="btn btn-primary">More...</button>
        <button class="btn btn-success">Join</button>
      </div>
    `;
  
    // Set the active world-info panel
    activeWorldInfo = { container, worldId };
    activeWorldInfoButton = button;
  }
  
  function restoreWorldButton() {console.log("yo");
    if (activeWorldInfo) {
      const { container, worldId } = activeWorldInfo;
  
      // Replace the info with the original button
      container.innerHTML = `
        <button class="btn btn-secondary large-button mx-1" data-world-id="${worldId}" onclick="showWorldInfo(this)" data-bs-toggle="tooltip" title="World ${worldId}"></button>
      `;
  
      activeWorldInfo = null; // Clear the active panel
    }
  }
  
  // Listen for clicks outside the world-info panel
  document.addEventListener("click", (event) => {
    if (activeWorldInfo) {
      const worldInfoElement = activeWorldInfo.container.querySelector(".world-info");
  
      // Check if the click happened outside the active world-info panel
      if (worldInfoElement && !worldInfoElement.contains(event.target)) {
        if (activeWorldInfoButton && activeWorldInfoButton.contains(event.target)) {

        }
        else {
            restoreWorldButton();
        }
      }
    }
  });

// World Panel Modal Functions (for myworlds.html)
function showWorldPanel(button) {
  const worldId = button.getAttribute("data-world-id");
  const worldTitle = button.getAttribute("title");
  
  // Populate modal content
  document.getElementById('worldTitle').value = worldTitle;
  document.getElementById('worldThumbnail').src = `world-${worldId}.jpg`;
  document.getElementById('worldThumbnail').alt = `${worldTitle} Thumbnail`;
  document.getElementById('worldUrl').value = `https://myworld.com/world/${worldId}`;
  
  // Show the modal
  const modal = new bootstrap.Modal(document.getElementById('worldModal'));
  modal.show();
}

function copyWorldUrl() {
  const urlField = document.getElementById('worldUrl');
  urlField.select();
  urlField.setSelectionRange(0, 99999); // For mobile devices
  
  // Copy to clipboard
  navigator.clipboard.writeText(urlField.value).then(() => {
    // Change button text temporarily to show success
    const copyBtn = document.getElementById('copyUrlBtn');
    const originalText = copyBtn.textContent;
    copyBtn.textContent = 'Copied!';
    copyBtn.classList.remove('btn-outline-secondary');
    copyBtn.classList.add('btn-success');
    
    setTimeout(() => {
      copyBtn.textContent = originalText;
      copyBtn.classList.remove('btn-success');
      copyBtn.classList.add('btn-outline-secondary');
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy URL: ', err);
    // Fallback for older browsers
    document.execCommand('copy');
  });
}