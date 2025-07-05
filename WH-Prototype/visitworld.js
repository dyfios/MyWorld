// World Visit Page JavaScript Functions

// Initialize the world visit page
document.addEventListener('DOMContentLoaded', function() {
  // Get world information from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const worldId = urlParams.get('worldId');
  const worldName = urlParams.get('worldName');
  
  if (worldId && worldName) {
    // Set the world title
    document.getElementById('worldTitle').textContent = worldName;
    
    // Set up the iframe source (placeholder for now)
    document.getElementById('worldIframe').src = `https://webverse.example.com/world/${worldId}`;
  } else {
    // If no parameters, show default content
    document.getElementById('worldTitle').textContent = 'World Visit';
    document.getElementById('worldIframe').src = 'about:blank';
  }
});

// Toggle fullscreen for the iframe
function toggleFullscreen() {
  const iframe = document.getElementById('worldIframe');
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  
  if (!document.fullscreenElement) {
    iframe.requestFullscreen().then(() => {
      fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
    }).catch(err => {
      console.error('Error attempting to enable fullscreen:', err);
    });
  } else {
    document.exitFullscreen().then(() => {
      fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
    }).catch(err => {
      console.error('Error attempting to exit fullscreen:', err);
    });
  }
}

// Update file path display when file is selected
function updateFilePath() {
  const fileInput = document.getElementById('fileInput');
  const filePathDisplay = document.getElementById('filePathDisplay');
  
  if (fileInput.files.length > 0) {
    filePathDisplay.value = fileInput.files[0].name;
  } else {
    filePathDisplay.value = '';
  }
}

// Create entity function
function createEntity() {
  const fileInput = document.getElementById('fileInput');
  const entityName = document.getElementById('entityName').value.trim();
  
  if (!fileInput.files.length) {
    alert('Please select a file');
    return;
  }
  
  if (!entityName) {
    alert('Please enter an entity name');
    return;
  }
  
  // Here you would typically upload the file and create the entity
  console.log('Creating entity:', {
    file: fileInput.files[0],
    name: entityName
  });
  
  // Show success message
  alert('Entity created successfully!');
  
  // Reset form
  fileInput.value = '';
  document.getElementById('filePathDisplay').value = '';
  document.getElementById('entityName').value = '';
}

// Listen for fullscreen changes
document.addEventListener('fullscreenchange', function() {
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  
  if (document.fullscreenElement) {
    fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
  } else {
    fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
  }
});