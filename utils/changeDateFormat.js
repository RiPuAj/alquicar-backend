export const changeDateFormat = (date) => {
    const formattedDate = date.replace("T", " ").replace("Z", "");
    return formattedDate; 
}