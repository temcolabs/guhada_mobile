/**
 * 앵커로 점프. replace를 이용해서 히스토리에 쌓이지 않게 한다
 * 일반 엘레멘트의 id 값이나 a 태그의 href 속성 값 사용 가능
 * @param {*} id
 */
export default function jumpToAnchor(id) {
  window.location.replace(`#${id}`);
}
