const html2canvas = window.html2canvas;

const RANDOM_QUOTE_ENDPOINT = import.meta.env.VITE_RANDOM_QUOTE_ENDPOINT;
console.log("Random quote endpoint:" + RANDOM_QUOTE_ENDPOINT);
const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY;
const PEXELS_ENDPOINT = import.meta.env.VITE_PEXELS_ENDPOINT;

async function getQuote() {
  const url = RANDOM_QUOTE_ENDPOINT;
  const options = { method: "GET", headers: { accept: "application/json" } };
  try {
    const response = await fetch(url, options);
    return response.json();
  } catch (err) {
    console.log(err);
  }
}

async function getImageBasedOnQuoteTag(quoteTag) {
  const url = `${PEXELS_ENDPOINT}?query=${quoteTag}&per_page=1`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `${PEXELS_API_KEY}`,
    },
  };
  try {
    const response = await fetch(url, options);
    return response.json();
  } catch (err) {
    console.log(err);
  }
}

async function newQuote() {
  const quoteElement = document.getElementById("quote");
  const authorElement = document.getElementById("author");

  // get new quote
  const quoteApiResponse = await getQuote();
  const author = quoteApiResponse.data.author;
  const quote = quoteApiResponse.data.content;
  const tags = quoteApiResponse.data.tags;

  // get a random tag based on quote api response
  const selectRandomTagBasedOnImage = tags[Math.floor(Math.random() * tags.length)];

  // get image based on quote tag
  const imageData = await getImageBasedOnQuoteTag(selectRandomTagBasedOnImage);
  const photoUrl = imageData.photos[0].src.landscape;

  document.body.style.backgroundImage = `url('${photoUrl}')`;

  quoteElement.textContent = quote;
  authorElement.textContent = author;
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    // show toast message when clipboard is copied
    const toast = document.getElementById("toast");
    toast.classList.remove("hidden");
    setTimeout(() => {
      toast.classList.add("hidden");
    }, 1000);
  } catch (error) {
    console.error(error.message);
  }
}

function downloadImage() {
  const quoteContainer = document.getElementById("quote-container");

  // convert html to image
  html2canvas(quoteContainer, {
    scale: 1,
  }).then((canvas) => {
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "quote-image.png";
    link.click();
    console.log("Image downloaded");
  });
}

// format quote for twitter and clipboard functionality
function getFormattedText() {
  const quote = document.getElementById("quote").textContent;
  const author = document.getElementById("author").textContent;
  return `${quote.endsWith(".") ? quote.slice(0, -1) : quote} - ${author}`;
}

// Event Listeners
document.getElementById("new_quote").addEventListener("click", newQuote);

document.getElementById("copy_to_clipboard").addEventListener("click", () => copyToClipboard(getFormattedText()));

document.getElementById("share_to_twitter").addEventListener("click", () => {
  const quote = getFormattedText();
  const url = `https://twitter.com/intent/tweet?text=${quote}`;
  window.open(url, "_blank");
});

document.getElementById("download_image").addEventListener("click", downloadImage);
