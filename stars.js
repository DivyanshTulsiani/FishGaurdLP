// Function to create the star field
function createStarField() {
  const stars = document.querySelector('.stars');
  
  // Clear any existing content
  stars.innerHTML = '';
  
  // Number of stars to create
  const starCount = 100;
  
  // Create stars
  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.classList.add('star');
    
    // Random position
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    
    // Random size (1-3px)
    const size = (Math.random() * 2) + 1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    
    // Random animation delay
    star.style.animationDelay = `${Math.random() * 1}s`;
    
    // Add to stars container
    stars.appendChild(star);
  }
}

// Call the function when page loads
document.addEventListener('DOMContentLoaded', createStarField);

// Optional: Recreate stars on window resize
window.addEventListener('resize', createStarField);