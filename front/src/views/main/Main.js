// MainPage.jsx
import './mainCss/MainCss.css'; // CSS 파일을 import 합니다.
import MainChart from './components/MainChart';
import MainList from './components/MainList';

function MainPage() {
    return (
        <div className="main-page">
            <div className="chart-container">
                <MainChart/>
            </div>
            <div className="list-container">
                <MainList/>
            </div>
        </div>
    );
}

export default MainPage;
