const userId = window.__be.id;

// function logo() {
//   var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
//   svg.setAttribute('width', '52');
//   svg.setAttribute('height', '52');
//   svg.setAttribute('viewBox', '0 0 40 40');
//   svg.setAttribute('fill', 'none');
//   svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

//   // Создаем группу (g) и добавляем атрибут clip-path
//   var group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
//   group.setAttribute('clip-path', 'url(#clip0_1231_5028)');

//   // Создаем круги
//   var circle1 = document.createElementNS(
//     'http://www.w3.org/2000/svg',
//     'circle'
//   );
//   circle1.setAttribute('cx', '20.0007');
//   circle1.setAttribute('cy', '4.88884');
//   circle1.setAttribute('r', '1.88884');
//   circle1.setAttribute('fill', 'url(#paint0_linear_1231_5028)');

//   var circle2 = document.createElementNS(
//     'http://www.w3.org/2000/svg',
//     'circle'
//   );
//   circle2.setAttribute('cx', '4.88884');
//   circle2.setAttribute('cy', '32.278');
//   circle2.setAttribute('r', '1.88884');
//   circle2.setAttribute('fill', 'url(#paint1_linear_1231_5028)');

//   var circle3 = document.createElementNS(
//     'http://www.w3.org/2000/svg',
//     'circle'
//   );
//   circle3.setAttribute('cx', '1.88884');
//   circle3.setAttribute('cy', '1.88884');
//   circle3.setAttribute('r', '1.88884');
//   circle3.setAttribute('transform', 'matrix(-1 0 0 1 37.001 30.3892)');
//   circle3.setAttribute('fill', 'url(#paint2_linear_1231_5028)');

//   // Создаем элемент path
//   var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
//   path.setAttribute('fill-rule', 'evenodd');
//   path.setAttribute('clip-rule', 'evenodd');

//   // Ваш путь
//   var pathData =
//     'M19.9994 10.7723C18.9636 10.7618 18.1191 9.94508 18.0521 8.91406C11.2182 9.86716 5.95703 15.7607 5.95703 22.8889C5.95703 24.8412 6.35171 26.7009 7.06528 28.3919C7.28261 28.3086 7.51831 28.2631 7.76456 28.2631C8.42523 28.2631 9.01002 28.5911 9.36786 29.0946L19.9994 22.9277V10.7723ZM9.06897 31.7469C9.47832 31.3822 9.7365 30.8485 9.7365 30.2539C9.7365 29.8702 9.62898 29.5119 9.44271 29.2079L20.068 23.0446L30.6695 29.1941C30.478 29.501 30.3672 29.8644 30.3672 30.2539C30.3672 30.8196 30.6009 31.3302 30.9761 31.6926C28.4027 34.9267 24.4425 36.9984 20.0008 36.9984C15.584 36.9984 11.6434 34.9499 9.06897 31.7469ZM20.1338 10.7692C21.1246 10.7121 21.9195 9.91659 21.987 8.91934C28.8026 9.88871 34.0446 15.7738 34.0446 22.8889C34.0446 24.8291 33.6548 26.6778 32.9496 28.3603C32.7574 28.2972 32.5522 28.2631 32.3391 28.2631C31.6843 28.2631 31.104 28.5853 30.7453 29.0813L20.1338 22.9261V10.7692Z';
//   path.setAttribute('d', pathData);

//   // Цвет заливки
//   path.setAttribute('fill', 'url(#paint3_linear_1231_5028)');

//   // Добавляем элементы в группу
//   group.appendChild(circle1);
//   group.appendChild(circle2);
//   group.appendChild(circle3);
//   group.appendChild(path);

//   // Добавляем группу в SVG
//   svg.appendChild(group);

//   // Добавляем определения (defs) с линейными градиентами и обрезкой
//   var defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

//   // Линейные градиенты
//   var linearGradient0 = document.createElementNS(
//     'http://www.w3.org/2000/svg',
//     'linearGradient'
//   );
//   linearGradient0.setAttribute('id', 'paint0_linear_1231_5028');
//   linearGradient0.setAttribute('x1', '18.1118');
//   linearGradient0.setAttribute('y1', '4.88884');
//   linearGradient0.setAttribute('x2', '21.8895');
//   linearGradient0.setAttribute('y2', '4.88884');
//   linearGradient0.setAttribute('gradientUnits', 'userSpaceOnUse');

//   // Добавляем stop-элементы
//   var stop0 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
//   stop0.setAttribute('stop-color', '#ED3984');

//   var stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
//   stop1.setAttribute('offset', '0.015625');
//   stop1.setAttribute('stop-color', '#ED3984');

//   var stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
//   stop2.setAttribute('offset', '1');
//   stop2.setAttribute('stop-color', '#7452C8');

//   // Добавляем stop-элементы в linearGradient0
//   linearGradient0.appendChild(stop0);
//   linearGradient0.appendChild(stop1);
//   linearGradient0.appendChild(stop2);

