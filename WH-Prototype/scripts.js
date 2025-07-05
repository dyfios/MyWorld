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
        <button class="btn btn-success" onclick="visitWorldFromInfo('${worldId}')">Visit</button>
        <button class="btn btn-secondary">Join</button>
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
  
  // Store current world info for visit function
  window.currentWorldInfo = { worldId, worldTitle };
  
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

// Create World Modal Functions
function showCreateWorldPanel() {
  // Reset form
  document.getElementById('templateSelect').value = '';
  document.getElementById('worldName').value = '';
  document.getElementById('templateThumbnail').style.display = 'none';
  document.getElementById('thumbnailPlaceholder').style.display = 'block';
  
  // Show the modal
  const modal = new bootstrap.Modal(document.getElementById('createWorldModal'));
  modal.show();
}

function createWorld() {
  const template = document.getElementById('templateSelect').value;
  const worldName = document.getElementById('worldName').value;
  
  if (!template) {
    alert('Please select a template');
    return;
  }
  
  if (!worldName.trim()) {
    alert('Please enter a world name');
    return;
  }
  
  // Here you would typically send the data to your backend
  console.log('Creating world:', { template, worldName });
  
  // Generate a unique world ID and URL
  const worldId = generateWorldId();
  const worldUrl = `https://myworld.com/world/${worldId}`;
  
  // Populate the new world modal
  document.getElementById('newWorldUrl').value = worldUrl;
  
  // Show the new world modal
  const newWorldModal = new bootstrap.Modal(document.getElementById('newWorldModal'));
  newWorldModal.show();
}

// Generate a unique world ID (simple implementation for demo)
function generateWorldId() {
  return 'world_' + Math.random().toString(36).substr(2, 9);
}

// Copy the new world URL to clipboard
function copyNewWorldUrl() {
  const urlField = document.getElementById('newWorldUrl');
  urlField.select();
  urlField.setSelectionRange(0, 99999); // For mobile devices
  
  // Copy to clipboard
  navigator.clipboard.writeText(urlField.value).then(() => {
    // Change button text temporarily to show success
    const copyBtn = document.getElementById('copyNewWorldUrlBtn');
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

// Close both modals when Ok is clicked
function closeAllModals() {
  // Use a timeout to ensure the new modal is fully displayed before closing
  setTimeout(() => {
    // Close the new world modal first
    const newWorldModalEl = document.getElementById('newWorldModal');
    const newWorldModal = bootstrap.Modal.getInstance(newWorldModalEl) || new bootstrap.Modal(newWorldModalEl);
    newWorldModal.hide();
    
    // Close the create world modal after a short delay
    setTimeout(() => {
      const createWorldModalEl = document.getElementById('createWorldModal');
      const createWorldModal = bootstrap.Modal.getInstance(createWorldModalEl) || new bootstrap.Modal(createWorldModalEl);
      createWorldModal.hide();
    }, 300);
  }, 100);
}

// Close the create world modal (called after new world modal is closed)
function closeCreateWorldModal() {
  // Wait for the new world modal to close, then close the create world modal
  const newWorldModal = document.getElementById('newWorldModal');
  
  // Listen for the new world modal to be completely hidden
  newWorldModal.addEventListener('hidden.bs.modal', function() {
    const createWorldModalEl = document.getElementById('createWorldModal');
    const createWorldModal = bootstrap.Modal.getInstance(createWorldModalEl);
    if (createWorldModal) {
      createWorldModal.hide();
    }
  }, { once: true }); // Use once: true to ensure this only runs once
}

// Template selection handler
document.addEventListener('DOMContentLoaded', function() {
  const templateSelect = document.getElementById('templateSelect');
  if (templateSelect) {
    templateSelect.addEventListener('change', function() {
      const template = this.value;
      const thumbnail = document.getElementById('templateThumbnail');
      const placeholder = document.getElementById('thumbnailPlaceholder');
      
      if (template) {
        thumbnail.src = `template-${template}.jpg`;
        thumbnail.style.display = 'block';
        placeholder.style.display = 'none';
      } else {
        thumbnail.style.display = 'none';
        placeholder.style.display = 'block';
      }
    });
  }
});

// Visit World Functions
function visitWorld() {
  if (window.currentWorldInfo) {
    const { worldId, worldTitle } = window.currentWorldInfo;
    const visitUrl = `visitworld.html?worldId=${encodeURIComponent(worldId)}&worldName=${encodeURIComponent(worldTitle)}`;
    window.open(visitUrl, '_blank');
  }
}

function visitNewWorld() {
  // Get the newly created world URL
  const worldUrl = document.getElementById('newWorldUrl').value;
  const worldId = worldUrl.split('/').pop(); // Extract world ID from URL
  const worldName = 'New World'; // Default name for new worlds
  
  const visitUrl = `visitworld.html?worldId=${encodeURIComponent(worldId)}&worldName=${encodeURIComponent(worldName)}`;
  window.open(visitUrl, '_blank');
}

function visitWorldFromInfo(worldId) {
  const worldName = `World ${worldId}`;
  const visitUrl = `visitworld.html?worldId=${encodeURIComponent(worldId)}&worldName=${encodeURIComponent(worldName)}`;
  window.open(visitUrl, '_blank');
}