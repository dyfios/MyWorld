// World Visit Page JavaScript Functions

// API Configuration
const API_BASE_URL = 'http://localhost:4000';
const PLACEHOLDER_USER_ID = 'user-placeholder';
const PLACEHOLDER_USER_TOKEN = 'token-placeholder';

// Initialize the world visit page
document.addEventListener('DOMContentLoaded', function() {
  // Get world information from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const worldId = urlParams.get('worldId');
  const worldName = urlParams.get('worldName');
  
  // Store world ID globally for use in API calls
  window.currentWorldId = worldId || 'world-placeholder';
  
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
async function createEntity() {
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
  
  const createButton = document.querySelector('#uploadCollapse .btn-primary');
  createButton.disabled = true;
  createButton.textContent = 'Creating...';
  
  try {
    // Prepare the file data
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = async function(e) {
      try {
        const fileData = {
          name: file.name,
          type: file.type,
          size: file.size,
          data: e.target.result.split(',')[1] // Remove data URL prefix
        };
        
        // Prepare the template data
        const templateData = {
          entity_tag: entityName,
          type: 'mesh',
          assets: fileData
        };
        
        // Send POST request to create entity template
        const response = await fetch(`${API_BASE_URL}/create-entity-template`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'world-id': window.currentWorldId,
            'user-id': PLACEHOLDER_USER_ID,
            'user-token': PLACEHOLDER_USER_TOKEN,
            'template-data': templateData
          })
        });
        
        const result = await response.json();
        
        if (response.ok) {
          // Show success message
          alert('Entity created successfully!');
          
          // Reset form
          fileInput.value = '';
          document.getElementById('filePathDisplay').value = '';
          document.getElementById('entityName').value = '';
        } else {
          // Show error message
          alert(`Error creating entity: ${result.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error creating entity:', error);
        alert('Error creating entity. Please check the console for details.');
      } finally {
        createButton.disabled = false;
        createButton.textContent = 'Create';
      }
    };
    
    reader.readAsDataURL(file);
  } catch (error) {
    console.error('Error creating entity:', error);
    alert('Error creating entity. Please check the console for details.');
    createButton.disabled = false;
    createButton.textContent = 'Create';
  }
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