import React from 'react';
import css from './MypageMenubar.module.scss';
import mypageRouteObj from 'routes/mypageRouteObj';
import MenubarSection from './MenubarSection';

const MENUBAR_SECTIONS = [
  {
    links: [
      {
        targetPaths: [mypageRouteObj['/mypage/OrderCompleteList']?.asPath],
        asPath: mypageRouteObj['/mypage/OrderCompleteList']?.asPath,
        text: '주문배송',
      },
    ],
  },
  {
    links: [
      {
        targetPaths: [
          mypageRouteObj['/mypage/OrderClaimList']?.asPath,
          mypageRouteObj['/mypage/OrderClaimDetail']?.asPath,
          mypageRouteObj['/mypage/OrderCancelForm']?.asPath,
          mypageRouteObj['/mypage/OrderCancelDone']?.asPath,
          mypageRouteObj['/mypage/OrderExchangeForm']?.asPath,
          mypageRouteObj['/mypage/OrderExchangeDone']?.asPath,
          mypageRouteObj['`/mypage/OrderReturnForm']?.asPath,
          mypageRouteObj['/mypage/OrderReturnDone']?.asPath,
        ],
        asPath: mypageRouteObj['/mypage/OrderClaimList']?.asPath,
        text: '취소 · 교환 · 반품',
      },
    ],
  },
  {
    links: [
      {
        targetPaths: [
          mypageRouteObj['/mypage/PointHistory']?.asPath,
          mypageRouteObj['/mypage/PointChargeHistory']?.asPath,
        ],
        asPath: mypageRouteObj['/mypage/PointHistory']?.asPath,
        text: '포인트',
      },
    ],
  },
  {
    links: [
      {
        targetPaths: [mypageRouteObj['/mypage/ProductReview']?.asPath],
        asPath: mypageRouteObj['/mypage/ProductReview']?.asPath,
        text: '리뷰',
      },
    ],
  },
  // {
  //   links: [
  //     {
  //       targetPaths: [
  //         mypageRouteObj['/mypage/CouponList']?.asPath,
  //         mypageRouteObj['/mypage/CouponEvents']?.asPath,
  //       ],
  //       asPath: mypageRouteObj['/mypage/CouponList']?.asPath,
  //       text: '쿠폰',
  //     },
  //   ],
  // },
  // {
  //   links: [
  //     {
  //       targetPaths: [mypageRouteObj['/mypage/Token']?.asPath],
  //       asPath: mypageRouteObj['/mypage/Token']?.asPath,
  //       text: '토큰',
  //     },
  //   ]
  // },
  // {
  //   links: [
  //     {
  //       targetPaths: [mypageRouteObj['/mypage/FollowStore']?.asPath],
  //       asPath: mypageRouteObj['/mypage/FollowStore']?.asPath,
  //       text: '팔로우한 스토어',
  //     },
  //   ],
  // },
  // {
  //   links: [
  //     {
  //       targetPaths: [mypageRouteObj['/mypage/ProductLikeList']?.asPath],
  //       asPath: mypageRouteObj['/mypage/ProductLikeList']?.asPath,
  //       text: '찜한 상품',
  //     },
  //   ],
  // },
  // {
  //   links: [
  //     {
  //       targetPaths: [mypageRouteObj['/mypage/RecentlySeenList']?.asPath],
  //       asPath: mypageRouteObj['/mypage/RecentlySeenList']?.asPath,
  //       text: '최근 본 상품',
  //     },
  //   ],
  // },
  // {
  //   links: [
  //      {
  //       targetPaths: [mypageRouteObj['북마크한 게시글']?.asPath],
  //       asPath: mypageRouteObj['북마크한 게시글']?.asPath,
  //       text: '북마크한 게시글',
  //     },
  //   ]
  // },
  // {
  //   links: [
  //     {
  //       targetPaths: [mypageRouteObj['좋아요한 게시글']?.asPath],
  //       asPath: mypageRouteObj['좋아요한 게시글']?.asPath,
  //       text: '좋아요한 게시글',
  //     },
  //   ]
  // },
  // {
  //   links: [
  //     {
  //       targetPaths: [mypageRouteObj['좋아요한 댓글']?.asPath],
  //       asPath: mypageRouteObj['좋아요한 댓글']?.asPath,
  //       text: '좋아요한 댓글',
  //     },
  //   ]
  // },

  {
    links: [
      {
        targetPaths: [mypageRouteObj['/mypage/ClaimPageMain']?.asPath],
        asPath: mypageRouteObj['/mypage/ClaimPageMain']?.asPath,
        text: '문의',
      },
    ],
  },
  // {
  //   links: [
  //     {
  //       targetPaths: [mypageRouteObj['커뮤니티 게시글']?.asPath],
  //       asPath: mypageRouteObj['커뮤니티 게시글']?.asPath,
  //       text: '커뮤니티 게시글',
  //     },
  //   ]
  // },
  // {
  //   links: [
  //     {
  //       targetPaths: [mypageRouteObj['커뮤니티 댓글']?.asPath],
  //       asPath: mypageRouteObj['커뮤니티 댓글']?.asPath,
  //       text: '커뮤니티 댓글',
  //     },
  //   ]
  // },
  // * 채팅 메뉴 빠지기로 결정됨
  // {
  //   links: [
  //     {
  //       targetPaths: [mypageRouteObj['/mypage/Chatting']?.asPath],
  //       asPath: mypageRouteObj['/mypage/Chatting']?.asPath,
  //       text: '채팅',
  //     },
  //   ]
  // },
  {
    links: [
      {
        targetPaths: [mypageRouteObj['/mypage/AddressManagement']?.asPath],
        asPath: mypageRouteObj['/mypage/AddressManagement']?.asPath,
        text: '배송지',
      },
    ],
  },
  // * 회원 등급 메뉴는 빠지기로 결정됨
  // {
  //   links: [
  //      {
  //       targetPaths: [mypageRouteObj['/mypage/Membership']?.asPath],
  //       asPath: mypageRouteObj['/mypage/Membership']?.asPath,
  //       text: '회원 등급',
  //     },
  //   ]
  // },
  // {
  //   links: [
  //     {
  //       targetPaths: [mypageRouteObj['/mypage/UserInfomation']?.asPath],
  //       asPath: mypageRouteObj['/mypage/UserInfomation']?.asPath,
  //       text: '회원정보 수정',
  //     },
  //   ],
  // },
];

function MypageMenubar({ userInfo = {}, pathname = '/', router = {} }) {
  // TODO: collapsed 데이터를 세션 스토리지에 저장해서 초기화시 반영한다
  const menubarSections = MENUBAR_SECTIONS.slice();

  return (
    <nav className={css.wrap}>
      {menubarSections.map((section, index) => {
        return (
          <MenubarSection
            key={index}
            index={index}
            links={section.links.map(link => {
              // 링크가 하이라이팅 시킬 경로와 매칭되는지 확인
              return link.targetPaths.includes(window.location.pathname)
                ? Object.assign({}, link, { isSelected: true })
                : link;
            })}
          />
        );
      })}
    </nav>
  );
}

export default MypageMenubar;
