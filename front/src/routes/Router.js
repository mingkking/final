import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../layouts/full/shared/loadable/Loadable';

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

/* ****Pages***** */
const Main = Loadable(lazy(() => import('../views/manager/main/Main')));
const MemberList = Loadable(lazy(() => import('../views/manager/memberList/MemberList')));
const MemberDetail = Loadable(lazy(() => import('../views/manager/memberList/MemberDetail')));
const Community = Loadable(lazy(() => import('../views/manager/community/Community')));
const Chat = Loadable(lazy(() => import('../views/manager/chat/Chat')));
const MgrCommunityReply = Loadable(lazy(() => import('../views/manager/communityComplaint/CommunityReply')));
const MgrCommunityPost = Loadable(lazy(() => import('../views/manager/communityComplaint/CommunityPost')));
const Graph = Loadable(lazy(() => import('../views/manager/graph/Graph')));
const ComplaintPostDetail = Loadable(lazy(() => import('../views/manager/communityComplaint/ComplaintPostDetail')));
const ComplaintReplyDetail = Loadable(lazy(() => import('../views/manager/communityComplaint/ComplaintReplyDetail')));

const Router = [
  {
    path: '/manager',
    element: <FullLayout />,
    children: [
      { path: 'main', exact: true, element: <Main /> },
      { path: 'memberList', exact: true, element: <MemberList /> },
      { path: 'memberDetail/:user_num', exact: true, element: <MemberDetail /> },      
      { path: 'community', exact: true, element: <Community /> },
      { path: 'chat', exact: true, element: <Chat /> },
      { path: 'complaint/communityPost', exact: true, element: <MgrCommunityPost /> },
      { path: 'complaint/communityComment', exact: true, element: <MgrCommunityReply /> },
      { path: 'graph', exact: true, element: <Graph /> },
      { path: 'complaint/commPostDetail/:id', exact: true, element: <ComplaintPostDetail />},
      { path: 'complaint/commReplyDetail/:id', exact: true, element: <ComplaintReplyDetail />}
    ]
  }
];

export default Router;
