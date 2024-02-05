// Initialize Firebase
const firebaseConfig = {
    apiKey: "YOUR-API-KEY",
    authDomain: "YOUR-AUTH-DOMAIN",
    projectId: "YOUR-PROJECT-ID",
    storageBucket: "YOUR-STORAGE-BUCKET",
    messagingSenderId: "YOUR-MESSAGING-SENDER-ID",
    appId: "YOUR-APP-ID"
  };
  firebase.initializeApp(firebaseConfig);
  
  // Initialize Google Photos API
  gapi.load('client:auth2', function() {
    gapi.client.init({
      'apiKey': 'YOUR-API-KEY',
      'discoveryDocs': ['https://photoslibrary.googleapis.com/$discovery/rest?version=v1'],
      'clientId': 'YOUR-CLIENT-ID',
      'scope': 'https://www.googleapis.com/auth/photoslibrary.readonly'
    }).then(function() {
      // List albums
      gapi.client.photoslibrary.albums.list({
        'pageSize': 10,
        'fields': 'nextPageToken,prevPageToken,albums(id,title,productUrl,coverPhoto(id,url))'
      }).then(function(response) {
        var albums = response.result.albums;
        if (albums && albums.length > 0) {
          albums.forEach(function(album) {
            var albumElement = document.createElement('div');
            albumElement.classList.add('album');
            albumElement.innerHTML = `
              <h2>${album.title}</h2>
              <a href="${album.productUrl}" target="_blank">View Album</a>
              ${album.coverPhoto ? `
                <img src="${album.coverPhoto.url}" alt="${album.title} cover photo">
              ` : ''}
            `;
            document.getElementById('photo-gallery').appendChild(albumElement);
          });
        } else {
          document.getElementById('photo-gallery').innerHTML = 'No albums found.';
        }
      });
    });
  });
  
  // Initialize feedback form
  document.getElementById('feedback-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    firebase.firestore().collection('feedback').add({
      name: name,
      email: email,
      message: message,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(function() {
      document.getElementById('feedback-form').reset();
      alert('Feedback submitted successfully!');
    }).catch(function(error) {
      console.error(error);
      alert('Error submitting feedback.');
    });
  });