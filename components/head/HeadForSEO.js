import Head from 'next/head';
import seo from '../../lib/constant/seo';

/**
 * 검색엔진 최적화를 위한 헤더
 * page 폴더에 있는 컴포넌트에 모두 추가해줘야 한다.
 *
 * * full url은 req 객체에서 가져오기 때문에 document.js에서 일괄적으로 추가하고 있다.
 * @param {*} param0
 */
const HeadForSEO = ({
  pageName, // * 페이지 이름. 뒤에 ":: 구하다" 를 붙여준다
  title = seo.TITLE, // pageName이 없을 때 사용할 페이지 타이틀
  description = seo.DESCRIPTION, // * 페이지 설명
  image = seo.MAIN_IMAGE, // * 페이지 대표 이미지
  fullUrl, // window.location.href
  children, // 별도로 추가 태그
}) => {
  const titleText = pageName ? `${pageName} :: 구하다` : title;

  return (
    <Head>
      <title key="title">{titleText}</title>
      <meta key="meta-description" name="description" content={description} />
      <meta key="meta-author" name="author" content={seo.AUTHOR} />
      <meta key="meta-title" name="title" content={titleText} />

      <meta key="itemprop-name" itemProp="name" content={titleText} />
      <meta
        key="itemprop-description"
        itemProp="description"
        content={description}
      />
      <meta key="itemprop-image" itemProp="image" content={image} />

      {/* 쿼리스트링에 따라 다른 페이지가 표시되므로 현재 페이지의 full URL을 넣어준다 */}
      {fullUrl && <link key="canonical" rel="canonical" href={fullUrl} />}

      {/* google search console */}
      <meta
        name="google-site-verification"
        content={seo.GOOGLE_SITE_VERIFICATION}
      />
      {/* naver 웹마스터 도구 */}
      <meta
        name="naver-site-verification"
        content={seo.NAVER_SITE_VERIFICATION}
      />

      {/* 페이스북 앱 아이디 */}
      {!!seo.FB_APP_ID && <meta property="fb:app_id" content={seo.FB_APP_ID} />}

      {/* opengraph Meta Tags */}
      {fullUrl && <meta key="og:url" property="og:url" content={fullUrl} />}
      <meta key="og:type" property="og:type" content="website" />
      <meta key="og:title" property="og:title" content={titleText} />
      <meta key="og:image" property="og:image" content={image} />
      <meta
        key="og:description"
        property="og:description"
        content={description}
      />
      <meta key="og:site_name" property="og:site_name" content={seo.APP_NAME} />
      <meta key="og:locale" property="og:locale" content="ko_KR" />

      {/* Twitter Meta Tags */}
      <meta key="twitter:card" name="twitter:card" content={image} />
      <meta key="twitter:title" name="twitter:title" content={titleText} />
      <meta
        key="twitter:description"
        name="twitter:description"
        content={description}
      />
      <meta key="twitter:image" name="twitter:image" content={image} />

      {/* 페이지에서 사용할 헤더 추가 */}
      {children}
    </Head>
  );
};

export default HeadForSEO;
