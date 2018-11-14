let currentUser

document.addEventListener('DOMContentLoaded', (event) => {
  let allSitters = []
  let allOwners = []
  let allPets = []
  let allTransactions = []
  const sitterList = document.getElementById('sitter-list')
  const ownerList = document.getElementById('owner-list')
  const petList = document.getElementById('pet-list')
  const transactionList = document.getElementById('transaction-list')
  const petForm = document.querySelector('.pet-form')
  const loginForm = document.querySelector('.login-form')
  const transactionForm = document.querySelector('.transaction-form')
  const hideContainer = document.getElementById('hidden-without-login')
  const sitterSelectDropdown = document.getElementById('sitter-select-dropdown')
  let petSelectDropdown = document.getElementById('pet-select-dropdown')

  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let ownerName = loginForm.querySelector('.owner-name').value
    let ownerEmail = loginForm.querySelector('.owner-email').value
    let ownerLocation = loginForm.querySelector('.owner-location').value
    let ownerData = {
    name: ownerName,
    email: ownerEmail,
    location: ownerLocation,
    }



    fetch('http://localhost:3000/api/v1/owners', {
      method: 'POST',
      body: JSON.stringify(ownerData),
      headers:{
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then((json) => {
      currentUser = json
      allOwners.push(currentUser)
      petSelectDropdown.innerHTML = renderPetDropdown(allPets, currentUser)
    })

    loginForm.style.display = 'none'
    hideContainer.style.display = 'block'
  }) // End of loginForm Listener


  fetch('http://localhost:3000/api/v1/sitters')
  .then( res => res.json())
  .then( json => {
    allSitters = json
    sitterList.innerHTML = renderSitters(json)
    sitterSelectDropdown.innerHTML = renderSitterDropdown(json)
  })

  fetch('http://localhost:3000/api/v1/owners')
  .then( res => res.json())
  .then( json => {
    allOwners = json
    // ownerList.innerHTML = renderOwners(json)
  })

  fetch('http://localhost:3000/api/v1/pets')
  .then( res => res.json())
  .then( json => {
    allPets = json
    // petList.innerHTML = renderPets(json)
  })

  fetch('http://localhost:3000/api/v1/transactions')
  .then( res => res.json())
  .then( json => {
    allTransactions = json
  })


  petForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let petName = petForm.querySelector('.pet-name').value
    let petSpecies = petForm.querySelector('.pet-species').value
    let petAge = petForm.querySelector('.pet-age').value
    let petTemperament = petForm.querySelector('.pet-temperament').value
    let petSize = petForm.querySelector('.pet-size').value
    let petUrl = petForm.querySelector('.pet-url').value
    let data = {
    owner_id: currentUser.id,
    name: petName,
    species: petSpecies,
    age: petAge,
    temperament: petTemperament,
    size: petSize,
    photo_url: petUrl
    }

    fetch('http://localhost:3000/api/v1/pets', {
      method: 'POST',
      body: JSON.stringify(data),
      headers:{
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then((json) => {
      allPets.push(json)
      petForm.reset()
      let petSelectDropdown = document.getElementById('pet-select-dropdown')
      // DEBUG: Not working to render dropdown list
      petSelectDropdown.innerHTML = renderPetDropdown(allPets, currentUser)
    })
  }) //End petForm Listener


  transactionForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let transactionPet = transactionForm.querySelector('.pick-pet').value
    let startDate = transactionForm.querySelector('.start-date').value
    let endDate = transactionForm.querySelector('.end-date').value
    let transactionSitter = transactionForm.querySelector('.pick-sitter').value

    let transactionData = {
    sitter_id: 1,
    pet_id: 5,
    start_date: startDate,
    end_date: endDate,
    days_sat: 2,
    total_cost: 150
    }

    fetch('http://localhost:3000/api/v1/transactions', {
      method: 'POST',
      body: JSON.stringify(transactionData), // data can be `string` or {object}!
      headers:{
        'Content-Type': 'application/json'
      }
    })
    .then(res =>  res.json())
    .then((json) => {
      allTransactions.push(json)
    })
  }) // End of transactionForm Event Listener

}) // END DOMContentLoaded


function renderSitters(sitters) {
  return sitters.map((sitter) => {
    return `
      <li>
        <img src="${sitter.photo_url}">
        <h3>Name: ${sitter.name} </h3>
        <h3>Email: ${sitter.email} </h3>
        <h3>Location: ${sitter.location} </h3>
        <h3>Rate/hour: ${sitter.rate} </h3>
        <h3>Pet Capacity: ${sitter.capacity} </h3>
      </li>
    `
  }).join('')
}

function renderOwners(owners) {
  return owners.map((owner) => {
    return `
      <li>
        <h3>${owner.name} </h3>
        <h3>${owner.email} </h3>
        <h3>${owner.location} </h3>
      </li>
    `
  }).join('')

}

function renderPets(pets) {
  return pets.map((pet) => {
    return `
      <li>
        <img src="${pet.photo_url}">
        <h3>${pet.name}</h3>
        <h3>${pet.age} </h3>
        <h3>${pet.species} </h3>
        <h2>${pet.temperament} </h2>
        <h2>${pet.size} </h2>
      </li>
    `
  }).join('')
}

function renderSitterDropdown(sitters) {
  return sitters.map((sitter) => {
    return `<option value=${sitter.id}>${sitter.name}</option>`
  }).join('')
}

function renderPetDropdown(pets, currentUser) {
  return pets.map((pet) => {
    if (pet.id == currentUser.id) {
      return `<option value=${pet.owner_id}>${pet.name}</option>`
    }
  }).join('')
}
