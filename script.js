// Elements
const inputEl = document.getElementById("qr-text");
const sizeEl = document.getElementById("qr-size");
const eccEl = document.getElementById("qr-ecc");
const generateBtn = document.getElementById("generate-btn");
const clearBtn = document.getElementById("clear-btn");
const downloadBtn = document.getElementById("download-btn");
const copyBtn = document.getElementById("copy-btn");
const qrBox = document.getElementById("qr-box");
const toastSR = document.getElementById("copied-toast");

// Map ECC letter to QRCode.js constant
const ECC_MAP = {
  L: QRCode.CorrectLevel.L,
  M: QRCode.CorrectLevel.M,
  Q: QRCode.CorrectLevel.Q,
  H: QRCode.CorrectLevel.H,
};

let qrcodeInstance = null;

function clearQR() {
  qrBox.innerHTML = "";
  qrcodeInstance = null;
  downloadBtn.disabled = true;
}

function generateQR() {
  const text = inputEl.value.trim();
  if (!text) {
    inputEl.focus();
    pulse(inputEl);
    return;
  }

  clearQR();

  const size = parseInt(sizeEl.value, 10);
  const ecc = ECC_MAP[eccEl.value] ?? QRCode.CorrectLevel.M;

  // Create the QR in the container
  qrcodeInstance = new QRCode(qrBox, {
    text,
    width: size,
    height: size,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: ecc,
  });

  // Enable download after render (slight delay to ensure DOM is updated)
  setTimeout(() => {
    downloadBtn.disabled = false;
  }, 100);
}

function downloadQR() {
  if (!qrcodeInstance) return;

  // qrcode.js inserts either an <img> or a <canvas> into the container
  const img = qrBox.querySelector("img");
  const canvas = qrBox.querySelector("canvas");

  let dataURL = null;
  if (img && img.src) {
    dataURL = img.src;
  } else if (canvas) {
    dataURL = canvas.toDataURL("image/png");
  }
  if (!dataURL) return;

  const link = document.createElement("a");
  link.href = dataURL;
  link.download = "qr-code.png";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function copyInput() {
  const text = inputEl.value;
  if (!text) {
    pulse(inputEl);
    return;
  }
  navigator.clipboard
    .writeText(text)
    .then(() => {
      toast("Copied input text");
    })
    .catch(() => {
      toast("Copy failed");
    });
}

function toast(message) {
  // Accessible toast for screen readers + quick visual feedback
  toastSR.textContent = message;
  // Optional quick visual pulse on hint area
  const hint = document.getElementById("hint");
  if (!hint) return;
  hint.textContent = message;
  hint.style.color = "#cde4ff";
  setTimeout(() => {
    hint.textContent = "Press Enter to generate.";
    hint.style.color = "";
  }, 1200);
}

function pulse(el) {
  el.style.boxShadow = "0 0 0 6px rgba(239,68,68,0.25)";
  setTimeout(() => (el.style.boxShadow = ""), 450);
}

// Events
generateBtn.addEventListener("click", generateQR);
clearBtn.addEventListener("click", () => {
  inputEl.value = "";
  clearQR();
  inputEl.focus();
});
downloadBtn.addEventListener("click", downloadQR);
copyBtn.addEventListener("click", copyInput);

// Generate on Enter
inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") generateQR();
});
