import loadScript from 'childs/lib/dom/loadScript';

/**
 * 다음 주소검색 모달 열기
 *
 * <script
    id="daumPostcode"
    src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js?autoload=false"
   />

 * @param {} onComplete 주소 검색 데이터 객체를 파라미터로 넘겨준다. 샘플 데이터는 아래 참조
 */
export default function openDaumAddressSearch({ onComplete = () => {} }) {
  loadScript(
    'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js',
    {
      id: 'daumPostcode',
      onLoad: () => {
        daum.postcode.load(() => {
          new daum.Postcode({
            oncomplete: (
              data = {
                // 셈플 데이터
                address: '부산 사상구 낙동대로1234번길 3', // * 선택한 주소
                jibunAddress: '부산 사상구 삼락동 416-20', // * 지번
                roadAddress: '부산 사상구 낙동대로1234번길 3', // * 도로명
                zonecode: '46912', // * 우편번호
                addressEnglish:
                  '3, Nakdong-daero 1234beon-gil, Sasang-gu, Busan, Korea',
                addressType: 'R',
                apartment: 'N',
                autoJibunAddress: '',
                autoJibunAddressEnglish: '',
                autoRoadAddress: '',
                autoRoadAddressEnglish: '',
                bcode: '2653010100',
                bname: '삼락동',
                bname1: '',
                bname2: '삼락동',
                buildingCode: '2653010100104160020015443',
                buildingName: '',
                hname: '',
                jibunAddressEnglish:
                  '416-20, Samnak-dong, Sasang-gu, Busan, Korea',
                noSelected: 'N',
                postcode: '617-827', // 구 우편번호
                postcode1: '617',
                postcode2: '827',
                postcodeSeq: '001',
                query: '부산광역시 사상구 낙동대로1234번길 ',
                roadAddressEnglish:
                  '3, Nakdong-daero 1234beon-gil, Sasang-gu, Busan, Korea',
                roadname: '낙동대로1234번길',
                roadnameCode: '4217058',
                sido: '부산',
                sigungu: '사상구',
                sigunguCode: '26530',
                userLanguageType: 'K',
                userSelectedType: 'J',
              }
            ) => {
              // 주소 선택 콜백
              onComplete(data);
            },
          }).open();
        });
      },
    }
  );
}
