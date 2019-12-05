import React from 'react';
import styled from 'styled-components';

const Wrap = styled.div`
  width: 100%;
  margin-top: 60px;
  padding: 22px 62px;
  background: url('/static/icon/mypage/icon-notimark-purple@3x.png') no-repeat
    30px center;
  background-size: 24px;
  background-color: #f9f9fa;
  color: #777;
`;

export default function NoInvoiceWarning() {
  return <Wrap>송장번호 미입력시 교환 처리가 늦어질 수 있습니다.</Wrap>;
}
