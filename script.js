
//Permet de faire des requetes. Asyncrone fonction car sinon marche pas
async function requete(url, methode, header) {
  const response = await fetch(url, { headers: header, method: methode });
  return response.json(); // Utilise response.text() au lieu de response.json()
}

//Modifie la base de donnée
function ecrire(data) {
  const url = `https://api.jsonbin.io/v3/b/6432bc23ace6f33a2207ae5c?meta=false`;
  const headers = {
    'Content-Type': 'application/json',
    'X-Master-Key': '$2b$10$ayKtGHFaZZsvOAzV6foGO.kgB/uLQRRNN4KA176LljMMbYRp4cvxC'
  };
  return fetch(url, {
    method: 'PUT',
    headers: headers,
    body: JSON.stringify(data)
  });
}

//Change le code html de la page en mettant le contenue de la base de donnée
async function change_page() {

  let liste_number = ["0️⃣", "1️⃣", " 2️⃣", " 3️⃣", " 4️⃣", " 5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"]

  //Charge les datas de la base de donnée
  header = { 'Content-Type': 'application/json', 'X-Master-Key': '$2b$10$ayKtGHFaZZsvOAzV6foGO.kgB/uLQRRNN4KA176LljMMbYRp4cvxC' };
  let mydata = await requete(url = 'https://api.jsonbin.io/v3/b/6432bc23ace6f33a2207ae5c?meta=false', methode = "GET", header = header);

  // Fonction de comparaison pour le tri
  function compareSitesByTrophe(a, b) {
    if (a.Trophe < b.Trophe) {
      return 1; // a vient après b
    } else if (a.Trophe > b.Trophe) {
      return -1; // a vient avant b
    } else {
      return 0; // a et b ont le même nombre de trophées
    }
  }

  // Tri des sites web par nombre de trophées
  mydata.page.sort(compareSitesByTrophe);

  //Nombre total de votes
  let sumTrophe = 0;

  for (let i = 0; i < mydata.page.length; i++) {
    sumTrophe += mydata.page[i].Trophe;
  }
  //affiche nombre de votes
  document.getElementById("votes").innerText = "Total des votes : " + String(sumTrophe);

  // Sélectionne l'élément table
  const body = document.getElementById("ajout");

  let counter = 0;

  for (let element of mydata["page"]) {
    // Ajoute des td au tr
    const newtr = document.createElement('tr');
    newtr.setAttribute('id', counter);
    const newtd1 = document.createElement('td');
    const newtd2 = document.createElement('td');
    const newtd3 = document.createElement('td');
    const newtd4 = document.createElement('td');
    const newtd5 = document.createElement('td');

    // Ajoute du contenu dans le div
    const chiffres = String(counter + 1).split('');
    let emojis = '';

    for (let i = 0; i < chiffres.length; i++) {
      const chiffre = Number(chiffres[i]);
      emojis += liste_number[chiffre];
    }
    // Création de la balise <a>
    const anchor = document.createElement('a');
    anchor.href = JSON.stringify(element["Siteweb"]).slice(1, -1);  // Remplacez 'https://example.com' par l'URL de           destination souhaitée

    // Ajout du texte dans la balise <a>
    anchor.textContent = "voir le projet";

    newtd1.textContent = emojis;
    //newtd2.textContent = JSON.stringify(element["Siteweb"]).slice(1, -1);
    newtd3.textContent = JSON.stringify(element["Sujet"]).slice(1, -1);
    newtd4.textContent = JSON.stringify(element["Trophe"]);

    // Crée un bouton cliquable
    const button = document.createElement('button');
    button.textContent = "Voter pour ce projet";

    // Ajoute le bouton dans le td5
    newtd5.appendChild(button);

    // Ajoute un gestionnaire d'événement pour détecter le clic de l'utilisateur
    button.addEventListener('click', function(event) { onConfirm(event, newtd4, mydata); });

    newtr.appendChild(newtd1)
    newtr.appendChild(anchor)
    newtr.appendChild(newtd3)
    newtr.appendChild(newtd4)
    newtr.appendChild(newtd5)

    // Ajoute le div à la fin de l'élément body
    body.appendChild(newtr);

    //+1 au compteur
    counter++;
  }
}

//Quand on clique sur un bouton
async function onConfirm(event, element, data) {

  let ip = await requete(url = 'https://api.ipify.org?format=json', methode = "GET", header = {})
  ip = JSON.stringify(ip["ip"]);

  //si l'adresse ip du client est déja enregister
  if (data["adresse_ip"].includes(ip)) {
    alert("Vous avez déja voter !")
    return
  }

  alert("Votre vote a été pris en compte")

  //Met à jour le code html
  let nb_trophe = parseInt(element.innerHTML);
  nb_trophe++;
  element.innerHTML = nb_trophe;

  //Met à jour la base de donnée pour que ça soit sauvegarder
  let trElement = element.parentNode;
  let id = trElement.id;
  data["page"][parseInt(id)]["Trophe"]++; //Met à jour nombre de trophé
  data["adresse_ip"].push(ip);
  ecrire(data);

}

//appariton de l'image avec défilement
const image = document.getElementById("img")
const cont = document.getElementById("cont")
const page = document.getElementById("container_page")
cont.classList.remove("up")
cont.classList.add("down")
page.classList.add("none")

let i = 1
function slide() {

  if (estPair(i)) {
    cont.classList.remove("up")
    cont.classList.add("down")
    page.classList.add("fade-out");
    setTimeout(() => {
      page.classList.add("none")
    }, 1000);


  } else {
    cont.classList.remove("down")
    cont.classList.add("up")
    page.classList.remove("none")
    page.classList.remove("fade-out");

  }

  i++
}

image.addEventListener("click", slide)
function estPair(nombre) {
  if (nombre % 2 == 0) {
    return true
  } else {
    return false
  }
}



async function update_data(lien, sujet) {

  //Charge les datas de la base de donnée
  header = { 'Content-Type': 'application/json', 'X-Master-Key': '$2b$10$ayKtGHFaZZsvOAzV6foGO.kgB/uLQRRNN4KA176LljMMbYRp4cvxC' };
  let mydata = await requete(url = 'https://api.jsonbin.io/v3/b/6432bc23ace6f33a2207ae5c?meta=false', methode = "GET", header = header);
  let envoie = {
    "Siteweb": lien,
    "Sujet": sujet,
    "Trophe": 0
  }
  mydata["page"].push(envoie);
  alert(JSON.stringify(mydata["page"]));

  // Effectuer d'autres actions avec les données du formulaire
  ecrire(mydata);
}
