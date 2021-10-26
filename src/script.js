function getCookie(cname) {
  let name = cname + '=';
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

let users = JSON.parse(localStorage.getItem('usersColors') || '{}');

new MutationObserver((e, o) => {
	for (const o of e) {
		if ('childList' === o.type) {
			for (const e of o.addedNodes) {
				// Change user message color and add reply function likes twitch does.
				if (e && e.classList && e.classList.contains('nimo-room__chatroom__message-item')) {
					const chatMessage = e;

					// Get message username and logged user name
					const username = chatMessage.querySelector('.nm-message-nickname').innerHTML;
					const currentUserName = getCookie('userName');

					// If color not exists in cache, generate a new one and save on localstorage
					if (!users[username]) {
						users[username] = `hsl(${Math.ceil(365 * Math.random())}, ${Math.ceil(Math.random() * 50 + 50)}%, 65%)`;
						localStorage.setItem('usersColors', JSON.stringify(users));
					}

					// Set user message color
					const colon = chatMessage.querySelector('.nimo-room__chatroom__message-item__info-colon');
					if (colon) {
						chatMessage.querySelector('.nimo-room__chatroom__message-item__info-colon').style.color = users[username];
					}
					chatMessage.querySelector('.nm-message-nickname').style.color = users[username];

					// Add reply button
					const btn = document.createElement('div');
					btn.classList.add('reply-btn-chat');
					btn.innerHTML = '<svg width="100%" height="100%" version="1.1" viewBox="0 0 20 20" x="0px" y="0px"><path d="M8.5 5.5L7 4L2 9L7 14L8.5 12.5L6 10H10C12.2091 10 14 11.7909 14 14V16H16V14C16 10.6863 13.3137 8 10 8H6L8.5 5.5Z"></path></svg>';
					btn.addEventListener('click', () => {
						const [ chatbox ] = document.getElementsByClassName('nimo-chat-box__input');
						chatbox.value = `@${username} `;
						chatbox.focus();
					});
					chatMessage.append(btn);

					// Fix bug when typing a blocked word in the text area that doesn't show any alert that the message has been filtered
					if (currentUserName === username) {
						const [ chatbox ] = document.getElementsByClassName('nimo-chat-box__input');
						if (chatbox.value.length > 2) {
							chatMessage.classList.add('message-filtered');
						}
					}
				}

				// Fix bug when change quality in Google Chrome append two video elements.
				if (e && e.nodeName && e.nodeName.toLowerCase() === 'video') {
					const videoContainer = e.parentElement;
					if (videoContainer && videoContainer.classList && videoContainer.classList.contains('video-player')) {
						const videos = videoContainer.querySelectorAll('video');
						if (videos && videos.length > 1) {
							videos[0].remove();
						}
					}
				}
			}
		}
	}
}).observe(document.body, {
	attributes: false,
	childList: true,
	subtree: true
});