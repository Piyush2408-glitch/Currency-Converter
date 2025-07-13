const BASE_URL = "https://v6.exchangerate-api.com/v6/0752ea53b65d95bdf010011a/latest";

const dropdowns = document.querySelectorAll(".dropdown select");
const form = document.querySelector("form");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".message");
const swapIcon = document.querySelector(".fa-right-left");

dropdowns.forEach(select => {
  for (const code in countryList) {
    const option = document.createElement("option");
    option.value = code;
    option.textContent = code;
    if (select.name === "from" && code === "USD") option.selected = true;
    if (select.name === "to" && code === "INR") option.selected = true;
    select.appendChild(option);
  }
  select.addEventListener("change", e => updateFlag(e.target));
});

function updateFlag(selectTag) {
  const countryCode = countryList[selectTag.value];
  const imgTag = selectTag.parentElement.querySelector("img");
  imgTag.src = `https://flagsapi.com/${countryCode}/shiny/64.png`;
}

async function updateExchangeRate() {
  const amountInput = document.querySelector(".amount input");
  let amountVal = parseFloat(amountInput.value) || 1;
  amountInput.value = amountVal;

  const url = `${BASE_URL}/${fromCurr.value}`;

  try {
    msg.textContent = "Fetching exchange rate...";
    const res = await fetch(url);
    const data = await res.json();

    const rate = data.conversion_rates[toCurr.value];

    if (!rate) {
      msg.textContent = `Exchange rate not available for ${fromCurr.value} to ${toCurr.value}`;
      return;
    }

    const finalAmount = (amountVal * rate).toFixed(2);
    msg.textContent = `${amountVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (err) {
    console.error("Exchange rate fetch failed:", err);
    msg.textContent = "Unable to fetch exchange rate. Please try again.";
  }
}

form.addEventListener("submit", e => {
  e.preventDefault();
  updateExchangeRate();
});

swapIcon.addEventListener("click", () => {
  [fromCurr.value, toCurr.value] = [toCurr.value, fromCurr.value];
  updateFlag(fromCurr);
  updateFlag(toCurr);
  updateExchangeRate();
});

window.addEventListener("load", updateExchangeRate);