//   var linearGradient1 = document.createElementNS(
//     'http://www.w3.org/2000/svg',
//     'linearGradient'
//   );
//   linearGradient1.setAttribute('id', 'paint1_linear_1231_5028');
//   linearGradient1.setAttribute('x1', '3');
//   linearGradient1.setAttribute('y1', '32.278');
//   linearGradient1.setAttribute('x2', '6.77768');
//   linearGradient1.setAttribute('y2', '32.278');
//   linearGradient1.setAttribute('gradientUnits', 'userSpaceOnUse');

//   var stop3 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
//   stop3.setAttribute('stop-color', '#ED3984');

//   var stop4 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
//   stop4.setAttribute('offset', '0.015625');
//   stop4.setAttribute('stop-color', '#ED3984');

//   var stop5 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
//   stop5.setAttribute('offset', '1');
//   stop5.setAttribute('stop-color', '#7452C8');

//   linearGradient1.appendChild(stop3);
//   linearGradient1.appendChild(stop4);
//   linearGradient1.appendChild(stop5);

//   var linearGradient2 = document.createElementNS(
//     'http://www.w3.org/2000/svg',
//     'linearGradient'
//   );
//   linearGradient2.setAttribute('id', 'paint2_linear_1231_5028');
//   linearGradient2.setAttribute('x1', '0');
//   linearGradient2.setAttribute('y1', '1.88884');
//   linearGradient2.setAttribute('x2', '3.77768');
//   linearGradient2.setAttribute('y2', '1.88884');
//   linearGradient2.setAttribute('gradientUnits', 'userSpaceOnUse');

//   var stop6 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
//   stop6.setAttribute('stop-color', '#ED3984');

//   var stop7 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
//   stop7.setAttribute('offset', '0.015625');
//   stop7.setAttribute('stop-color', '#ED3984');

//   var stop8 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
//   stop8.setAttribute('offset', '1');
//   stop8.setAttribute('stop-color', '#7452C8');

//   linearGradient2.appendChild(stop6);
//   linearGradient2.appendChild(stop7);
//   linearGradient2.appendChild(stop8);

//   var linearGradient3 = document.createElementNS(
//     'http://www.w3.org/2000/svg',
//     'linearGradient'
//   );
//   linearGradient3.setAttribute('id', 'paint3_linear_1231_5028');
//   linearGradient3.setAttribute('x1', '9.19681');
//   linearGradient3.setAttribute('y1', '13.4484');
//   linearGradient3.setAttribute('x2', '40.0129');
//   linearGradient3.setAttribute('y2', '20.4136');
//   linearGradient3.setAttribute('gradientUnits', 'userSpaceOnUse');

//   var stop9 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
//   stop9.setAttribute('stop-color', '#ED3984');

//   var stop10 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
//   stop10.setAttribute('offset', '1');
//   stop10.setAttribute('stop-color', '#7452C8');

//   linearGradient3.appendChild(stop9);
//   linearGradient3.appendChild(stop10);

//   // Добавляем определения в defs
//   defs.appendChild(linearGradient0);
//   defs.appendChild(linearGradient1);
//   defs.appendChild(linearGradient2);
//   defs.appendChild(linearGradient3);

//   // Добавляем определение clipPath
//   var clipPath = document.createElementNS(
//     'http://www.w3.org/2000/svg',
//     'clipPath'
//   );
//   clipPath.setAttribute('id', 'clip0_1231_5028');

//   var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
//   rect.setAttribute('width', '40');
//   rect.setAttribute('height', '40');
//   rect.setAttribute('fill', 'white');

//   clipPath.appendChild(rect);

//   defs.appendChild(clipPath);

//   // Добавляем определения в SVG
//   svg.appendChild(defs);
//   return svg;
// }

const getData = () => {
  var iframeElement = document.createElement('iframe');
  // var openButton = document.createElement('button');
  // openButton.style.border = 'none';
  // openButton.style.width = '64px';
  // openButton.style.height = '64px';
  // openButton.style.background = 'transparent';
  // openButton.style.cursor = 'pointer';
  // openButton.style.borderRadius = '50%';
  // openButton.style.position = 'absolute';
  // openButton.style.bottom = '20px';
  // openButton.style.right = '20px';

  // openButton.appendChild(logo());
  // openButton.onclick = function () {
  //   iframeElement.style.opacity = '1';
  //   iframeElement.style.visibility = 'visible';
  //   openButton.style.display = 'none';
  // };

  // var closeButton = document.createElement('button');
  // closeButton.innerText = 'X';

  iframeElement.src = `http://127.0.0.1:5500/index.html`;
  // iframeElement.src = `https://localhost:3001/eva_widget/auth?id=${userId}`;

  // iframeElement.style.opacity = '0';
  // iframeElement.style.visibility = 'hidden';
  // iframeElement.style.transition = 'opacity 0.5s linear 0s';
  iframeElement.width = '400';
  iframeElement.height = '600';
  iframeElement.scrolling = 'no';
  (iframeElement.style.overflowY = 'hidden'),
    (iframeElement.style.position = 'fixed');
  iframeElement.style.bottom = '20px';
  iframeElement.style.right = '20px';
  iframeElement.frameBorder = 0;
  iframeElement.style.borderRadius = '16px';

  // document.body.appendChild(openButton);
  document.body.appendChild(iframeElement);
  // document.body.appendChild(closeButton);
};

getData();
