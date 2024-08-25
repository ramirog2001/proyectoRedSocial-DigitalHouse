const URL_BASE = 'https://jsonplaceholder.typicode.com/posts'
let posts = []
function getData() {
    fetch(URL_BASE)
        .then(response => response.json())
        .then(data => {
            posts = data
            renderPostList()
        })
        .catch(error => console.error('Error:', error))
}

getData()

function renderPostList(){
    const postList = document.getElementById('postList')
    postList.innerHTML = ''
    posts.forEach(post => {
        const postItem = document.createElement('li')
        postItem.classList.add('postItem')
        postItem.innerHTML = `
            <strong>${post.title}</strong>
            <p>${post.body}</p>
            <button onclick="editPost(${post.id})" class="editButton">Editar</button>
            <button onclick="deletePost(${post.id})" class="deleteButton">Borrar</button>
            <div id="editForm-${post.id}" class="editForm" style="display:none">
                <label for="editTitle">Título:</label>
                <input type="text" id="editTitle-${post.id}" value="${post.title}" required>
                <label for="editBody">Contenido:</label>
                <textArea type="text" id="editBody-${post.id}" rows="3" required>${post.body}</textArea>
                <button onclick="updatePost(${post.id})">Actualizar</button>
            </div>
        `
        postList.appendChild(postItem)
    })
}

function postData() {
    const postTitle = document.getElementById('postTitle')
    const postBody = document.getElementById('postBody')

    if(postTitle.value.trim() == "" || postBody.value.trim() == ""){
        alert("Los campos son obligatorios")
        return;
    }

    fetch(URL_BASE, {
        method: 'POST',
        body: JSON.stringify({
            title: postTitle.value,
            body: postBody.value, 
            userId: 1,

        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then(response => response.json())
        .then(data => {
            posts.unshift(data)
            renderPostList()
            postTitle.value = ""
            postBody.value = ""
        })
        .catch(error => console.error("Error al postear:", error))
}

function editPost(id) {
    const editForm = document.getElementById(`editForm-${id}`)
    editForm.style.display = (editForm.style.display == 'none') ? 'block' : 'none'
}

function updatePost(id) {
    const editTitle = document.getElementById(`editTitle-${id}`)
    const editBody = document.getElementById(`editBody-${id}`)
    fetch(`${URL_BASE}/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            id: id,
            title: editTitle.value,
            body: editBody.value,
            userId: 1,
        }),
        headers:{
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then(response => response.json())
        .then(data => {
            const index = posts.findIndex(post => post.id == data.id)
            if(index != -1){
                posts[index] = data
                renderPostList()
            }
            else
                alert('Hubo un error al encontrar el posteo')
        })
        .catch(error => console.error("Error al actualizar:", error))
}


function deletePost(id) {
    fetch(`${URL_BASE}/${id}`, {
        method: 'DELETE',
    })
    .then(response => {
        if(response.ok){
            posts = posts.filter(post => post.id != id)
            renderPostList()
        }
        else{
            alert('Error al elminar el posteo')
        }
    })
    .catch(error => console.error('Error al eliminar el posteo:', error))

}
