import React, { useState, useEffect, useRef } from 'react';
import apartImg from '../../../imges/apartImg.png';             // 아파트 이미지 import
import schoolImg from '../../../imges/schoolImg.png';           // 학교 이미지 import
import storeImg from '../../../imges/storeImg.png';             // 편의점 이미지 import
import busStationImg from '../../../imges/busStationImg.png'    // 버스정류장 이미지 import
import '../budongsanCss/kakaoMap.css';

function KakaoMap({ selectedProperty }) {
    const [data, setData] = useState(null);                         // 데이터 상태를 저장하는 훅
    const [schoolData, setSchoolData] = useState(null);             // 학교 데이터 상태를 저장하는 훅
    const [storeData, setStoreData] = useState(null);               // 편의점 데이터 상태를 저장하는 훅
    const [busStationData, setBusStationData] = useState(null);     // 버스정류장 데이터 상태를 저장하는 훅
    const [selectedCategory, setSelectedCategory] = useState('전체'); // 카테고리 선택을 저장하는 훅
    const markersRef = useRef([]);                                  // 마커를 저장할 Ref
    const mapRef = useRef(null);                                    // 지도를 저장할 Ref
    const clustererRef = useRef(null);                              // 클러스터러를 저장할 Ref
    const circleRef = useRef(null);                                 // 원을 저장할 Ref
    const customOverlayRef = useRef(null);                          // CustomOverlay를 저장할 Ref

    const [schoolMarkerCount, setSchoolMarkerCount] = useState(0);  // 학교 마커 수
    const [storeMarkerCount, setStoreMarkerCount] = useState(0);    // 편의점 마커 수
    const [busStationMarkerCount, setBusStationMarkerCount] = useState(0); // 버스정류장 마커 수


    

    // 컴포넌트가 처음 렌더링될 때 데이터 fetch
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [budongsanResponse, schoolResponse, storeResponse, busStationResponse] = await Promise.all([
                    fetch('/budongsanMapData'),
                    fetch('/schoolData'),
                    fetch('/storeData'),
                    fetch('/busStationData')
                ]);

                if (!budongsanResponse.ok || !schoolResponse.ok || !storeResponse.ok || !busStationResponse.ok) {
                    throw new Error('Network response was not ok');
                }

                const budongsanData = await budongsanResponse.json();
                const schoolData = await schoolResponse.json();
                const storeData = await storeResponse.json();
                const busStationData = await busStationResponse.json();

                setData(budongsanData);             // 데이터를 상태에 저장
                setSchoolData(schoolData);          // 학교 데이터를 상태에 저장
                setStoreData(storeData);            // 편의점 데이터를 상태에 저장
                setBusStationData(busStationData);  // 버스정류장 데이터를 상태에 저장

                // 데이터를 콘솔에 찍어봅니다
                console.log('Bus Station Data:', busStationData);
                console.log('School Data:', schoolData);
                console.log('Store Data:', storeData);
                console.log('Budongsan Data:', budongsanData);

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
                                content: `<span class="badge bg-warning">${address}</span>`
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
            markersRef.current = [];    // Ref의 마커 배열 초기화
            

            // 기존 원 제거
            if (circleRef.current) {
                circleRef.current.setMap(null);
            }

            // 기존 CustomOverlay 제거
            if (customOverlayRef.current) {
                customOverlayRef.current.setMap(null);
            }

            const map = mapRef.current;
            const geocoder = new window.kakao.maps.services.Geocoder();

            // 선택된 매물의 주소를 좌표로 변환하고 새로운 마커를 추가
            geocoder.addressSearch(selectedProperty.address, function (result, status) {
                if (status === window.kakao.maps.services.Status.OK) {
                    const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
                    const markerImage = new window.kakao.maps.MarkerImage(apartImg, new window.kakao.maps.Size(48, 70));
                    const marker = new window.kakao.maps.Marker({
                        position: coords,
                        image: markerImage
                    });

                    const infowindow = new window.kakao.maps.InfoWindow({
                        content: 
                                `
                                <div class="card text-white bg-info mb-0" style="max-width: 15rem;">
                                    <div class="card-header">${selectedProperty.address}</div>
                                    <div class="card-body">
                                        <p class="card-text">${selectedProperty.apartMentName} ${selectedProperty.floorNumber}층</p>
                                        
                                    </div>
                                </div>
                                `
                    });

                    window.kakao.maps.event.addListener(marker, 'mouseover', function () {
                        infowindow.open(map, marker);
                    });

                    window.kakao.maps.event.addListener(marker, 'mouseout', function () {
                        infowindow.close();
                    });

                    marker.setMap(map);             // 새로운 마커를 지도에 추가
                    markersRef.current = [marker];  // 새로운 마커 배열로 업데이트
                    map.setCenter(coords);          // 지도 중심을 선택된 매물로 이동
                    map.setLevel(4);                // 마커를 더 잘 보이게 하기 위해 확대



                    // 원을 지도에 추가
                    const circle = new window.kakao.maps.Circle({
                        center: coords,             // 원의 중심좌표
                        radius: 1000,               // 미터 단위의 원의 반지름
                        strokeWeight: 2,            // 선의 두께
                        strokeColor: '#75B8FA',     // 선의 색깔
                        strokeOpacity: 1,           // 선의 불투명도 (0에서 1 사이의 값이며, 1이면 완전히 불투명)
                        strokeStyle: 'solid',       // 선의 스타일
                        fillColor: '#CFE7FF',       // 채우기 색깔
                        fillOpacity: 0.7            // 채우기 불투명도 (0에서 1 사이의 값이며, 1이면 완전히 불투명)
                    });

                    circle.setMap(map);         // 지도에 원을 추가
                    circleRef.current = circle; // 원을 Ref에 저장


                    const offsetY = 1000;       // 원의 중심에서 아래로 50 픽셀 이동

                    const position = new window.kakao.maps.LatLng(
                        coords.getLat() + (offsetY / 111320),       // 위도는 1도 당 약 111,320미터 (위치에 따라 다를 수 있음)
                        coords.getLng()                             // 경도는 변경하지 않음
                    );

                    // CustomOverlay를 사용하여 원 안에 텍스트 추가
                    const content = `
                                    <div style="
                                        padding:5px; 
                                        color: #FFFFFF; 
                                        text-align:center;"
                                        class="badge rounded-pill bg-primary
                                    ">
                                        도보15분
                                    </div>
                                    `;

                    const customOverlay = new window.kakao.maps.CustomOverlay({
                        position: position,     // 중심 좌표와 동일하게 설정
                        content: content,
                        xAnchor: 0.5,           // 중심을 맞추기 위해 xAnchor와 yAnchor를 0.5로 설정
                        yAnchor: 0.5
                    });

                    customOverlay.setMap(map);                  // 지도에 오버레이 추가
                    customOverlayRef.current = customOverlay;   // CustomOverlay를 Ref에 저장

                     // Haversine 공식을 사용하여 두 좌표 사이의 거리 계산 함수
                    const haversineDistance = (lat1, lon1, lat2, lon2) => {
                        const R = 6371; // 지구의 반지름 (킬로미터)
                        const dLat = (lat2 - lat1) * Math.PI / 180;
                        const dLon = (lon2 - lon1) * Math.PI / 180;
                        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
                        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                        return R * c; // 킬로미터 단위의 거리
                    };

                    // 원 안에 있는지 확인하는 함수
                    const isInsideCircle = (latLng, center, radius) => {
                        const distance = haversineDistance(
                            latLng.getLat(), latLng.getLng(),
                            center.getLat(), center.getLng()
                        );
                        return distance <= radius / 1000; // 미터 단위로 변환
                    };

                    // 마커 수를 세는 변수
                    let schoolCount = 0;
                    let storeCount = 0;
                    let busStationCount = 0;
                    
                    if (selectedCategory  === '전체') {
                        schoolData.forEach(school => {
                            const schoolCoords = new window.kakao.maps.LatLng(school.위도, school.경도);
                            // 원의 중심좌표와 반경을 이용하여 원 안에 있는지 확인
                            if (isInsideCircle(schoolCoords, coords, 1000)) {
                                const markerImage = new window.kakao.maps.MarkerImage(schoolImg, new window.kakao.maps.Size(24, 35));
                                
                                const marker = new window.kakao.maps.Marker({
                                    position: schoolCoords,
                                    image: markerImage
                                });

                                const infowindow = new window.kakao.maps.InfoWindow({
                                    content: 
                                            `
                                            <div class="card text-white bg-info mb-0" style="max-width: 15rem;">
                                                <div class="card-header">${school.소재지지번주소}</div>
                                                <div class="card-body">
                                                    <p class="card-text">${school.학교명}</p>
                                                </div>
                                            </div>
                                            `
                                });

                                window.kakao.maps.event.addListener(marker, 'mouseover', function () {
                                    infowindow.open(map, marker);
                                });

                                window.kakao.maps.event.addListener(marker, 'mouseout', function () {
                                    infowindow.close();
                                });

                                marker.setMap(map);                 // 새로운 마커를 지도에 추가
                                markersRef.current.push(marker);    // 마커를 Ref에 추가
                                schoolCount++;
                            }
                        });

                        storeData.forEach(store => {
                            const storeCoords = new window.kakao.maps.LatLng(store.위도, store.경도);
                            // 원의 중심좌표와 반경을 이용하여 원 안에 있는지 확인
                            if (isInsideCircle(storeCoords, coords, 1000)) {
                                const markerImage = new window.kakao.maps.MarkerImage(storeImg, new window.kakao.maps.Size(24, 35));
                                
                                const marker = new window.kakao.maps.Marker({
                                    position: storeCoords,
                                    image: markerImage
                                });

                                const infowindow = new window.kakao.maps.InfoWindow({
                                    content: 
                                            `
                                            <div class="card text-white bg-info mb-0" style="max-width: 15rem;">
                                                <div class="card-header">${store.지번주소}</div>
                                                <div class="card-body">
                                                    <p class="card-text">${store.상호명}</p>
                                                </div>
                                            </div>
                                            `
                                });

                                window.kakao.maps.event.addListener(marker, 'mouseover', function () {
                                    infowindow.open(map, marker);
                                });

                                window.kakao.maps.event.addListener(marker, 'mouseout', function () {
                                    infowindow.close();
                                });

                                marker.setMap(map);                 // 새로운 마커를 지도에 추가
                                markersRef.current.push(marker);    // 마커를 Ref에 추가
                                storeCount++;
                            }
                        });


                        busStationData.forEach(busStaion => {
                            const busStationCoords = new window.kakao.maps.LatLng(busStaion.위도, busStaion.경도);
                            // 원의 중심좌표와 반경을 이용하여 원 안에 있는지 확인
                            if (isInsideCircle(busStationCoords, coords, 1000)) {
                                const markerImage = new window.kakao.maps.MarkerImage(busStationImg, new window.kakao.maps.Size(24, 35));
                                
                                const marker = new window.kakao.maps.Marker({
                                    position: busStationCoords,
                                    image: markerImage
                                });


                                marker.setMap(map);                 // 새로운 마커를 지도에 추가
                                markersRef.current.push(marker);    // 마커를 Ref에 추가
                                busStationCount++;
                            }
                        });
                    }
                    // 마커 수 상태 업데이트
                    setSchoolMarkerCount(schoolCount);
                    setStoreMarkerCount(storeCount);
                    setBusStationMarkerCount(busStationCount);
                    

                    // schoolData의 주소들을 좌표로 변환하여 마커 추가
                    if (selectedCategory  === '학교' && schoolData) {
                        schoolData.forEach(school => {
                            const schoolCoords = new window.kakao.maps.LatLng(school.위도, school.경도);
                            // 원의 중심좌표와 반경을 이용하여 원 안에 있는지 확인
                            if (isInsideCircle(schoolCoords, coords, 1000)) {
                                const markerImage = new window.kakao.maps.MarkerImage(schoolImg, new window.kakao.maps.Size(24, 35));
                                
                                const marker = new window.kakao.maps.Marker({
                                    position: schoolCoords,
                                    image: markerImage
                                });

                                const infowindow = new window.kakao.maps.InfoWindow({
                                    content: 
                                            `
                                            <div class="card text-white bg-info mb-0" style="max-width: 15rem;">
                                                <div class="card-header">${school.소재지지번주소}</div>
                                                <div class="card-body">
                                                    <p class="card-text">${school.학교명}</p>
                                                </div>
                                            </div>
                                            `
                                });

                                window.kakao.maps.event.addListener(marker, 'mouseover', function () {
                                    infowindow.open(map, marker);
                                });

                                window.kakao.maps.event.addListener(marker, 'mouseout', function () {
                                    infowindow.close();
                                });

                                marker.setMap(map);                 // 새로운 마커를 지도에 추가
                                markersRef.current.push(marker);    // 마커를 Ref에 추가
                            }
                        });
                    }

                    // storeData를 선택된 매물과의 거리 기준으로 정렬하여 가장 가까운 5개를 선택
                    if (selectedCategory  === '편의점' && storeData) {
                        storeData.forEach(store => {
                            const storeCoords = new window.kakao.maps.LatLng(store.위도, store.경도);
                            // 원의 중심좌표와 반경을 이용하여 원 안에 있는지 확인
                            if (isInsideCircle(storeCoords, coords, 1000)) {
                                const markerImage = new window.kakao.maps.MarkerImage(storeImg, new window.kakao.maps.Size(24, 35));
                                
                                const marker = new window.kakao.maps.Marker({
                                    position: storeCoords,
                                    image: markerImage
                                });

                                const infowindow = new window.kakao.maps.InfoWindow({
                                    content: 
                                            `
                                            <div class="card text-white bg-info mb-0" style="max-width: 15rem;">
                                                <div class="card-header">${store.지번주소}</div>
                                                <div class="card-body">
                                                    <p class="card-text">${store.상호명}</p>
                                                </div>
                                            </div>
                                            `
                                });

                                window.kakao.maps.event.addListener(marker, 'mouseover', function () {
                                    infowindow.open(map, marker);
                                });

                                window.kakao.maps.event.addListener(marker, 'mouseout', function () {
                                    infowindow.close();
                                });

                                marker.setMap(map);                 // 새로운 마커를 지도에 추가
                                markersRef.current.push(marker);    // 마커를 Ref에 추가
                            }
                        });
                    }

                    // schoolData의 주소들을 좌표로 변환하여 마커 추가
                    if (selectedCategory   === '정류장' && busStationData) {
                        busStationData.forEach(busStaion => {
                            const busStationCoords = new window.kakao.maps.LatLng(busStaion.위도, busStaion.경도);
                            // 원의 중심좌표와 반경을 이용하여 원 안에 있는지 확인
                            if (isInsideCircle(busStationCoords, coords, 1000)) {
                                const markerImage = new window.kakao.maps.MarkerImage(busStationImg, new window.kakao.maps.Size(24, 35));
                                
                                const marker = new window.kakao.maps.Marker({
                                    position: busStationCoords,
                                    image: markerImage
                                });


                                marker.setMap(map);                 // 새로운 마커를 지도에 추가
                                markersRef.current.push(marker);    // 마커를 Ref에 추가
                            }
                        });
                    }


                }
            });
        }
        
    }, [selectedProperty, selectedCategory, schoolData, storeData, busStationData]); // selectedProperty가 변경될 때마다 실행

    // 마커 카운트를 계산하고 상태에 저장하는 효과
    useEffect(() => {
        if (schoolData) {
            setSchoolMarkerCount(schoolData.length);
        }
        if (storeData) {
            setStoreMarkerCount(storeData.length);
        }
        if (busStationData) {
            setBusStationMarkerCount(busStationData.length);
        }
    }, [schoolData, storeData, busStationData]);
    

    // 카테고리 클릭 이벤트 핸들러
    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

    return (
        <div className='containerMap parentContainer'>
            <div class="map_wrap">
                <div id="map"></div>
                
                {selectedProperty && (
                    <>
                        <ul id="category"  style={{ fontFamily: '돋움, sans-serif', fontSize: '12px' }}>
                            <li id="" data-order="0" onClick={() => handleCategoryClick('전체')}> 
                                <span class="category_bg bank"></span>
                                전체
                            </li>
                            <li id="BK9" data-order="1" onClick={() => handleCategoryClick('학교')}> 
                                <span class="category_bg bank"></span>
                                학교
                            </li>
                            <li id="MT1" data-order="2" onClick={() => handleCategoryClick('편의점')}> 
                                <span class="category_bg store"></span>
                                편의점
                            </li>  
                            <li id="PM9" data-order="3" onClick={() => handleCategoryClick('정류장')}> 
                                <span class="category_bg pharmacy"></span>
                                정류장
                            </li>
                        </ul>
                        <div className="marker-count">
                            <p>학교 마커 수: {schoolMarkerCount}</p>
                            <p>편의점 수: {storeMarkerCount}</p>
                            <p>정류장 수: {busStationMarkerCount}</p>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
}

export default KakaoMap;
