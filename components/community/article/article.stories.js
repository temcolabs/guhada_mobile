import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import withMobxDeco from '.storybook/decorators/withMobxDeco';
import {
  withKnobs,
  text,
  boolean,
  number,
  color,
  select,
} from '@storybook/addon-knobs';
import ArticleTitle from './ArticleTitle';
import ArticleLikeButton from './ArticleLikeButton';
import ArticleBookmarkButton from './ArticleBookmarkButton';
import ArticleMoreButton from './ArticleMoreButton';
import ArticleShareButton from './ArticleShareButton';
import ArticlePreviewModal from './ArticlePreviewModal';
import ArticleImages from './ArticleImages';
import withCenteredDeco from '.storybook/decorators/withCenteredDeco';

const stories = storiesOf('community/article', module);

// Add the `withKnobs` decorator to add knobs support to your stories.
// You can also configure `withKnobs` as a global decorator.
stories.addDecorator(withKnobs);
stories.addDecorator(
  withMobxDeco({
    bbs: {
      article: {
        data: {
          id: 282423,
          categoryId: 6,
          categoryFilterId: null,
          imageUrl:
            'https://d3ikprf0m31yc7.cloudfront.net/images/community/bbs/54490aebc2e040d28a5a9bb2556d14f9',
          title: 'androidapp photo regi',
          contents: 'teazcgg',
          use: true,
          delete: false,
          deletedAt: null,
          deletedTimestamp: null,
          like: false,
          bookmark: true,
          commentCount: 0,
          hitCount: 4,
          likeCount: 0,
          brandId: null,
          brandName: '',
          dealId: null,
          dealName: '',
          dspCreatedAt: '2019년 10월 23일',
          createdTimestamp: 1571801581000,
          currentTimestamp: 1571888013000,
          userId: 356,
          createUserInfo: {
            id: 356,
            email: 'seoyoung.jeong@temco.io',
            name: '정서영',
            userType: 'NORMAL',
            emailVerify: true,
            nickname: '닉네임입니😀😀',
            mobile: '01093036421',
            profileImageUrl:
              'https://s3-ap-northeast-1.amazonaws.com/poc.online-luxury-market/images/users/normal/profile/KakaoTalk_Photo_2019-05-24-14-50-02.jpeg',
          },
          guhadaClientPlatform: 'MOBILE',
          bbsImageList: [
            {
              id: 227,
              bbsId: 282423,
              url:
                'https://d3ikprf0m31yc7.cloudfront.net/images/community/bbs/54490aebc2e040d28a5a9bb2556d14f9',
              priority: 1,
              width: 5312,
              height: 2988,
              fileName: '20191023_123052_HDR.jpg',
              fileType: 'image/*',
              fileSize: 5135986,
              createdAt: [2019, 10, 23, 3, 33, 1],
              createdTimestamp: 1571801581000,
            },
            {
              id: 228,
              bbsId: 282423,
              url:
                'https://d3ikprf0m31yc7.cloudfront.net/images/community/bbs/a22153c16c5845349754a78d5e3a6fa4',
              priority: 2,
              width: 5312,
              height: 2988,
              fileName: '20191023_123039.jpg',
              fileType: 'image/*',
              fileSize: 5877975,
              createdAt: [2019, 10, 23, 3, 33, 1],
              createdTimestamp: 1571801581000,
            },
          ],
        },
      },
    },
  })
);
stories.addDecorator(withCenteredDeco);

stories.add('ArticleTitle', () => {
  return (
    <ArticleTitle userName="username" title={'ArticleTitle 제목입니다만?'} />
  );
});

stories.add('ArticleImages', () => {
  return <ArticleImages />;
});

stories.add('ArticleLikeButton', () => {
  return (
    <ArticleLikeButton
      onClick={action('onClick')}
      isLikedByMe={boolean('isLikedByMe', true)}
      likeCount={number('likeCount', 10)}
    />
  );
});

