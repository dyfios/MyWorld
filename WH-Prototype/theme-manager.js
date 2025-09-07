/**
 * Theme Manager - Unified theme handling across all pages
 * Manages light/dark mode persistence and transitions
 */

class ThemeManager {
  constructor() {
    this.STORAGE_KEY = 'wh-theme-preference';
    this.DARK_CLASS = 'dark-mode';
    this.init();
  }

  init() {
    // Load saved theme on page load
    this.loadSavedTheme();
    
    // Set up theme toggle listeners
    this.setupThemeToggles();
  }

  loadSavedTheme() {
    const savedTheme = localStorage.getItem(this.STORAGE_KEY);
    
    // Check for legacy theme storage formats and migrate them
    const legacyTheme = localStorage.getItem('theme');
    const legacyDarkMode = localStorage.getItem('darkMode');
    
    let themePreference = savedTheme;
    
    // Migrate from legacy formats
    if (!themePreference && legacyTheme) {
      themePreference = legacyTheme === 'dark-mode' ? 'dark' : 'light';
      localStorage.setItem(this.STORAGE_KEY, themePreference);
      localStorage.removeItem('theme'); // Clean up old storage
    } else if (!themePreference && legacyDarkMode) {
      themePreference = legacyDarkMode === 'true' ? 'dark' : 'light';
      localStorage.setItem(this.STORAGE_KEY, themePreference);
      localStorage.removeItem('darkMode'); // Clean up old storage
    }
    
    // Use system preference if no saved preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = themePreference === 'dark' || (themePreference === null && prefersDark);
    
    // Safari-specific: Ensure DOM is fully ready before applying theme
    if (this.isSafari()) {
      requestAnimationFrame(() => {
        if (shouldUseDark) {
          this.setDarkMode(true, false); // false = no transition on load
        } else {
          this.setLightMode(true, false); // false = no transition on load
        }
      });
    } else {
      if (shouldUseDark) {
        this.setDarkMode(true, false); // false = no transition on load
      } else {
        this.setLightMode(true, false); // false = no transition on load
      }
    }
  }

