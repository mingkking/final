import {
  IconUsers, IconMoneybag, IconBrandWechat, IconBuildingCommunity, IconChartHistogram
} from '@tabler/icons-react';

import { uniqueId } from 'lodash';

const Menuitems = [
  {
    navlabel: true,
    subheader: 'Members',
  },

  {
    id: uniqueId(),
    title: '회원',
    icon: IconUsers,
    href: '/manager/memberList',
  },
  {
    navlabel: true,
    subheader: 'Management',
  },
  {
    id: uniqueId(),
    title: '커뮤니티 관리',
    icon: IconBuildingCommunity,
    href: '/manager/community',
  },
  {
    id: uniqueId(),
    title: '채팅 관리',
    icon: IconBrandWechat,
    href: '/manager/chat',
  },
  {
    navlabel: true,
    subheader: 'Complaint',
  },
  {
    id: uniqueId(),
    title: '커뮤니티 게시글 신고 관리',
    icon: IconBuildingCommunity,
    href: '/manager/complaint/communityPost',
  },
  {
    id: uniqueId(),
    title: '커뮤니티 댓글 신고 관리',
    icon: IconBuildingCommunity,
    href: '/manager/complaint/communityComment',
  },
  {
    navlabel: true,
    subheader: 'Graph',
  },
  {
    id: uniqueId(),
    title: '통계',
    icon: IconChartHistogram,
    href: '/manager/graph',
  }  
];



export default Menuitems;
