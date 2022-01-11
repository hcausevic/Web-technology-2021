export const formatDate = (d) => {
    const [date, time] = new Date(d).toLocaleString().split(', ');
    return `${time} ${date}`;
};