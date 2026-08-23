const searchBar = document.querySelector("#searchBar")
const usersContainer = document.querySelector("#usersContainer")

const query = () => {
    const search = searchBar.value;

    fetch(`/users/search?search=${encodeURIComponent(search)}`)
        .then(res => res.json())
        .then(users => {
            usersContainer.innerHTML = "";

            users.forEach(u => {
                if (u._id !== currentUserId) {
                    usersContainer.innerHTML += `
                 <div class="card">
                    <a href="/users/${u._id}">
                        ${u.username}
                    </a>
                </div>`
                }

            });
        }).catch(error => {
            console.log(error)

        })
}
searchBar.addEventListener('input', query)