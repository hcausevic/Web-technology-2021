export const getError = (req, res) => {
    const data = {
        search: false,
    }
    res.render('../public/views/error.ejs', data);
};