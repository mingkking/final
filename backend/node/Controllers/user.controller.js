const User = require("../Models/user");
const userController = { };                           // 유저 컨트롤러

userController.saveUser = async (userName, sid) => {  // 유저 정보 생성
    
    let user = await User.findOne({                   // userName 과 똑같은 user가 있는지 조회
        name: userName
    });

    try { 
        if(!user){                                    // 같은 ID를 가진 유저가 없을 경우

            user = new User({                         // 유저 정보 생성
                
                name: userName,                       // 유저 ID
                token: sid,                           // 유저 접속 번호
                online: true,                         // 유저 상태

            });

            await user.save();                        // 유저 정보 DB 저장

        }
    } catch (error) {
        console.log("error", error.message);
    }

    user.token = sid;                                 // 유저 접속 번호 업데이트
    await user.save();                                // 유저 정보 DB 저장

    return user;                                      // 유저 정보 반환
}

userController.checkUser= async(sid)=>{               // 유저 접속 번호로 유저 정보 조회
    const user = await User.findOne({token:sid});
    return user;
}

module.exports = userController;