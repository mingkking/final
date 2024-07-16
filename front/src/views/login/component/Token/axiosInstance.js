import axios from 'axios';

// axios 인스턴스 생성
const axiosInstance = axios.create({
  // 기본 URL 설정
  baseURL: 'http://localhost:8080/api', 
  // 쿠키와 함께 요청을 전송
  withCredentials: true
  
});

// 요청 인터셉터 설정
axiosInstance.interceptors.request.use(
    config => {
        // localStorage에서 accessToken을 가져옴
        const token = localStorage.getItem('accessToken');
        if (token) {
            // Authorization 헤더에 Bearer 토큰을 추가
            config.headers.Authorization = `Bearer ${token}`;
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

      if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
                // 리프레시 토큰으로 새로운 accessToken을 요청
                const response = await axiosInstance.post('/refresh-token', {
                  refreshToken: localStorage.getItem('refreshToken'),
              });

              // 새로운 토큰과 리프레시 토큰을 localStorage에 저장
              const { token, refreshToken } = response.data;
              localStorage.setItem('accessToken', token);
              localStorage.setItem('refreshToken', refreshToken);
              axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

              // 원래 요청을 새로운 토큰으로 재시도
              return axiosInstance(originalRequest);
          } catch (refreshError) {
              // 리프레시 토큰이 유효하지 않거나 만료된 경우
              console.error('Refresh token is invalid or expired.');
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              window.location.href = '/Login';
          }
      }

      return Promise.reject(error);
  }
);



export default axiosInstance;