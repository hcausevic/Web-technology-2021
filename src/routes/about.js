export const getAbout = (req, res) => {
    const data = {
        search: false,
    }
    res.render('../public/views/about.ejs', data);
};