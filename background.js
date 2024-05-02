function isValidSupercastUrl(url) {
  const pattern = /^https:\/\/www\.supercast\.xyz\/c\/0x[a-fA-F0-9]{40}$/;
  return pattern.test(url);
}
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (
    changeInfo.status === 'complete' &&
    tab.url &&
    isValidSupercastUrl(tab.url)
  ) {
    console.log(`Updated tab ${tabId} has URL: ${tab.url}`);
    const url = new URL(tab.url);
    const path = url.pathname;
    console.log(`Path of the tab is: ${path}`);

    // 메시지를 해당 탭에 보내는 올바른 방법
    chrome.tabs.sendMessage(
      tabId,
      {
        action: 'tabUpdated',
        content: path,
      },
      (response) => {
        if (chrome.runtime.lastError) {
          console.log(
            'Error sending message:',
            chrome.runtime.lastError.message,
          );
        } else if (response) {
          console.log('Response from content script:', response);
        }
      },
    );
  }
});
