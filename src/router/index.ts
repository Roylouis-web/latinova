import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: 'home',
      path: '/',
      component: () => import('@/views/Home.vue')
    },
    {
      name: 'about',
      path: '/about',
      component: () => import('@/views/About.vue')
    },
    {
      name: 'policy',
      path: '/policy',
      component: () => import('@/views/Policy.vue')
    },
    {
      name: 'account',
      path: '/account',
      component: () => import('@/views/Account.vue')
    },
    {
      name: 'cart',
      path: '/cart',
      component: () => import('@/views/Cart.vue')
    },
    {
      name: 'login',
      path: '/login',
      component: () => import('@/views/Login.vue')
    },
    {
      name: 'register',
      path: '/register',
      component: () => import('@/views/Register.vue')
    },
    {
      name: 'reset_password',
      path: '/reset_password',
      component: () => import('@/views/ResetPassword.vue')
    },
    {
      name: 'categories',
      path: '/categories',
      component: () => import('@/views/Categories.vue')
    },
    {
      name: 'outfits',
      path: '/categories/:category',
      component: () => import('@/views/Outfits.vue')
    },
    {
      name: 'best_selling',
      path: '/best_selling',
      component: () => import('@/views/BestSelling.vue')
    },
    {
      name: 'best_selling_outfits',
      path: '/best_selling/:category',
      component: () => import('@/views/BestSellingOutfits.vue')
    },
    {
      name: 'off_season',
      path: '/off_season',
      component: () => import('@/views/OffSeason.vue')
    }
    ,
    {
      name: 'items',
      path: '/categories/:category/items',
      component: () => import('@/views/Item.vue')
    },
    {
      name: 'wishlist',
      path: '/wishlist',
      component: () => import('@/views/WishList.vue')
    },
    {
      name: 'orders',
      path: '/orders',
      component: () => import('@/views/Orders.vue')
    },
    {
      name: 'admin_orders',
      path: '/admin/orders',
      component: () => import('@/views/AdminOrders.vue')
    },
    {
      name: 'my_products',
      path: '/my_products',
      component: () => import('@/views/AllProducts.vue')
    },
    {
      name: 'purchases',
      path: '/purchases',
      component: () => import('@/views/Purchases.vue')
    },
    {
      name: 'sales',
      path: '/sales',
      component: () => import('@/views/Sales.vue')
    },
    {
      name: 'track_order',
      path: '/track_order',
      component: () => import('@/views/TrackOrder.vue')
    },
    {
      name: 'edit_outfit',
      path: '/edit_outfit',
      component: () => import('@/views/EditOutfit.vue')
    },
    {
      name: 'african_prints',
      path: '/african_prints',
      component: () => import('@/views/AfricanPrints.vue')
    },
    {
      name: 'contact',
      path: '/contact',
      component: () => import('@/views/Contact.vue')
    },
    {
      name: 'edit_profile',
      path: '/edit_profile',
      component: () => import('@/views/EditProfile.vue')
    },
    {
      name: 'upload',
      path: '/upload',
      component: () => import('@/views/UploadOutfit.vue')
    },
    {
      name: 'search',
      path: '/search',
      component: () => import('@/views/Search.vue')
    },
    {
      name: 'payment',
      path: '/payment',
      component: () => import('@/views/Payment.vue')
    },
    {
      name: 'not-found',
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/404.vue')
    },
    {
      name: 'delete_account',
      path: '/delete_account',
      component: () => import('@/views/DeleteAccount.vue')
    }
  ],
  scrollBehavior () {
    return { top: 0 }
  }
});

export default router;
