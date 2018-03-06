$(() => {
  $('select[name=scale]').change(scaleChangeEventHandler);
  // window.AudioContext = window.AudioContext || window.webkitAudioContext; // クロスブラウザ対応
  // const audioCtx = new AudioContext();

  // // 引数のヘルツの高さの音を出す関数
  // function play(hz) {

  //   // 正弦波の音を作成
  //   const osciillator = audioCtx.createOscillator();

  //   // ヘルツ（周波数）指定
  //   osciillator.frequency.value = hz;

  //   // 音の出力先
  //   const audioDestination = audioCtx.destination;

  //   // 出力先のスピーカーに接続
  //   osciillator.connect(audioDestination);

  //   // 音を出す
  //   osciillator.start = osciillator.start || osciillator.noteOn; // クロスブラウザ対応
  //   osciillator.start();

  //   // 音を0.5秒後にストップ
  //   setTimeout(() => {
  //     osciillator.stop();
  //   }, 500);
  // }

  // // ピアノの鍵盤を取得
  // const pianoKey = document.getElementsByClassName('pianokey');

  // // DOMのrenderのあとじゃないと0になるのでbodyタグ内の一番下に書くか、jquery.readyなどのhtml描画をに動作するところに書く
  // // https://stackoverflow.com/questions/30211605/javascript-html-collection-showing-as-0-length
  // const pianoKeyL = pianoKey.length;
  // for (i = 0; i < pianoKeyL; i++) {

  //   // クロージャ
  //   (function (i) {
  //     pianoKey[i].addEventListener('click', () => {

  //       // 鍵盤の位置で周波数を計算
  //       const h = 442 * Math.pow(2, (1 / 12) * (i - 9));
  //       play(h);
  //     }, false);
  //   }(i));
  // }
});

function scaleChangeEventHandler(event) {
  const key = event.target.value;
  const resultPiano = generateScaleKey(key);

  // pianoのclassを書き換え
  const children = $('#piano').children();
  for (let i = 0; i < children.length; i++) {
    children[i].className = resultPiano[i];
  }
}

const piano = [
  'pianokey',
  'pianokey sharp',
  'pianokey',
  'pianokey sharp',
  'pianokey',
  'pianokey',
  'pianokey sharp',
  'pianokey',
  'pianokey sharp',
  'pianokey',
  'pianokey sharp',
  'pianokey',
];
const KeyList = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const majorScale = [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1]; // Cメジャースケール。使用できるキーが1
const minorScale = [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0]; // Cマイナースケール。使用できるキーが1


function generateScaleKey(key, scale = 'major') {
  const startIdx = KeyList.indexOf(key);

  let scaleList = (new Array(12)).fill(1);
  switch (scale) {
    case 'major':
      scaleList = majorScale;
      break;
    case 'minor':
      scaleList = minorScale;
      break;
    default:
      break;
  }

  // 1オクターブ
  const resultPiano = [];
  Object.assign(resultPiano, piano);

  for (let i = 0; i < 12; i++) {
    const idx = (i + startIdx) % 12;
    resultPiano[idx] = ((scaleList[i] === 1) ? resultPiano[idx] : `${resultPiano[idx]} none`);
  }

  return resultPiano;
}
