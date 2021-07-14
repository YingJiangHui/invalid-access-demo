const routes = [
  {
    path: '/',
    redirect: '/index',
  },
  {
    name: 'index',
    icon: 'smile',
    path: '/index',
    component: './index',
  },
  {
    name: 'user',
    icon: 'smile',
    path: '/user',
    access: 'canUser',
    component: './user',
  },
  {
    name: 'admin',
    icon: 'smile',
    path: '/admin',
    access: 'canAdmin',
    component: './admin',
  },
  {
    name: 'visitor',
    icon: 'smile',
    path: '/visitor',
    access: 'canVisitor',
    component: './visitor',
  }
];

export default routes;
