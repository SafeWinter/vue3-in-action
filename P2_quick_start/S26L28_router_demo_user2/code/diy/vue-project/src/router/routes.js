const HomeAsync = () => import('@/views/Home.vue')
const AboutAsync = () => import('@/views/About.vue')
const EmailAsync = () => import('@/views/Email.vue')
const TelAsync = () => import('@/views/Tel.vue')
const AddAsync = () => import('@/views/AddOrEdit.vue')
const DetailAsync = () => import('@/views/Detail.vue')

export const routes = [
  {
    path: '/', // 路由的路径
    name: 'Portal',
    redirect: '/home'
  },
  {
    path: '/home', // 路由的路径
    name: 'Home',
    component: HomeAsync // 路由对应的组件
  },
  {
    path: '/about',
    name: 'About',
    component: AboutAsync,
    redirect: '/about/email',
    // 创建嵌套的路由
    children: [
      {
        path: 'email',
        component: EmailAsync
      },
      {
        path: 'tel',
        component: TelAsync
      }
    ]
  },
  {
    path: '/add',
    name: 'AddOrEdit',
    component: AddAsync
  },
  {
    // 这里的详情就应该是一个动态路由
    path: '/detail/:id',
    component: DetailAsync
  },
  {
    path: '/edit/:id',
    component: AddAsync
  }
]
