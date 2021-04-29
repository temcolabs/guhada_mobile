import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import useStores from 'stores/useStores';
import { pushRoute } from 'childs/lib/router';

import DefaultLayout from 'components/layout/DefaultLayout';
import Footer from 'components/footer/Footer';

Gift.propTypes = {};

function Gift() {
  const { main: mainStore, searchitem: searchItemStore } = useStores();

  useEffect(() => {}, []);

  return (
    <DefaultLayout>
      <div>sadgasdgs</div>
      <Footer />
    </DefaultLayout>
  );
}

export default observer(Gift);
