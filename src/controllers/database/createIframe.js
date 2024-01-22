const userId = window.__be.id;

const getData = () => {
  var iframeElement = document.createElement('iframe');
  iframeElement.src = `http://127.0.0.1:5500/index.html`;
  // iframeElement.src = `https://localhost:3001/eva_widget/auth?id=${userId}`;
  iframeElement.width = '400';
  iframeElement.height = '600';
  iframeElement.scrolling = 'no';
  iframeElement.style.overflowY = 'hidden';
  iframeElement.style.position = 'fixed';
  iframeElement.style.bottom = '20px';
  iframeElement.style.right = '20px';
  iframeElement.style.zIndex = '999';
  iframeElement.frameBorder = 0;
  iframeElement.style.borderRadius = '16px';

  document.body.appendChild(iframeElement);
};

getData();
