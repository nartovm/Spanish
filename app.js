/* ===========================================
   Spanish B2.1 Learning Platform - JavaScript
   =========================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Highlight current navigation item
  highlightCurrentNav();
  
  // Add hover effects to tense cells
  setupTenseHoverEffects();
});

/**
 * Highlights the current page in navigation
 */
function highlightCurrentNav() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.navbar a');
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (currentPath.endsWith(href) || 
        (href.includes('teoria') && currentPath.includes('teoria')) ||
        (href.includes('practica') && currentPath.includes('practica'))) {
      link.classList.add('active');
    }
  });
}

/**
 * Setup hover effects for tense cells in the verb table
 */
function setupTenseHoverEffects() {
  const tenseCells = document.querySelectorAll('.tense-cell');
  
  tenseCells.forEach(cell => {
    cell.addEventListener('mouseenter', () => {
      // Could add axis highlighting here in the future
    });
  });
}

/**
 * Navigate back to verb table
 */
function goBackToTable() {
  window.location.href = '../index.html';
}
