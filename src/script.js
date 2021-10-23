function getCookie(name) {
	return document.cookie.split('; ').reduce((r, v) => {
	  const parts = v.split('=')
	  return parts[0] === name ? decodeURIComponent(parts[1]) : r
	}, '')
}

function hexToHSL(H) {
	// Convert hex to RGB first
	let r = 0, g = 0, b = 0;
	if (H.length == 4) {
		r = '0x' + H[1] + H[1];
		g = '0x' + H[2] + H[2];
		b = '0x' + H[3] + H[3];
	} else if (H.length == 7) {
		r = '0x' + H[1] + H[2];
		g = '0x' + H[3] + H[4];
		b = '0x' + H[5] + H[6];
	}
	// Then to HSL
	r /= 255;
	g /= 255;
	b /= 255;
	let cmin = Math.min(r,g,b),
		cmax = Math.max(r,g,b),
		delta = cmax - cmin,
		h = 0,
		s = 0,
		l = 0;

	if (delta == 0) {
		h = 0;
	} else if (cmax == r) {
		h = ((g - b) / delta) % 6;
	} else if (cmax == g) {
		h = (b - r) / delta + 2;
	} else {
		h = (r - g) / delta + 4;
	}
	h = Math.round(h * 60);
	if (h < 0) {
		h += 360;
	}
	l = (cmax + cmin) / 2;
	s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
	s = +(s * 100).toFixed(1);
	l = +(l * 100).toFixed(1);

	return { h, s, l};
}

let users = {};
const defaultColors = ['#ff0000', '#0000ff', '#008000', '#b22222', '#ff7f50', '#9acd32', '#ff4500', '#2e8b57', '#daa520', '#d2691e', '#5f9ea0', '#1e90ff', '#ff69b4', '#8a2be2', '#00ff7f'];

new MutationObserver((e, o) => {
for (const o of e) {
  if ('childList' === o.type) {
	for (const e of o.addedNodes) {

	  // Change user message color and add reply function likes twitch does.
	  if (e && e.classList && e.classList.contains('nimo-room__chatroom__message-item')) {
		const chatMessage = e;
		const username = chatMessage.querySelector('.nm-message-nickname').innerHTML;
		const currentUserName = getCookie('userName');

		if (!users[username]) {
		  const color = Math.random() < 0.5 ? defaultColors[Math.floor(13 * Math.random())] : '#' + Math.floor(16777215 * Math.random()).toString(16);
		  let { h, s } = hexToHSL(color);
		  users[username] = `hsl(${h}, ${s}%, 65%)`;
		}

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

		// Fix bug when typing a blocked word in the text area that doesn't show any message that the message has been filtered
		if (currentUserName === username) {
		  const [ chatbox ] = document.getElementsByClassName('nimo-chat-box__input');
		   if (chatbox.value.length > 2) {
			  chatMessage.classList.add('message-filtered');
			  chatbox.parentElement.classList.add('message-filtered');
		   } else {
			  chatbox.parentElement.classList.remove('message-filtered');
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
attributes: !1,
childList: !0,
subtree: !0
});