import React from 'react';
import './MyPage.css';
import { useContext, useState, useEffect } from 'react';
import LoginContext from '../login/contexts/LoginContext';
import { Avatar, Tabs, Tab, Box } from '@mui/material';
import UploadImage from './component/UploadImage';
import axiosInstance from '../login/component/Token/axiosInstance';
import axios from 'axios';
import "./component/UploadImage.css";
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import UserLike from '../community/components/UserLike/UserLike';
import ReplyBtn from '../community/components/ReplyBtn/ReplyBtn';
import Share from '../community/components/Share/Share';
import CommunityContext from '../community/contexts/CommunityContext';
import BudongsanContext from '../budongsan/sideView/componoets/BudongsanContext';


const getUserInterest = async (userNum) => {
  try {
    const response = await axiosInstance.get(`/user/${userNum}/interest`);
    
    return response.data;
  } catch (error) {
    console.error('Error fetching user interest:', error);
    throw new Error('Failed to fetch interests.');
  }
};

const getUserProperty = async (userNum) => {
  try {
    const response = await axiosInstance.get(`/user/${userNum}/property`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user property:', error);
    throw new Error('Failed to fetch property.');
  }
};


const MyPage = () => {

  const { state, actions } = useContext(LoginContext);
  const [profileImage, setProfileImage] = useState('');
  
  const [isEditing, setIsEditing] = useState(false);
  const BASE_URL = 'http://localhost:8080';
  

// 프로필 이미지 업로드
useEffect(() => {
  if (state.userId) {
    axiosInstance.get(`/profile-image/${state.userId}`)
      .then(response => {
        const imageUrl = response.data.profileImageUrl || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
        const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${BASE_URL}${imageUrl}`;
        setProfileImage(fullImageUrl);
        actions.setProfileImage(fullImageUrl);
      })
      .catch(error => console.error('Error fetching profile image:', error));
  }
}, [state.userId, actions]);

const handleImageUpload = (newProfileImageUrl) => {
  const fullImageUrl = `${BASE_URL}${newProfileImageUrl}`;
  setProfileImage(fullImageUrl);
  actions.setProfileImage(fullImageUrl);
};

//------------------------------------------------------
const { register, handleSubmit, watch, formState: { errors } } = useForm({ mode: 'onBlur' });
    const navigate = useNavigate();
    const [nicknameExists, setNicknameExists] = useState(false);
    const [nicknameChecked, setNicknameChecked] = useState(false);
    const [useremailExists, setUseremailExists] = useState(false); // 이메일 중복 여부
    const [usertelExists, setUsertelExists] = useState(false); // 전화번호 중복 여부
    const [useremailChecked, setUseremailChecked] = useState(false); // 이메일 중복검사 여부
    const [usertelChecked, setUsertelChecked] = useState(false); // 전화번호 중복검사 여부
    

    const onSubmit = async (data) => {
      try {
        // 데이터 전송 전에 userId와 함께 전송
        const response = await axiosInstance.put(`/user/${state.userId}`, {
          userId: state.userId,
          ...data
        });
        alert("정보가 업데이트 되었습니다.");
        actions.setAfterLoginNick(data.userNickname);
        navigate('/'); 
      } catch (error) {
        alert("정보를 정확히 입력해주세요. \n업데이트 실패: " + error.response?.data || error.message);
      }
    };

    
    // 닉네임 중복검사
    const checkNicknameExists = async (nickname) => {
        try {
            setNicknameChecked(false);
            const response = await axiosInstance.get(`/check-nickname?nickname=${nickname}`);
            const exists = response.data;
            setNicknameExists(exists);
            setNicknameChecked(true);
        } catch (error) {
            console.error('Error checking nickname:', error);
            alert('Error checking nickname. ' + error);
        }
    };

    // 이메일 중복검사
    const checkEmailExists = async (userEmail) => {
      try {
          setUseremailChecked(false); // 중복검사 시작 전에 false로 설정
          const response = await axiosInstance.get(`/check-email?email=${userEmail}`);
          const exists = response.data;
          setUseremailExists(exists);
          setUseremailChecked(true); // 중복검사 완료 후 true로 설정

      } catch (error) {
          console.error('Error checking email:', error);
          alert('Error checking email. ' + error);
      }
  };

  // 전화번호 중복검사
  const checkTelExists = async (userTel) => {
      try {
          setUsertelChecked(false); // 중복검사 시작 전에 false로 설정
          const response = await axiosInstance.get(`/check-tel?usertel=${userTel}`);
          const exists = response.data;
          setUsertelExists(exists);
          setUsertelChecked(true); // 중복검사 완료 후 true로 설정

      } catch (error) {
          console.error('Error checking phone:', error);
          alert('Error checking phone. ' + error);
      }
  };


    //---------------------------------------------------------------

    const communityContext = useContext(CommunityContext);
  
  
 
  const createAtCal = (created_at) => {
    const now = new Date();
    const date = new Date(created_at);

    const diffInSeconds = Math.floor((now - date) / 1000);
    if (diffInSeconds < 60) {
      return `${diffInSeconds}초 전`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes}분 전`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}시간 전`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays}일 전`;
    }

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
      return `${diffInWeeks}개월 전`;
    }

  }

  // 현재 사용자 ID에 해당하는 게시글만 필터링
  const [myPosts, setMyPosts] = useState([]);
  const { state: communityState, actions: communityActions } = useContext(CommunityContext);

  useEffect(() => {
    const fetchCommunityData = async () => {
        try {
            const response = await fetch('http://localhost:8080/selectCommunity');
            const data = await response.json();
            communityActions.setSelectAllPosts(data);
        } catch (error) {
            console.error('Error fetching community data:', error);
        }
    };
    fetchCommunityData();
}, []);



  useEffect(() => {
    const fetchMyPosts = async () => {
        if (state.userId) {
            const userPosts = communityState.selectAllPosts.filter(post => post.user_num.userId === state.userId);
            setMyPosts(userPosts);
        }
    };
    fetchMyPosts();
}, [state.userId, communityState.selectAllPosts]);

//------------------------------------------------------------

const [myReplies, setMyReplies] = useState([]);
const [myReReplies, setMyReReplies] = useState([]);

useEffect(() => {

  // 댓글수
  const fetchReplies = async () => {
    try {
      const response = await fetch(`http://localhost:8080/selectAllReply`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
  
      if (Array.isArray(data)) {
        communityContext.actions.setSelectAllReply(data);
      } else {
        console.error('받아온 데이터가 배열이 아닙니다:', data);
      }
    } catch (error) {
      console.error('댓글을 가져오는 중 오류 발생:', error);
    }
  };

  // 대댓글수
  const fetchRereplyData = async () => {
    try {
      const res2 = await fetch('http://localhost:8080/selectAllReReply');
      if (!res2.ok) {
        throw new Error(`HTTP error! Status: ${res2.status}`);
      }
      const data2 = await res2.json();
  
      if (Array.isArray(data2)) {
        communityActions.setSelectAllReReply(data2);
      } else {
        console.error('받아온 대댓글 데이터가 배열이 아닙니다:', data2);
      }
    } catch (error) {
      console.error('대댓글을 가져오는 중 오류 발생:', error);
    }
  };

  fetchReplies();
  fetchRereplyData();
}, []);

useEffect(() => {
    const fetchMyReplies = () => {
        if (state.userId) {
            // 사용자의 댓글 필터링
            const userReplies = communityState.selectAllReply.filter(reply => reply.user_num.userId === state.userId);
            // 사용자의 대댓글 필터링
            const userReReplies = communityState.selectAllReReply.filter(reReply => reReply.user_num.userId === state.userId);
            setMyReplies(userReplies);
            setMyReReplies(userReReplies);
           }
    };
    fetchMyReplies();
}, [state.userId, communityState.selectAllReply, communityState.selectAllReReply]);

//------------------------------------------------------------

const [bookmarkedPosts, setBookmarkedPosts] = useState("");
const [communityId, setCommunityId] = useState(null);

const fetchUserNum = async () => {
  try {
    const response = await axiosInstance.get(`/userNum/${state.userId}`);
    
    return response.data;
  } catch (error) {
    console.error('사용자 번호 조회 오류:', error);
    return null;
  }
};

// 북마크
const fetchBookmarkedPosts = async () => {
  try {
    const userData = await fetchUserNum(); // 사용자 userNum 가져오기
    if (userData) {
      const userNum = userData.userNum;
      const nickname = userData.nickname;
      
      // API 요청을 통해 북마크된 게시글 데이터 가져오기
      const response = await axios.get(`http://localhost:8080/selectAllBookmark?userNum=${userNum}`);
      
      // 응답 데이터에서 게시글 ID만 추출하기
      const bookmarkedIds = response.data
        .filter(bookmark => bookmark.user_num.userNum === userNum) // 현재 사용자가 북마크한 것만 필터링
        .map(bookmark => bookmark.id); // CommunityVO의 ID 추출
      
      if (bookmarkedIds.length > 0) {
        setCommunityId(bookmarkedIds);
        fetchPostsByIds(bookmarkedIds, nickname);
      } else {
        console.log('No bookmarked IDs found.');
      }

      // ID를 사용하여 게시글 정보를 가져옵니다
      fetchPostsByIds(bookmarkedIds, userNum);
    } else {
      console.error('사용자 번호를 가져오는 데 실패했습니다.');
    }
  } catch (error) {
    console.error('북마크된 게시글 조회 오류:', error);
  }
};

const fetchPostsByIds = async (ids) => {
  try {
    const promises = ids.map(item => {
      const id = item.id; // 객체의 id 속성을 사용
      return axios.get(`http://localhost:8080/selectOneCommunity?id=${id}`);
    });
    const responses = await Promise.all(promises);

    

    const posts = responses.map(response => ({
      userNum: response.data.user_num ? response.data.user_num.userNum : null,
      contents: response.data.contents,
      title: response.data.title, 
      id: response.data.id, 
      nickname: response.data.user_num.userNickname,
    }));
    
    

    setBookmarkedPosts(posts); // 상태 업데이트
    
  } catch (error) {
    console.error('게시글 조회 오류:', error);
  }
};

useEffect(() => {
  if (state.userId) {
    fetchBookmarkedPosts(); // userId가 변경되면 북마크된 게시글을 가져옵니다
  }
}, [state.userId]);

const [userprofileImage, setUserprofileImage] = useState('');


//---------------------------------------------------

const [userInterests, setUserInterests] = useState([]);
const [loadingInterests, setLoadingInterests] = useState(true);
const [errorInterests, setErrorInterests] = useState(null);

// 주식 관심등록
useEffect(() => {
  const loadUserInterests = async () => {
    try {
      setLoadingInterests(true);
      const userNumObj = await fetchUserNum();
      const userNum = userNumObj.userNum;
      

      if (userNum) {
        const allInterests = await getUserInterest(userNum);
        const uniqueStockCodes = Array.from(new Set(allInterests.map(interest => interest.stock_code)));
        const filteredInterests = uniqueStockCodes.map(stockCode => {
          return allInterests.find(interest => interest.stock_code === stockCode);
        });
        setUserInterests(filteredInterests);
      }
    } catch (error) {
      setErrorInterests(error.message);
    } finally {
      setLoadingInterests(false);
    }
  };

  loadUserInterests();
}, [state.userId]);

const handleStockSelect = (stockCode) => {
  
  navigate(`/stock/${stockCode}`);
}

//---------------------------------------------------

const { state:budongsanState } = useContext(BudongsanContext)

const [ userProperty,setUserProperty ] = useState([]);

// 부동산 관심등록
useEffect(() => {
  const loadUserProperty = async () => {
    try {
      
      const userNumObj = await fetchUserNum();
      const userNum = userNumObj.userNum;
      

      if (userNum) {
        const interests = await getUserProperty(userNum);
        setUserProperty(interests);
        
      }
    } catch (error) {
      console.log('loadUserProperty error :>> ', error);
    } 
  };

  loadUserProperty();
}, [state.userId]);

const handlePropertySelect = () => {
  
  navigate(`/budongsan`);
}
//----------------------------------------------------
  const [value, setValue] = useState(0); // 탭 상태
  const [value2, setValue2] = useState(0);

   // 탭 변경 핸들러
   const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChange2 = (event, newValue2) => {
    setValue2(newValue2);
  };

    return (
      <div className="mypage-container" style={{backgroundColor:'#212737'}}>
        
        <div className="profile-section" style={{backgroundColor:'#212737'}}>
          
          <div className="profile-info">
            <div className="profile-avatar-container">
              <Avatar
                src={profileImage || state.profileImage}
                alt="Profile"
                sx={{ width: 100, height: 100 }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
                }}
              />
              <UploadImage onImageUpload={handleImageUpload} />
            </div>
            <div className="profile-details">
              <h2 className="mypage-nickname">{state.afterLoginNick}</h2>
              <table className="profile-stats">
                <thead>
                  <tr>
                    <th>댓글</th>
                    <th>게시글</th>
                    
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{myReReplies.length+myReplies.length || 0}</td>
                    <td>{myPosts.length}</td>
                    
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          
          {isEditing && (
            <div className="mypage-form-section">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mypage-form-group">
                    <label htmlFor="userId">아이디</label>
                    <input
                      type="text"
                      id="userId"
                      placeholder="아이디"
                      value={state.userId}
                      readOnly
                    />  
                </div>

                

                    {errors.userName && <p className='mypage-err'>{errors.userName.message}</p>}

                    <div className="mypage-form-group">
                        <label htmlFor="userNickname">닉네임</label>
                        <input
                            type="text"
                            id="userNickname"
                            placeholder="닉네임"
                            {...register('userNickname', {
                                required: '닉네임은 필수 항목입니다.',
                                minLength: {
                                    value: 2,
                                    message: '최소 2글자 이상이어야 합니다.'
                                },
                                maxLength: {
                                    value: 10,
                                    message: '최대 10글자까지 가능합니다.'
                                },
                                onChange: (e) => {
                                    checkNicknameExists(e.target.value);
                                }
                            })}
                        />
                    </div>

                    {errors.userNickname && <p className='mypage-err'>{errors.userNickname.message}</p>}
                        {nicknameChecked && (
                            <>
                                {nicknameExists && <p className="mypage-err">이미 존재하는 닉네임입니다.</p>}
                            </>
                        )}

                  <div className="mypage-form-group">
                    <label>전화번호</label>
                    <input 
                    type="tel" 
                    name="userTel" 
                    placeholder="전화번호"  
                    {...register('userTel', {
                        required: '전화번호는 필수 항목입니다.',
                        pattern: {
                            value: /^\d{3}-\d{3,4}-\d{4}$/,
                            message: '전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)'
                          },
                        onChange: (e) => {
                            // 전화번호 중복 검사 실행
                            checkTelExists(e.target.value);
                        }
                      })}
                    />
                    
                </div>
                
                    {errors.userTel && <p className='mypage-err'>{errors.userTel.message}</p>}
                    {usertelChecked && (
                        <>
                            
                            {usertelExists && <p className="mypage-err">이미 존재하는 전화번호입니다.</p>}
                        </>
                    )}

                    <div className="mypage-form-group">
                    <label>이메일</label>
                    <input 
                        type="email" 
                        name="userEmail" 
                        placeholder="이메일"  
                        {...register('userEmail', {
                            required: '이메일은 필수 항목입니다.',
                            pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: '유효한 이메일 주소를 입력하세요.'
                            },
                            onChange: (e) => {
                                // 이메일 중복 검사 실행
                                checkEmailExists(e.target.value);
                            }
                          })}
                    />
                    
                    
                </div>
                
                    {errors.userEmail && <p className='mypage-err'>{errors.userEmail.message}</p>}
                    {useremailChecked && (
                        <>
                            
                            {useremailExists && <p className="mypage-err">이미 존재하는 이메일입니다.</p>}
                        </>
                    )}


                    <button className="btn btn-warning edit-profile-button">수정하기</button>
                
              </form>
            </div>
          )}
             <button onClick={() => setIsEditing(!isEditing)} className="btn btn-warning edit-profile-toggle-button">
          {isEditing ? '취소' : '프로필 편집'}
        </button>
         

  <hr/>

  <Box sx={{ width: '100%' }}>
          <Tabs value={value} onChange={handleChange} aria-label="tabs">
            <Tab label="작성한 글" />
            <Tab label="북마크 목록" />
          </Tabs>
          <TabPanel value={value} index={0}>
            <div className="my-posts">
              
              <ul className="post-list">
                {myPosts.length > 0 ? (
                  myPosts.map(post => (
                    <li key={post.id} className="post-item">
                      <div className="post-item-top">
                        <div className='post-item-profile'>
                          <Avatar
                            src={profileImage || state.profileImage}
                            alt="Profile"
                            sx={{ width: 35, height: 35 }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
                            }}
                          />
                        </div>
                        <div className='post-item-info'>
                          <div className='post-item-userNickname'>{state.afterLoginNick}</div>
                          <div className='post-item-created_at'>{createAtCal(post.created_at)}</div>
                        </div>
                      </div>
                      <div className="post-item-middle">
                        <div className='post-item-title'>
                          <Link className="no-underline-link" to={"/DetailCommunity"} state={{ id: post.id }}>
                            {post.title}<br />
                          </Link>
                        </div>
                        <div className='post-item-contents'>
                          <Link className="no-underline-link" to={"/DetailCommunity"} state={{ id: post.id }}>
                            {post.contents}<br />
                          </Link>
                        </div>
                      </div>
                      <div className="post-item-bottom">
                        <div className='post-item-uploadFile'>
                          {post.image_path && (<img src={`http://localhost:8080/uploads/${post.image_path}`} alt={"업로드 이미지"}></img>)}
                        </div>
                      </div>
                      <div className="post-item-actions">
                        <UserLike postId={post.id} />
                        <ReplyBtn postId={post.id} />
                        <Share post={post} />
                        
                      </div>
                    </li>
                  ))
                ) : (
                  <p>작성한 게시글이 없습니다.</p>
                )}
              </ul>
            </div>
          </TabPanel>
          <TabPanel value={value} index={1}>
          <div className="my-posts">
  {bookmarkedPosts.length === 0 ? (
    <p>북마크된 게시글이 없습니다.</p>
  ) : (
    <div className="post-list">
      {bookmarkedPosts.map(post => (
        <div key={post.id} className="post-item">
          <div className="post-item-top">
            <div className="post-item-profile">
              <Avatar
                src={userprofileImage || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
                alt="Profile"
                sx={{ width: 40, height: 40 }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
                }}
              />
            </div>
            <div className="post-item-info">
              <p className="post-item-userNickname">{post.nickname}</p>
              <p className="post-item-created_at">{createAtCal(post.created_at)}</p>
            </div>
          </div>
          <div className="post-item-middle">
            <Link className="no-underline-link" to={"/DetailCommunity"} state={{ id: post.id }}>
              <h3 className="post-item-title">{post.title}</h3>
              <p className="post-item-contents">{post.contents}</p>
            </Link>
          </div>
          <div className="post-item-bottom">
                        <div className='post-item-uploadFile'>
                          {post.image_path && (<img src={`http://localhost:8080/uploads/${post.image_path}`} alt={"업로드 이미지"}></img>)}
                        </div>
                      </div>
                      <div className="post-item-actions">
                        <UserLike postId={post.id} />
                        <ReplyBtn postId={post.id} />
                        <Share post={post} />
                        
                      </div>
        </div>
      ))}
    </div>
  )}
</div>
          </TabPanel>
        </Box>
        
        
      </div>  

      <Box sx={{ 
      width: { xs: '200%', sm: '50%', md: '50%', lg: '40%' }, // 반응형 너비 설정
      margin: '0 auto', // 중앙 정렬
      padding: 2,
      maxWidth: '100% !important',
      marginTop: -2
    }}
    
    >
      <div className='my-interest' style={{backgroundColor:'#212737'}}>
        <h2>관심목록</h2>
        
        <Tabs value={value2} onChange={handleChange2} aria-label="tabs">
          <Tab label="부동산" />
          <Tab label="주식" />
        </Tabs>
        
        <TabPanel value={value2} index={0}>
  <div className='my-interest-item' style={{ width: '100%', backgroundColor:'#212737'}}>
    <ul className='property-list'>
      {userProperty.length > 0 ? (
        userProperty.map((item, index) => (
          <li key={index} className='property-item' onClick={() => handlePropertySelect()}>
            <div className='property-details'>
              <p><span className='property-label'>주소:</span> {item.address}</p>
              <p><span className='property-label'>아파트 이름:</span> {item.apartment_name}</p>
              <p><span className='property-label'>층수:</span> {item.floor_number}층</p>
              <p><span className='property-label'>거래 금액:</span> {item.transaction_amount.toLocaleString()} 원</p>
              <p><span className='property-label'>건축 연도:</span> {item.year_built}년</p>
            </div>
          </li>
        ))
      ) : (
        <div className='no-interest'>관심 등록한 목록이 없습니다.</div>
      )}
    </ul>
  </div>
</TabPanel>

<TabPanel value={value2} index={1}>
  <div className='my-interest-item' style={{ width: '100%', backgroundColor:'#212737' }}>
    <ul className='stock-list'>
      {userInterests.length > 0 ? (
        userInterests.map((item, index) => (
          <li key={index} className='stock-item' onClick={() => handleStockSelect(item.stock_code)}>
            <div className='item-title'>{item.stock_name} ({item.stock_code})</div>
            <div className='item-detail'>종가: {item.closing_price}</div>
            <div className='item-detail'>대비: {item.compared_price}</div>
            <div className='item-detail'>거래량: {item.trading_volume}</div>
          </li>
        ))
      ) : (
        <div className='no-interest'>관심 등록한 목록이 없습니다.</div>
      )}
    </ul>
  </div>
</TabPanel>
        
      </div>
    </Box>
    </div>
  );
};

// TabPanel 컴포넌트 정의
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default MyPage;