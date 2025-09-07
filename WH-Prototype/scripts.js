// API Configuration
const API_BASE_URL = 'https://myworlds.worldhub.me:4000';
const PLACEHOLDER_USER_ID = 'user-placeholder';
const PLACEHOLDER_USER_TOKEN = 'token-placeholder';

const themeToggle = document.getElementById('themeToggle');
const header = document.getElementById('header');
const body = document.body;

let activeWorldInfo = null; // To track the active world-info panel
let activeWorldInfoButton = null; // To track the active world-info button

let userID = sessionStorage.getItem("WORLDHUB_ID_ID");
let userToken = sessionStorage.getItem("WORLDHUB_ID_TOKEN");

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize theme
  initializeTheme();
  
  // Initialize worlds grid if we're on myworlds.html
  if (document.querySelector('.worlds-grid') || document.querySelector('.stats-grid')) {
    initializeMyWorldsPage();
  }
  
  // Initialize template selection if we're on a page with create world modal
  initializeTemplateSelection();
});

// Initialize theme system
function initializeTheme() {
  // Check for saved theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme && body) {
    body.classList.add(savedTheme);
    if (savedTheme === 'dark-mode' && header) {
      header.classList.replace('navbar-light', 'navbar-dark');
      header.classList.replace('bg-light', 'bg-dark');
      if (themeToggle) themeToggle.textContent = '??';
    }
  }
}

// Initialize My Worlds page
function initializeMyWorldsPage() {
  // Load worlds from API if user is logged in
  if (userID && userToken) {
    loadWorldsFromAPI(userID, userToken);
  } else {
    // Create some demo worlds for display
    const demoWorlds = [
      { id: 'demo-1', name: 'Forest Paradise', description: 'A lush green world with beautiful trees', template: 'forest' },
      { id: 'demo-2', name: 'Ocean World', description: 'Endless blue waters and marine life', template: 'ocean' },
      { id: 'demo-3', name: 'Space Station Alpha', description: 'A futuristic space exploration base', template: 'space' }
    ];
    populateWorldButtons(demoWorlds);
  }
  
  // Initialize tooltip if Bootstrap is available
  if (typeof bootstrap !== 'undefined') {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }
}

// Initialize template selection
function initializeTemplateSelection() {
  const templateSelect = document.getElementById('templateSelect');
  if (templateSelect) {
    templateSelect.addEventListener('change', function() {
      const template = this.value;
      const thumbnail = document.getElementById('templateThumbnail');
      const placeholder = document.getElementById('thumbnailPlaceholder');
      
      if (template && thumbnail && placeholder) {
        thumbnail.src = `template-${template}.jpg`;
        thumbnail.style.display = 'block';
        placeholder.style.display = 'none';
      } else if (thumbnail && placeholder) {
        thumbnail.style.display = 'none';
        placeholder.style.display = 'block';
      }
    });
  }
}

// Theme toggle functionality
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    if (body.classList.contains('dark-mode')) {
      body.classList.remove('dark-mode');
      if (header) {
        header.classList.replace('navbar-dark', 'navbar-light');
        header.classList.replace('bg-dark', 'bg-light');
      }
      themeToggle.textContent = '??';
      localStorage.setItem('theme', 'light-mode');
    } else {
      body.classList.add('dark-mode');
      if (header) {
        header.classList.replace('navbar-light', 'navbar-dark');
        header.classList.replace('bg-light', 'bg-dark');
      }
      themeToggle.textContent = '??';
      localStorage.setItem('theme', 'dark-mode');
    }
  });
}

