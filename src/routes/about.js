export const getAbout = (req, res) => {
    const data = {
        title: 'Web Technology 2021',
        search: false,
    }
    res.render('../public/views/about.ejs', data);
};