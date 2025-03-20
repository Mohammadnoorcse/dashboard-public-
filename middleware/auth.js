// middleware/auth.js
import { useTokenStore } from '~/stores/token';

export default defineNuxtRouteMiddleware((to, from) => {
  const tokenStore = useTokenStore();
  if (!tokenStore.isAuthenticated && to.path !== '/') {
    return navigateTo('/');
  }
  // If the user is authenticated, they are allowed to navigate to the requested route
  if (tokenStore.isAuthenticated && to.path === '/') {
    return navigateTo('/dashboard');
  }
});
