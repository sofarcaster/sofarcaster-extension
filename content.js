function simulateClick(button) {
  const mouseClickEvents = ['mousedown', 'click', 'mouseup'];
  mouseClickEvents.forEach((mouseEventType) => {
    button.dispatchEvent(
      new MouseEvent(mouseEventType, {
        bubbles: true,
        cancelable: true,
        view: window,
      }),
    );
  });
}

function simulateAdClick() {
  const button = document.querySelector('#radix-\\:r2\\:');
  if (!button) {
    console.error('Button not found');
    return;
  }

  // 마우스 이벤트 생성 및 발송
  ['mousedown', 'mouseup', 'click'].forEach((eventType) => {
    const event = new MouseEvent(eventType, {
      view: window,
      bubbles: true,
      cancelable: true,
      buttons: 1,
    });
    button.dispatchEvent(event);
  });

  console.log('Simulated click events dispatched.');
}

function clickHeartButton() {
  const xpath =
    '/html/body/div/main/div/div/div/div[2]/div/div[2]/div[3]/div[3]/button';
  const button = document.evaluate(
    xpath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null,
  ).singleNodeValue;

  if (button) {
    simulateClick(button);
    console.log('Button clicked successfully!');
  } else {
    console.error('The specified button could not be found.');
  }
}

function clickRecastButton() {
  console.log('clickRecastButton= ', clickRecastButton);
  simulateAdClick();
}
function clickSubmitButton() {
  console.log('clickRecastButton= ', clickRecastButton);
  const xpath = '/html/body/div/main/div/div/div/div[3]/div[1]/div[4]/button';
  const button = document.evaluate(
    xpath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null,
  ).singleNodeValue;

  if (button) {
    simulateClick(button);
    console.log('Recast button clicked successfully!');
  } else {
    console.error('The specified recast button could not be found.');
  }
}

const ASIDE_TEXTAREA_XPATH =
  '/html/body/div[2]/aside/div/div/div[3]/div[1]/div[2]/div[1]/textarea';

const CONTENT_TEXTAREA_XPATH =
  '/html/body/div/main/div/div/div/div[3]/div[1]/div[2]/div[1]/textarea';

function insertTextIntoTextarea(isAside = false) {
  console.log('isAside= ', isAside);
  const xpath = isAside ? ASIDE_TEXTAREA_XPATH : CONTENT_TEXTAREA_XPATH;
  const element = document.evaluate(
    xpath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null,
  ).singleNodeValue;

  const contentElement = document.querySelector('.card .content');
  if (element && contentElement) {
    element.value = contentElement.textContent;
    // input 이벤트 트리거
    const event = new Event('input', { bubbles: true, cancelable: true });
    element.dispatchEvent(event);
    // change 이벤트도 필요할 수 있음
    const changeEvent = new Event('change', { bubbles: true });
    element.dispatchEvent(changeEvent);
  } else {
    console.error('The specified textarea element could not be found.');
  }
}

