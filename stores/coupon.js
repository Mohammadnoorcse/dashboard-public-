export const useCouponStore = defineStore ("Coupon",{
    state : () => ({
        loading : false,
        couponList : [],
        coupons:[],
        pagination: {
            currentPage: 1,
            totalPages: 1,
            perPage: 15,
            totalItems: 0,
            links: [],
        },
    }),
    getters: {
        status: (state) => state.status,
        isLoading: (state) => state.loading,
        currentPage: (state) => state.pagination.currentPage,
        totalPages: (state) => state.pagination.totalPages,
        totalItems: (state) => state.pagination.totalItems,
        currentPage: (state) => state.pagination.currentPage,
    },
    actions: {
                // Add Coupons In "/coupon/create" Page
                async addcoupon(couponData) {
                    const config = useRuntimeConfig();
                    const EndPoint = config.public.baseURl;
                    const MasterKey = config.public.masterToken;
                    const app_token = useTokenStore().getToken;
                    const formData = couponData;
                    try {
                        const res = await fetch(`${EndPoint}/admin/${MasterKey}/coupon`, {
                            method: "POST",
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${app_token}`,
                            },
                            body: JSON.stringify(formData),
                        });
                        const data = await res.json();
                        if (data && data[0] === "Success") {
                            return { success: true, message: 'Coupon Added Successfully' };
                        } else {
                            return { success: false, message: 'Invalid credentials' };
                        }
                    } catch (error) {
                        console.log(error);
                        return { success: false, message: 'An error Occurred During Add coupon' };
                    }
                },
                // Show Coupons & Paginate In "/coupon" Page
                async getAllCoupons(page = 1) {
                    const config = useRuntimeConfig();
                    const EndPoint = config.public.baseURl;
                    const MasterKey = config.public.masterToken;
                    const app_token = useTokenStore().getToken;
                    this.loading = true;
                    try {
                        const res = await fetch(`${EndPoint}/admin/${MasterKey}/coupon?page=${page}&limit_per_page=${this.pagination.perPage}`, {
                            method: 'GET',
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${app_token}`,
                            },
                        });
                        const data = await res.json();
                        console.log(data);
                        this.coupons = data.data;
                        this.pagination.currentPage = data.current_page;
                        this.pagination.totalPages = data.last_page;
                        this.pagination.totalItems = data.total;
                        this.pagination.links = data.links;
                    } catch (error) {
                        console.log(error);
                    } finally {
                        this.loading = false;
                    }
                },
                // Delete coupon In "/coupon" Page
                async deleteCoupon(id) {
                    const config = useRuntimeConfig();
                    const EndPoint = config.public.baseURl;
                    const MasterKey = config.public.masterToken;
                    const app_token = useTokenStore().getToken;
                    try {
                        const res = await fetch(`${EndPoint}/admin/${MasterKey}/coupon/${id}`, {
                            method: "DELETE",
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${app_token}`,
                            },
                        });
                        const data = await res.json();
                        if (data === "Success") {
                            return { success: true, message: 'Coupon Deleted Successfully' };
                        } else {
                            return { success: false, message: 'Invalid credentials' };
                        }
                    } catch (error) {
                        console.log(error);
                        return { success: false, message: 'An error occurred during login' };
                    }
                },
                // Get coupon List In "/coupon/" Page
                async getcouponList() {
                    const config = useRuntimeConfig();
                    const EndPoint = config.public.baseURl;
                    const MasterKey = config.public.masterToken;
                    const app_token = useTokenStore().getToken;
                    try {
                        const res = await fetch(`${EndPoint}/admin/${MasterKey}/coupon`, {
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${app_token}`,
                            },
                        });
                        const data = await res.json();
                        this.categories = data.data;
                    } catch (error) {
                        console.log(error);
                    }
                },
                //SingleShow coupon In "/coupon/:id" Page
                async getSingleCoupon(id) {
                    const config = useRuntimeConfig();
                    const EndPoint = config.public.baseURl;
                    const MasterKey = config.public.masterToken;
                    const app_token = useTokenStore().getToken;
                    try {
                        const res = await fetch(`${EndPoint}/admin/${MasterKey}/coupon/${id}`, {
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${app_token}`,
                            },
                        });
                        const data = await res.json();
                        return data;
                    } catch (error) {
                        console.log(error);
                    }
                },
                // Update Coupon In "/brand/:id" Page
                async updateCoupon(couponData, id) {
                    const config = useRuntimeConfig();
                    const EndPoint = config.public.baseURl;
                    const MasterKey = config.public.masterToken;
                    const app_token = useTokenStore().getToken;
                    const formData = couponData;
                    try {
                        const res = await $fetch(`${EndPoint}/admin/${MasterKey}/coupon/${id}`, {
                            method: "PUT",
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${app_token}`,
                            },
                            body: JSON.stringify(formData),
                        });
                        if (res === "Success") {
                            return { success: true, message: 'Coupon Updated Successfully' };
                        } else {
                            return { success: false, message: 'Something wrong on Request' };
                        }
                    } catch (error) {
                        console.log(error);
                        return { success: false, message: 'An error Occurred During Update Coupon' };
                    }
                },
                //Filtered Coupon Data In "/coupon/"Page
                async filterdData(couponName, couponStatus) {
                    const config = useRuntimeConfig();
                    const EndPoint = config.public.baseURl;
                    const MasterKey = config.public.masterToken;
                    const app_token = useTokenStore().getToken;
                
                    // Construct query parameters dynamically
                    const queryParams = [];
                    if (couponName) queryParams.push(`name=${encodeURIComponent(couponName)}`);
                    if (couponStatus) queryParams.push(`status=${encodeURIComponent(couponStatus)}`);
                    const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';
                
                    try {
                        const res = await fetch(`${EndPoint}/admin/${MasterKey}/coupon${queryString}`, {
                            method: "GET",
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${app_token}`,
                            },
                        });
                        const data = await res.json();
                        return data;
                    } catch (error) {
                        console.log(error);
                        return { success: false, message: 'An error occurred during filtering' };
                    }
                }
    }
})