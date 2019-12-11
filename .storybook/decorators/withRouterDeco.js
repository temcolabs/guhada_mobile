import Router from 'next/router';

// mock next router instance
Router.router = {
  push: () => {},
  replace: () => {},
  prefetch: () => {},
  pathname: '',
  as: '',
  apply: () => {},
  query: {},
};
