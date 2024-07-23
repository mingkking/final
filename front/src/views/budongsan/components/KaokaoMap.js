import React, { useState, useEffect, useRef } from 'react';
import apartImg from '../../../imges/apartImg.png'; // 이미지 import

function KakaoMap({ selectedProperty }) {
    const [data, setData] = useState(null); // 데이터 상태를 저장하는 훅
    const markersRef = useRef([]); // 마커를 저장할 Ref
    const mapRef = useRef(null); // 지도를 저장할 Ref
    const clustererRef = useRef(null); // 클러스터러를 저장할 Ref

    

    // 컴포넌트가 처음 렌더링될 때 데이터 fetch
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/budongsanMapData');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const jsonData = await response.json();
                setData(jsonData); // 데이터를 상태에 저장
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []); // 빈 배열을 의존성으로 넣어 한 번만 실행

    // 지도를 초기화하고 마커를 추가하는 효과
    useEffect(() => {
        const initMap = () => {
            const mapContainer = document.getElementById('map'); // 지도를 표시할 HTML 요소
            const mapOption = {
                center: new window.kakao.maps.LatLng(37.5528112179, 126.93794821), // 초기 중심 좌표
                level: 7 // 초기 확대 레벨
            };

            const map = new window.kakao.maps.Map(mapContainer, mapOption);
            mapRef.current = map; // 지도를 Ref에 저장

            const geocoder = new window.kakao.maps.services.Geocoder(); // 주소를 좌표로 변환하는 서비스
            const clusterer = new window.kakao.maps.MarkerClusterer({
                map: map,
                averageCenter: true,
                minLevel: 10
            });
            clustererRef.current = clusterer; // 클러스터러를 Ref에 저장
            

            
            // 주소들을 좌표로 변환하고 마커를 추가하는 함수
            const geocodeAddresses = (addresses) => {
                addresses.forEach((address) => {
                    geocoder.addressSearch(address, function (result, status) {
                        if (status === window.kakao.maps.services.Status.OK) {
                            const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
                            const imageSize = new window.kakao.maps.Size(24, 35);
                            const imageOption = { offset: new window.kakao.maps.Point(12, 35) };
                            const markerImage = new window.kakao.maps.MarkerImage(apartImg, imageSize, imageOption);

                            const marker = new window.kakao.maps.Marker({
                                position: coords,
                                image: markerImage
                            });

                            const infowindow = new window.kakao.maps.InfoWindow({
                                content: `<div style="width:150px;text-align:center;padding:6px 0; ">${address}</div>`
                            });

                            window.kakao.maps.event.addListener(marker, 'mouseover', function () {
                                infowindow.open(map, marker);
                            });

                            window.kakao.maps.event.addListener(marker, 'mouseout', function () {
                                infowindow.close();
                            });

                            markersRef.current.push(marker); // 마커를 Ref에 추가
                            clusterer.addMarker(marker); // 클러스터러에 마커 추가
                        }
                    });
                });
            };

            // 데이터가 있을 경우 주소를 좌표로 변환하여 마커 추가
            if (data) {
                const addresses = data.map(item => item.address);
                geocodeAddresses(addresses);
            }

            // 지도의 경계나 확대 레벨에 따라 마커를 업데이트하는 함수
            const updateMarkers = () => {
                const bounds = map.getBounds();
                const level = map.getLevel();
                markersRef.current.forEach(marker => {
                    if (bounds.contain(marker.getPosition()) && level <= 7) {
                        marker.setMap(map);
                    } else {
                        marker.setMap(null);
                    }
                });
            };

            // 지도 경계가 변경될 때와 확대 레벨이 변경될 때 마커를 업데이트
            window.kakao.maps.event.addListener(map, 'bounds_changed', updateMarkers);
            window.kakao.maps.event.addListener(map, 'zoom_changed', updateMarkers);
        };

        initMap(); // 지도를 초기화하는 함수 호출
    }, [data]); // data가 변경될 때마다 실행

    // 선택된 매물에 따라 지도를 업데이트하는 효과
    useEffect(() => {
        if (selectedProperty) {
            // 클러스터러에서 기존 마커 제거
            clustererRef.current.clear(); 
            // 기존 마커 제거
            markersRef.current.forEach(marker => marker.setMap(null));
            markersRef.current = []; // Ref의 마커 배열 초기화

            const map = mapRef.current;
            const geocoder = new window.kakao.maps.services.Geocoder();

            // 선택된 매물의 주소를 좌표로 변환하고 새로운 마커를 추가
            geocoder.addressSearch(selectedProperty.address, function (result, status) {
                if (status === window.kakao.maps.services.Status.OK) {
                    const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
                    const markerImage = new window.kakao.maps.MarkerImage(apartImg, new window.kakao.maps.Size(24, 35));
                    const marker = new window.kakao.maps.Marker({
                        position: coords,
                        image: markerImage
                    });

                    const infowindow = new window.kakao.maps.InfoWindow({
                        content: `<div style="width:150px;text-align:center;padding:6px 0;">${selectedProperty.address  }</div>`
                    });

                    window.kakao.maps.event.addListener(marker, 'mouseover', function () {
                        infowindow.open(map, marker);
                    });

                    window.kakao.maps.event.addListener(marker, 'mouseout', function () {
                        infowindow.close();
                    });

                    marker.setMap(map); // 새로운 마커를 지도에 추가
                    markersRef.current = [marker]; // 새로운 마커 배열로 업데이트
                    map.setCenter(coords); // 지도 중심을 선택된 매물로 이동
                    map.setLevel(5); // 마커를 더 잘 보이게 하기 위해 확대
                }
            });
        }
    }, [selectedProperty]); // selectedProperty가 변경될 때마다 실행

    return (
        <div className='containerMap parentContainer'>
            <div id="map"></div>
        </div>
    );
}

export default KakaoMap;
