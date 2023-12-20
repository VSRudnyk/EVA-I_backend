const userId = window.__be.id;

const getData = () => {
  var myDiv = document.getElementById('myDiv');
  var iframeElement = document.createElement('iframe');

  iframeElement.src = `https://vsrudnyk.github.io/eva_widget/auth?id=${userId}`;
  // iframeElement.src = `https://localhost:3001/eva_widget/auth?id=${userId}`;
  iframeElement.width = '400';
  iframeElement.height = '600';
  iframeElement.style.position = 'absolute';
  iframeElement.style.bottom = '20px';
  iframeElement.style.right = '20px';
  iframeElement.frameBorder = 0;

  myDiv.appendChild(iframeElement);
};

getData();
