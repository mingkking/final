import React from 'react';
import './IdConfirm.css'
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const IdConfirm = () => {

    const location = useLocation(); 
    const navigate = useNavigate();
    const userId = location.state?.userId;


    return (
        <div className="center-container d-flex justify-content-center align-items-center min-vh-100">
        <div className="id-confirm-container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-12">
                    <div className="card shadow-sm border-light">
                        <div className="card-body text-center">
                            <h2 className="card-title mb-4">아이디 찾기</h2>
                            <div className="mb-4">
                                <p className="lead">귀하의 아이디는 <strong>{userId}</strong> 입니다</p>
                            </div>
                            <div className="d-flex justify-content-center gap-3">
                                <button 
                                    className="btn btn-primary"
                                    onClick={() => navigate('/Login')}
                                >
                                    로그인하기
                                </button>
                                <button 
                                    className="btn btn-secondary"
                                    onClick={() => navigate('/PwFind')}
                                >
                                    비밀번호 찾기
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
};

export default IdConfirm;