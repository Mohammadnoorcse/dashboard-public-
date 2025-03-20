export const useVendorStore = defineStore("vendor", {
    state: () => ({
        loading: false,
        VendorList: [],
        Vendors: [],
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
        // Add Vendors In "/Vendor/create" Page
        async addVendor(VendorData) {
            const config = useRuntimeConfig();
            const EndPoint = config.public.baseURl;
            const MasterKey = config.public.masterToken;
            const app_token = useTokenStore().getToken;
            const formData = VendorData;
        
            try {
                
                const res = await fetch(`${EndPoint}/admin/${MasterKey}/vendor`, {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${app_token}`,
                    },
                    body: JSON.stringify(formData),
                });
        
                const data = await res.json();
        
                if (res.ok) {
                    return { success: true, message: 'Vendor Added Successfully' };
                } else {
                    
                    return { success: false, message: 'Something is Wrong!' };
                }
            } catch (error) {
               
                console.error('Error during API call:', error);
                return { success: false, message: 'An error Occurred During Add Vendor' };
            }
        },
        // Show Vendors & Paginate In "/Vendor" Page
        async getAllVendors(page = 1) {
            const config = useRuntimeConfig();
            const EndPoint = config.public.baseURl;
            const MasterKey = config.public.masterToken;
            const app_token = useTokenStore().getToken;
            this.loading = true;
            try {
                const res = await fetch(`${EndPoint}/admin/${MasterKey}/vendor?page=${page}&limit_per_page=${this.pagination.perPage}`, {
                    method: 'GET',
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${app_token}`,
                    },
                });
                const data = await res.json();
                console.log(data);
                this.Vendors = data.data;
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
        // Delete Vendor In "/Vendor" Page
        async deleteVendor(id) {
            const config = useRuntimeConfig();
            const EndPoint = config.public.baseURl;
            const MasterKey = config.public.masterToken;
            const app_token = useTokenStore().getToken;
            try {
                const res = await $fetch(`${EndPoint}/admin/${MasterKey}/vendor/${id}`, {
                    method: "DELETE",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${app_token}`,
                    },
                });
        
                
                console.log("api",res);
                if (res && res.status === "Success" ) {
                    return { success: true, message: 'Vendor Deleted Successfully' };
                } else {
                    return { success: false, message: 'Something went wrong on the request' };
                }
            } catch (error) {
                console.log(error);
                return { success: false, message: 'An error occurred during the API call' };
            }
        },
        // Get Vendor List In "/Vendor/" Page
        async getVendorList() {
            const config = useRuntimeConfig();
            const EndPoint = config.public.baseURl;
            const MasterKey = config.public.masterToken;
            const app_token = useTokenStore().getToken;
            try {
                const res = await fetch(`${EndPoint}/admin/${MasterKey}/vendor`, {
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
        //SingleShow Vendor In "/Vendor/:id" Page
        async getSingleVendor(id) {
            const config = useRuntimeConfig();
            const EndPoint = config.public.baseURl;
            const MasterKey = config.public.masterToken;
            const app_token = useTokenStore().getToken;
            try {
                const res = await fetch(`${EndPoint}/admin/${MasterKey}/vendor/${id}`, {
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
                return { success: false, message: 'An error occurred during Api Call' };
            }
        },
        //Updated Vendor In "/Vendor/:id" Page
        async updateVendor(VendorData, id) {
            const config = useRuntimeConfig();
            const EndPoint = config.public.baseURl;
            const MasterKey = config.public.masterToken;
            const app_token = useTokenStore().getToken;
            const formData = VendorData;
            try {
                const res = await $fetch(`${EndPoint}/admin/${MasterKey}/vendor/${id}`, {
                    method: "PUT",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${app_token}`,
                    },
                    body: JSON.stringify(formData),
                });

                console.log('updated',res);
                if (res === "Success") {
                    return { success: true, message: 'Vendor Updated Successfully' };
                } else {
                    return { success: false, message: 'Something wrong on Request' };
                }
            } catch (error) {
                console.log(error);
                return { success: false, message: 'An error Occurred During Update Vendor' };
            }
        },
        //Filtered Vendor Data In "/Vendor/"Page
        async filterdData(vendorName, vendorStatus) {
            const config = useRuntimeConfig();
            const EndPoint = config.public.baseURl;
            const MasterKey = config.public.masterToken;
            const app_token = useTokenStore().getToken;
            
            // Construct query parameters conditionally
            const queryParameters = [];
            if (vendorName) queryParameters.push(`name=${encodeURIComponent(vendorName)}`);
            if (vendorStatus) queryParameters.push(`status=${encodeURIComponent(vendorStatus)}`);
        
            const queryString = queryParameters.length ? `?${queryParameters.join('&')}` : '';
        
            try {
                const res = await fetch(`${EndPoint}/admin/${MasterKey}/vendor${queryString}`, {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${app_token}`,
                    },
                });
        
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
        
                const data = await res.json();
                return data;
            } catch (error) {
                console.error(error);
                return { success: false, message: 'An error occurred during filtering' };
            }
        }

    }
})