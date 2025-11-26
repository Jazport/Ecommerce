// Reusable helper to create DOM nodes
function el(tag, attributes = {}, children = []) {
  const node = document.createElement(tag);
  Object.entries(attributes).forEach(([k, v]) => {
    if (k === 'class') node.className = v;
    else if (k.startsWith('data-')) node.setAttribute(k, v);
    else node[k] = v;
  });
  children.forEach(child => node.append(child));
  return node;
}

// Products logic
let PRODUCTS = [];

// Loading products from JSON FILE and puts in ARRAY. Try catch err returns Array or Error
async function loadProducts() {
  try {
    const res = await fetch('products.json', { cache: "no-store" });
    if (!res.ok) throw new Error('Failed to load products.json');
    const data = await res.json();
    PRODUCTS = Array.isArray(data) ? data : [];
    return PRODUCTS;
  } catch (err) {
    console.error('Error loading products:', err);
    PRODUCTS = [];
    return [];
  }
}

// Building a single product card 
function renderProductCard(p) {
  const card = el('div', { class: 'card', role: 'listitem', tabIndex: 0 });
  const imgWrap = el('div', { class: 'card-image' }, []);
  const img = el('img', { src: p.photo, alt: p.description || p.name });
  imgWrap.appendChild(img);

  const content = el('div', { class: 'card-content' });
  const name = el('h3', { class: 'product-name' }, [document.createTextNode(p.name)]);
  const price = el('div', { class: 'product-price' }, [document.createTextNode(`$${p.price.toFixed(2)}`)]);
  const desc = el('p', {}, [document.createTextNode(p.description)]);
  const buy = el('button', { class: 'btn-small', type: 'button', 'aria-label': `View ${p.name}` }, [document.createTextNode('View')]);

  content.appendChild(name);
  content.appendChild(price);
  content.appendChild(desc);
  content.appendChild(buy);

  card.appendChild(imgWrap);
  card.appendChild(content);
  return card;
}

// Render grid with given array
function renderGrid(arr) {
  const container = document.getElementById('product-grid') || document.getElementById('featured-grid');
  if (!container) return;
  container.innerHTML = '';
  arr.forEach(p => {
    const card = renderProductCard(p);
    container.appendChild(card);
  });
}

// Initialize the products page behaviors
async function initProductsPage() {
  await loadProducts();

  // Render full product list if on products page
  const productGrid = document.getElementById('product-grid');
  if (productGrid) {
    renderGrid(PRODUCTS);
  }

  // Render first 3 if featured grid exists (home page)
  const featuredGrid = document.getElementById('featured-grid');
  if (featuredGrid) {
    renderGrid(PRODUCTS.slice(0, 3));
  }

}

// Expose to global for product page init
window.initProductsPage = initProductsPage;

// Contact form handling ---
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const status = document.getElementById('form-status');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('#name');
    const email = form.querySelector('#email');
    const message = form.querySelector('#message');

    let ok = true;
    if (!name.value.trim()) { ok = false; name.classList.add('invalid'); }
    else name.classList.remove('invalid');

    if (!validateEmail(email.value)) { ok = false; email.classList.add('invalid'); }
    else email.classList.remove('invalid');

    if (!message.value.trim()) { ok = false; message.classList.add('invalid'); }
    else message.classList.remove('invalid');

    if (!ok) {
      status.textContent = 'Please fix the errors in the form and try again.';
      status.style.color = 'crimson';
      return;
    }

    status.textContent = 'Thanks! your message has been received!';
    status.style.color = 'green';

    form.reset();
  });
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Expose contact init
window.initContactForm = initContactForm;
