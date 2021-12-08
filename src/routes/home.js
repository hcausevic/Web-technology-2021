export const getHome = (req, res) => {
    const data = {
        title: 'Web Technology 2021',
        items: [
            {
                name: 'item 1',
            },
            {
                name: 'item 2',
            }
        ]
    }
    res.render('../public/views/index.ejs', data);
};
