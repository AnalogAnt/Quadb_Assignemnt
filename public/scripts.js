const avgElement = document.getElementById("avgPrice");
const tickerList = document.getElementById("tickerList");
const list = ["WazirX", "Bitbns", "Colodax", "Zebpay", "CoinDCX"];
fetch("/get-data")
  .then((response) => response.json())
  .then((data) => {
    let sum = 0;
    let count = 1;
    data.forEach((ticker) => {
      const tickerElement = document.createElement("li");
      tickerElement.classList.add("listItem");
      sum = sum + ticker.last;
      tickerElement.innerHTML = `
       <p class="index">${count}</p>
        <p class="index">${list[count - 1]}</p>
        <p class="index">$${ticker.last.toLocaleString("en-IN")}</p>
        <p class="index">$${ticker.buy.toLocaleString(
          "en-IN"
        )}/$${ticker.sell.toLocaleString("en-IN")}</p>
        <p class="index">${Math.round(
          ((ticker.sell - sum) / sum) * 100
        ).toLocaleString("en-IN")}</p>
        <p class="index">${Math.round(ticker.sell - sum).toLocaleString(
          "en-IN"
        )}</p>
      `;
      tickerList.appendChild(tickerElement);
      count = count + 1;
      avgElement.textContent = `$${Math.round(sum).toLocaleString("en-IN")}`;
    });
  })
  .catch((error) => {
    console.error(error);
  });
