document.addEventListener('DOMContentLoaded', (event) => {
let allSitters = []
let allOwners = []
let allPets = []
let allTransactions = []

const sitterList = document.getElementById('sitter-list')
const ownerList = document.getElementById('owner-list')
const petList = document.getElementById('pet-list')
const transactionList = document.getElementById('transaction-list')


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
  ownerList.innerHTML = renderOwners(json)
})

fetch('http://localhost:3000/api/v1/pets')
.then( res => res.json())
.then( json => {
  allPets = json
  petList.innerHTML = renderPets(json)
})

fetch('http://localhost:3000/api/v1/transactions')
.then( res => res.json())
.then( json => {
  allTransactions = json
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
