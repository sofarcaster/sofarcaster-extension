document.getElementById("fetchData").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    console.log("tab=", tab);
    sendMessageToTab(tab.id, {
      action: "pasteContent",
      content: tab.url,
    });
  });
});

function sendMessageToTab(tabId, message) {
  chrome.tabs.sendMessage(tabId, message, (response) => {
    handleResponse(response);
  });
}

function handleResponse(response) {
  if (chrome.runtime.lastError) {
    console.log("Error sending message:", chrome.runtime.lastError.message);
    updateDataArea("Error: " + chrome.runtime.lastError.message);
  } else {
    console.log("response = ", response);
    updateDataArea(response ? response : "No response");
  }
}

function updateDataArea(response) {
  document.getElementById("dataArea").value = response.status;

  const container = document.createElement("div");
  container.style.cssText =
    "position: fixed; top: 10px; right: 10px; width: 300px; z-index: 1000;";

  document.body.appendChild(container);
  response.data.data.current_cast.forEach((item) => {
    const card = document.createElement("div");
    card.style.cssText =
      "background: white; margin-bottom: 10px; padding: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);";

    card.className = "card";
    card.innerHTML = `
          <p>Content: ${item.content}</h4>
          <p>Model: ${item.model}</p>
          <p>Created at: ${new Date(item.created_at).toLocaleString()}</p>
          <p>Parent Hash: ${item.parent_hash}</p>
      `;

    container.appendChild(card);
  });
}
