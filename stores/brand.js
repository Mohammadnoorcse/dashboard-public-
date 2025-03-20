export const useBrandStore = defineStore("brand", {
    state: () => ({
        loading: false,
        BrandList: [],
        brands: [],
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
        // Add Brands In "/brand/create" Page
        async addBrand(BrandData) {
            const config = useRuntimeConfig();
            const EndPoint = config.public.baseURl;
            const MasterKey = config.public.masterToken;
            const app_token = useTokenStore().getToken;
            const formData = BrandData;
            try {
                const res = await fetch(`${EndPoint}/admin/${MasterKey}/brand`, {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${app_token}`,
                    },
                    body: JSON.stringify(formData),
                });
                const data = await res.json();
                console.log('api',data);
                if (data && data[0] === "Success") {
                    return { success: true, message: 'Brand Added Successfully' };
                } else {
                    return { success: false, message: 'Invalid credentials' };
                }
            } catch (error) {
                console.log(error);
                return { success: false, message: 'An error Occurred During Add brand' };
            }
        },
        // Show Brands & Paginate In "/brand" Page
        async getAllBrands(page = 1) {
            const config = useRuntimeConfig();
            const EndPoint = config.public.baseURl;
            const MasterKey = config.public.masterToken;
            const app_token = useTokenStore().getToken;
            this.loading = true;
            try {
                const res = await fetch(`${EndPoint}/admin/${MasterKey}/brand?relative=categories&page=${page}&limit_per_page=${this.pagination.perPage}`, {
                    method: 'GET',
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${app_token}`,
                    },
                });
                const data = await res.json();
                console.log(this.brands);
                this.brands = data.data;
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
        // Delete brand In "/brand" Page
        async deleteBrand(id) {
            const config = useRuntimeConfig();
            const EndPoint = config.public.baseURl;
            const MasterKey = config.public.masterToken;
            const app_token = useTokenStore().getToken;
            try {
                const res = await fetch(`${EndPoint}/admin/${MasterKey}/brand/${id}`, {
                    method: "DELETE",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${app_token}`,
                    },
                });
                const data = await res.json();
                if (data === "Success") {
                    return { success: true, message: 'Brand Deleted Successfully' };
                } else {
                    return { success: false, message: 'Invalid credentials' };
                }
            } catch (error) {
                console.log(error);
                return { success: false, message: 'An error occurred during login' };
            }
        },
        // Get brand List In "/brand/" Page
        async getBrandList() {
            const config = useRuntimeConfig();
            const EndPoint = config.public.baseURl;
            const MasterKey = config.public.masterToken;
            const app_token = useTokenStore().getToken;
            try {
                const res = await fetch(`${EndPoint}/admin/${MasterKey}/brand`, {
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
        //SingleShow brand In "/brand/:id" Page
        async getSingleBrand(id) {
            const config = useRuntimeConfig();
            const EndPoint = config.public.baseURl;
            const MasterKey = config.public.masterToken;
            const app_token = useTokenStore().getToken;
            try {
                const res = await fetch(`${EndPoint}/admin/${MasterKey}/brand/${id}`, {
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
        // Update Slide In "/brand/:id" Page
        async updateBrand(brandData, id) {
            const config = useRuntimeConfig();
            const EndPoint = config.public.baseURl;
            const MasterKey = config.public.masterToken;
            const app_token = useTokenStore().getToken;
            const formData = brandData;
            try {
                const res = await fetch(`${EndPoint}/admin/${MasterKey}/brand/${id}`, {
                    method: "PUT",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${app_token}`,
                    },
                    body: JSON.stringify(formData),
                });
                const data = await res.json();
                return data;
            } catch (error) {
                console.log(error);
                return { success: false, message: 'An error occurred during Request' };
            }
        },
        //Filtered Brand Data In "/brand/"Page
        async filterdData(brandName, brandStatus) {
            const config = useRuntimeConfig();
            const EndPoint = config.public.baseURl;
            const MasterKey = config.public.masterToken;
            const app_token = useTokenStore().getToken;
        
            try {
                // Construct query parameters dynamically
                const queryParams = new URLSearchParams();
                if (brandName && brandName !== undefined) queryParams.append('name', brandName);
                if (brandStatus !== null) queryParams.append('status', brandStatus);
        
                // Build the full URL with query parameters
                const url = `${EndPoint}/admin/${MasterKey}/brand?${queryParams.toString()}`;
        
                const res = await fetch(url, {
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