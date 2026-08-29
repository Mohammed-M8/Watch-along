const episodesContainer = document.querySelector("#episodesContainer")
const seasonSelect = document.querySelector("#season")

const selection = async () => {
    const season = seasonSelect.value
    const showId = seasonSelect.dataset.showId

    const response = await fetch(
        `https://api.tvmaze.com/shows/${showId}/episodes?specials=false`
    )

    const episodes = await response.json()

    const seasonEpisodes = episodes.filter(
        episode =>
            episode.season === Number(season) &&
            episode.number !== null
    )

    if (seasonEpisodes.length > 0) {
        episodesContainer.innerHTML = ""
        seasonEpisodes.forEach(e => {
            episodesContainer.innerHTML += `<label class="episode"><div><input type="checkbox" name="episodes[]" value="${e.number}">${e.number} - ${e.name}</div>
            <img src="${e.image.medium}" alt="${e.name}"></label>`
        })
    }

}

seasonSelect.addEventListener("change", selection)