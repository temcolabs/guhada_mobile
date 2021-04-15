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

    const utm = sessionStorage.get('UTM') || {};

    if (
      utm &&
      typeof utm === 'object' &&
      (utm_source || utm_medium || utm_campaign)
    ) {
      if (utm_source && (!utm.source || utm.source !== utm_source)) {
        utm.source = utm_source;
      }
      if (utm_medium && (!utm.medium || utm.medium !== utm_medium)) {
        utm.medium = utm_medium;
      }
      if (utm_campaign && (!utm.campaign || utm.campaign !== utm_campaign)) {
        utm.campaign = utm_campaign;
      }

      sessionStorage.set('UTM', utm);
    }
  }
}
