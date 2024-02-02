function aggiornaOrologio(){
    var oraAttuale = new Date();
    var ore = oraAttuale.getHours();
    var minuti = oraAttuale.getMinutes();
    
    ore = ore < 10 ? "0" + ore : ore;
    minuti = minuti < 10 ? "0" + minuti : minuti;
    
    var tempo = ore + ":" + minuti;
    
    document.getElementById('orologio').textContent = tempo;
}

aggiornaOrologio();
setInterval(aggiornaOrologio, 1000);

function riproduzioneSpotify() {
    fetch('/now-playing')
    .then(response => response.json())
    .then(data => {
        if (data.isPlaying) {
            document.getElementById('title').textContent = data.trackName;
            document.getElementById('artist').textContent = data.artistName;
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

riproduzioneSpotify();
setInterval(riproduzioneSpotify, 5000);
