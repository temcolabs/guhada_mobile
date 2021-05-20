/**
 * load foreign resource with link tag
 *
 * @param {string} id tag id
 * @param {string} href
 * @param {string} rel default rel is stylesheet
 */
const loadLink = (id, href, rel = 'stylesheet') => {
  if (document.getElementById(id)) {
    return;
  }

  const link = document.createElement('link');
  link.id = encodeURIComponent(id);
  link.href = href;
  link.rel = rel;

  document.body.appendChild(link);
};

export default loadLink;
