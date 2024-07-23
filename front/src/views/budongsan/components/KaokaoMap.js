import React, { useState, useEffect } from 'react';
import apartImg from '../../../imges/apartImg.png'; // 이미지를 import합니다

function KakaoMap() {
    const [data, setData] = useState(null); // 상태로 데이터 저장


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/budongsanMapData');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const jsonData = await response.json();
                setData(jsonData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    
        fetchData();
    }, []);
    

    useEffect(() => {
        // 카카오맵 API가 로드된 후 실행될 콜백 함수
        const initMap = () => {
            const mapContainer = document.getElementById('map'); // 지도를 표시할 div 
            const mapOption = { 
                center: new window.kakao.maps.LatLng(37.5528112179, 126.93794821), // 지도의 중심좌표
                level: 7 // 지도의 확대 레벨
            };

            // 지도를 생성합니다
            const map = new window.kakao.maps.Map(mapContainer, mapOption);
            

            // 주소-좌표 변환 객체를 생성합니다
            const geocoder = new window.kakao.maps.services.Geocoder();
                        
            // 장소 검색 객체를 생성합니다
            const ps = new window.kakao.maps.services.Places();
            

            window.kakao.maps.event.addListener(map, "zoom_changed", function() {
                updateMarkers();
            });

            const markers = []; // 모든 마커를 저장하는 배열

            // 모든 주소를 한 번에 처리하는 함수
            const geocodeAddresses = (addresses) => {
                addresses.forEach((address, index) => {
                    geocoder.addressSearch(address, function(result, status) {
                        if (status === window.kakao.maps.services.Status.OK) {
                            const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);

                            const imageSize = new window.kakao.maps.Size(24, 35); // 마커 이미지의 크기
                            const imageOption = { offset: new window.kakao.maps.Point(12, 35) }; // 마커 이미지의 옵션

                            // 마커 이미지를 생성합니다
                            const markerImage = new window.kakao.maps.MarkerImage(apartImg, imageSize, imageOption);

                            const marker = new window.kakao.maps.Marker({
                                position: coords,
                                image: markerImage // 마커 이미지 설정
                            });

                            // 마커 클릭 시 인포윈도우로 정보 표시
                            const infowindow = new window.kakao.maps.InfoWindow({
                                content: `<div style="width:150px;text-align:center;padding:6px 0;">${address}</div>`
                            });

                            // 마커에 마우스오버 이벤트를 등록
                            window.kakao.maps.event.addListener(marker, 'mouseover', function() {
                                infowindow.open(map, marker);
                            });

                            // 마커에 마우스아웃 이벤트를 등록
                            window.kakao.maps.event.addListener(marker, 'mouseout', function() {
                                infowindow.close();
                            });

                            markers.push(marker);
                        }
                    });
                });

                // 2초 딜레이 후 마커를 지도에 추가
                setTimeout(() => {
                    updateMarkers(); // 초기 마커 업데이트 호출
                }, 1000);
            };

            const updateMarkers = () => {
                const bounds = map.getBounds();
                const level = map.getLevel();
                markers.forEach(marker => {
                    if (bounds.contain(marker.getPosition()) && level <= 7) {
                        marker.setMap(map); // 마커를 지도에 표시
                    } else {
                        marker.setMap(null); // 마커를 지도에서 제거
                    }
                });
            };

            // 데이터가 유효할 때 모든 주소를 한꺼번에 처리
            if (data) {
                const addresses = data.map(item => item.address);
                geocodeAddresses(addresses);
            }

            // 지도의 범위가 변경될 때 마커를 업데이트
            window.kakao.maps.event.addListener(map, 'bounds_changed', updateMarkers);
        };

        // 지도 초기화 함수 호출
        initMap();
    }, [data]); // data 상태가 변경될 때마다 실행

    return (
        <div className='containerMap parentContainer'>
            <div id="map"></div>
        </div>
    );
}

export default KakaoMap;
