/**
 * Theme toggle functionality for the quiz platform
 * Handles switching between light and dark mode
 */

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const logoImage = document.getElementById('logo-image');

    // Check if theme is stored in localStorage
    const currentTheme = localStorage.getItem('theme');

    // Apply theme from localStorage or system preference
    if (currentTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        updateThemeIcon('dark');
        updateLogoIfNeeded('dark');
    } else if (currentTheme === 'light') {
        document.body.removeAttribute('data-theme');
        updateThemeIcon('light');
        updateLogoIfNeeded('light');
    } else if (prefersDarkScheme.matches) {
        // If no theme in localStorage but system prefers dark
        document.body.setAttribute('data-theme', 'dark');
        updateThemeIcon('dark');
        updateLogoIfNeeded('dark');
    }

    // Toggle theme when button is clicked
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            // Check current theme
            const isDark = document.body.getAttribute('data-theme') === 'dark';

            if (isDark) {
                // Switch to light theme
                document.body.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                updateThemeIcon('light');
                updateLogoIfNeeded('light');
            } else {
                // Switch to dark theme
                document.body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                updateThemeIcon('dark');
                updateLogoIfNeeded('dark');
            }

            // Add transition effect
            document.body.classList.add('theme-transition');
            setTimeout(() => {
                document.body.classList.remove('theme-transition');
            }, 500);
        });
    }

    // Listen for system theme changes
    prefersDarkScheme.addEventListener('change', (e) => {
        // Only apply if user hasn't set a preference
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                // System switched to dark mode
                document.body.setAttribute('data-theme', 'dark');
                updateThemeIcon('dark');
                updateLogoIfNeeded('dark');
            } else {
                // System switched to light mode
                document.body.removeAttribute('data-theme');
                updateThemeIcon('light');
                updateLogoIfNeeded('light');
            }
        }
    });
});

/**
 * Update the theme toggle icon based on current theme
 * @param {string} theme - The current theme ('light' or 'dark')
 */
function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    const icon = themeToggle.querySelector('i');
    if (!icon) return;

    if (theme === 'dark') {
        icon.className = 'fas fa-moon';
    } else {
        icon.className = 'fas fa-sun';
    }
}

/**
 * Update logo image based on theme if alternate version exists
 * @param {string} theme - The current theme ('light' or 'dark')
 */
function updateLogoIfNeeded(theme) {
    const logoImage = document.getElementById('logo-image');
    if (!logoImage) return;

    if (theme === 'dark') {
        // Try to use dark mode logo if it exists
        const darkLogoPath = logoImage.src.replace(/\.png$/, '-dark.png');
        checkImageExists(darkLogoPath, function(exists) {
            if (exists) {
                logoImage.src = darkLogoPath;
            }
        });
    } else {
        // Revert to light mode logo
        const lightLogoPath = logoImage.src.replace(/-dark\.png$/, '.png');
        logoImage.src = lightLogoPath;
    }
}

/**
 * Check if an image exists at the specified URL
 * @param {string} url - Image URL to check
 * @param {function} callback - Callback function with boolean result
 */
function checkImageExists(url, callback) {
    const img = new Image();
    img.onload = function() { callback(true); };
    img.onerror = function() { callback(false); };
    img.src = url;
}
