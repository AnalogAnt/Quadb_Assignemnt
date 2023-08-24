const avgElement = document.getElementById("avgPrice");
const tickerList = document.getElementById("tickerList");
const list = [
  "WazirX",
  "Bitbns",
  "Colodax",
  "Zebpay",
  "CoinDCX",
  "NIL",
  "NIL",
  "NIL",
  "NIL",
  "NIL",
];

fetch("/get-data")
  .then((response) => response.json())
  .then((data) => {
    let sum = 0;
    let count = 1;
    data.forEach((ticker) => {
      sum = sum + ticker.last;
    });
    let avg = sum / 10;
    avgElement.textContent = `$${Math.round(avg).toLocaleString("en-IN")}`;
    data.forEach((ticker) => {
      const tickerElement = document.createElement("li");
      let difference = Math.round(((avg - ticker.sell) / avg) * 100);
      let className = difference < 0 ? "less" : "more";
      tickerElement.classList.add("listItem");
      tickerElement.innerHTML = `
       <p class="index1">${count}</p>
        <p class="name">${list[count - 1]}</p>
        <p class="last">$${ticker.last.toLocaleString("en-IN")}</p>
        <p class="index">$${ticker.buy.toLocaleString(
          "en-IN"
        )}/$${ticker.sell.toLocaleString("en-IN")}</p>
        <p class=${className} >${Math.abs(difference).toLocaleString(
        "en-IN"
      )} %</p>
        <p class=${className}>${Math.round(avg - ticker.sell).toLocaleString(
        "en-IN"
      )}</p>
      `;
      tickerList.appendChild(tickerElement);
      count = count + 1;
    });
  })
  .catch((error) => {
    console.error(error);
  });
