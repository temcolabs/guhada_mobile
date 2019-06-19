import { observable, action, toJS } from 'mobx';

import Cookies from 'js-cookie';
import Router from 'next/router';
import API from 'lib/API';

const isServer = typeof window === 'undefined';
export default class SideTab {
  constructor(root) {
    if (!isServer) this.root = root;
  }
  // @observable asideCriterion = 0
  @observable asideCriterionTop;
  @observable fixedPositon = 'relative';
  @observable fixedTop = '43px';
  // --------------------- 사이드 결제정보창 최초 위치 값 설정 ---------------------
  @action
  getAsideCriterion = () => {
    if (!this.root.orderpayment.paymentMethod) {
      window.scrollTo(0, 0);
    }

    // this.asideCriterionTop = document.querySelector('.aside__criterion');
    // this.asideCriterion = this.asideCriterionTop.offsetTop;
    // console.log(this.asideCriterion, '결제정보창 최초 위치 값 설정');
  };

  //--------------------- 사이드 결제정보 스크롤 이벤트 ---------------------
  @action
  sidePaymentInfoFixed = () => {
    let headrWrap = document.querySelector('.header-wrapper');

    let orderPaymentTemplate = document.querySelector('.order__payment__wrap');
    let sideTab = document.querySelector('.order__payment__info__side');
    let sideTabRect = sideTab.getBoundingClientRect();
    let sideTabTop = sideTabRect.top;
    // let sideTabTop =
    //   headrWrap.offsetHeight +
    //   orderPaymentTemplate.offsetTop +
    //   sideTab.offsetTop;
    // console.log(
    //   sideTabTop,
    //   window.scrollY,
    //   // headrWrap.offsetHeight,
    //   // orderPaymentTemplate.offsetTop,
    //   'fd'
    // );
    if (orderPaymentTemplate) {
      if (sideTabTop < -43) {
        this.fixedPositon = 'fixed';
        this.fixedTop = '30px';
      } else {
        this.fixedPositon = 'relative';
        this.fixedTop = '43px';
      }
    }
  };
}
