import { useState } from 'react';
import css from './Footer.module.scss';
import openPopupCenter from 'childs/lib/common/openPopupCenter';
import dynamic from 'next/dynamic';
import { LoadingSpinner } from 'components/common/loading/Loading';

/**
 * Lazy UserClaimModal
 */
const DynamicUserClaimModal = dynamic(
  () => import('components/claim/userclaim/UserClaimModal'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

export default function Footer() {
  const [userClaimModalOpen, setUserClaimModalOpen] = useState(false);

  return (
    <div className={css.wrap}>
      <div className={css.footerWrap}>
        <div className={css.tabSection}>
          <div className={css.tabItem}>
            <a href="mailto:help@mail.guhada.com">입점/제휴문의</a>
          </div>
          <div
            className={css.tabItem}
            onClick={() =>
              openPopupCenter(
                `${process.env.HOSTNAME}/terms/privacy`,
                'privacy',
                500,
                550
              )
            }
          >
            개인정보처리방침
          </div>

          <div
            className={css.tabItem}
            onClick={() => setUserClaimModalOpen(true)}
          >
            문의하기
          </div>

          <div
            className={css.tabItem}
            onClick={() =>
              openPopupCenter(
                `${process.env.HOSTNAME}/terms/purchase`,
                'privacy',
                500,
                550
              )
            }
          >
            이용약관
          </div>
        </div>
        <div className={css.contentsWrap}>
          <div className={css.snsWrap}>
            <ul>
              <li>
                <a
                  href="https://www.instagram.com/official.guhada/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="/static/icon/sns-insta.png" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/guhada.official"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="/static/icon/sns-fb.png" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/channel/UCFTpZVfGP02a6s-jWfxAoTQ/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="/static/icon/sns-youtube.png" />
                </a>
              </li>
              <li>
                <a
                  href="https://blog.naver.com/guhada401"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="/static/icon/sns-blog.png" />
                </a>
              </li>
            </ul>
          </div>
          <div className={css.storeItem}>
            <span className={css.csCenterTitle}>고객센터 : </span>
            <span style={{ color: '#5d2ed1' }}>1522-9839</span>
            <br />
            상담가능시간 : 오전 10시 ~ 오후6시 토요일 공휴일 휴무
            <br />
            <span>
              E-mail :{' '}
              <a href="mailto:help@mail.guhada.com">help@mail.guhada.com</a>
            </span>
          </div>
          <div className={css.guhadaItem}>
            (주)구하다 <br />
            대표이사 : 윤재섭 ㅣ 개인정보보호책임자 :{' '}
            <a href="mailto:daehoon.choi@temco.io">{`최대훈`}</a> <br />
            사업자등록번호: 876-86-01259 <br />
            주소 : 서울특별시 영등포구 의사당대로 83 오투타워 <br />
            통신판매업자신고 : 2020-서울영등포-3486호{' '}
            <a
              href="http://ftc.go.kr/bizCommPop.do?wrkr_no=8768601259"
              target="_blank"
              rel="noopener noreferrer"
            >
              사업자정보확인
            </a>{' '}
            <br />
          </div>
          <div style={{ marginBottom: 24 }}>
            고객님은 안전거래를 위해 결제 시 저희 사이트에서 가입한 구매안전
            서비스 (채무지급보증)을 이용하실 수 있습니다.{' '}
            <a
              onClick={() =>
                openPopupCenter(
                  `${process.env.HOSTNAME}/terms/guarantee`,
                  'guarantee',
                  500,
                  550
                )
              }
            >
              채무 보증확인
            </a>
          </div>
          <div>
            COPYRIGHT <span style={{ fontFamily: 'sans-serif' }}>Ⓒ</span> 2019
            GUHADA ALL RIGHTS RESERVED
          </div>
        </div>
      </div>

      {/* Footer - 문의하기 - UserClaimModal */}
      {userClaimModalOpen && (
        <DynamicUserClaimModal setUserClaimModalOpen={setUserClaimModalOpen} />
      )}
    </div>
  );
}
