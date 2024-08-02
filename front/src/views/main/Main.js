// MainPage.jsx
import './mainCss/MainCss.css'; // CSS 파일을 import 합니다.
import MainChart from './components/MainChart';
import MainList from './components/MainList';
import MainUnder from './components/MainUnder';

function MainPage({onPropertySelect}) {

    const handlePropertySelect = (property) => {
        console.log('Property Selected in MainPage:', property);
        if (typeof onPropertySelect === 'function') {
            onPropertySelect(property);
        } else {
            console.error('onPropertySelect is not a function');
        }
    };

    return (
        <div className="container">
            <div className="main-page">
                <div className="content-container">
                    <div className="chart-list-container">
                        <div className="chart-container">
                            <MainChart />
                        </div>
                        <div className="list-container">
                            <MainList onPropertySelect={handlePropertySelect}/>
                        </div>
                    </div>
                    <div className="under-container">
                        <MainUnder />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainPage;
