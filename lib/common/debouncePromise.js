/**
 * 함수가 ms 이내로 연속 호출될 때 마지막 1번만 호출한다
 *
 * @param {*} inner promise를 리턴하는 함수
 * @param {*} ms debouncing 간격
 */
function debouncePromise(inner, ms = 0) {
  let timer = null;
  let resolves = [];

  return function(...args) {
    // Run the function after a certain amount of time
    clearTimeout(timer);
    timer = setTimeout(() => {
      // Get the result of the inner function, then apply it to the resolve function of
      // each promise that has been created since the last time the inner function was run
      let result = inner(...args);
      resolves.forEach(r => r(result));
      resolves = [];
    }, ms);

    return new Promise(r => resolves.push(r));
  };
}

module.exports = debouncePromise;
