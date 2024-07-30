import React from 'react';
import { Link } from 'react-router-dom'; // Link 임포트
import './footerCss/Footer.css';

function Footer() {
    return (
        <div className="Footer">
            <div className="footer-section">
                <p><strong>(주)인베스트게이트</strong></p>
                <p>사업자 등록번호 : 000-00-00000 | 대표 : 조혜경, 남다윗</p>
                <p>통신판매신고 제 2024-서울신촌-00000호</p>
                <p>서울 마포구 백범로 23 케이터틀 3층(신수동 63-14)</p>
                <p>대표 전화: 02-0000-0000</p>
            </div>

            <div className="footer-section">
                <p><strong>Company</strong></p>
                <p><Link to="/serviceUse">서비스 이용약관</Link></p>
                <p><Link to="/privacy">개인정보 처리방침</Link></p>
            </div>

            <div className="footer-section">
                <p><strong>인재 영입</strong></p>
                <p><a href="/recruiting">리크루팅 바로가기</a></p>
            </div>

            <div className="footer-section">
                <p><strong>고객센터</strong></p>
                <p>고객문의 : <a href="mailto:whgprud602@investGate.io">whgprud602@investGate.io</a></p>
                <p>광고문의 : <a href="mailto:fptmzmvkzm@investGate.io">fptmzmvkzm@investGate.io</a></p>
                <p>사업제휴 : <a href="mailto:david00296@investGate.io">david00296@investGate.io</a></p>
                <p>IR : <a href="mailto:jumki12@investGate.io">jumki12@investGate.io</a></p>
            </div>
        </div>
    );
}

export default Footer;
