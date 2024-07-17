import React, { useState, useEffect } from 'react';
import apartImg from '../../../imges/apartImg.png'; // 이미지를 import합니다
import SideSearch from '../sideView/SideSearch';


function KakaoMap() {
    const [data, setData] = useState(null); // 상태로 데이터 저장
    const [value, setValue] = useState("");
    const [keyword, setKeyword] = useState("");

    const keywordChange = (e) => {
        setValue(e.target.value);
    }

    const submitKeyword = (e) => {
        e.preventDefault();
        if (value.trim() === "") {
            alert("검색어를 입력해주세요.");
        } else {
            setKeyword(value);
        }
    }

    useEffect(() => {
        // 데이터를 가져오는 함수
        const fetchData = async () => {
            try {
                const response = await fetch('/budongsan'); // Flask 서버의 엔드포인트
                const jsonData = await response.json(); // JSON으로 변환
                setData(jsonData); // 상태에 데이터 저장
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData(); // 데이터 가져오기 함수 호출
    }, []); // 빈 배열을 전달하여 컴포넌트가 마운트될 때 한 번만 실행되도록 함

    useEffect(() => {
        // 카카오맵 API가 로드된 후 실행될 콜백 함수
        const initMap = () => {
            
            const mapContainer = document.getElementById('map'); // 지도를 표시할 div 
            const mapOption = { 
                center: new window.kakao.maps.LatLng(37.5528112179, 126.93794821), // 지도의 중심좌표
                level: 3 // 지도의 확대 레벨
            };

            // 지도를 생성합니다
            const map = new window.kakao.maps.Map(mapContainer, mapOption);

            // 주소-좌표 변환 객체를 생성합니다
            const geocoder = new window.kakao.maps.services.Geocoder();
                        
            // 장소 검색 객체를 생성합니다
            const ps = new window.kakao.maps.services.Places();

            
            // 키워드로 장소를 검색합니다
            ps.keywordSearch(keyword, placesSearchCB);
           
             
             // 키워드 검색 완료 시 호출되는 콜백함수 입니다
             function placesSearchCB (data, status, pagination) {
                if (status === window.kakao.maps.services.Status.OK) {

                    // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
                    // LatLngBounds 객체에 좌표를 추가합니다
                    var bounds = new window.kakao.maps.LatLngBounds();

                    for (var i=0; i<data.length; i++) {
                          
                        bounds.extend(new window.kakao.maps.LatLng(data[i].y, data[i].x));
                    }       

                    // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
                    map.setBounds(bounds);
                } 
            }

            
            


            // 모든 주소를 한 번에 처리하는 함수
            const geocodeAddresses = (addresses) => {
                const markers = [];

                addresses.forEach((address, index) => {
                    geocoder.addressSearch(address, function(result, status) {
                        if (status === window.kakao.maps.services.Status.OK) {
                            const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);

                            const imageSize = new window.kakao.maps.Size(24, 35); // 마커 이미지의 크기
                            const imageOption = { offset: new window.kakao.maps.Point(12, 35) }; // 마커 이미지의 옵션

                            // 마커 이미지를 생성합니다
                            const markerImage = new window.kakao.maps.MarkerImage(apartImg, imageSize, imageOption);

                            const marker = new window.kakao.maps.Marker({
                                position: coords
                                ,image: markerImage // 마커 이미지 설정
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

                // 3초 딜레이 후 마커를 지도에 추가
                setTimeout(() => {
                    markers.forEach(marker => marker.setMap(map));
                }, 3000);
            };

            // 데이터가 유효할 때 모든 주소를 한꺼번에 처리
            if (data) {
                const addresses = data.map(item => item.address);
                geocodeAddresses(addresses);
            }
        };

        // 지도 초기화 함수 호출
        initMap();
    }, [data, keyword]); // data 상태가 변경될 때마다 실행



    return (
        <div>
            <form className="d-flex" onSubmit={submitKeyword}>
                <input
                    className="form-control me-sm-2"
                    type="search"
                    placeholder="검색어를 입력해주세요."
                    required
                    value={value}
                    onChange={keywordChange}
                />
                <button className="btn btn-secondary my-2 my-sm-0" type="submit">Search</button>
            </form>
            <div className='containerMap parentContainer'>
                <div id="map"></div>
            </div>
        </div>
    );
}

export default KakaoMap;
