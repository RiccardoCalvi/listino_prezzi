function aggiornaOrologio(){
    var oraAttuale = new Date();
    var ore = oraAttuale.getHours();
    var minuti = oraAttuale.getMinutes();
    
    ore = ore < 10 ? "0" + ore : ore;
    minuti = minuti < 10 ? "0" + minuti : minuti;
    
    var tempo = ore + ":" + minuti;
    
    document.getElementById('orologio').textContent = tempo;
}

function mostraData() {
    document.getElementById('data').textContent = new Date().toLocaleDateString('it-IT', { weekday: 'long', month: 'long', day: 'numeric'});
}

function riproduzioneSpotify() {
    fetch('/now-playing')
    .then(response => response.json())
    .then(data => {
        const trackImage = document.getElementById('cover');
        const titoloRiproduzione = document.getElementById('titolo_riproduzione')
        if (data.isPlaying) {
            document.getElementById('title').textContent = data.trackName;
            document.getElementById('artist').textContent = data.artistName;
            trackImage.src = data.albumArt;
            titoloRiproduzione.hidden = false;
            trackImage.hidden = false;
        } else {
            document.getElementById('title').textContent = "";
            document.getElementById('artist').textContent = "";
            titoloRiproduzione.hidden = true;
            trackImage.hidden = true;
        }
    })
    .catch(error => {
        console.error('Error fetching now-playing:', error);
    });
}

function mostraOrariBus() {
    fetch('/api/orari')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('orariContainer');
            container.innerHTML = '';
            container.innerHTML = '<h3 class="titolo">Prossime Partenze</h3>'
            data.forEach(linea => {
                const elemento = document.createElement('span');
                elemento.className = "orario"
                elemento.innerHTML = `<h4>${linea.nomeLinea}</h4> <p class="ora">${linea.prossimaPartenza}</p>`
                container.appendChild(elemento);
            });
        })
        .catch(error => console.error('Errore nel recupero degli orari:', error));
}


  

// Ogni 10 secondi controlla la prossima partenza
mostraOrariBus();
setInterval(mostraOrariBus, 10000);

// Ogni 2 ore aggiorna la data
mostraData();
setInterval(mostraData, 7200000);

// Ogni 5 secondi controlla spotify
riproduzioneSpotify();
setInterval(riproduzioneSpotify, 5000);

// Ogni 5 secondi aggiorna l'orologio
aggiornaOrologio();
setInterval(aggiornaOrologio, 5000);