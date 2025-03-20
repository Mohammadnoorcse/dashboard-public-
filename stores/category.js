export const useCategoryStore = defineStore("category", {
    state: () => ({
        loading: false,
        CategoryList: [],
        categories: [],
        cat: [],
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
        // Add Categories In "/category/create" Page
        async addCategory(categoryData) {
            const config = useRuntimeConfig();
            const EndPoint = config.public.baseURl;
            const MasterKey = config.public.masterToken;
            const app_token = useTokenStore().getToken;
            const formData = categoryData;
            try {
                const res = await fetch(`${EndPoint}/admin/${MasterKey}/category`, {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${app_token}`,
                    },
                    body: JSON.stringify(formData),
                });
                const data = await res.json();
                console.log(formData);
                if (data && data[0] === "Success") {
                    return { success: true, message: 'Category Added Successfully' };
                } else {
                    return { success: false, message: 'Something is Wrong' };
                }
            } catch (error) {
                console.log(error);
                return { success: false, message: 'An error Occurred During Add Category' };
            }
        },


        // Add Categories In "/category/create" Page
        async updateCategory(categoryData) {
            const config = useRuntimeConfig();
            const EndPoint = config.public.baseURl;
            const MasterKey = config.public.masterToken;
            const app_token = useTokenStore().getToken;
            const formData = categoryData;
            try {
                const res = await fetch(`${EndPoint}/admin/${MasterKey}/category/${formData.id}`, {
                    method: "PUT",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${app_token}`,
                    },
                    body: JSON.stringify(formData),
                });
                const data = await res.json();
                console.log(data);
                if (data && data[0] === "Success") {
                    return { success: true, message: 'Category Updated Successfully' };
                } else {
                    return { success: false, message: 'Something is Wrong' };
                }
            } catch (error) {
                console.log(error);
                return { success: false, message: 'An error Occurred During Add Category' };
            }
        },

        // Show Categories & Paginate In "/category" Page
        async getAllCategories(page = 1) {
            const config = useRuntimeConfig();
            const EndPoint = config.public.baseURl;
            const MasterKey = config.public.masterToken;
            const app_token = useTokenStore().getToken;
            this.loading = true;
            try {
                const res = await fetch(`${EndPoint}/admin/${MasterKey}/category?relative=categories&page=${page}&limit_per_page=${this.pagination.perPage}&nestedLable=4`, {
                    method: 'GET',
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${app_token}`,
                    },
                });
                const data = await res.json();
                // console.log("Data:>",data);
                this.categories = data.data;
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
        // Delete Category In "/category" Page
        async deleteCategory(id) {
            const config = useRuntimeConfig();
            const EndPoint = config.public.baseURl;
            const MasterKey = config.public.masterToken;
            const app_token = useTokenStore().getToken;
            try {
                const res = await fetch(`${EndPoint}/admin/${MasterKey}/category/${id}`, {
                    method: "DELETE",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${app_token}`,
                    },
                });
                const data = await res.json();
                if (data === "Success") {
                    return { success: true, message: 'Category Deleted Successfully' };
                } else {
                    return { success: false, message: 'Invalid credentials' };
                }
            } catch (error) {
                console.log(error);
                return { success: false, message: 'An error occurred during login' };
            }
        },
        // Get Category List In "/category/" Page
        async getCategoryList() {
            const config = useRuntimeConfig();
            const EndPoint = config.public.baseURl;
            const MasterKey = config.public.masterToken;
            const app_token = useTokenStore().getToken;
            try {
                const data = await $fetch(`${EndPoint}/admin/${MasterKey}/category?parent_id=0&data=all&nestedLable=4`, {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${app_token}`,
                    },
                });
                this.CategoryList = data;
            } catch (error) {
                console.log(error);
            }
        },
        //SingleShow Category In "/category/:id" Page
        async getSingleCategory(id) {
            const config = useRuntimeConfig();
            const EndPoint = config.public.baseURl;
            const MasterKey = config.public.masterToken;
            const app_token = useTokenStore().getToken;
            try {
                const res = await fetch(`${EndPoint}/admin/${MasterKey}/category/${id}`, {
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
        // Get Filterd Data In "/category" Page
        async getFilteredCategoriList(filteredName) {
            const config = useRuntimeConfig();
            const EndPoint = config.public.baseURl;
            const MasterKey = config.public.masterToken;
            const app_token = useTokenStore().getToken;
            try {
                const data = await $fetch(`${EndPoint}/admin/${MasterKey}/category?name=${filteredName}`, {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${app_token}`,
                    },
                });
                this.CategoryList = data;
            } catch (error) {
                console.log(error);
            }
        },
        //Filtered Category Data In "/Category/"Page
        async filterdData(categoryName, categoryStatus) {
            const config = useRuntimeConfig();
            const EndPoint = config.public.baseURl;
            const MasterKey = config.public.masterToken;
            const app_token = useTokenStore().getToken;
            try {
                const res = await fetch(`${EndPoint}/admin/${MasterKey}/category?${categoryName ? `name=${categoryName}` : ''}${categoryName && categoryStatus ? '&' : ''}${categoryStatus ? `status=${categoryStatus}` : ''}`, {
                    method: 'GET',
                    headers: {
                      Accept: "application/json",
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${app_token}`,
                    }
                  });
              const data = await res.json();
              return data;
            } catch (error) {
              console.log(error);
              return { success: false, message: 'An error occurred during filtering' };
            }
          },

            async fetchCategories() {
                const config = useRuntimeConfig();
                const EndPoint = config.public.baseURl;
                const MasterKey = config.public.masterToken;
                const app_token = useTokenStore().getToken;

                try {
                    const data = await $fetch(`${EndPoint}/admin/${MasterKey}/category?parent_id=0&data=all&nestedLable=4`, {
                        method: 'GET',
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${app_token}`,
                        },
                    });

                    this.cat = data || []; // Ensure array format
                    // console.log("Fetched Categories:", this.cat); 
                } catch (error) {
                    console.error("Error fetching categories:", error);
                }
            },
        },
        
});