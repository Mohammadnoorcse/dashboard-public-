export const useDataDate = () => {
    const dateMonthFunction = (data: any) => {
        let monthShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        let d = new Date(data);
        let dYear = d.getFullYear();
        let dMonth = d.getMonth()
        let dDate = d.getDate()
        let dHours = d.getHours()
        let dMinutes = d.getMinutes()

        return dDate+'-'+monthShort[dMonth]+'-'+dYear+' '+dHours+':'+dMinutes;
    }


    const dateFunction = (data: any) => {

        let d = new Date(data);
        let dYear = d.getFullYear();
        let dMonth = d.getMonth()
        let dDate = d.getDate()
        let dHours = d.getHours()
        let dMinutes = d.getMinutes()

        return dDate+'-'+dMonth+'-'+dYear+' '+dHours+':'+dMinutes;
    }

    return {
        dateFunction,
        dateMonthFunction
    }
}