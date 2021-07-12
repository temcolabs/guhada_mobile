export const LINK_PATH = {
  androidStore: 'https://play.google.com/store/apps/details?id=io.temco.guhada',
  iosStore:
    'https://apps.apple.com/kr/app/%EA%B5%AC%ED%95%98%EB%8B%A4-%EB%AA%85%ED%92%88-%EC%87%BC%ED%95%91-%ED%95%84%EC%88%98%EC%95%B1/id1478120259?itsct=apps_box_link&itscg=30200',
  universalLink: (dealId) =>
    `${window.location.origin}/apple-app-site-association`,
  intent: (dealId) =>
    `intent://DEAL?dealid=${dealId}#Intent;package=io.temco.guhada;scheme=guhada;end;`,
  schemeUrl: (dealId) => `guhada://DEAL?dealid=${dealId}`,
};
