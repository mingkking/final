import React, { useRef, useState } from 'react';

const ImageUpload = ({ onFileSelect }) => {
    const fileInputRef = useRef(null);
    const [preview, setPreview] = useState(null); // 미리보기 이미지의 상태
    const [uploadImgUrl, setUploadImgUrl] = useState("");

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // 부모 컴포넌트로 파일 전달
            onFileSelect(file);

            // 파일의 URL을 생성하고 미리보기 상태를 설정
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setUploadImgUrl(reader.result);
            }
        }
    };

    const handleClearPreview = () => {
        // 미리보기와 파일 상태를 초기화
        setPreview(null);
        onFileSelect(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // input의 value 초기화
        }
    };

    return (
        <div className='community-image'>
            <input
                className='form-control'
                type="file"
                name="file"
                onChange={handleFileChange}
            />
            {preview && (
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <img
                        src={preview}
                        alt="Preview"
                        style={{ width: '200px', height: 'auto', borderRadius: '8px' }}
                    />
                    <button
                        className='detailCommunity-menuBtn'
                        onClick={handleClearPreview}
                        style={{ marginTop: '10px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
                    >
                        취소
                    </button>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
