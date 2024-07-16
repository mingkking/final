const User = require("../Models/user");
const userController = {};

userController.saveUser = async (userName, sid) => {
    // 이미 접속한 유저인지 확인
    let user = await User.findOne({
        name: userName
    });

    // 채팅 방 안에 같은 ID 가 있으면 유저 정보를 새로 생성한다.
    try {
        if(!user){
            user = new User({
                // 비어있지만 유저 _id
                name: userName, // 유저 ID
                token: sid, // 유저 접속 번호
                online: true, // 유저 상태
            });
            await user.save(); // 유저 정보 저장
        }
    } catch (error) {
        console.log("error", error.message);
    }

    user.token = sid;
    await user.save();

    return user; // 유저 정보 반환
}

userController.checkUser= async(sid)=>{
    const user = await User.findOne({token:sid});
    return user;
}

module.exports = userController;