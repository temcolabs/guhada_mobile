import { observable, toJS } from 'mobx';

export const autoHypenPhone = function(str) {
  str = str.replace(/[^0-9]/g, '');
  let tmp = '';
  if (str.length < 4) {
    return str;
  } else if (str.length < 7) {
    tmp += str.substr(0, 3);
    tmp += '-';
    tmp += str.substr(3);
    return tmp;
  } else if (str.length < 11) {
    tmp += str.substr(0, 3);
    tmp += '-';
    tmp += str.substr(3, 3);
    tmp += '-';
    tmp += str.substr(6);
    return tmp;
  } else {
    tmp += str.substr(0, 3);
    tmp += '-';
    tmp += str.substr(3, 4);
    tmp += '-';
    tmp += str.substr(7);
    return tmp;
  }
  return str;
};

export const autoHypenTele = function(obj) {
  if (obj === undefined) return;

  var number = obj.replace(/[^0-9]/g, '');
  var tel = '';

  // 서울 지역번호(02)가 들어오는 경우
  if (number.substring(0, 2).indexOf('02') == 0) {
    if (number.length < 3) {
      return number;
    } else if (number.length < 6) {
      tel += number.substr(0, 2);
      tel += '-';
      tel += number.substr(2);
    } else if (number.length < 10) {
      tel += number.substr(0, 2);
      tel += '-';
      tel += number.substr(2, 3);
      tel += '-';
      tel += number.substr(5);
    } else {
      tel += number.substr(0, 2);
      tel += '-';
      tel += number.substr(2, 4);
      tel += '-';
      tel += number.substr(6);
    }

    // 서울 지역번호(02)가 아닌경우
  } else {
    if (number.length < 4) {
      return number;
    } else if (number.length < 7) {
      tel += number.substr(0, 3);
      tel += '-';
      tel += number.substr(3);
    } else if (number.length < 11) {
      tel += number.substr(0, 3);
      tel += '-';
      tel += number.substr(3, 3);
      tel += '-';
      tel += number.substr(6);
    } else {
      tel += number.substr(0, 3);
      tel += '-';
      tel += number.substr(3, 4);
      tel += '-';
      tel += number.substr(7);
    }
  }

  return tel;
};

export const autoHypencompanyRegistration = function(str) {
  str = str.replace(/[^0-9]/g, '');
  let tmp = '';

  if (str.length > 12) {
    return;
  }

  if (str.length < 4) {
    return str;
  } else if (str.length < 7) {
    tmp += str.substr(0, 3);
    tmp += '-';
    tmp += str.substr(3);
    return tmp;
  } else {
    tmp += str.substr(0, 3);
    tmp += '-';
    tmp += str.substr(1, 2);
    tmp += '-';
    tmp += str.substr(5);
    return tmp;
  }
  return str;
};

export const getParameterByName = function(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

export const getCategoryTitle = function(data, id) {
  let title;
  data.forEach(element => {
    var getItem = searchTreeId(element, id);
    if (getItem) {
      title = getItem.title;
    }
  });

  return title;
};

let searchitem = [];

export const searchCategoryName = function(data, name) {
  searchitem = [];

  data.forEach(element => {
    searchTreeName(element, name);
  });

  return searchitem;
};

export const searchTreeName = function(element, name) {
  if (element.name.indexOf(name) != -1) {
    searchitem.push({
      id: element.id,
      name: element.name,
      key: element.key,
      hierarchy: element.hierarchy,
      fullDepthName: element.fullDepthName,
    });
  }

  if (element.children != null) {
    var i;
    var result = null;
    for (i = 0; result == null && i < element.children.length; i++) {
      result = searchTreeName(element.children[i], name);
    }
    return result;
  }

  return null;
};

export const getBrandTitle = function(data, id) {
  let title;
  if (data && id) {
    data.forEach(element => {
      if (element.id.toString() === id.toString()) {
        title = element.nameDefault;
      }
    });
  }
  return title;
};

export const searchTreeId = function(element, id) {
  if (element.id == id) {
    return element;
  } else if (element.children != null) {
    var i;
    var result = null;
    for (i = 0; result == null && i < element.children.length; i++) {
      result = searchTreeId(element.children[i], id);
    }
    return result;
  }
  return null;
};

export const getCategory = function(element, id) {
  let result = null;

  if (element === undefined) {
    return undefined;
  }

  for (var i = 0; i < element.length; i++) {
    var getItem = searchTreeId(element[i], id);

    if (getItem) {
      return getItem;
    }
  }
};

export const getCategoryChildren = function(element, id) {
  let result = null;

  if (element === undefined) {
    return undefined;
  }

  for (var i = 0; i < element.length; i++) {
    var getItem = searchTreeId(element[i], id);

    if (getItem) {
      result = getItem.children;
      return result;
    }
  }

  return result;
};

export const getCategoryKey = function(data, id) {
  let key;

  data.forEach(element => {
    var getItem = searchTreeKey(element, id);
    if (getItem) {
      key = getItem.key;
    }
  });

  return key;
};

export const getCategoryKeyArray = function(data, id) {
  let key;
  let keyArray;
  data.forEach(element => {
    var getItem = searchTreeKey(element, id);

    if (getItem) {
      key = getItem.key;
      keyArray = key.split('-');
    }
  });

  return keyArray;
};

export const searchTreeKey = function(element, matchingTitle) {
  if (element.id == matchingTitle) {
    return element;
  } else if (element.children != null) {
    var i;
    var result = null;
    for (i = 0; result == null && i < element.children.length; i++) {
      result = searchTreeId(element.children[i], matchingTitle);
    }
    return result;
  }
  return null;
};

export const loadScript = function(src, id) {
  let script = document.createElement('script');
  script.src = src;
  script.id = id;
  // script.onload = function() {
  //   callback(script);
  // };
  document.body.appendChild(script);
};

// 유저 에이전트 를 가져오는 함수 (김관추가)
export const getUserAgent = function() {
  return navigator.userAgent;
};
