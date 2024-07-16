import icon1 from 'src/assets/images/svgs/icon-account.svg'
import icon2 from 'src/assets/images/svgs/icon-inbox.svg'
import icon3 from 'src/assets/images/svgs/icon-tasks.svg'

//
// Profile dropdown
//
const profile = [
  {
    href: '/user-profile',
    title: 'My Profile',
    subtitle: 'Account Settings',
    icon: icon1,
  },
  {
    href: '/apps/email',
    title: 'My Inbox',
    subtitle: 'Messages & Emails',
    icon: icon2,
  },
  {
    href: '/apps/notes',
    title: 'My Tasks',
    subtitle: 'To-do and Daily Tasks',
    icon: icon3,
  },
];

export { profile };
