
module.exports = function applyRoutes(app)  {
    app.get('/', (req, res) => {
        res.send('Hello World!');
    });
};