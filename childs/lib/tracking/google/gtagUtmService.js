import sessionStorage from 'childs/lib/common/sessionStorage';

export function gtagUtmSave() {
  const search = window.location.search.substring(1);
  if (search.length) {
    const { utm_source, utm_medium, utm_campaign } = JSON.parse(
      '{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}',
      function(key, value) {
        return key === '' ? value : decodeURIComponent(value);
      }
    );

    if (utm_source || utm_medium || utm_campaign) {
      const _utm_source = sessionStorage.get('utm_source');
      const _utm_medium = sessionStorage.get('utm_medium');
      const _utm_campaign = sessionStorage.get('utm_campaign');

      if (!_utm_source || (_utm_source && _utm_source !== utm_source)) {
        sessionStorage.set('utm_source', utm_source);
      }
      if (!_utm_medium || (_utm_medium && _utm_medium !== utm_medium)) {
        sessionStorage.set('utm_medium', utm_medium);
      }
      if (!_utm_campaign || (_utm_campaign && _utm_campaign !== utm_campaign)) {
        sessionStorage.set('utm_medium', utm_campaign);
      }

      return {
        utm_source,
        utm_medium,
        utm_campaign,
      };
    }
  }
  return {};
}

export function gtagUtmGet() {
  const _utm_source = sessionStorage.get('utm_source');
  const _utm_medium = sessionStorage.get('utm_medium');
  const _utm_campaign = sessionStorage.get('utm_campaign');

  return {
    utm_source: _utm_source,
    utm_medium: _utm_medium,
    utm_campaign: _utm_campaign,
  };
}
