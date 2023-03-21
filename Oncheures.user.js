// ==UserScript==
// @name         Oncheures
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Affichez les heures des posts
// @author       Annapurna
// @match https://onche.org/topic/*
// ==/UserScript==


//////////////// HISTORIQUE
// 0.1 : heures style jvc sous le pseudo, suppression de l'heure en bas à droite
// 0.2 : changement de la couleur en fonction du thème
// 0.3 : ajout d'un bouton pour répondre aux topics depuis le haut de la page



///////////////// CODE

// Get all message elements with class 'message'
const messages = document.querySelectorAll('.message');

// Get the href content of the first occurrence of the class 'active'
const hrefContent = document.querySelector('.active').href;

// Loop through each message
messages.forEach(message => {
  // Find the element with class 'message-date' within this message
  const messageDateElement = message.querySelector('.message-date');

  // If such an element was found, extract the date and time from its title attribute using a regular expression
  if (messageDateElement) {
    const originalString = messageDateElement.getAttribute('title');
    const regex = /(\d{2}\/\d{2}\/\d{4} à \d{2}:\d{2}:\d{2})/;
    const match = regex.exec(originalString);

    // If a match was found, create a new div element and set its inner HTML to the extracted date and time
    if (match) {
      const newLink = document.createElement('a');
      const messageID = message.getAttribute('data-id');
      newLink.href = hrefContent + '#message_' + messageID;
      
      // Add CSS styles to the new link element
      newLink.classList.add('my-link-class');
      newLink.style.fontSize = '0.8125rem';

      // Set the inner HTML of the link to the extracted date and time
      newLink.innerHTML = match[0];

      // Find the element with class 'message-infos' within this message and append the new link element to it
      const messageInfosElement = message.querySelector('.message-infos');
      if (messageInfosElement) {
        messageInfosElement.appendChild(newLink);
      }
      messageDateElement.remove();

      // Add a click event listener to the new link that scrolls to the target message and copies its href attribute to the clipboard
      newLink.addEventListener('click', event => {
        event.preventDefault();
        const href = event.target.getAttribute('href');
        const targetElement = document.querySelector(href);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
          navigator.clipboard.writeText(href);
        }
      });
    }
  }
});



let changeBackground = document.querySelector("#theme-button");
const myLinkElements = document.querySelectorAll('.my-link-class');
const body = document.querySelector('body');
const topic = document.querySelector('#topic');
const rightContent = topic.querySelector('.right');
const newImg = document.createElement('img');
newImg.classList.add('response');
newImg.style.cursor = 'pointer';


let bodyClass = null;

function alternate() {
    if(bodyClass == null){
      bodyClass = document.querySelector("body").className;
    }

    if(body.classList.contains('grey')){
      newImg.src = 'https://raw.githubusercontent.com/NicolasAili/Oncheures/main/blackresp.png';
      myLinkElements.forEach(link => {
        link.style.color = '#79bcee';
      });
    }
    else if(body.classList.contains('blue')){
      newImg.src = 'https://raw.githubusercontent.com/NicolasAili/Oncheures/main/blueresp.png';
      myLinkElements.forEach(link => {
        link.style.color = '#79bcee';
      });
    }
    else{
      myLinkElements.forEach(link => {
        newImg.src = 'https://raw.githubusercontent.com/NicolasAili/Oncheures/main/whiteresp.png';
        link.style.color = '#1078c5';
      });
    }
    rightContent.insertBefore(newImg, rightContent.firstChild);
}

alternate();

changeBackground.onclick = function () {
  if(document.querySelector("body").className.includes("blue")){
      body.classList.remove('blue');
      body.classList.add('grey');
  }
  else if(document.querySelector("body").className.includes("grey")){
      body.classList.remove('grey');
  }
  else{
      body.classList.add('blue');
  }
  alternate();
};

// Add a click event listener to the parent element
topic.addEventListener('click', function(event) {
  // Check if the clicked element has the .response class
  if (event.target.classList.contains('response')) {
    // Scroll to the bottom of the page
    window.scrollTo(0, document.body.scrollHeight);
  }
});