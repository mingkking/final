
import '../sideCss/SideView.css';

const SideStarAuto = ({ totalStars = 5 }) => {



    return (
        <div>
            {[...Array(totalStars)].map((_, index) => {
                return (
                <span
                    key={index}
                    className={`star
                    }`}
                >
                    ★
                </span>
                );
            })}
        </div>
    );
};

export default SideStarAuto;