function showWorldInfo(button) {
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
  
  function restoreWorldButton() {
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
function showWorldPanel(element) {
  const worldId = element.getAttribute("data-world-id");
  const worldName = element.getAttribute("data-world-name") || element.getAttribute("title");
  const worldDescription = element.getAttribute("data-world-description") || '';
  
  // Store current world info for visit function
  window.currentWorldInfo = { worldId, worldTitle: worldName };
  
  // Check if we have the new world details modal or the old one
  const newWorldDetailsModal = document.getElementById('worldDetailsModal');
  const oldWorldModal = document.getElementById('worldModal');
  
  if (newWorldDetailsModal) {
    // New modal structure
    document.getElementById('detailWorldName').textContent = worldName;
    document.getElementById('detailWorldDescription').textContent = worldDescription || 'A virtual world experience';
    document.getElementById('detailWorldUrl').value = `https://myworld.com/world/${worldId}`;
    
    // Update world icon based on element (for world cards)
    const worldIcon = element.querySelector('.world-card-icon');
    const modalIcon = document.getElementById('detailWorldIcon');
    if (worldIcon && modalIcon) {
      modalIcon.className = worldIcon.className;
    }
    
    // Show the new modal
    const modal = new bootstrap.Modal(newWorldDetailsModal);
    modal.show();
  } else if (oldWorldModal) {
    // Old modal structure (fallback)
    document.getElementById('worldTitle').value = worldName;
    document.getElementById('worldThumbnail').src = `world-${worldId}.jpg`;
    document.getElementById('worldThumbnail').alt = `${worldName} Thumbnail`;
    document.getElementById('worldUrl').value = `https://myworld.com/world/${worldId}`;
    
    // Show the old modal
    const modal = new bootstrap.Modal(oldWorldModal);
    modal.show();
  }
}

function copyWorldUrl() {
  // Check for new modal structure first
  const newUrlField = document.getElementById('detailWorldUrl');
  const oldUrlField = document.getElementById('worldUrl');
  
  let urlField, copyBtn;
  
  if (newUrlField) {
    // New modal structure
    urlField = newUrlField;
    copyBtn = document.getElementById('copyDetailUrlBtn');
  } else if (oldUrlField) {
    // Old modal structure
    urlField = oldUrlField;
    copyBtn = document.getElementById('copyUrlBtn');
  } else {
    console.error('URL field not found');
    return;
  }
  
  urlField.select();
  urlField.setSelectionRange(0, 99999); // For mobile devices
  
  // Copy to clipboard
  navigator.clipboard.writeText(urlField.value).then(() => {
    if (copyBtn) {
      // Change button text temporarily to show success
      const originalText = copyBtn.textContent;
      copyBtn.textContent = 'Copied!';
      copyBtn.classList.remove('btn-outline-secondary');
      copyBtn.classList.add('btn-success');
      
      setTimeout(() => {
        copyBtn.textContent = originalText;
        copyBtn.classList.remove('btn-success');
        copyBtn.classList.add('btn-outline-secondary');
      }, 2000);
    }
  }).catch(err => {
    console.error('Failed to copy URL: ', err);
    // Fallback for older browsers
    document.execCommand('copy');
  });
}

// Visit world function for new modal
function visitWorldFromDetails() {
  if (window.currentWorldInfo) {
    visitWorld(window.currentWorldInfo.worldId, window.currentWorldInfo.worldTitle);
  } else {
    console.error('No world info available');
  }
}

// Create World Modal Functions
function showCreateWorldPanel() {
  // Reset form
  document.getElementById('templateSelect').value = '';
  document.getElementById('worldName').value = '';
  document.getElementById('worldDescription').value = '';
  document.getElementById('templateThumbnail').style.display = 'none';
  document.getElementById('thumbnailPlaceholder').style.display = 'block';
  
  // Show the modal
  const modal = new bootstrap.Modal(document.getElementById('createWorldModal'));
  modal.show();
}

async function createWorld() {
  const template = document.getElementById('templateSelect').value;
  const worldName = document.getElementById('worldName').value;
  const worldDescription = document.getElementById('worldDescription').value;
  
  if (!template) {
    alert('Please select a template');
    return;
  }
  
  if (!worldName.trim()) {
    alert('Please enter a world name');
    return;
  }
  
  if (!worldDescription.trim()) {
    alert('Please enter a world description');
    return;
  }
  
  const createButton = document.querySelector('#createWorldModal .btn-success');
  createButton.disabled = true;
  createButton.textContent = 'Creating...';
  
  try {
    // Send POST request to create world
    const response = await fetch(`${API_BASE_URL}/create-world`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: worldName,
        description: worldDescription,
        owner: userID,
        permissions: 'public', // Default permissions
        'user-id': userID,
        'user-token': userToken,
        template: template // Template parameter as mentioned in the issue
      })
    });
    
    const result = await response.json();
    
    if (response.ok && result.worldid) {
      // Generate world URL using the returned world ID
      const worldUrl = `https://myworld.com/world/${result.worldid}`;
      
      // Populate the new world modal
      document.getElementById('newWorldUrl').value = worldUrl;
      
      // Show the new world modal
      const newWorldModal = new bootstrap.Modal(document.getElementById('newWorldModal'));
      newWorldModal.show();
      
      // Refresh the world list
      loadWorldsFromAPI(userID, userToken);
    } else {
      alert(`Error creating world: ${result.error || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Error creating world:', error);
    alert('Error creating world. Please check the console for details.');
  } finally {
    createButton.disabled = false;
    createButton.textContent = 'Create';
  }
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

// Load worlds from API
async function loadWorldsFromAPI(id, token) {
  try {
    userID = id;
    userToken = token;
    const response = await fetch(`${API_BASE_URL}/list-worlds?user-id=${userID}&user-token=${userToken}`);
    const result = await response.json();
    if (response.ok && result.worlds) {
      populateWorldButtons(result.worlds);
    } else {
      console.error('Error loading worlds:', result.error || 'Unknown error');
    }
  } catch (error) {
    console.error('Error loading worlds:', error);
  }
}

// Populate world buttons based on API data
function populateWorldButtons(worlds) {
  const worldsGrid = document.querySelector('.worlds-grid');
  if (!worldsGrid) {
    // Fallback for old layout if new grid doesn't exist
    const worldsContainer = document.querySelector('.container .d-flex');
    if (!worldsContainer) return;
    
    // Clear existing world buttons (keep the + button)
    const existingButtons = worldsContainer.querySelectorAll('.btn-secondary');
    existingButtons.forEach(button => button.remove());
    
    // Add world buttons (old layout)
    worlds.forEach((world, index) => {
      const button = document.createElement('button');
      button.className = 'btn btn-secondary large-button mx-2 my-2';
      button.setAttribute('data-world-id', world.id || `world-${index + 1}`);
      button.setAttribute('data-world-name', world.name || `World ${index + 1}`);
      button.setAttribute('data-world-description', world.description || '');
      button.setAttribute('data-bs-toggle', 'tooltip');
      button.setAttribute('title', world.name || `World ${index + 1}`);
      button.onclick = function() { showWorldPanel(this); };
      
      // Insert before the + button
      const createButton = worldsContainer.querySelector('.btn-primary');
      worldsContainer.insertBefore(button, createButton);
    });
    return;
  }
  
  // New grid layout
  // Clear existing world cards (keep the create button)
  const existingCards = worldsGrid.querySelectorAll('.world-card:not(.create-world-card)');
  existingCards.forEach(card => card.remove());
  
  // Get the create button for insertion reference
  const createCard = worldsGrid.querySelector('.create-world-card');
  
  // Add world cards
  worlds.forEach((world, index) => {
    const worldCard = createWorldCard(
      world.id || `world-${index + 1}`,
      world.name || `World ${index + 1}`,
      world.description || 'A virtual world experience',
      world.template || 'custom'
    );
    
    // Insert before the create button
    if (createCard) {
      worldsGrid.insertBefore(worldCard, createCard);
    } else {
      worldsGrid.appendChild(worldCard);
    }
  });
  
  // Update stats if they exist
  updateWorldStats(worlds);
}

// Create a world card element for the new grid layout
function createWorldCard(worldId, worldName, worldDescription, template = 'custom') {
  const worldCard = document.createElement('div');
  worldCard.className = 'world-card';
  worldCard.setAttribute('data-world-id', worldId);
  worldCard.setAttribute('data-world-name', worldName);
  worldCard.setAttribute('data-world-description', worldDescription);
  worldCard.setAttribute('data-bs-toggle', 'tooltip');
  worldCard.setAttribute('title', 'Click to view details');
  worldCard.onclick = function() { showWorldPanel(this); };
  
  // Determine icon based on template or world name
  let icon = 'fa-globe'; // default
  if (template) {
    switch (template.toLowerCase()) {
      case 'city':
        icon = 'fa-city';
        break;
      case 'forest':
        icon = 'fa-tree';
        break;
      case 'desert':
        icon = 'fa-sun';
        break;
      case 'ocean':
        icon = 'fa-water';
        break;
      case 'space':
        icon = 'fa-rocket';
        break;
      case 'island':
        icon = 'fa-mountain';
        break;
      default:
        icon = 'fa-globe';
    }
  }
  
  // Create a short description from the full description
  const shortDescription = worldDescription.length > 30 ? 
    worldDescription.substring(0, 30) + '...' : worldDescription;
  
  worldCard.innerHTML = `
    <i class="fas ${icon} world-card-icon"></i>
    <div class="world-card-title">${worldName}</div>
    <div class="world-card-subtitle">${shortDescription}</div>
  `;
  
  // Add entrance animation
  worldCard.style.opacity = '0';
  worldCard.style.transform = 'translateY(20px)';
  setTimeout(() => {
    worldCard.style.transition = 'all 0.3s ease';
    worldCard.style.opacity = '1';
    worldCard.style.transform = 'translateY(0)';
  }, 100);
  
  return worldCard;
}

// Update world statistics in the stats section
function updateWorldStats(worlds) {
  const totalWorldsEl = document.getElementById('totalWorlds');
  const activeWorldsEl = document.getElementById('activeWorlds');
  const totalVisitsEl = document.getElementById('totalVisits');
  const avgRatingEl = document.getElementById('avgRating');
  
  if (totalWorldsEl) {
    animateCounterTo(totalWorldsEl, worlds.length);
  }
  
  if (activeWorldsEl) {
    // Assume all worlds are active for now
    animateCounterTo(activeWorldsEl, worlds.length);
  }
  
  if (totalVisitsEl) {
    // Calculate total visits from world data if available
    const totalVisits = worlds.reduce((sum, world) => {
      return sum + (world.visits || Math.floor(Math.random() * 1000) + 100);
    }, 0);
    animateCounterTo(totalVisitsEl, totalVisits);
  }
  
  if (avgRatingEl) {
    // Calculate average rating from world data if available
    const totalRating = worlds.reduce((sum, world) => {
      return sum + (world.rating || (Math.random() * 2 + 3)); // Random rating between 3-5
    }, 0);
    const avgRating = worlds.length > 0 ? totalRating / worlds.length : 4.5;
    animateCounterToDecimal(avgRatingEl, avgRating);
  }
}

// Animate counter to a specific value
function animateCounterTo(element, targetValue) {
  const startValue = parseInt(element.textContent) || 0;
  const duration = 1000;
  let startTimestamp = null;
  
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const currentValue = Math.floor(progress * (targetValue - startValue) + startValue);
    element.textContent = currentValue.toLocaleString();
    
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  
  window.requestAnimationFrame(step);
}

// Animate decimal counter (for ratings)
function animateCounterToDecimal(element, targetValue) {
  const startValue = parseFloat(element.textContent) || 0;
  const duration = 1000;
  let startTimestamp = null;
  
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const currentValue = progress * (targetValue - startValue) + startValue;
    element.textContent = currentValue.toFixed(1);
    
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  
  window.requestAnimationFrame(step);
}

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

window.addEventListener("message", (event) => {
  if (event.origin !== "https://id.worldhub.me:35526") return; // Validate sender

  if (event.data.type === "session-info") {
    let userID = event.data.userID;
    const userName = event.data.userName;
    let userToken = event.data.sessionToken;
    const tokenExpiry = event.data.sessionTokenExpiry;

    if (userID == null || userToken == null) {
        window.location.href = "https://id.worldhub.me:35526/login?redirect_url=https://myworlds.worldhub.me:8080/myworlds.html";
    }


    // Load worlds from API if on myworlds page
    if (window.location.pathname.includes('myworlds.html')) {
      loadWorldsFromAPI(userID, userToken);
    }
  }
});

var loginIFrame = document.getElementById("loginiframe");
loginIFrame.contentWindow.postMessage({type:"request-session"}, "https://id.worldhub.me:35526");