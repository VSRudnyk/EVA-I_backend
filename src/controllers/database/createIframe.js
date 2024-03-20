const { id, width } = window.__be;
const mobileView = width < 1000;

const getData = () => {
  var iframe = document.createElement('iframe');
  iframeElement.src = `https://eva-i.com/chat/widget`;
  iframe.style.width = '100px';
  iframe.style.height = '100px';
  iframe.style.position = 'fixed';
  iframe.style.right = '20px';
  iframe.style.bottom = '20px';
  iframe.style.border = 'none';
  iframe.style.overscrollBehaviorY = 'hidden';
  iframe.style.bottom = mobileView ? '0' : '20px';
  iframe.style.right = mobileView ? '0' : '20px';
  iframe.style.zIndex = '999';
  iframe.style.borderRadius = mobileView ? '0' : '16px';
  iframe.scrolling = 'no';

  function resizeIframe(width, height) {
    iframe.style.width = width;
    iframe.style.height = height;
  }

  window.addEventListener('message', function (event) {
    if (event.data === 'toggleResize') {
      if (iframe.style.width === '100px' && iframe.style.height === '100px') {
        resizeIframe(
          mobileView ? '100%' : '410px',
          mobileView ? '100%' : '700px'
        );
      } else {
        setTimeout(function () {
          resizeIframe('100px', '100px');
        }, 1000);
      }
    }
  });

  document.body.appendChild(iframe);
};

getData();
