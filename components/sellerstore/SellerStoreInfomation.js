import css from './SellerStoreInfomation.module.scss';
import SellerStoreMap from './SellerStoreMap';
import _ from 'lodash';

export default function SellerStoreInfomation({ sellerStore }) {
  const sellerInfo = [
    { label: '상호명', key: 'companyName' },
    { label: '대표자', key: 'representativeName' },
    { label: '사업자등록번호', key: 'companyRegistrationNumber' },
    { label: '통신판매업번호', key: 'mailorderRegistrationNumber' },
    { label: '사업장소재지', key: 'offlineStoreAddress' },
  ];
  let renderTable = [];
  sellerInfo.map((info) => {
    if (
      _.isNil(sellerStore[info.key]) !== true &&
      sellerStore[info.key] !== ''
    ) {
      renderTable.push({ label: info.label, value: sellerStore[info.key] });
    }
    return renderTable;
  });

  return (
    <div className={css.wrap}>
      {_.isNil(sellerStore.storeIntroductionDetail) === false && (
        <div
          className={css.detailWrap}
          dangerouslySetInnerHTML={{
            __html: sellerStore.storeIntroductionDetail,
          }}
        />
      )}

      <div className={css.sellerInfo}>
        <div className={css.infoHeader}>셀러정보</div>
        <table>
          <tbody>
            {renderTable.map((item, i) => {
              return (
                <tr key={i}>
                  <td className={css.tableHeader}>{item.label}</td>
                  <td className={css.tableValue}>
                    {_.isNil(sellerStore.offlineStoreAddress.trim()) ||
                    sellerStore.offlineStoreAddress.trim() === 'null'
                      ? ''
                      : item.value}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {_.isNil(sellerStore.offlineStoreAddress.trim()) ||
      sellerStore.offlineStoreAddress.trim() === 'null' ? null : (
        <div className={css.storeInfoWrap}>
          <div className={css.infoHeader}>오프라인 스토어</div>
          <div className={css.map}>
            <SellerStoreMap address={sellerStore.offlineStoreAddressForMap} />
          </div>
          <div className={css.infoStoreAddress}>
            {sellerStore.offlineStoreAddress || ''}
          </div>
          {_.isNil(sellerStore.businessHours) === false && (
            <div className={css.infoStoreTime}>{sellerStore.businessHours}</div>
          )}
        </div>
      )}
    </div>
  );
}
