function aggiornaOrologio(){
    var oraAttuale = new Date();
    var ore = oraAttuale.getHours();
    var minuti = oraAttuale.getMinutes();
    
    ore = ore < 10 ? "0" + ore : ore;
    minuti = minuti < 10 ? "0" + minuti : minuti;
    
    var tempo = ore + ":" + minuti;
    
    document.getElementById('orologio').textContent = tempo;
}

function riproduzioneSpotify() {
    fetch('/now-playing')
    .then(response => response.json())
    .then(data => {
        if (data.isPlaying) {
            document.getElementById('title').textContent = data.trackName;
            document.getElementById('artist').textContent = data.artistName;
            document.getElementById('titolo_riproduzione').hidden = false;
            const trackImage = document.getElementById('cover');
            trackImage.src = data.albumArt;
            trackImage.hidden = false;
        } else {
            document.getElementById('title').textContent = "";
            document.getElementById('artist').textContent = "";
            document.getElementById('cover').hidden = true;
            document.getElementById('titolo_riproduzione').hidden = true;
        }
    })
    .catch(error => {
        console.error('Error fetching now-playing:', error);
    });
}

function mostraData() {
    document.getElementById('data').textContent = new Date().toLocaleDateString('it-IT', { weekday: 'long', month: 'long', day: 'numeric'});
}

function mostraOrariBus() {
    fetch('/api/orari')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('orariContainer');
            data.forEach(linea => {
                const elemento = document.createElement('span');
                elemento.className = "orario"
                elemento.innerHTML = `<h4>${linea.nomeLinea}</h4> <p class="ora">${linea.prossimaPartenza}</p>`
                container.appendChild(elemento);
            });
        })
        .catch(error => console.error('Errore nel recupero degli orari:', error));
}

mostraOrariBus();

mostraData();

riproduzioneSpotify();
setInterval(riproduzioneSpotify, 5000);

aggiornaOrologio();
setInterval(aggiornaOrologio, 1000);