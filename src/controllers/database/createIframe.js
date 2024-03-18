const { id, width } = window.__be;
const mobileView = width < 1000;

const getData = () => {
  var iframeElement = document.createElement('iframe');
  iframeElement.src = `https://eva-i.com/chat/widget`;
  iframeElement.width = mobileView ? '100%' : '400';
  iframeElement.height = mobileView ? '100%' : '600';
  iframeElement.scrolling = 'no';
  iframeElement.style.overflowY = 'hidden';
  iframeElement.style.position = 'fixed';
  iframeElement.style.bottom = mobileView ? '0' : '20px';
  iframeElement.style.right = mobileView ? '0' : '20px';
  iframeElement.style.zIndex = '999';
  iframeElement.frameBorder = 0;
  iframeElement.style.borderRadius = mobileView ? '0' : '16px';

  document.body.appendChild(iframeElement);
};

getData();
