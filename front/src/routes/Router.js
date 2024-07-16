import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../layouts/full/shared/loadable/Loadable';

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

/* ****Pages***** */
const Main = Loadable(lazy(() => import('../views/manager/main/Main')));
const MemberList = Loadable(lazy(() => import('../views/manager/memberList/MemberList')));
const SubscribeList = Loadable(lazy(() => import('../views/manager/subscribe_list/Subscribe_list')));
const Community = Loadable(lazy(() => import('../views/manager/community/Community')));
const Chat = Loadable(lazy(() => import('../views/manager/chat/Chat')));
const Graph = Loadable(lazy(() => import('../views/manager/graph/Graph')));
const Error = Loadable(lazy(() => import('../views/manager/authentication/Error')));


const Router = [
  {
    path: '/',
    element: <FullLayout />,
    children: [
      { path: '/main', exact: true, element: <Main /> },
      { path: '/memberList', exact: true, element: <MemberList /> },
      { path: '/subscribe_list', exact: true, element: <SubscribeList /> },
      { path: '/community', exact: true, element: <Community /> },
      { path: '/chat', exact: true, element: <Chat /> },
      { path: '/graph', exact: true, element: <Graph /> },
      { path: '*', element: <Navigate to="/auth/404" /> }
    ],
  },
  {
    path: '/auth',
    element: <BlankLayout />,
    children: [
      { path: '404', element: <Error /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
];

export default Router;
