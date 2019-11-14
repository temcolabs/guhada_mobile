const getFileName = url => {
  let originalUrl = url;
  let splitUrl = originalUrl.split('/');
  let splitLength = splitUrl.length;

  return splitUrl[splitLength - 1];
};

export default getFileName;
