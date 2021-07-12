import sessionStorage from 'lib/common/sessionStorage';
import qs from 'querystring';

export function gtagUtmSave() {
  const search = window.location.search.substring(1);

  if (search.length) {
    const { utm_source, utm_medium, utm_campaign } = qs.parse(search);

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
