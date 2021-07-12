export default function findChoKorean(str) {
  // 문자를 받아서 초성을 return 한다.
  // 된음 ㄲㄸㅃ 등은 ㄱㄷㅂ 으로 리턴한다.

  let cho = [
    'ㄱ',
    'ㄱ',
    'ㄴ',
    'ㄷ',
    'ㄷ',
    'ㄹ',
    'ㅁ',
    'ㅂ',
    'ㅂ',
    'ㅅ',
    'ㅅ',
    'ㅇ',
    'ㅈ',
    'ㅈ',
    'ㅊ',
    'ㅋ',
    'ㅌ',
    'ㅍ',
    'ㅎ',
  ];
  let result = '';

  let code = str.charCodeAt(0) - 44032;
  if (code > -1 && code < 11172) result += cho[Math.floor(code / 588)];

  return result;
}
