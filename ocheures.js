// ==UserScript==
// @name         Oncheures
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Affichez les heures des posts
// @author       Annapurna
// @match https://onche.org/topic/*
// ==/UserScript==

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
      newLink.style.color = '#79bcee';
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
          console.log('Link copied to clipboard:', href);
        }
      });
    }
  }
});
