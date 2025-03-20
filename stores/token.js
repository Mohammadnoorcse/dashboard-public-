export const useTokenStore = defineStore('token',{
state: () => ({
    isLoggedIn: false,
    token:'',
}),
getters:{
    isAuthenticated : (state) => state.isLoggedIn,
    getToken : (state) => state.token,
},
actions: {
    setToken(token){
        this.token = token;
        this.isLoggedIn = true;
    },
    removeToken(){
        this.$reset();
        const router = useRouter();
        router.push('/');
    }
},
persist: true,
})