  setupThemeToggles() {
    // Find all theme toggle elements
    const toggles = document.querySelectorAll('#themeToggle, [data-theme-toggle]');
    
    toggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleTheme();
      });
    });
  }

  toggleTheme() {
    const isDark = document.body.classList.contains(this.DARK_CLASS);
    
    // Safari-specific: Add a small delay to ensure DOM is ready
    if (this.isSafari()) {
      setTimeout(() => {
        if (isDark) {
          this.setLightMode(true, true);
        } else {
          this.setDarkMode(true, true);
        }
      }, 10);
    } else {
      if (isDark) {
        this.setLightMode(true, true);
      } else {
        this.setDarkMode(true, true);
      }
    }
  }

  // Helper method to detect Safari
  isSafari() {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  }

  // Force Safari to reflow/repaint the element
  forceSafariReflow(element) {
    if (this.isSafari()) {
      // Trigger reflow by reading offsetHeight
      const height = element.offsetHeight;
      // Force repaint by modifying and restoring a style property
      const originalTransform = element.style.transform;
      element.style.transform = 'translateZ(0)';
      // Use requestAnimationFrame to ensure the change is processed
      requestAnimationFrame(() => {
        element.style.transform = originalTransform;
        // Also trigger a style recalculation
        this.triggerStyleRecalculation();
      });
    }
  }

  // Additional Safari fix: Force style recalculation
  triggerStyleRecalculation() {
    if (this.isSafari()) {
      // Force Safari to recalculate all styles by temporarily adding/removing a class
      const body = document.body;
      body.classList.add('safari-reflow-trigger');
      body.offsetHeight; // Force reflow
      body.classList.remove('safari-reflow-trigger');
    }
  }

  setDarkMode(save = true, animate = true) {
    const body = document.body;
    
    // Force Safari to recognize the change by triggering a reflow
    this.forceSafariReflow(body);
    
    // Add transition if animating
    if (animate) {
      body.style.transition = 'all 0.3s ease';
      setTimeout(() => body.style.transition = '', 300);
    }
    
    // Apply dark mode
    body.classList.add(this.DARK_CLASS);
    
    // Force another reflow for Safari after class change
    this.forceSafariReflow(body);
    
    // Update toggle button icons
    this.updateToggleIcons('dark');
    
    // Save preference
    if (save) {
      localStorage.setItem(this.STORAGE_KEY, 'dark');
    }
    
    // Dispatch custom event for other components
    this.dispatchThemeEvent('dark');
  }

  setLightMode(save = true, animate = true) {
    const body = document.body;
    
    // Force Safari to recognize the change by triggering a reflow
    this.forceSafariReflow(body);
    
    // Add transition if animating
    if (animate) {
      body.style.transition = 'all 0.3s ease';
      setTimeout(() => body.style.transition = '', 300);
    }
    
    // Apply light mode
    body.classList.remove(this.DARK_CLASS);
    
    // Force another reflow for Safari after class change
    this.forceSafariReflow(body);
    
    // Update toggle button icons
    this.updateToggleIcons('light');
    
    // Save preference
    if (save) {
      localStorage.setItem(this.STORAGE_KEY, 'light');
    }
    
    // Dispatch custom event for other components
    this.dispatchThemeEvent('light');
  }

  updateToggleIcons(mode) {
    const toggles = document.querySelectorAll('#themeToggle, [data-theme-toggle]');
    
    toggles.forEach(toggle => {
      const icon = toggle.querySelector('i');
      
      if (icon) {
        if (mode === 'dark') {
          // Dark mode active - show sun icon (to switch to light)
          icon.className = 'fas fa-sun me-2';
        } else {
          // Light mode active - show moon icon (to switch to dark)
          icon.className = 'fas fa-moon me-2';
        }
      }
      
      // Update text if it exists
      const textNode = Array.from(toggle.childNodes).find(node => 
        node.nodeType === Node.TEXT_NODE && node.textContent.trim()
      );
      
      if (textNode) {
        textNode.textContent = mode === 'dark' ? 
          'Switch to Light Mode' : 'Switch to Dark Mode';
      }
    });
  }

  dispatchThemeEvent(mode) {
    const event = new CustomEvent('themeChanged', {
      detail: { mode, isDark: mode === 'dark' }
    });
    window.dispatchEvent(event);
    
    // Safari-specific: Force all elements to update
    if (this.isSafari()) {
      this.forceFullStyleUpdate();
    }
    
    // Also trigger gradient update if the function exists
    if (typeof applyRandomGradient === 'function') {
      // Small delay to ensure theme transition completes first
      setTimeout(() => {
        applyRandomGradient();
      }, this.isSafari() ? 150 : 100);
    }
  }

  // Force all styled elements to update (Safari-specific)
  forceFullStyleUpdate() {
    if (this.isSafari()) {
      // Force update on all elements with theme-dependent styles
      const elementsToUpdate = document.querySelectorAll('*');
      elementsToUpdate.forEach(element => {
        if (element.style || window.getComputedStyle(element)) {
          element.offsetHeight; // Force reflow
        }
      });
      
      // Additional Safari-specific DOM manipulation
      requestAnimationFrame(() => {
        document.body.style.visibility = 'hidden';
        document.body.offsetHeight; // Force reflow
        document.body.style.visibility = 'visible';
      });
    }
  }

  getCurrentTheme() {
    return document.body.classList.contains(this.DARK_CLASS) ? 'dark' : 'light';
  }

  isDarkMode() {
    return this.getCurrentTheme() === 'dark';
  }
}

// Initialize theme manager when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Safari-specific: Add extra delay to ensure everything is ready
    if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
      setTimeout(() => {
        window.themeManager = new ThemeManager();
      }, 50);
    } else {
      window.themeManager = new ThemeManager();
    }
  });
} else {
  // Safari-specific: Use requestAnimationFrame for immediate execution
  if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
    requestAnimationFrame(() => {
      window.themeManager = new ThemeManager();
    });
  } else {
    window.themeManager = new ThemeManager();
  }
}

// Export for module use if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThemeManager;
}
