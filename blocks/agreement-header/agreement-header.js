export default function decorate(block) {
  // Clear existing content and create new structure
  block.innerHTML = '';
  
  // Create wrapper div
  const wrapper = document.createElement('div');
  wrapper.classList.add('agreement-header-wrapper');
  
  // Create main container
  const container = document.createElement('div');
  container.classList.add('agreement-header-block');
  
  // Create title element
  const titleDiv = document.createElement('div');
  titleDiv.classList.add('agreement-title');
  titleDiv.textContent = 'Agreements';
  
  // Create link element
  const linkDiv = document.createElement('div');
  linkDiv.classList.add('agreement-link');
  
  const link = document.createElement('a');
  link.href = '#';
  link.textContent = 'Download PDF';
  link.setAttribute('role', 'button');
  
  linkDiv.appendChild(link);
  
  // Assemble the structure
  container.appendChild(titleDiv);
  container.appendChild(linkDiv);
  wrapper.appendChild(container);
  block.appendChild(wrapper);
  
  // Add container class to parent
  block.classList.add('agreement-header-container');
}
