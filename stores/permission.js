export const usePermissionStore = defineStore('permission', {
    state: () => ({
      accessMenu: {},
      allAccess: {},
      loading: false,
    }),
    actions: {
      async getPermissions() {
        const config = useRuntimeConfig();
        const EndPoint = config.public.baseURl;
        const MasterKey = config.public.masterToken;
        const tokenStore = useTokenStore();
        const authToken = tokenStore.getToken; //get token
  
        if (!authToken) {
          return { success: false, message: 'User is not authenticated' };
        }
  
        // this.loading = true;
        try {
          const res = await fetch(`${EndPoint}/admin/${MasterKey}/currentAccess`, {
            method: 'GET',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
          });
  
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(`API error: ${res.status} - ${errorData.message || 'Unknown error'}`);
          }
  
          const data = await res.json();
          // console.log("Permissions Data:", data);
  
          if (data.accessMenu && Object.keys(data.accessMenu).length > 0 && 
              data.allAccess && Object.keys(data.allAccess).length > 0) {
            this.accessMenu = data.accessMenu;
            this.allAccess = data.allAccess;
            return { success: true };
          } else {
            return { success: false, message: 'Invalid permission structure' };
          }
        } catch (error) {
          console.error("Error fetching permissions:", error);
          return { success: false, message: error.message || 'An error occurred while fetching permissions' };
        } finally {
          this.loading = true;
        }
      },
      removePermissions() {
        this.$reset();
      },
    },
    persist: true,
  });