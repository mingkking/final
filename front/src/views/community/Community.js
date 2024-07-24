import "./Community.css"
import Posts from "./components/Posts/Posts";
import PopularPosts from "./components/PopularPosts/PopularPosts";

const Community = () => {

    return (
        <div className="container" style={{ margin: "50px auto" }}>
            <div className="row">

                <div className="post card col-lg-8 col-md-12">
                    <Posts />
                </div>

                <div className="popular card col-lg-4 col-md-12">

                    <div className="row" style={{ width: "100%" }}>
                        <PopularPosts/>
                    </div>

                </div>

            </div>
        </div>
    )

}

export default Community;