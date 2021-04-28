import styled from 'styled-components';

/**
 * LuckyDraw Card Wrapper
 */
export const Wrapper = styled.div`
  font-family: 'Noto Sans KR', sans-serif;
  width: 360px;
  margin: 0 auto;
  margin-top: 70px;
  text-align: center;
`;

/**
 * LuckyDraw Card Section Form
 */
export const SectionForm = styled.div`
  width: 320px;
  height: 325px;
  margin: 50px auto 0 auto;
`;

/**
 * LuckyDraw Card Section Form - Header
 */
export const SectionFormHeader = styled.div`
  display: flex;
  flex-flow: column wrap;
  justify-content: space-between;
  font-family: Roboto;
  text-align: left;
  color: #222222;

  > div:first-child {
    font-size: 16px;
    line-height: 1.2;
    font-weight: bold;
  }
  > div:last-child {
    font-size: 15px;
    line-height: 1.33;
  }
`;

/**
 * LuckyDraw Card Section Form - Price
 */
export const SectionFormPrice = styled.div`
  height: 50px;
  margin-top: 25px;

  > div {
    height: 100%;
  }
  > div:first-child {
    float: left;
  }
  > div:last-child {
    float: right;
  }
`;

export const SectionFormPriceRate = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fd4900;
  width: 38px;
  height: 20px;

  > span:first-child {
    font-family: 'BebasNeue-Book';
    font-size: 16px;
    font-weight: bold;
    line-height: 0.69;
    letter-spacing: 0.32px;
    text-align: center;
    color: #fff;
  }
`;

export const SectionFromSellDiscountPrice = styled.div`
  color: #777777;
  font-family: 'BebasNeue-Regular';
  font-size: 20px;

  > span:first-child {
    position: relative;
    text-align: center;
  }

  > span:first-child:before {
    border-top: 1px solid #777;
    content: '';
    width: 100%;
    position: absolute;
    top: 50%;
  }
`;

export const SectionFromSellPrice = styled.div`
  height: 100%;
  margin-bottom: 20px;
  text-align: right;

  > span:first-child {
    font-family: 'BebasNeue-Bold';
    font-size: 44px;
  }

  > span:last-child {
    font-size: 20px;
    font-weight: 500;
  }
`;

/**
 * LuckyDraw Card Section Form - Notify
 */
export const SectionNotify = styled.div`
  color: #777777;
  font-family: 'Roboto';
  font-size: 13px;
  height: 67px;
  margin-top: 40px;
  text-align: left;

  > div {
    margin-bottom: 8px;
  }
  > div:last-child {
    margin-bottom: 0;
  }
`;

export const SectionNotifyItem = styled.div`
  > span:nth-child(2) {
    border-right: 1px solid #cccccc;
    color: #cccccc;
    display: inline-block;
    margin-left: 10px;
    margin-right: 10px;
    height: 10px;
  }
`;

export const WrapperDivder = styled.hr`
  border: 0.5px solid #eeeeee;
  margin-top: 70px;
`;
