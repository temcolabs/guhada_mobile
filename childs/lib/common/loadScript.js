/**
 * !deprecated
 * lib/dom/loadScript 모듈을 대신 사용하도록 한다.
 *
 * script 태그로 외부 js 파일 불러오기
 *
 * @param {*} src 스크립트 URL
 * @param {*} option.onload 스크립트가 로드된 후 실행할 콜백. 로드되었다면 바로 실행한다.
 * @param {*} option.id script 태그 id
 * @param {*} option.async 비동기 로드
 * @param {*} option.replaceExitsing id와 매칭되는 것이 있으면 기존의 스크립트는 대체
 * @param {*} option.innerText
 * @param {*} option.innerHTML
 */
const loadScript = (
  src,
  {
    type = 'text/javascript',
    innerText,
    innerHTML,
    onLoad = () => {},
    id,
    async = false,
    replaceExitsing = false,
  } = {}
) => {
  const existingTag = document.getElementById(id);

  /**
   * 스크립트 추가
   */
  const addScript = () => {
    let script = document.createElement('script');

    script.type = type;

    if (src) {
      script.src = src;
    }

    script.id = !!id ? encodeURIComponent(id) : encodeURIComponent(src);
    script.async = async;

    if (innerText) {
      script.innerText = innerText;
    }

    if (innerHTML) {
      script.innerHTML = innerHTML;
    }

    script.onload = function() {
      if (typeof onLoad === 'function') {
        onLoad();
      }
    };

    script.onerror = function() {
      console.error('error on loading' + this.src);
    };

    document.body.appendChild(script);
  };

  /**
   * 1. script 없음. 교체함 => 추가
     2. script 없음. 교헤안함 => 추가
     3. script 있음. 교체함 => 삭제 후 추가
     4. script 있음. 교체안함
   */
  // 태그가 있고 교체가 아니라면 onload 바로 실행
  if (existingTag && !replaceExitsing) {
    if (typeof onLoad === 'function') {
      onLoad();
    }
  } else {
    if (existingTag && replaceExitsing) {
      existingTag.remove();
    }

    addScript();
  }
};

export default loadScript;

/**
 * loadScript로 불러올 스크립트 고유 아이디
 */
export const scriptIds = {
  CRITEO_TRACKER: 'CRITEO_TRACKER',
  DAUM_TRACKER: 'DAUM_TRACKER',
  NAVER_SHOPPING: 'NAVER_SHOPPING',
  WIDERPLANET_TRACKER: 'WIDERPLANET_TRACKER',
};
