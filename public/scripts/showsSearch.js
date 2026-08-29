const searchBar = document.querySelector('#showSearch');
const showsContainer = document.querySelector('#showsContainer')

const query = () => {
    const search = searchBar.value;
    if (search) {
        fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(search)}`)
            .then(res => res.json())
            .then(data => {
                showsContainer.innerHTML = ""
                data.forEach(s => {
                    showsContainer.innerHTML += `
 <div class="show">
                    <a href="/shows/${s.show.id}">
                        ${s.show.name}
                            <img src="${s.show.image.medium}" alt="${s.show.name}">
                    </a>
                    </div>
                `
                })
            })
    } else {
        fetch('https://api.tvmaze.com/shows')
            .then(res => res.json())
            .then(data => {
                showsContainer.innerHTML = "";

                data.forEach(s => {
                    showsContainer.innerHTML += `
                        <div class="show">
                            <a href="/shows/${s.id}">
                                ${s.name}
                                <img src="${s.image?.medium || ''}" alt="${s.show.name}">
                            </a>
                        </div>
                    `;
                });
            })
    }
}

searchBar.addEventListener('input', query)