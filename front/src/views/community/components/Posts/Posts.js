import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Posts.css';
import { useNavigate } from 'react-router';

function Posts() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    // axios.get('/api/posts')
    //   .then(response => setPosts(response.data))
    //   .catch(error => console.error(error));
  }, []);

  const handleSearch = (event) => {
    // setKeyword(event.target.value);
    // axios.get(`/api/posts/search?keyword=${event.target.value}`)
    //   .then(response => setPosts(response.data))
    //   .catch(error => console.error(error));
  };

  const insertCommunity = (evt) => {
    evt.preventDefault();
    alert("클릭");
    navigate("/InsertCommunity");
  }

  return (
    <div className="container">
      <div className='community-navbar'>
        <h2 className="community-header">커뮤니티</h2>
        <input
          type="text"
          placeholder="검색어를 입력하세요..."
          value={keyword}
          onChange={handleSearch}
          className="community-search-bar"
        />
        <button onClick={insertCommunity} className='community-insertBtn'><img src='https://www.therich.io/images/icons/add.svg'></img></button>
      </div>
      <ul className="post-list">
        {posts.map(post => (
          <li key={post.id} className="post-item">
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <p>Likes: {post.likes}</p>
          </li>
        ))}
        <li className="post-item">
          <h2>1</h2>
          <p>1</p>
          <p>Likes: 1</p>
        </li>
        <li className="post-item">
          <h2>2</h2>
          <p>2</p>
          <p>Likes: 2</p>
        </li>
        <li className="post-item">
          <h2>2</h2>
          <p>2</p>
          <p>Likes: 2</p>
        </li>
        <li className="post-item">
          <h2>2</h2>
          <p>2</p>
          <p>Likes: 2</p>
        </li>
        <li className="post-item">
          <h2>2</h2>
          <p>2</p>
          <p>Likes: 2</p>
        </li>
        <li className="post-item">
          <h2>2</h2>
          <p>2</p>
          <p>Likes: 2</p>
        </li>
        <li className="post-item">
          <h2>2</h2>
          <p>2</p>
          <p>Likes: 2</p>
        </li>
        <li className="post-item">
          <h2>2</h2>
          <p>2</p>
          <p>Likes: 2</p>
        </li>
        <li className="post-item">
          <h2>2</h2>
          <p>2</p>
          <p>Likes: 2</p>
        </li>
        <li className="post-item">
          <h2>2</h2>
          <p>2</p>
          <p>Likes: 2</p>
        </li>
        <li className="post-item">
          <h2>2</h2>
          <p>2</p>
          <p>Likes: 2</p>
        </li>
        <li className="post-item">
          <h2>2</h2>
          <p>2</p>
          <p>Likes: 2</p>
        </li>
      </ul>
    </div>
  );
}

export default Posts;