stories.add('ArticleBookmarkButton', () => {
  return (
    <ArticleBookmarkButton
      isBookmarkedByMe={boolean('isBookmarkedByMe', true)}
    />
  );
});

stories.add('ArticleMoreButton', () => {
  return <ArticleMoreButton onChangeOption={action('onChangeOption')} />;
});

stories.add('ArticleShareButton', () => {
  return <ArticleShareButton />;
});

stories.add('ArticlePreviewModal', () => {
  return (
    <ArticlePreviewModal
      isOpen={boolean('isOpen', true)}
      title={'title'}
      categoryFilterName={'filtername'}
      commentCount={'123'}
      hitCount={'1234'}
      likeCount={'1234'}
      createdTimestamp={+new Date()}
      userName={'asdasd'}
      contents={`
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque accusantium provident qui tenetur adipisci quaerat veniam sequi debitis ea? Veritatis commodi earum explicabo animi a quo voluptate libero, deserunt nemo unde ducimus vel reiciendis! Earum eum ipsam voluptatem est numquam repellat architecto. Ad qui omnis, accusamus voluptates modi eius ut animi alias tempore nam reiciendis voluptatem blanditiis rerum nobis hic dolore odio quo corrupti in aut ducimus dolor atque, deleniti laudantium? Dolor molestiae cupiditate nisi eveniet voluptates earum voluptas totam error vero nostrum, quod impedit commodi quos sunt deserunt modi, nemo incidunt perferendis! Vitae, sunt. Est, sapiente! Quo, magni? Explicabo deleniti voluptas, necessitatibus ex dignissimos aliquam aspernatur cupiditate at nostrum illum aut sequi porro sed quam soluta, molestias quidem corporis ad animi nesciunt eaque modi? Modi sunt at laborum possimus iste, sapiente in tempora, doloremque cupiditate qui natus, consequuntur id quas corrupti quibusdam delectus beatae autem! Voluptate minus eaque, tenetur qui quaerat molestias expedita. Ex nostrum perspiciatis iure id quas quos rem natus quod nisi corporis hic excepturi officiis mollitia repudiandae ad consequuntur architecto temporibus repellat, consectetur possimus itaque tempora? Totam corporis vel fugiat eos voluptates necessitatibus iure, fugit obcaecati! Corrupti, totam in. Voluptatem optio veritatis beatae, expedita nesciunt dolor.</p>
        <p>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quidem totam, obcaecati commodi quis dolore velit nulla quo, nemo repellat sequi nesciunt saepe! Assumenda nihil quibusdam possimus modi ipsa velit delectus? Consectetur natus numquam suscipit eligendi sunt, nobis facilis deserunt sint perspiciatis commodi perferendis eos ab culpa, odit at neque unde. Quaerat eveniet, obcaecati soluta, voluptas explicabo natus, dolores officia eligendi totam delectus ad ratione sit sapiente deserunt earum et quos fuga quibusdam unde molestias? Ipsa officia amet ullam quod ut quas debitis perferendis non ipsum ratione, quaerat ipsam id nisi alias beatae repellendus! Quam velit veritatis inventore quos recusandae pariatur ipsum iste eligendi, dolorum maiores porro nulla consectetur error itaque, quae a iure omnis quisquam facilis, perspiciatis sit! Hic assumenda illo quia laudantium, magni facere odio soluta? Ut totam, necessitatibus nemo minus illum placeat debitis deleniti nihil, explicabo fugiat ullam, tenetur et deserunt nam. Quisquam incidunt totam culpa eligendi unde, blanditiis ex ratione mollitia dolor harum suscipit maxime, ad repellendus distinctio doloremque similique neque omnis ab architecto, eum sed perspiciatis quaerat. Adipisci necessitatibus dolorum nihil? Ullam omnis repellat nostrum voluptates veritatis unde quisquam architecto soluta? Et, laborum. Reprehenderit maxime est amet placeat at, et fuga voluptatibus, quae, pariatur sed rerum?</p>

        `}
    />
  );
});
