document.addEventListener('DOMContentLoaded', () => {
    const sliderContainer = document.getElementById('slider-container');
    const audioPlayer = document.getElementById('audio-player');
    const trackInfo = document.getElementById('track-info');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const backgroundBlur = document.getElementById('background-blur'); // NOVO
    
    const musicFolder = 'musica/';
    const imageFolder = 'imagens/';

    const musicData = [
        { file: 'musica1.mp3', image: 'banner1.png', title: 'Piano na chuva', artist: 'Fael' },
        { file: 'musica2.mp3', image: 'banner2.png', title: 'この情熱を', artist: 'Fael' },
        { file: 'musica6.mp3', image: 'banner6.png', title: 'Choro No Violin', artist: 'Fael' },
        { file: 'musica3.mp3', image: 'banner3.png', title: 'Samba pra dois', artist: 'Fael' },
        { file: 'musica4.mp3', image: 'banner4.png', title: 'Amor em 8-Bits', artist: 'Fael' },
        { file: 'musica5.mp3', image: 'banner5.png', title: 'Choro No Violin', artist: 'Fael' }
    ];

    let currentIndex = 0;
    let audioContext = null;
    let isPlaying = false;
    let currentButton = null;

    // ===== FUNÇÃO MODIFICADA PARA ATUALIZAR O FUNDO =====
    function goToSlide(index) {
        const cardWidth = sliderContainer.querySelector('.music-card').offsetWidth;
        sliderContainer.style.transform = `translateX(-${index * cardWidth}px)`;
        currentIndex = index;

        // Atualiza a imagem de fundo
        const currentImage = musicData[currentIndex].image;
        backgroundBlur.style.backgroundImage = `url('${imageFolder + currentImage}')`;
    }

    function togglePlay() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        const currentCard = sliderContainer.children[currentIndex];
        currentButton = currentCard.querySelector('.play-button');
        const songToPlay = currentButton.dataset.songFile;

        if (isPlaying && audioPlayer.src.endsWith(songToPlay)) {
            audioPlayer.pause();
        } else {
            if(isPlaying) {
                audioPlayer.pause();
            }
            audioPlayer.src = songToPlay;
            audioPlayer.play();
        }
    }

    musicData.forEach(song => {
        const card = document.createElement('div');
        card.className = 'music-card';
        card.innerHTML = `
            <img class="card-image" src="${imageFolder + song.image}" alt="Capa do álbum ${song.title}">
            <h3 class="card-title">${song.title}</h3>
            <p class="card-artist">${song.artist}</p>
            <button class="play-button" data-song-file="${musicFolder + song.file}">▶</button>
        `;
        sliderContainer.appendChild(card);
    });

    sliderContainer.querySelectorAll('.play-button').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); 
            togglePlay();
        });
    });

    nextButton.addEventListener('click', () => {
        const nextIndex = (currentIndex + 1) % musicData.length;
        goToSlide(nextIndex);
    });

    prevButton.addEventListener('click', () => {
        const prevIndex = (currentIndex - 1 + musicData.length) % musicData.length;
        goToSlide(prevIndex);
    });
    
    const allPlayButtons = sliderContainer.querySelectorAll('.play-button');
    audioPlayer.onplaying = () => {
        isPlaying = true;
        const currentCard = sliderContainer.children[currentIndex];
        currentButton = currentCard.querySelector('.play-button');
        
        allPlayButtons.forEach(btn => {
            btn.textContent = '▶';
            btn.classList.remove('playing');
        });

        currentButton.textContent = '❚❚';
        currentButton.classList.add('playing');
        
        const title = currentCard.querySelector('.card-title').textContent;
        trackInfo.textContent = `Tocando: ${title}`;
    };

    audioPlayer.onpause = audioPlayer.onended = () => {
        isPlaying = false;
        allPlayButtons.forEach(btn => {
            btn.textContent = '▶';
            btn.classList.remove('playing');
        });
        trackInfo.textContent = 'Navegue pelas ondas da sua playlist';
    };

    // Lógica de arrastar (continua a mesma)
    let isDragging = false, startX, walk;
    sliderContainer.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX - sliderContainer.offsetLeft;
        sliderContainer.style.cursor = 'grabbing';
    });
    
    sliderContainer.addEventListener('mouseleave', () => { isDragging = false; sliderContainer.style.cursor = 'grab'; });
    sliderContainer.addEventListener('mouseup', (e) => {
        isDragging = false;
        sliderContainer.style.cursor = 'grab';
        
        if (walk < -50) {
            nextButton.click();
        } else if (walk > 50) {
            prevButton.click();
        }
        walk = 0;
    });

    sliderContainer.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - sliderContainer.offsetLeft;
        walk = (x - startX);
    });

    // ===== INICIALIZAÇÃO DA PÁGINA =====
    // Define o fundo inicial ao carregar a página
    goToSlide(0);
});