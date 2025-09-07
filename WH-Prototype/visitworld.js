// World Visit Page JavaScript Functions

// API Configuration
const API_BASE_URL = 'https://myworlds.worldhub.me:4000';
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
    document.getElementById('worldIframe').src = `https://webverse-webgl.s3.amazonaws.com/WebGL/index.html?main_app_id=00000000-0000-0000-0000-000000000000&daemon_port=5525&max_entries=2048&max_entry_length=2048&max_key_length=512&tab_id=100&files_directory=files&world_load_timeout=300&world_url=https://myworlds.worldhub.me:8081/myworld.veml?world_metadata={"id":"${worldId}","name":"${worldName}","description":"","owner":"1","permissions":"{}"}%26worlds_server=https://myworlds.worldhub.me:4000`;
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
          variant_tag: "default",
          type: "mesh",
          assets: "{\"model_path\": \"" + fileData.name + "\"}",
          scripts: "[]"
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
          const newResponse = await fetch(`${API_BASE_URL}/add-asset`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              'world-id': window.currentWorldId,
              'user-id': PLACEHOLDER_USER_ID,
              'user-token': PLACEHOLDER_USER_TOKEN,
              'file-buffer': fileData.data,
              'file-name': fileData.name
            })
          });

          const newResult = await newResponse.json();
          if (newResponse.ok) {
            // Show success message
            alert('Entity created successfully!');
            
            // Reset form
            fileInput.value = '';
            document.getElementById('filePathDisplay').value = '';
            document.getElementById('entityName').value = '';
          } else {
            // Show error message
            alert(`Error uploading entity: ${newResult.error || 'Unknown error'}`);
          }
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

/**
 * Visit World Page JavaScript
 * Handles world viewing functionality, entity uploads, and UI interactions
 */

class WorldVisitor {
  constructor() {
    this.worldData = null;
    this.isFullscreen = false;
    this.init();
  }

  init() {
    this.loadWorldFromURL();
    this.setupEventListeners();
    this.setupThemeIntegration();
  }

  loadWorldFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const worldId = urlParams.get('id');
    const worldName = urlParams.get('name');
    const worldUrl = urlParams.get('url');

    if (worldName) {
      document.getElementById('worldTitle').textContent = decodeURIComponent(worldName);
      document.title = `${decodeURIComponent(worldName)} - WH Search Engine`;
    }

