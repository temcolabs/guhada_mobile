import React, { useState, useEffect } from 'react';
import { inject } from 'mobx-react';
import css from './EventDetail.module.scss';
import DefaultLayout from 'components/layout/DefaultLayout';

function EventDetail({ eventmain }) {
  const url = document.location.href;
  const id = url.substr(url.lastIndexOf('/') + 1);

  return (
    <DefaultLayout headerShape={'eventmain'} pageTitle={'이벤트'}>
      <div className={css.wrap}>asfsfsdfss</div>
    </DefaultLayout>
  );
}

export default inject('eventmain')(EventDetail);
