import axios from 'axios';

export const refreshToken = async () => {
    const refreshToken = document.cookie.split(';').find(c => c.trim().startsWith('refreshToken=')).split('=')[1];

    try {
        const response = await axios.post('http://localhost:8080/api/refresh-token', refreshToken, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // 새로운 액세스 토큰을 로컬 스토리지에 저장
        const newAccessToken = response.data.token;
        localStorage.setItem('token', newAccessToken);

    } catch (error) {
        console.error('Error refreshing token:', error);
    }
};