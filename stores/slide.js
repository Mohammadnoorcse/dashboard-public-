export const useSlideStore = defineStore("slide", {
  state: () => ({
    status: null,
    loading: false,
    SlideList: [],
    slides: [],
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
    // Add Slides In "/slide/create" Page
    async addSlide(slideData) {
      const config = useRuntimeConfig();
      const EndPoint = config.public.baseURl;
      const MasterKey = config.public.masterToken;
      const app_token = useTokenStore().getToken;
      const formData = slideData;
      try {
        const res = await fetch(`${EndPoint}/admin/${MasterKey}/slide`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${app_token}`,
          },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data && data.status === "Success") {
          return { success: true };
        } else {
          return { success: false, message: 'Invalid credentials' };
        }
      } catch (error) {
        console.log(error);
        return { success: false, message: 'An error occurred during login' };
      }
    },
    // Show Slides & Paginate In "/slide" Page
    async getAllSlides(page = 1) {
      const config = useRuntimeConfig();
      const EndPoint = config.public.baseURl;
      const MasterKey = config.public.masterToken;
      const app_token = useTokenStore().getToken;
      this.loading = true;
      try {
        const res = await fetch(`${EndPoint}/admin/${MasterKey}/slide?page=${page}&limit_per_page=${this.pagination.perPage}`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${app_token}`,
          },
        });
        const data = await res.json();
        this.slides = data.data;
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
    // Get Slide List In "/slide/" Page
    async getSlidesList() {
      const config = useRuntimeConfig();
      const EndPoint = config.public.baseURl;
      const MasterKey = config.public.masterToken;
      const app_token = useTokenStore().getToken;
      try {
        const res = await fetch(`${EndPoint}/admin/${MasterKey}/slide`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${app_token}`,
          },
        });
        const data = await res.json();
        this.SlideList = data.data;
      } catch (error) {
        console.log(error);
      }
    },
    // Delete Slide In "/slide" Page
    async deleteSlide(id) {
      const config = useRuntimeConfig();
      const EndPoint = config.public.baseURl;
      const MasterKey = config.public.masterToken;
      const app_token = useTokenStore().getToken;
      try {
        const res = await fetch(`${EndPoint}/admin/${MasterKey}/slide/${id}`, {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${app_token}`,
          },
        });
        const data = await res.json();
        if (data === "Success") {
          await this.getAllSlides();// Refresh the slides
          return { success: true, message: 'Slide deleted successfully' };
        } else {
          return { success: false, message: 'Failed to delete slide' };
        }
      } catch (error) {
        console.log(error);
        return { success: false, message: 'An error occurred during delete' };
      }
    },
    //SingleShow Slide In "/slide/:id" Page
    async getSingleSlide(id) {
      const config = useRuntimeConfig();
      const EndPoint = config.public.baseURl;
      const MasterKey = config.public.masterToken;
      const app_token = useTokenStore().getToken;
      try {
        const res = await fetch(`${EndPoint}/admin/${MasterKey}/slide/${id}`, {
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
    // Update Slide In "/slide/:id" Page
    async updateSlide(slideData, id) {
      const config = useRuntimeConfig();
      const EndPoint = config.public.baseURl;
      const MasterKey = config.public.masterToken;
      const app_token = useTokenStore().getToken;
      const formData = slideData;
      try {
        const res = await fetch(`${EndPoint}/admin/${MasterKey}/slide/${id}`, {
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
        return { success: false, message: 'An error occurred during login' };
      }
    },
    //Filtered Slide Data In "/slide/"Page
    async filterdData(slideName) {
      const config = useRuntimeConfig();
      const EndPoint = config.public.baseURl;
      const MasterKey = config.public.masterToken;
      const app_token = useTokenStore().getToken;
      // console.log(slideName, slideStatus)
      try {
        const res = await fetch(`${EndPoint}/admin/${MasterKey}/slide?name=${slideName}`, {
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
  },
});