let currentUser

document.addEventListener('DOMContentLoaded', (event) => {
  let allSitters = []
  let allOwners = []
  let allPets = []
  let allTransactions = []
  const formHeader = document.getElementById('pet-form-header')
  const sitterList = document.getElementById('sitter-list')
  const petList = document.getElementById('pet-list')
  const transactionTable = document.getElementById('transaction-table')
  const petForm = document.querySelector('.pet-form')
  const loginForm = document.querySelector('.login-form')
  const transactionForm = document.querySelector('.transaction-form')
  const hideContainer = document.getElementById('hidden-without-login')
  const sitterSelectDropdown = document.getElementById('sitter-select-dropdown')
  let petSelectDropdown = document.getElementById('pet-select-dropdown')
  let transactionCalculatorDiv = document.getElementById('transaction-calculator')

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
      petList.innerHTML = myPetsFilter(allPets)
      transactionTable.innerHTML += renderTransactions(allTransactions, currentUser, currentUser)
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
    // allPets = selectAllPets(json)

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
    if(event.target.dataset.action === "create-new") {
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
          petList.scrollIntoView({behavior: "smooth"})
          petForm.reset()
          let petSelectDropdown = document.getElementById('pet-select-dropdown')
          petSelectDropdown.innerHTML = renderPetDropdown(allPets, currentUser)
          petList.innerHTML = myPetsFilter(allPets)
             formHeader.innerText = "Add a New Pet!"
        })
    } else if (event.target.dataset.action === "edit-current") {
      fetch(`http://localhost:3000/api/v1/pets/${event.target.dataset.id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .then((json) => {
       let editedPet = allPets.find((pet) => {
         return json.id == pet.id
       })

       editedPet.name = json.name
       editedPet.age = json.age
       editedPet.temperament = json.temperament
       editedPet.species = json.species
       editedPet.size = json.size
       editedPet.photo_url = json.photo_url
      petForm.reset()
      let petSelectDropdown = document.getElementById('pet-select-dropdown')
      petSelectDropdown.innerHTML = renderPetDropdown(allPets, currentUser)
      petList.innerHTML = myPetsFilter(allPets)
      formHeader.innerText = "Add a New Pet!"
      petList.scrollIntoView({behavior: "smooth"})
      })
    }
  }) //End petForm Listener


  transactionForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let transactionPet = transactionForm.querySelector('#pet-select-dropdown').value
    let startDate = transactionForm.querySelector('#start-date').value
    let endDate = transactionForm.querySelector('#end-date').value
    let transactionSitter = transactionForm.querySelector('#sitter-select-dropdown').value
    let transactionSitterObject = findSitter(transactionSitter, allSitters)
    let daysSat = calculateDaysSat(startDate, endDate)
    let totalCost =  calculateCost(daysSat, transactionSitterObject)
    let transactionData = {
    sitter_id: transactionSitter,
    pet_id: transactionPet,
    start_date: startDate,
    end_date: endDate,
    days_sat: daysSat,
    total_cost: totalCost
    }

    if (event.target.dataset.action === "new-transaction") {
      fetch('http://localhost:3000/api/v1/transactions', {
        method: 'POST',
        body: JSON.stringify(transactionData),
        headers:{
          'Content-Type': 'application/json'
        }
      })
      .then(res =>  res.json())
      .then((json) => {
        allTransactions.push(json)
        transactionTable.innerHTML += renderSingleTransaction(json, currentUser)
        transactionTable.scrollIntoView({behavior: "smooth"})
        transactionForm.reset()
        transactionCalculatorDiv.innerHTML = ""
      })
    } else if (event.target.dataset.action === "edit-transaction") {
        let foundTransaction = findTransaction(event.target.dataset.transactionid, allTransactions)
        transactionData.id = foundTransaction.id
        fetch(`http://localhost:3000/api/v1/transactions/${foundTransaction.id}`, {
          method: 'PATCH',
          body: JSON.stringify(transactionData),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(res => res.json())
        .then((json) => {
          foundTransaction.sitter_id = json.sitter_id
          foundTransaction.pet_id = json.pet_id
          foundTransaction.days_sat = json.days_sat
          foundTransaction.total_cost = json.total_cost
          foundTransaction.start_date = json.start_date
          foundTransaction.end_date = json.end_date
          let editedRow = transactionTable.querySelector(`[data-transactionid="${foundTransaction.id}"]`)
          editedRow.innerHTML = renderSingleTransaction(json)
         })
         transactionForm.reset()
         transactionCalculatorDiv.innerHTML = ""
         let sitterSelectDropdown = document.getElementById("sitter-select-dropdown")
         sitterSelectDropdown.innerHTML = renderSitterDropdown(allSitters)
         transactionTable.scrollIntoView({behavior: "smooth"})
         transactionForm.querySelector("#transaction-header").innerText = "New Sitter Reservation"
    }

  }) // End of transactionForm Event Listener

  transactionForm.addEventListener('change', event => {
    let transactionPet = transactionForm.querySelector('#pet-select-dropdown').value
    let startDate = transactionForm.querySelector('#start-date').value
    let endDate = transactionForm.querySelector('#end-date').value
    let transactionSitter = transactionForm.querySelector('#sitter-select-dropdown').value
    let transactionSitterObject = findSitter(transactionSitter, allSitters)
    let daysSat = calculateDaysSat(startDate, endDate)
    let totalCost =  calculateCost(daysSat, transactionSitterObject)

    if (transactionSitter !== undefined && startDate !== "" && endDate !== "") {
      transactionCalculatorDiv.innerHTML = renderTransactionCalculator(daysSat,totalCost)
    } else {
      transactionCalculatorDiv.innerHTML = ""
    }


  }) /// Transaction Form Change Listener

  petList.addEventListener('click', (event) => {
    if(event.target.name === "edit-pet") {
       formHeader.innerText = "Edit This Pet!"
      petForm.dataset.action = "edit-current"
       let foundPet = findPet(event, allPets)
       petForm.dataset.id = foundPet.id
      petForm.querySelector('.pet-name').value = foundPet.name
      petForm.querySelector('.pet-species').value = foundPet.species
      petForm.querySelector('.pet-age').value = foundPet.age
      petForm.querySelector('.pet-temperament').value = foundPet.temperament
      petForm.querySelector('.pet-size').value = foundPet.size
      petForm.querySelector('.pet-url').value = foundPet.photo_url
      petForm.scrollIntoView({behavior: "smooth"})
    } else if (event.target.name === "delete-pet") {
        let petId = event.target.dataset.petid
        let card = event.target.parentElement
        fetch(`http://localhost:3000/api/v1/pets/${petId}`,
          {
           method: 'DELETE'
         }
       )
         .then(response => {
           if (response.ok) {
             allPets= allPets.filter(pet => pet.id != petId)
            card.remove()
           }
         })
    }
  })

  transactionTable.addEventListener('click', (event) => {
    if (event.target.name === "edit-reservation") {
      let transactionId = event.target.parentElement.parentElement.dataset.transactionid
      let foundTransaction = findTransaction(transactionId, allTransactions)
      document.getElementById('sitter-select-dropdown').value = foundTransaction.sitter_id
      document.getElementById('start-date').value = foundTransaction.start_date
      document.getElementById('end-date').value = foundTransaction.end_date
      document.getElementById('pet-select-dropdown').value = foundTransaction.pet_id
      transactionForm.dataset.action = "edit-transaction"
      transactionForm.querySelector("#transaction-header").innerText = "Edit this Sitter Reservation"
      transactionForm.dataset.transactionid = transactionId
      transactionCalculatorDiv.innerHTML = renderTransactionCalculator(foundTransaction.days_sat, foundTransaction.total_cost)
      transactionForm.scrollIntoView({behavior: "smooth"})

    } else if (event.target.name === "delete-reservation") {
      let transactionId = event.target.parentElement.parentElement.dataset.transactionid
      let row = event.target.parentElement.parentElement
      fetch(`http://localhost:3000/api/v1/transactions/${transactionId}`,
        {
         method: 'DELETE'
       }
     )
       .then(response => {
         if (response.ok) {
           allTransactions = allTransactions.filter(transaction => transaction.id != transactionId)
          row.remove()
         }
       })
      }
  }) // End of TransactionTable Listener

  sitterList.addEventListener("click", (event) => {
    let foundSitter
    if (event.target.id === "like-button") {
      foundSitter = findSitterLikes(allSitters, event.target.dataset.sitterid)
      foundSitter.likes++

      fetch(`http://localhost:3000/api/v1/sitters/${foundSitter.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          likes: `${foundSitter.likes}`
        })
      })
      .then(response => response.json())
      .then(sitterJson => {
        event.target.innerText = `👍🏽 ${sitterJson.likes}`
      })
    } else if (event.target.id === "dislike-button") {
      foundSitter = findSitterLikes(allSitters, event.target.dataset.sitterid)
      foundSitter.dislikes++

      fetch(`http://localhost:3000/api/v1/sitters/${foundSitter.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dislikes: `${foundSitter.dislikes}`
        })
      })
      .then(response => response.json())
      .then(sitterJson => {
        event.target.innerText = `👎🏽 ${sitterJson.dislikes}`
      })
    }
  })

}) // END DOMContentLoaded


