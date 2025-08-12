// 字符映射关系
const charMap = {
  '0': '\uFE00',
  '1': '\uFE01',
  '2': '\uFE02',
  '3': '\uFE03',
  '4': '\uFE04',
  '5': '\uFE05',
  '6': '\uFE06',
  '7': '\uFE07',
  '8': '\uFE08',
  '9': '\uFE09',
  'A': '\uFE0A',
  'B': '\uFE0B',
  'C': '\uFE0C',
  'D': '\uFE0D',
  'E': '\uFE0E',
  'F': '\uFE0F'
};

// 反转映射
const reverseMap = {};
for (const [key, value] of Object.entries(charMap)) {
  reverseMap[value] = key;
}

// DOM元素
const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');
const toAowuBtn = document.getElementById('toAowu');
const toOriginalBtn = document.getElementById('toOriginal');
const pasteToOriginal = document.getElementById('pasteToOriginal');
const copyResultBtn = document.getElementById('copyResult');
const clearBtn = document.getElementById('clear');

// 文本转嗷呜语
function textToAowu(text) {
  let result = '';
  
  for (let char of text) {
    // 获取字符的Unicode码点
    const codePoint = char.codePointAt(0);
    // 转换为6位16进制，并转换为大写
    const hexCode = codePoint.toString(16).toUpperCase().padStart(6, '0');
    
    // 按映射规则替换每个16进制字符
    let converted = '';
    for (let hexChar of hexCode) {
      converted += charMap[hexChar] || hexChar;
    }
    
    result += converted;
  }
  
  // 添加前缀和后缀
  return '嗷' + result + '呜~';
}

// 嗷呜语转原始文本
function aowuToText(aowu) {
  // 检查并移除前缀和后缀
  if (!aowu.startsWith('嗷') || !aowu.endsWith('呜~')) {
    return '无效的嗷呜语格式';
  }
  
  const content = aowu.slice(1, -2);
  let result = '';
  let hexBuffer = '';
  
  // 将每个字符转换回16进制字符
  for (let char of content) {
    hexBuffer += reverseMap[char] || char;
    
    // 每6个字符一组
    if (hexBuffer.length === 6) {
      const codePoint = parseInt(hexBuffer, 16);
      // 处理代理对（Surrogate Pairs）
      if (codePoint <= 0xFFFF) {
        result += String.fromCharCode(codePoint);
      } else {
        // 对于大于0xFFFF的码点
        const high = Math.floor((codePoint - 0x10000) / 0x400) + 0xD800;
        const low = ((codePoint - 0x10000) % 0x400) + 0xDC00;
        result += String.fromCharCode(high, low);
      }
      hexBuffer = '';
    }
  }
  
  return result;
}

window.onload = function() {
  // 事件监听器
  toAowuBtn.addEventListener('click', () => {
    const text = inputText.value;
    if (text) {
      outputText.value = textToAowu(text);
    }
  });
  
  toOriginalBtn.addEventListener('click', () => {
    const aowu = inputText.value;
    if (aowu) {
      outputText.value = aowuToText(aowu);
    }
  });
  
  pasteToOriginal.addEventListener('click', async () => {
    try {
      const t = await navigator.clipboard.readText();
      inputText.value = t;
      outputText.value = aowuToText(t);
    } catch (e) {
      alert('粘贴时出错：' + e);
      console.error(e);
    }
  });
  
  copyResultBtn.addEventListener('click', () => {
    if (outputText.value) {
      outputText.select();
      document.execCommand('copy');
      alert('已复制到剪贴板！');
    }
  });
  
  clearBtn.addEventListener('click', () => {
    inputText.value = '';
    outputText.value = '';
    inputText.focus();
  });
  
}