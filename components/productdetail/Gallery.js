import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import css from './Gallery.module.scss';

class Gallery extends Component {
  render() {
    return (
      <div className={css.detail__gallery}>
        <img src="/static/m_detail_1.png" alt="detail" />
      </div>
    );
  }
}

export default Gallery;