async function callLocalApi(url) {
  return 'hi';
  function extractLastHash(url) {
    // URL을 '/'로 분리하여 배열을 생성합니다.
    const parts = url.split('/');
    // 배열의 마지막 요소를 반환합니다.
    const lastPart = parts.pop() || '';
    return lastPart;
  }

  try {
    const hash = extractLastHash(url);
    console.log('Hash extracted from URL:', hash);
    const response = await fetch(
      `http://localhost:8000/v1/farcaster/get_current_cast/${hash}`,
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Data from local API:', data);
    return data; // 필요한 경우 데이터 반환
  } catch (error) {
    console.error('Error fetching data:', error);
    return null; // 에러 발생 시 null 반환 또는 다른 에러 처리 로직 구현
  }
}

function getContentText() {
  console.log('getContentText= ');
  const xpath = '/html/body/div/main/div/div/div/div[2]/div/div[2]/div[2]/p';
  const element = document.evaluate(
    xpath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null,
  ).singleNodeValue;

  if (element) {
    const spans = element.querySelectorAll('span');
    console.log('Span texts:');
    let text = '';
    spans.forEach(
      (span) => console.log(span.textContent),
      (text += span.textContent),
    );
  } else {
    console.log('No element found for the given XPath');
  }
}

function displayDataOnPage(current_cast, error) {
  const container = document.createElement('div');
  container.style.cssText =
    'position: fixed; top: 50px; right: 200px; width: 300px; z-index: 1000; background: #333; padding: 10px; border-radius: 4px;';

  document.body.appendChild(container);

  if (!current_cast || error) {
    const card = document.createElement('div');
    card.style.cssText =
      'border-radius: 4px; background: black; margin-bottom: 10px; padding: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.5); color: white;';

    card.className = 'card';
    card.innerHTML = `
    <h4>저장된 데이터가 없습니다.</h4>`;
    const button = document.createElement('button');
    // 버튼 설정
    button.textContent = 'fetchData';
    button.style.cssText =
      'padding: 5px 10px; margin-top: 5px; background: #555; color: white; border: none; cursor: pointer;';

    card.appendChild(button);
    container.appendChild(card);
    return;
  }

  current_cast.forEach((item) => {
    const card = document.createElement('div');
    card.style.cssText =
      'border-radius: 4px; background: black; margin-bottom: 10px; padding: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.5); color: white;';

    const button = document.createElement('button');
    // 버튼 설정
    button.textContent = '붙혀넣기';
    button.style.cssText =
      'padding: 5px 10px; margin-top: 5px; background: #555; color: white; border: none; cursor: pointer;';

    button.addEventListener('click', function () {
      performAction(item.id, item.content); // 버튼 클릭 시 실행할 함수
    });

    card.className = 'card';
    card.innerHTML = `
          <h4>${item.content}</h4>
          <p>Model:${item.model}</p>
      `;
    card.appendChild(button);
    container.appendChild(card);
  });
}

function performAction(id, content) {
  console.log('Button clicked for item ID:', id);
  insertTextIntoTextarea(content);
  // 여기에서 더 복잡한 로직을 수행할 수 있습니다.
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received:', request);
  //팝업에서 컨트롤용
  if (request.action === 'pasteContent') {
    callLocalApi(request.content)
      .then((data) => {
        console.log('Received data:', data);
        displayDataOnPage(data.data.current_cast);
        sendResponse({
          status: 'Content pasted successfully',
          hello: 'hi',
          data: data,
        });
      })
      .catch((error) => {
        console.error('Failed to fetch data:', error);
        sendResponse({
          status: 'Failed to fetch data',
          error: error.message,
        });
      });
    return true; // 비동기 응답을 처리하기 위해 true를 반환, 이것이 메시지 포트를 열어둠
  }
  //현재 tab updated
  if (request.action === 'tabUpdated') {
    //getContentText();
    // callLocalApi(request.content)
    //   .then((data) => {
    //     console.log('Received data:', data);
    //     displayDataOnPage(data.data.current_cast);
    //     sendResponse({
    //       status: 'Content pasted successfully',
    //       hello: 'hi',
    //       data: data,
    //     });
    //   })
    //   .catch((error) => {
    //     console.error('Failed to fetch data:', error);
    //     displayDataOnPage(null, error);
    //     sendResponse({
    //       status: 'Failed to fetch data',
    //       error: error.message,
    //     });
    //   });
    // return true; // 비동기 응답을 처리하기 위해 true를 반환, 이것이 메시지 포트를 열어둠
  }
});

function showLoadingIndicator() {
  const contentElement = document.querySelector('.card .content');
  const loadingIndicator = document.getElementById('loadingIndicator');
  if (!loadingIndicator) {
    // 로딩 인디케이터가 없으면 생성합니다.
    const newIndicator = document.createElement('div');
    newIndicator.id = 'loadingIndicator';
    newIndicator.textContent = '';
    newIndicator.style.position = 'fixed';
    newIndicator.style.top = '50%';
    newIndicator.style.left = '50%';
    newIndicator.style.transform = 'translate(-50%, -50%)';
    newIndicator.style.fontSize = '20px';
    newIndicator.style.color = 'white';
    newIndicator.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    newIndicator.style.padding = '10px';
    newIndicator.style.borderRadius = '5px';
    newIndicator.style.display = 'none'; // 초기에는 숨겨져 있습니다.
    contentElement.appendChild(newIndicator);
  } else {
    loadingIndicator.style.display = 'block'; // 로딩 인디케이터를 보이도록 설정합니다.
  }
}

function hideLoadingIndicator() {
  const loadingIndicator = document.getElementById('loadingIndicator');
  if (loadingIndicator) {
    loadingIndicator.style.display = 'none';
  }
}

function isValidSupercastUrl(url) {
  const pattern = /^https:\/\/www\.supercast\.xyz\/c\/0x[a-fA-F0-9]{40}$/;
  return pattern.test(url);
}

