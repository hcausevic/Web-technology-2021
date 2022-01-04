export const getError = (req, res) => {
    const data = {
        title: 'Web Technology 2021',
        search: false,
    }
    res.render('../public/views/error.ejs', data);
};