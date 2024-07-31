
const Bookmark = () => {

  return (
    <div className='post-item-bookmark'>
      {false ?
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-bookmark">
          <path d="M19 3H5a2 2 0 0 0-2 2v18l7-5 7 5V5a2 2 0 0 0-2-2z" />
        </svg>
        :
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-bookmark">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
        </svg>
      }
    </div>
  );
}

export default Bookmark;