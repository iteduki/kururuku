$(() => {
  $('select[name=key]').change(keyScaleChangeEventHandler);
  $('select[name=scale]').change(keyScaleChangeEventHandler);

  initKey();
});

const keymap = {
  // Zキー = C4
  90: 60,
  // Sキー = C#4
  83: 61,
  // Xキー = D4
  88: 62,
  // Dキー = D#4
  68: 63,
  // Cキー = E4
  67: 64,
  // Vキー = F4
  86: 65,
  // Gキー = F#4
  71: 66,
  // Bキー = G4
  66: 67,
  // Hキー = G#4
  72: 68,
  // Nキー = A4
  78: 69,
  // Jキー = A#4
  74: 70,
  // Mキー = B4
  77: 71
};

function initKey() {
  window.AudioContext = window.AudioContext || window.webkitAudioContext; // クロスブラウザ対応
  const audioContext = new AudioContext();
  // キーダウンした際の処理
  $(this).keydown((keyDownEvent) => {
    // キー押しっぱなしの状態で発火した場合は、動作を終了する
    if (keyDownEvent.repeat === true) {
      return;
    }
    // 対応するキー以外が押されたら
    if (!keymap[keyDownEvent.keyCode]) {
      return;
    }
    // noneだったら発音しない
    const keyIdx = keymap[keyDownEvent.keyCode] - 60;
    if ($('#piano').children()[keyIdx].className.indexOf('none') !== -1) {
      return;
    }
    // オシレーターを作成
    const osciillatorNode = audioContext.createOscillator();
    // MIDIノートナンバーを周波数に変換
    const freq = 440.0 * (2.0 ** ((keymap[keyDownEvent.keyCode] - 69.0) / 12.0));
    // オシレーターの周波数を決定
    osciillatorNode.frequency.value = freq;
    // オシレーターを最終出力に接続
    osciillatorNode.connect(audioContext.destination);
    // オシレーター動作
    osciillatorNode.start();
    // キーを離した際に音が止まるよう、イベントを登録する
    $(document).on('keyup', checkKeyUp);
    // キーを離したかどうかチェック
    function checkKeyUp(keyUpEvent) {
      // 離したキーが、押下したキーで無い場合は処理を行わない
      if (keyUpEvent.keyCode !== keyDownEvent.keyCode) {
        return;
      }
      // オシレーターを停止する
      osciillatorNode.stop();
      // 自身のイベントを削除
      $(document).off('keyup', checkKeyUp);
    }
  });

  // 引数のヘルツの高さの音を出す関数
  function play(hz) {
    // 正弦波の音を作成
    const osciillator = audioContext.createOscillator();

    // ヘルツ（周波数）指定
    osciillator.frequency.value = hz;

    // 音の出力先
    const audioDestination = audioContext.destination;

    // 出力先のスピーカーに接続
    osciillator.connect(audioDestination);

    // 音を出す
    osciillator.start = osciillator.start || osciillator.noteOn; // クロスブラウザ対応
    osciillator.start();

    // 音を0.5秒後にストップ
    setTimeout(() => {
      osciillator.stop();
    }, 500);
  }

  // ピアノの鍵盤を取得
  const pianokey = $('#piano').children();

  for (let i = 0; i < pianokey.length; i++) {
    $(pianokey[i]).click((mouseEvent) => {
      if (mouseEvent.target.className.indexOf('none') === -1) {
        // 鍵盤の位置で周波数を計算
        const h = 442 * (2 ** ((1 / 12) * (i - 9)));
        play(h);
      }
    });
  }
}

function keyScaleChangeEventHandler() {
  const key = $('select[name=key]').val();
  const scale = $('select[name=scale]').val();
  const resultPiano = generateScaleKey(key, scale);

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
  'pianokey'
];
const keyList = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const majorScale = [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1]; // Cメジャースケール。使用できるキーが1
const minorScale = [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0]; // Cマイナースケール。使用できるキーが1
const ryukyuScale = [1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 1]; // 琉球音階。使用できるキーが1


function generateScaleKey(key, scale = 'major') {
  const startIdx = keyList.indexOf(key);

  if (startIdx === -1) {
    return piano;
  }

  let scaleList = (new Array(12)).fill(1);
  switch (scale) {
    case 'major':
      scaleList = majorScale;
      break;
    case 'minor':
      scaleList = minorScale;
      break;
    case 'ryukyu':
      scaleList = ryukyuScale;
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
