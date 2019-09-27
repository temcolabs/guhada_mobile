import React, { Component } from 'react';
import Axios from 'axios';
import { loadScript } from 'lib/dom';

export class SellerStoreMap extends Component {
  componentDidMount() {
    let { address } = this.props;
    /**
     * 카카오맵
     */
    loadScript(
      '//dapi.kakao.com/v2/maps/sdk.js?appkey=50cd818cd563ebaf53f775134f327806&autoload=false&libraries=services,clusterer,drawing',
      {
        onLoad: () => {
          window.kakao.maps.load(() => {
            let el = document.getElementById('storeMap');
            let map = new kakao.maps.Map(el, {
              center: new kakao.maps.LatLng(33.450701, 126.570667),
              level: 3,
            });

            let getcoder = new kakao.maps.services.Geocoder();
            getcoder.addressSearch(address, function(result, status) {
              if (status === kakao.maps.services.Status.OK) {
                var coords = new kakao.maps.LatLng(result[0].y, result[0].x);

                var imageSrc = '/static/icon/seller_icon_locationpin.png', // 마커이미지의 주소입니다
                  imageSize = new kakao.maps.Size(32, 48), // 마커이미지의 크기입니다
                  imageOption = { offset: new kakao.maps.Point(27, 69) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

                // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
                var markerImage = new kakao.maps.MarkerImage(
                  imageSrc,
                  imageSize,
                  imageOption
                );

                // 결과값으로 받은 위치를 마커로 표시합니다
                var marker = new kakao.maps.Marker({
                  map: map,
                  position: coords,
                  image: markerImage,
                });

                marker.setMap(map);
                // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
                map.setCenter(coords);
              }
            });
          });
        },
      }
    );
  }

  render() {
    return <div id="storeMap" style={{ width: '100%', height: '100%' }} />;
  }
}

export default SellerStoreMap;