function handleURL(url) {
  // URL 객체를 생성하여 호스트와 pathname을 추출
  const parsedUrl = new URL(url);
  const hostname = parsedUrl.hostname;
  const pathname = parsedUrl.pathname;
  console.log('hostname=', hostname);
  console.log('pathname=', pathname);

  // 'supercast.xyz' 도메인이 맞는지 확인
  if (hostname === 'www.supercast.xyz') {
    // 패턴에 따라 함수 호출
    if (pathname.includes('/c/')) {
      return 'content';
    }
    // else if (
    //   pathname === '/' ||
    //   pathname.includes('/channel/') ||
    //   pathname.match(/^\/\w+$/)
    // ) {
    return 'aside';
    //}
  }

  if (hostname === 'www.warpcast.com') {
    return 'warpcast';
  }

  return 'other';
}

const CONTENT_XPATH =
  '/html/body/div/main/div/div/div/div[2]/div/div[2]/div[2]/p';

const ASIDE_CONTENT_XPATH =
  '/html/body/div[1]/aside/div/div/div[2]/div/div[2]/div[2]/p';

let isGenerating = false;
let isFirstTokenReceived = false;
function refetchStream(isAside = false) {
  const xpath = isAside ? ASIDE_CONTENT_XPATH : CONTENT_XPATH;
  const element = document.evaluate(
    xpath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null,
  ).singleNodeValue;
  if (element) {
    console.log('Element found:', element.textContent);

    const contentElement = document.querySelector('.card .content');
    if (contentElement) {
      contentElement.textContent = '';
    }
    setupFetchStreaming(element.textContent); // 서버에 데이터를 보내고 스트리밍 데이터 받기
  }
}

// XPath로 요소를 찾는 함수
function getElementByXPath(xpath) {
  return document.evaluate(
    xpath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null,
  ).singleNodeValue;
}

function insertDivAfterXPath(xpath) {
  const referenceNode = getElementByXPath(xpath);
  if (referenceNode) {
    const newNode = document.createElement('div');
    newNode.innerText = '새로운 내용'; // 새 div에 들어갈 텍스트 또는 내용
    // newNode.className = 'your-custom-class'; // 필요한 경우 클래스 추가

    // 요소 바로 다음에 새 요소 삽입
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  } else {
    console.error('지정된 XPath에 해당하는 요소를 찾을 수 없습니다.');
  }
}

function create_Element(isAside = false) {
  const container = document.createElement('div');
  // container.style.cssText =
  //   'position: fixed; top: 50px; right: 200px; width: 300px; z-index: 1000; background: transparent; padding: 10px; border-radius: 4px;';

  container.style.cssText =
    'width: 100%; background: transparent; padding: 10px; border-radius: 4px;';

  const card = document.createElement('div');
  card.style.cssText =
    'border-radius: 4px; background: transparent; margin-bottom: 10px; padding: 10px;  color: white;';
  card.className =
    'card text-sm text-gray-900 dark:text-gray-100 mb-2 break-words max-w-[280px] xs:max-w-[310px] xl:max-w-[500px] border dark:border-gray-800';
  card.innerHTML = `
        <h4 class='content p-4'></h4>
        <p class='p-2'>100 $DEGEN</p>
    `;
  const buttonContainer = document.createElement('button');
  buttonContainer.className = 'flex gap-2';

  const refetchButton = document.createElement('button');
  // 버튼 설정
  refetchButton.textContent = 'Refetch';
  refetchButton.className =
    'flex items-center rounded-md bg-gray-900 w-20 h-9 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 disabled:bg-gray-700 disabled:hover:bg-gray-700 false';
  refetchButton.style.cssText =
    'padding: 5px 10px; margin-top: 5px; background: #555; color: white; border: none; cursor: pointer;';
  refetchButton.addEventListener('click', function () {
    refetchStream(isAside); // 버튼 클릭 시 실행할 함수
  });

  const submitButton = document.createElement('button');
  submitButton.textContent = 'submit';
  submitButton.className =
    'flex items-center rounded-md bg-gray-900 w-20 h-9 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 disabled:bg-gray-700 disabled:hover:bg-gray-700 false';
  submitButton.style.cssText =
    'padding: 5px 10px; margin-top: 5px; background: #555; color: white; border: none; cursor: pointer;';
  submitButton.addEventListener('click', function () {
    //refetchStream(isAside); // 버튼 클릭 시 실행할 함수
    insertTextIntoTextarea(isAside);
  });

  //document.body.appendChild(container);
  // 다음 노드 다음에 삽입
  const asideXpath = '/html/body/div[2]/aside/div/div/div[2]';
  const referenceNode = getElementByXPath(asideXpath);
  console.log('referenceNode ', referenceNode);
  referenceNode.parentNode.insertBefore(container, referenceNode.nextSibling);
  //

  card.appendChild(buttonContainer);
  buttonContainer.appendChild(refetchButton);
  buttonContainer.appendChild(submitButton);

  container.appendChild(card);
}

