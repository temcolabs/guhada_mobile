import SlideUpOptions from '../form/SlideUpOptions';
import css from './BrandSearch.module.scss';
import TextInput from '../form/TextInput';

/**
 * 글쓰기 화면에서 게시판 선택
 */
const BrandSearch = ({
  onChangeBrandName = (name) => {}, // 브랜드 변경
  initialBrandName = null,
}) => {
  return (
    <SlideUpOptions
      renderButton={() => {
        return (
          <div className={css.wrap}>
            <TextInput
              placeholder="브랜드명을 입력해주세요."
              onChange={onChangeBrandName}
              initialValue={initialBrandName}
            />
          </div>
        );
      }}
      options={[]}
      slideWrapperStyle={{
        padding: '22px 30px 22px',
      }}
      optionStyle={{
        borderTop: 'none',
        padding: '7px 0 7px',
        color: '#111111',
        height: 'initial',
      }}
      topPosOnEnter="49px"
      topPosOnExit="49px"
    />
  );
};

export default BrandSearch;
