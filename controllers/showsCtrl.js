const index = (req, res) => {
    res.render('shows.ejs')
}

const show = async (req, res) => {
    try {
        const id = req.params.id

        const response = await fetch(`https://api.tvmaze.com/shows/${id}`)
        const showObject = await response.json();

        res.render('show.ejs', { showObject })

    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
}

module.exports = {
    index, show
}
