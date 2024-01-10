// Function to generate UPI QR code
function generateUPIQRCode(vpa) {
  const amount = '0'; // Set default amount as 0

  // Constructing the UPI link
  const upiLink = `upi://pay?pa=${encodeURIComponent(vpa)}&am=${encodeURIComponent(amount)}&cu=INR`;

  // Create QR code instance
  const qr = new QRious({
    size: 150,
    value: upiLink,
  });

  return qr.toDataURL(); // Return data URL of the generated QR code
}

// Function to add UPI ID and generate QR code
function addUPI() {
  const upiIdInput = document.getElementById('upiIdInput');
  const upiId = upiIdInput.value.trim();

  if (upiId !== '') {
    const qrcodesDiv = document.getElementById('qrcodes');
    const qrDataURL = generateUPIQRCode(upiId);

    // Create elements for displaying QR code and delete button
    const qrContainer = document.createElement('div');
    qrContainer.classList.add('qr-container');
    qrContainer.innerHTML = `
      <img src="${qrDataURL}" alt="QR Code">
      <p>${upiId}</p>
      <button onclick="deleteUPI(this)">Delete</button>
    `;

    // Append QR code container to the main container
    qrcodesDiv.appendChild(qrContainer);

    // Save UPI ID in local storage
    saveUPI(upiId);
    upiIdInput.value = ''; // Clear input field after adding
  }
}

// Function to save UPI ID in local storage
function saveUPI(upiId) {
  let storedUPIs = JSON.parse(localStorage.getItem('upis')) || [];
  storedUPIs.push(upiId);
  localStorage.setItem('upis', JSON.stringify(storedUPIs));
}

// Function to delete UPI ID
function deleteUPI(button) {
  const qrContainer = button.parentNode;
  const upiId = qrContainer.querySelector('p').innerText;
  qrContainer.remove();

  // Remove UPI ID from local storage
  removeUPI(upiId);
}

// Function to remove UPI ID from local storage
function removeUPI(upiId) {
  let storedUPIs = JSON.parse(localStorage.getItem('upis')) || [];
  storedUPIs = storedUPIs.filter(id => id !== upiId);
  localStorage.setItem('upis', JSON.stringify(storedUPIs));
}

// Load saved UPI IDs from local storage
function loadSavedUPIs() {
  const storedUPIs = JSON.parse(localStorage.getItem('upis')) || [];
  storedUPIs.forEach(upiId => {
    const qrDataURL = generateUPIQRCode(upiId);
    const qrcodesDiv = document.getElementById('qrcodes');

    // Create elements for displaying QR code and delete button
    const qrContainer = document.createElement('div');
    qrContainer.classList.add('qr-container');
    qrContainer.innerHTML = `
      <img src="${qrDataURL}" alt="QR Code">
      <p>${upiId}</p>
      <button onclick="deleteUPI(this)">Delete</button>
    `;
    
    // Append QR code container to the main container
    qrcodesDiv.appendChild(qrContainer);
  });
}

// Load saved UPI IDs when the page loads
window.onload = loadSavedUPIs;
