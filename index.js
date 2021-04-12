
const newSightingForm = document.querySelector('form#new-animal-sighting-form')
const travelerLikeBtn = document.querySelector('button.like-button')
const allSightingsUl = document.querySelector('ul#animals')

function updateTraveler() {

    const travelerName = document.querySelector('h2')
    const travelerNickname = document.querySelector('em')
    const travelerPhoto = document.querySelector('img')
    const travelerLikes = document.querySelector('p.likes')

    fetch('http://localhost:3000/travelers/1')
        .then((response) => response.json())
        .then((travelerData) => {
            travelerName.textContent = `${travelerData.name}`
            travelerNickname.textContent = `${travelerData.nickname}`
            travelerPhoto.src = `${travelerData.photo}`
            travelerPhoto.alt = `${travelerData.name}`
            travelerLikes.textContent = `${travelerData.likes} Likes`
        })
}


function renderOneAnimal(animalObj) {
    const animalLi = document.createElement('li')
    animalLi.dataset.id = animalObj.id

    animalLi.innerHTML = `<p>${animalObj.description}</p>
    <img src='${animalObj.photo}' alt='${animalObj.species}'/>
    <a href=${animalObj.link} target='_blank'>Here's a video about the ${animalObj.species} species!</a>
    <p class='likes-display'>${animalObj.likes} Likes</p>
    <button class="like-button" type="button">Like</button>
    <button class="delete-button" type="button">Delete</button>
    <button class="toggle-update-form-button" type="button">Toggle Update Form</button>
    <form class="update-form" style="display: none;">
      <input type="text" value="{description here}"/>
      <input type="submit" value="Update description">
      </form>`

    const animalsUl = document.querySelector('ul#animals')
    animalsUl.append(animalLi)
}


function renderAllAnimals() {
    fetch('http://localhost:3000/animalSightings')
        .then((response) => response.json())
        .then((animalsArr) => {
            animalsArr.forEach(animalObject => {
                renderOneAnimal(animalObject)
            })
        })
}


newSightingForm.addEventListener('submit', function(event) {
    event.preventDefault()

    const newAnimalSighting = {
        travelerId: 1,
        species: event.target.species.value,
        photo: event.target.photo.value,
        link: event.target.video.value,
        description: event.target.description.value,
        likes: 0
    }
 
    fetch('http://localhost:3000/animalSightings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(newAnimalSighting)
    })
        .then((response) => response.json())
        .then((newAnimalSighting) => {
            renderOneAnimal(newAnimalSighting)
        })

        newSightingForm.reset() 
})



travelerLikeBtn.addEventListener('click', function(event) {
    event.preventDefault()

    const travDiv = document.querySelector('div#profile')
    const travelerLikes = document.querySelector('p.likes')
    const currLikes = parseInt(travelerLikes.textContent)
    travelerLikes.textContent = `${currLikes + 1} Likes`

    fetch(`http://localhost:3000/travelers/1`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ likes: currLikes + 1})
    })

})

allSightingsUl.addEventListener('click', event => {
    const animalCard = event.target.closest('li')

    if (event.target.className === 'delete-button') {
        animalCard.remove()
        fetch(`http://localhost:3000/animalSightings/${animalCard.dataset.id}`, {
            method: 'Delete'
        })
    }
    else if (event.target.className === 'like-button') {
        const likesP = event.target.previousElementSibling
        const currLikes = parseInt(likesP.textContent)
        likesP.textContent = `${currLikes + 1}`
        
        fetch(`http://localhost:3000/animalSightings/${animalCard.dataset.id}`, {
            method: "PATCH", 
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                likes: currLikes + 1
            })
        })
    }
    else if (event.target.className === 'toggle-update-form-button') {
        const updateForm = animalCard.querySelector("form.update-form")
        if (updateForm.style.display === "none") {
            updateForm.style.display = "block"
        } else {
            updateForm.style.display = "none"
        }
    }
})


allSightingsUl.addEventListener('submit', event => {
    event.preventDefault()
    if (event.target.className === "update-form") {
    const descriptionInput = event.target.querySelector("input").value
    const liToUpdate = event.target.closest("li")
    const descriptionToUpdate = liToUpdate.querySelector("p")
    descriptionToUpdate.textContent = descriptionInput
    
    fetch(`http://localhost:3000/animalSightings/${liToUpdate.dataset.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ description: descriptionInput })
    })
    }
})


updateTraveler()
renderAllAnimals()

