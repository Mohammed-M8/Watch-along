const index = async (req, res) => {
    try {
        const response = await fetch(`https://api.tvmaze.com/shows`)
        const shows = await response.json();
        res.render('shows/index.ejs', { shows })

    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
}


const show = async (req, res) => {
    try {
        const id = req.params.id
        const response = await fetch(`https://api.tvmaze.com/shows/${id}`)
        const showObject = await response.json();

        res.render('shows/show.ejs', { showObject })

    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
}

module.exports = {
    index, show
}
