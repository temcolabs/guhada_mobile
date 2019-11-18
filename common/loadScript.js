/**
 * script 태그로 외부 js 파일 불러오기
 *
 * @param {*} src 스크립트 URL
 * @param {*} option.onload 스크립트가 로드된 후 실행할 콜백. 로드되었다면 바로 실행한다.
 * @param {*} option.id script 태그 id
 * @param {*} option.async 비동기 로드
 */
const loadScript = (
  src,
  {
    type = 'text/javascript',
    innerText,
    onLoad = () => {},
    id,
    async = false,
  } = {}
) => {
  const didNotLoaded = !document.getElementById(id);

  if (didNotLoaded) {
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

    script.onload = function() {
      if (typeof onLoad === 'function') {
        onLoad();
      }
    };

    script.onerror = function() {
      console.error('error on loading' + this.src);
    };

    document.body.appendChild(script);
  } else {
    if (typeof onLoad === 'function') {
      onLoad();
    }
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