window.addEventListener('load', function () {
  console.log('Current page URL:', window.location.href);
  const functionControl = handleURL(window.location.href);
  if (functionControl !== 'other') {
    //create_Element(functionControl === 'aside');
    //alert('Page fully loaded and script initiating...' + window.location.href);
    initiateAutomaticProcess(functionControl);
  }
});

function initiateAutomaticProcess(functionControl) {
  console.log('Page fully loaded and script initiating...');
  console.log('functionControl = ', functionControl);
  // 여기에 페이지가 로드된 후 자동으로 실행할 코드를 추가합니다.
  // 예를 들어, API 호출하거나, DOM 조작, 데이터 표시 등
  if (functionControl === 'aside') {
    console.log('aside');
    observeDOMChangesAside();
    return;
  }

  if (functionControl === 'content') {
    console.log('content');
    observeDOMChanges();
  }
  //observeDOMChanges();
}

function submitButton(functionControl) {
  if (functionControl === 'aside') {
    submitButton.addEventListener('click', function () {});
    return;
  }
  if (functionControl === 'content') {
    submitButton.addEventListener('click', function () {});
    return;
  }
}

// contentScript.js
function setupFetchStreaming(content) {
  const contentElement = document.querySelector('.card .content');
  if (contentElement) {
    contentElement.textContent = '';
  }
  const url = 'http://localhost:8000/v1/farcaster/get_replies'; // 서버의 엔드포인트 URL
  const data = { content: content }; // 서버로 전송할 데이터

  const controller = new AbortController();
  const signal = controller.signal;

  isGenerating = true;
  isFirstTokenReceived = false;
  showLoadingIndicator(); // 로딩 인디케이터 표시

  // POST 요청 설정
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    signal,
  })
    .then((response) => {
      console.log('Response status:', response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.body.getReader();
    })
    .then((reader) => {
      readStream(reader);
    })
    .catch((err) => {
      console.error('Fetch error:', err);
      hideLoadingIndicator(); // 에러 발생 시 로딩 인디케이터 숨김
    });

  // 스트림 데이터를 읽는 함수
  function readStream(reader) {
    const utf8Decoder = new TextDecoder('utf-8');
    function push() {
      reader
        .read()
        .then(({ done, value }) => {
          if (done) {
            console.log('Stream complete');
            hideLoadingIndicator(); // 스트림 완료 시 로딩 인디케이터 숨김

            return;
          }
          const text = utf8Decoder.decode(value, { stream: true });
          console.log('Received:', text);

          if (!isFirstTokenReceived) {
            isFirstTokenReceived = true;
            hideLoadingIndicator(); // 첫 번째 토큰 수신 시 로딩 인디케이터 숨김
          }

          const contentElement = document.querySelector('.card .content');
          if (contentElement) {
            contentElement.textContent += text;
          }
          push(); // 계속해서 다음 데이터 청크를 읽음
        })
        .catch((error) => {
          console.error('Error in stream:', error);
          hideLoadingIndicator(); // 에러 발생 시 로딩 인디케이터 숨김
        });
    }
    push();
  }
}

const ASIDE_CONTENT_AREA_XPATH =
  '/html/body/div/aside/div/div/div[2]/div/div[2]/div[2]/p';
const CONTENT_CONTENT_AREA_XPATH =
  '/html/body/div/main/div/div/div/div[2]/div/div[2]/div[2]/p';

function observeDOMChangesAside() {
  let lastObservedText = ''; // 마지막으로 관찰된 텍스트를 저장할 변수

  const observer = new MutationObserver((mutations, obs) => {
    const xpath = ASIDE_CONTENT_AREA_XPATH;
    const element = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    ).singleNodeValue;
    if (element && element.textContent !== lastObservedText) {
      console.log('Element found:', element.textContent);
      lastObservedText = element.textContent; // 새로운 텍스트로 업데이트
      create_Element();
      setupFetchStreaming(element.textContent); // 변화가 있을 때만 서버에 데이터 보내기
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

function observeDOMChanges() {
  const observer = new MutationObserver((mutations, obs) => {
    const xpath = CONTENT_CONTENT_AREA_XPATH;
    const element = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    ).singleNodeValue;
    if (element) {
      console.log('Element found:', element.textContent);
      observer.disconnect(); // 요소를 찾았으므로 관찰 종료
      setupFetchStreaming(element.textContent); // 서버에 데이터를 보내고 스트리밍 데이터 받기
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}