function renderSitters(sitters) {
  return sitters.map((sitter) => {
    return `
    <div id="sitter-card" data-sitterid=${sitter.id} class="col s3 container">
        <img class="circle z-depth-3" src="${sitter.photo_url} width="150" height="150"">
        <h5>${sitter.name} </h5>
        <p>Email: ${sitter.email} </p>
        <p>Location: ${sitter.location} </p>
        <p>Rate/hour: $${sitter.rate} </p>
        <p>Pet Capacity: ${sitter.capacity} </p>
        <button id="like-button" data-sitterid=${sitter.id} type="button" name="button">👍🏽  ${sitter.likes} </button>
        <button id="dislike-button" data-sitterid=${sitter.id} type="button" name="button">👎🏽  ${sitter.dislikes} </button>
      </div>
    `
  }).join('')
}

// function renderOwners(owners) {
//   return owners.map((owner) => {
//     return `
//       <li>
//         <h3>${owner.name} </h3>
//         <h3>${owner.email} </h3>
//         <h3>${owner.location} </h3>
//       </li>
//     `
//   }).join('')
//
// }

function renderPets(pets) {
  return pets.map((pet) => {
    return `
      <div class="col s6">
        <img src="${pet.photo_url}">
        <h3>${pet.name}</h3>
        <h3>${pet.age} </h3>
        <h3>${pet.species} </h3>
        <h2>${pet.temperament} </h2>
        <h2>${pet.size} </h2>
      </div>
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
    if (pet.owner_id == currentUser.id) {
      return `<option value=${pet.id}>${pet.name}</option>`
    }
  }).join('')
}

function calculateDaysSat(startDate, endDate){
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.floor(((new Date(endDate)  - new Date(startDate)) / msPerDay))
}

function calculateCost(daysSat, transactionSitterObject) {
  let rate = parseInt(transactionSitterObject.rate)
  return daysSat * rate
}

function findSitter(transactionSitter, allSitters) {
  return allSitters.find(sitter => sitter.id == transactionSitter)
}

function myPetsFilter(pets) {
    const myPets = pets.filter((pet) => {
  return pet.owner_id == currentUser.id
   })
   return myPets.map((pet) => {
    return  `
     <div class="col s6">
       <h4>${pet.name}</h4>
       <img class="z-depth-5 circle" src="${pet.photo_url}" width="200" height="200"><br>
       <button class="btn" name="edit-pet" data-petid="${pet.id}">Edit</button>
       <button class="btn" name="delete-pet" data-petid="${pet.id}">Delete 😿</button>
     </div>
     `
   }).join('')
}
function findPet(event, allPets) {
 return allPets.find((pet) => {
    return pet.id == event.target.dataset.petid
 })
}

function renderTransactions(transactions, currentUser) {
let filterTransactions = transactions.filter((transaction) =>{
  return transaction.pet.owner_id == currentUser.id
})
 return filterTransactions.map((transaction) => {
   return  `
   <tr data-transactionid="${transaction.id}">
     <td>${transaction.pet.name}</td>
     <td>${transaction.sitter.name}</td>
     <td>${transaction.start_date}</td>
     <td>${transaction.end_date}</td>
     <td>${transaction.days_sat}</td>
     <td>${transaction.total_cost}</td>
     <td><button class="btn" type="button" name="edit-reservation">Edit</button></td>
     <td><button class="btn" type="button" name="delete-reservation">Delete</button></td>
   </tr>
   `
}).join('')
}

function findTransaction(transactionId, allTransactions) {
  return allTransactions.find((transaction) => transaction.id == transactionId)
}

function renderSingleTransaction(transaction) {
  return  `
  <tr data-transactionid="${transaction.id}">
    <td>${transaction.pet.name}</td>
    <td>${transaction.sitter.name}</td>
    <td>${transaction.start_date}</td>
    <td>${transaction.end_date}</td>
    <td>${transaction.days_sat}</td>
    <td>${transaction.total_cost}</td>
    <td><button class="btn" type="button" name="edit-reservation">Edit</button></td>
    <td><button class="btn" type="button" name="delete-reservation">Delete</button></td>
   </tr>
  `
}

function renderTransactionCalculator(daysSat,totalCost){
  return `
    <h5>Length of Stay: ${daysSat}</h5>
    <h5>Estimated Cost: $${totalCost}</h4>
    `
}

function findSitterLikes(allSitters, sitterid) {
  return allSitters.find(sitter => sitter.id == sitterid)
}
