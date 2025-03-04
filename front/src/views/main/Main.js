// MainPage.jsx
import './mainCss/MainCss.css'; // CSS 파일을 import 합니다.
import MainChart from './components/MainChart';
import MainList from './components/MainList';
import MainUnder from './components/MainUnder';
import GetVisitCount from './components/Main'
import InvestmentInside from './components/InvestmentInside';
import TodayNews from './components/TodayNews';

function MainPage() {

    

    return (
        <div className="container">
            <div className="main-page">
                <div className="content-container">
                    <div className="chart-list-container">
                        <div className="chart-container">
                            <MainChart />
                        </div>
                        <div className="list-container">
                            <MainList/>
                        </div>
                    </div>
                    <div>
                        <TodayNews/>
                    </div>
                    <div>
                        <InvestmentInside/>
                    </div>
                    <div className="under-container">
                        <MainUnder />
                    </div>
                    <div style={{ display: 'hide' }}>
                        <GetVisitCount />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainPage;
