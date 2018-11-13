document.addEventListener('DOMContentLoaded', (event) => {
let allSitters = []
let allOwners = []
let allPets = []
let allTransactions = []
let currentUser
const sitterList = document.getElementById('sitter-list')
const ownerList = document.getElementById('owner-list')
const petList = document.getElementById('pet-list')
const transactionList = document.getElementById('transaction-list')
const petForm = document.querySelector('.pet-form')
const loginForm = document.querySelector('.login-form')
const transactionForm = document.querySelector('.transaction-form')

fetch('http://localhost:3000/api/v1/sitters')
.then( res => res.json())
.then( json => {
  allSitters = json
  sitterList.innerHTML = renderSitters(json)
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
owner_id: 1, //// NOTE: Add proper owner ID
name: petName,
species: petSpecies,
age: petAge,
temperament: petTemperament,
size: petSize,
photo_url: petUrl
}
fetch('http://localhost:3000/api/v1/pets', {
  method: 'POST', // or 'PUT'
  body: JSON.stringify(data), // data can be `string` or {object}!
  headers:{
    'Content-Type': 'application/json'
  }
}).then(res => res.json())
.then((json) => {
allPets.push(json) //// NOTE: Come back to Pet Display
petForm.reset()
})



}) //End petForm Listener

loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    console.log(event);
let ownerName = loginForm.querySelector('.owner-name').value
let ownerEmail = loginForm.querySelector('.owner-email').value
let ownerLocation = loginForm.querySelector('.owner-location').value

let ownerData = {
name: ownerName,
email: ownerEmail,
location: ownerLocation,
}
fetch('http://localhost:3000/api/v1/owners', {
  method: 'POST', // or 'PUT'
  body: JSON.stringify(ownerData), // data can be `string` or {object}!
  headers:{
    'Content-Type': 'application/json'
  }
}).then(res => res.json())
.then((json) => {
currentUser = json
allOwners.push(currentUser)
})


})

transactionForm.addEventListener('submit', (event) => {
    event.preventDefault();
let transactionPet = transactionForm.querySelector('.pick-pet').value
let startDate = transactionForm.querySelector('.start-date').value
let endDate = transactionForm.querySelector('.end-date').value
let transactionSitter = transactionForm.querySelector('.pick-sitter').value
// debugger;
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
}).then(res =>  res.json())
.then((json) => {
allTransactions.push(json)
console.log(json);
})


})



}) // END DOMContentLoaded


function renderSitters(sitters) {
return sitters.map((sitter) => {
  return `
  <li>
          <img src="${sitter.photo_url}">
          <h3>${sitter.name} </h3>
          <h3>${sitter.email} </h3>
          <h3>${sitter.location} </h3>
          <h2>${sitter.rate} </h2>
       <h2>${sitter.capacity} </h2>

        </li>
`
}).join(' ')

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
}).join(' ')

}
function renderPets(pets) {
return pets.map((pet) => {
  return `
  <li>
          <img src="${pet.photo_url}">
          <h3>${pet.name} </h3>
          <h3>${pet.age} </h3>
          <h3>${pet.species} </h3>
          <h2>${pet.temperament} </h2>
          <h2>${pet.size} </h2>

        </li>
`
}).join(' ')

}
