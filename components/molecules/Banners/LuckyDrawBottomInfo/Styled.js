import styled from 'styled-components';

export const LuckyDrawTopBannerSection = styled.div`
  height: 865px;
  padding-top: 80px;
  padding-bottom: 70px;
  text-align: center;
`;

export const LuckyDrawInfoBanner = styled.div`
  background-image: url('/static/images/luckydraw/bottom_info/luckydraw_info/luckydraw_info.png');
  background-position: center;
  background-repeat: no-repeat;
  height: 239px;
  max-width: 100%;
  margin: 0 15px;
  margin-bottom: 60px;
`;

export const LuckyDrawAttendBanner = styled.div`
  background-image: url('/static/images/luckydraw/bottom_info/attend_info/attend_info.png');
  background-position: center;
  background-repeat: no-repeat;
  height: 253px;
  max-width: 100%;
  margin-bottom: 60px;
`;

export const LuckyDrawWarnInfo = styled.div`
  color: #999999;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 14px;
  height: 37px;
  line-height: 0.79;
  margin-top: 20px;
  cursor: pointer;
`;