    if (worldUrl) {
      this.loadWorldContent(decodeURIComponent(worldUrl));
    } else if (worldId) {
      this.loadWorldById(worldId);
    }
  }

  loadWorldById(worldId) {
    // This would typically make an API call to get world data
    console.log('Loading world by ID:', worldId);
    
    // For now, show a placeholder
    this.showWorldPlaceholder();
  }

  loadWorldContent(url) {
    const iframe = document.getElementById('worldIframe');
    
    try {
      iframe.src = url;
      iframe.onload = () => {
        console.log('World loaded successfully');
      };
      iframe.onerror = () => {
        this.showWorldError('Failed to load world content');
      };
    } catch (error) {
      this.showWorldError('Invalid world URL');
    }
  }

  showWorldPlaceholder() {
    const iframe = document.getElementById('worldIframe');
    const placeholderHTML = `
      <html>
        <head>
          <style>
            body {
              margin: 0;
              padding: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              font-family: 'Inter', sans-serif;
              color: white;
              text-align: center;
            }
            .placeholder {
              padding: 2rem;
              border-radius: 20px;
              background: rgba(255, 255, 255, 0.1);
              backdrop-filter: blur(10px);
              border: 1px solid rgba(255, 255, 255, 0.2);
            }
            .icon {
              font-size: 4rem;
              margin-bottom: 1rem;
              opacity: 0.7;
            }
            h2 {
              margin-bottom: 1rem;
              font-weight: 600;
            }
            p {
              opacity: 0.8;
              margin-bottom: 0;
            }
          </style>
        </head>
        <body>
          <div class="placeholder">
            <div class="icon">??</div>
            <h2>World Preview</h2>
            <p>World content will be displayed here</p>
          </div>
        </body>
      </html>
    `;
    
    iframe.srcdoc = placeholderHTML;
  }

  showWorldError(message) {
    const iframe = document.getElementById('worldIframe');
    const errorHTML = `
      <html>
        <head>
          <style>
            body {
              margin: 0;
              padding: 0;
              background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              font-family: 'Inter', sans-serif;
              color: white;
              text-align: center;
            }
            .error {
              padding: 2rem;
              border-radius: 20px;
              background: rgba(255, 255, 255, 0.1);
              backdrop-filter: blur(10px);
              border: 1px solid rgba(255, 255, 255, 0.2);
            }
            .icon {
              font-size: 4rem;
              margin-bottom: 1rem;
            }
            h2 {
              margin-bottom: 1rem;
              font-weight: 600;
            }
            p {
              opacity: 0.9;
              margin-bottom: 0;
            }
          </style>
        </head>
        <body>
          <div class="error">
            <div class="icon">??</div>
            <h2>Error Loading World</h2>
            <p>${message}</p>
          </div>
        </body>
      </html>
    `;
    
    iframe.srcdoc = errorHTML;
  }

  setupEventListeners() {
    // Fullscreen toggle
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
    }

    // File input handler
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.addEventListener('change', () => this.updateFilePath());
    }

    // Entity creation
    const createBtn = document.querySelector('[onclick="createEntity()"]');
    if (createBtn) {
      createBtn.removeAttribute('onclick');
      createBtn.addEventListener('click', () => this.createEntity());
    }

    // Handle fullscreen change events
    document.addEventListener('fullscreenchange', () => {
      this.handleFullscreenChange();
    });

    // Handle escape key for fullscreen exit
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isFullscreen) {
        this.exitFullscreen();
      }
    });
  }

  setupThemeIntegration() {
    // Listen for theme changes
    window.addEventListener('themeChanged', (e) => {
      this.handleThemeChange(e.detail.mode);
    });
  }

  handleThemeChange(mode) {
    // Update any theme-specific elements if needed
    console.log('Theme changed to:', mode);
  }

  toggleFullscreen() {
    if (!this.isFullscreen) {
      this.enterFullscreen();
    } else {
      this.exitFullscreen();
    }
  }

  enterFullscreen() {
    const iframe = document.getElementById('worldIframe');
    const container = iframe.parentElement;
    const btn = document.getElementById('fullscreenBtn');
    
    if (container.requestFullscreen) {
      container.requestFullscreen().then(() => {
        this.isFullscreen = true;
        btn.innerHTML = '<i class="fas fa-compress me-1"></i>Exit Fullscreen';
        iframe.style.height = '100vh';
        iframe.style.borderRadius = '0';
      }).catch(err => {
        console.error('Error attempting to enable fullscreen:', err);
        this.showMessage('Fullscreen not supported', 'error');
      });
    } else {
      this.showMessage('Fullscreen not supported in this browser', 'error');
    }
  }

  exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen().then(() => {
        this.handleFullscreenExit();
      }).catch(err => {
        console.error('Error exiting fullscreen:', err);
      });
    } else {
      this.handleFullscreenExit();
    }
  }

  handleFullscreenChange() {
    if (!document.fullscreenElement) {
      this.handleFullscreenExit();
    }
  }

  handleFullscreenExit() {
    const iframe = document.getElementById('worldIframe');
    const btn = document.getElementById('fullscreenBtn');
    
    this.isFullscreen = false;
    btn.innerHTML = '<i class="fas fa-expand me-1"></i>Fullscreen';
    iframe.style.height = '600px';
    iframe.style.borderRadius = '20px';
  }

  updateFilePath() {
    const fileInput = document.getElementById('fileInput');
    const display = document.getElementById('filePathDisplay');
    
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      display.value = file.name;
      
      // Validate file type
      this.validateFile(file);
    } else {
      display.value = 'No file selected';
    }
  }

  validateFile(file) {
    const allowedTypes = ['glb', 'gltf', 'fbx'];
    const maxSize = 50 * 1024 * 1024; // 50MB
    
    const extension = file.name.split('.').pop().toLowerCase();
    
    if (!allowedTypes.includes(extension)) {
      this.showMessage(`File type .${extension} is not supported. Please use: ${allowedTypes.join(', ')}`, 'error');
      return false;
    }
    
    if (file.size > maxSize) {
      this.showMessage('File size exceeds 50MB limit', 'error');
      return false;
    }
    
    return true;
  }

  createEntity() {
    const fileInput = document.getElementById('fileInput');
    const entityName = document.getElementById('entityName');
    const btn = event.target;
    
    if (!fileInput.files.length) {
      this.showMessage('Please select a file first', 'error');
      entityName.focus();
      return;
    }
    
    if (!entityName.value.trim()) {
      this.showMessage('Please enter an entity name', 'error');
      entityName.focus();
      return;
    }
    
    const file = fileInput.files[0];
    if (!this.validateFile(file)) {
      return;
    }
    
    // Show loading state
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Creating...';
    btn.disabled = true;
    
    // Simulate entity creation (replace with actual API call)
    this.uploadEntity(file, entityName.value.trim())
      .then(() => {
        this.showEntityCreationSuccess(btn, originalText);
        this.resetForm();
      })
      .catch(error => {
        this.showEntityCreationError(btn, originalText, error);
      });
  }

  uploadEntity(file, name) {
    // This would typically make an API call to upload the entity
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate success/failure
        if (Math.random() > 0.1) { // 90% success rate for demo
          resolve({ id: Date.now(), name, file: file.name });
        } else {
          reject(new Error('Upload failed'));
        }
      }, 2000);
    });
  }

  showEntityCreationSuccess(btn, originalText) {
    btn.innerHTML = '<i class="fas fa-check me-2"></i>Created!';
    btn.classList.add('btn-success');
    btn.classList.remove('btn-primary');
    
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.classList.remove('btn-success');
      btn.classList.add('btn-primary');
      btn.disabled = false;
    }, 2000);
    
    this.showMessage('Entity created successfully!', 'success');
  }

  showEntityCreationError(btn, originalText, error) {
    btn.innerHTML = '<i class="fas fa-times me-2"></i>Failed';
    btn.classList.add('btn-danger');
    btn.classList.remove('btn-primary');
    
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.classList.remove('btn-danger');
      btn.classList.add('btn-primary');
      btn.disabled = false;
    }, 2000);
    
    this.showMessage(`Failed to create entity: ${error.message}`, 'error');
  }

  resetForm() {
    document.getElementById('entityName').value = '';
    document.getElementById('fileInput').value = '';
    this.updateFilePath();
  }

  showMessage(message, type = 'info') {
    // Create a toast-like message
    const toast = document.createElement('div');
    toast.className = `alert alert-${type === 'error' ? 'danger' : type === 'success' ? 'success' : 'info'} position-fixed`;
    toast.style.cssText = `
      top: 20px;
      right: 20px;
      z-index: 9999;
      max-width: 400px;
      animation: slideInRight 0.3s ease;
    `;
    toast.innerHTML = `
      <i class="fas fa-${type === 'error' ? 'exclamation-triangle' : type === 'success' ? 'check' : 'info-circle'} me-2"></i>
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(toast);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove();
      }
    }, 5000);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.worldVisitor = new WorldVisitor();
});

// Add CSS animation for toast messages
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);