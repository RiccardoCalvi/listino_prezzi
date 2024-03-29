if (controllaData('2024-03-16')) {
    document.addEventListener('DOMContentLoaded', () => {
        blossom();
        
        setInterval(() => {
            document.querySelectorAll('svg').forEach(function(svg) {
                svg.parentNode.removeChild(svg);
            });
            blossom();
        }, 6000);
        
        setTimeout(affacciaFolletto, 2000);
    });
}

function affacciaFolletto() {
    const folletto = document.getElementById('folletto');
    folletto.classList.toggle('folletto-visible');

    setTimeout(affacciaFolletto, Math.random() * 15000 + 2000);
}

function blossom() {
    for (let i = 0; i < 15; i++) {
        let s = Math.floor(Math.random() * 10);
        let t = Math.floor(Math.random() * 4000 + 1000);
        let x = Math.random() * 80;
        let y = Math.random() * 80;
        
        let svgElement = document.createElement('div');
        svgElement.innerHTML = '<svg width="172px" height="172px" viewBox="0 0 172 172" style="position: absolute; top:' + x + '%; left:' + y + '%; animation-name:blossom-' + s + '; animation-duration:' + t + 'ms;" class="animate"><g transform="translate(36.000000, 0.000000)"><path d="M50,9.16532067 C75.2536706,-13.4843611 115.738059,9.33932356 93.6164857,39.6288395 C80.6531579,57.3786136 62.7999657,68.2812276 50,86 C37.2000343,68.2812276 19.3468421,57.3786136 6.38351434,39.6288395 C-15.7380586,9.33932356 24.7463294,-13.4843611 50,9.16532067 Z" fill="#00731B" opacity="0.6"></path><path d="M50,9.16532067 C75.2536706,-13.4843611 115.738059,9.33932356 93.6164857,39.6288395 C80.6531579,57.3786136 62.7999657,68.2812276 50,86" fill="#FFFFFF" opacity="0.1"></path></g><g id="Group" transform="translate(86.000000, 129.000000) scale(1, -1) translate(-86.000000, -129.000000) translate(36.000000, 86.000000)"><path d="M50,9.16532067 C75.2536706,-13.4843611 115.738059,9.33932356 93.6164857,39.6288395 C80.6531579,57.3786136 62.7999657,68.2812276 50,86 C37.2000343,68.2812276 19.3468421,57.3786136 6.38351434,39.6288395 C-15.7380586,9.33932356 24.7463294,-13.4843611 50,9.16532067 Z" fill="#00731B" opacity="0.6"></path><path d="M50,9.16532067 C75.2536706,-13.4843611 115.738059,9.33932356 93.6164857,39.6288395 C80.6531579,57.3786136 62.7999657,68.2812276 50,86" fill="#FFFFFF" opacity="0.1"></path></g><g id="Group" transform="translate(129.000000, 86.000000) rotate(90.000000) translate(-129.000000, -86.000000) translate(79.000000, 43.000000)"><path d="M50,9.16532067 C75.2536706,-13.4843611 115.738059,9.33932356 93.6164857,39.6288395 C80.6531579,57.3786136 62.7999657,68.2812276 50,86 C37.2000343,68.2812276 19.3468421,57.3786136 6.38351434,39.6288395 C-15.7380586,9.33932356 24.7463294,-13.4843611 50,9.16532067 Z" fill="#00731B" opacity=".6"></path><path d="M50,9.16532067 C75.2536706,-13.4843611 115.738059,9.33932356 93.6164857,39.6288395 C80.6531579,57.3786136 62.7999657,68.2812276 50,86" fill="#FFFFFF" opacity="0.1"></path></g><g id="Group" transform="translate(43.000000, 86.000000) scale(1, -1) rotate(-90.000000) translate(-43.000000, -86.000000) translate(-7.000000, 43.000000)"><path d="M50,9.16532067 C75.2536706,-13.4843611 115.738059,9.33932356 93.6164857,39.6288395 C80.6531579,57.3786136 62.7999657,68.2812276 50,86 C37.2000343,68.2812276 19.3468421,57.3786136 6.38351434,39.6288395 C-15.7380586,9.33932356 24.7463294,-13.4843611 50,9.16532067 Z" fill="#00731B" opacity=".6"></path><path d="M50,9.16532067 C75.2536706,-13.4843611 115.738059,9.33932356 93.6164857,39.6288395 C80.6531579,57.3786136 62.7999657,68.2812276 50,86" fill="#FFFFFF" opacity="0.1"></path></g></svg>';
        document.body.appendChild(svgElement.firstChild);
    }
}

function controllaData(data) {
    const dataAttivazione = new Date(data)
    const dataOdierna = new Date();
    return dataOdierna.getDate() === dataAttivazione.getDate() && dataOdierna.getMonth() === dataAttivazione.getMonth() && dataOdierna.getFullYear() === dataAttivazione.getFullYear();
}