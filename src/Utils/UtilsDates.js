import dayjs from 'dayjs'
export const dateFormatTemplate = 'DD/MM/YYYY';

export let timestampToString = (timestamp) => {
    const date = dayjs.unix(timestamp/1000);
    const formattedDate = date.format(dateFormatTemplate);
    return formattedDate;
}

export let timestampToDate = (timestamp) => {
    let dateInString = timestampToString(timestamp)
    return dayjs(dateInString, dateFormatTemplate)
}