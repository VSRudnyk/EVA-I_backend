const { id, width } = window.__be;
const mobileView = width < 1000;

const getData = () => {
  var iframe = document.createElement('iframe');
  // iframe.src = `https://eva-i.com/widget/`; // Нужно будет сделать что бы на виджет отправлять не id а токен
  iframe.src = `http://localhost:5173/widget_v2/`; // Нужно будет сделать что бы на виджет отправлять не id а токен
  iframe.style.width = '255px';
  iframe.style.height = '180px';
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
      if ((iframe.style.width === '255px' || iframe.style.width === '100px')  && (iframe.style.height === '180px' || iframe.style.height === '100px')) {
        resizeIframe(
          mobileView ? '100%' : '410px',
          mobileView ? '100%' : '80%'
        );
      } else {
        setTimeout(function () {
          resizeIframe('100px', '100px');
        }, 1000);
      }
    } else if (event.data === 'closePopover') {
      resizeIframe('100px', '100px')
    }
  });

  window.addEventListener('message', function (event) {
    if (event.data === 'getDimensions') {
      event.source.postMessage(
        {
          width: window.innerWidth,
        },
        '*'
      );
    }
  });

  document.body.appendChild(iframe);
};

getData();
