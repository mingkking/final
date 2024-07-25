import axios from 'axios';

// axios 인스턴스 생성
const axiosInstance = axios.create({
  // 기본 URL 설정
  baseURL: 'http://192.168.0.209:8080/api', 
  // 쿠키와 함께 요청을 전송
  withCredentials: true
  
});

// 요청 인터셉터 설정
axiosInstance.interceptors.request.use(
  config => {
      // 쿠키에서 accessToken을 읽어온다
      const cookies = document.cookie.split('; ');
      const tokenCookie = cookies.find(row => row.startsWith('accessToken='));
      
      if (tokenCookie) {
          const accessToken = tokenCookie.split('=')[1];
          
          config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
  },
  error => Promise.reject(error)
);


// 응답 인터셉터 설정
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await axios.post('/refresh-token', {
          refreshToken: localStorage.getItem('refreshToken'),
        }, {
          withCredentials: true, // 쿠키를 포함하여 요청을 보냅니다.
        });

        const { token, refreshToken } = response.data;
        localStorage.setItem('accessToken', token);
        localStorage.setItem('refreshToken', refreshToken);
        

        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token is invalid or expired.');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);



export default axiosInstance;