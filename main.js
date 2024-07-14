// bind querySelector
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

// storage key


// define variables
const player = $('.player')
const playlist = $('.playlist')
const song = $('.playing-song-name');
const art = $('.playing-song-artist')
const thumb = $('.cd-thumbnail');
const audio = $('#audio')
const cd = $('.cd');
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const preBtn = $('.btn-prev')
const btnRandomSong = $('.btn-shuffle')
const btnRepeat = $('.btn-repeat')
const app = {
 
   // configs: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    currentIndex: 0, 
    isPlaying: false,
    isRandom: false, 
    isRepeat: false,
    playedSongs: [], // Khởi tạo mảng chứa các bài hát đã phát
    unplayedSongs: [], // Khởi tạo mảng chứa các bài hát chưa phát
    songs: [
        {
            name: "Moshi Moshi",
            singer: "feat. 百足",
            path: "./assets/songs/Moshi Moshi (feat. 百足).mp3",
            image: "./assets/img/moshi moshi.png",
            isFavorite: false
        },
        {
            name: "TruE",
            singer: "HOYO-MiX · 黄龄 · 文驰 · TetraCalyx",
            path: "./assets/songs/TruE.mp3",
            image: "./assets/img/TruE.jpg",
            isFavorite: false
        },
        {
            name: "Regression",
            singer: "Ayanga",
            path: "./assets/songs/Regression - Honkai Impact 3rd Theme Song Performed by- Ayanga - Honkai Impact 3rd.mp3",
            image: "./assets/img/Regression.jpg",
            isFavorite: false
        },
        {
            name: "Rubia",
            singer: "Zhou Shen",
            path: "./assets/songs/Rubia (Performed by Zhou Shen) - Honkai Impact 3rd.mp3",
            image: "./assets/img/Rubia.jpg",
            isFavorite: false
        },
        {
            name: "Starfall",
            singer: "TIA RAY",
            path: "./assets/songs/[Starfall] (Performed by TIA RAY) - Honkai Impact 3rd OST.mp3",
            image: "./assets/img/Starfall.jpg",
            isFavorite: false
        },
        {
            name: "Moon Halo",
            singer: "茶理理 x TetraCalyx x Hanser",
            path: "./assets/songs/Moon Halo - Honkai Impact 3rd Valkyrie Theme.mp3",
            image: "./assets/img/Moon Halo.jpg",
            isFavorite: false
        },
        {
            name: "Houkai Sekai no Utahime (Honkai World Diva)",
            singer: "Mika Kobayashi",
            path: "./assets/songs/Houkai Sekai no Utahime (Honkai World Diva, movie ver.)-- Honkai Impact 3rd.mp3",
            image: "./assets/img/Houkai Sekai no Utahime.jpg",
            isFavorite: false
        },
        {
            name: "Dual-Ego",
            singer: "Sa Dingding",
            path: "./assets/songs/Dual-Ego Honkai Impact 3rd OSTBy Sa Dingding.mp3",
            image: "./assets/img/Dual-Ego.jpg",
            isFavorite: false
        },
        {
            name: "Da Capo",
            singer: "车子玉Ziyu Che",
            path: "./assets/songs/Da Capo  Honkai Impact 3rd Theme Song.mp3",
            image: "./assets/img/Da Capo.jpg",
            isFavorite: false
        },
        {
            name: "Cyberangel",
            singer: "Hanser",
            path: "./assets/songs/Cyberangel Honkai Impact 3rd OSTBy Hanser.mp3",
            image: "./assets/img/Cyberangel.webp",
            isFavorite: false
        }
    ],

    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index == this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="song-contain">
                    <div class="song-img" style="background-image: url('${song.image}')" alt="" class="song-image"></div>
                    <div class="song-text">
                        <h5 class="song-name">${song.name}</h5>
                        <p class="song-artist">${song.singer}</p>
                    </div>
                </div>

                <div class="song-contain song-select">
                    <div>
                        <i class="song-favorite-${index} btn song-favorite fa-regular fa-heart" onclick="handleFavorite(event)"></i>
                        <i class="btn song-remove-${index} fa-solid fa-xmark" onclick="handleRemove(event)"></i>
                    </div>
                </div>
            </div>
            `
        })
        playlist.innerHTML = htmls.join('');
    },

    defineProperties: function(){
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
        
    },

    handleEvents: function(){
        const _this = this
        const cdWidth = cd.offsetWidth;
        const mediaQuery = window.matchMedia('(max-width: 64em)');
        
        document.onscroll = function(){
            const scrollTop = window.scrollY|| document.documentElement.scrollTop;
            if (mediaQuery.matches) {
                // Nếu kích thước cửa sổ nhỏ hơn hoặc bằng 64em, thay đổi kích thước .cd
                const newCdWidth = cdWidth - scrollTop;
                cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : '0px';
                cd.style.opacity = newCdWidth / cdWidth 
            } else {
                // Nếu kích thước cửa sổ lớn hơn 64em, giữ nguyên kích thước ban đầu của .cd
                cd.style.width = cdWidth + 'px';
            }
        } ;
        //xử lý khi click Play
        playBtn.onclick = function(){
           if (_this.isPlaying) {
             audio.pause()
           }else{
            audio.play()
           }
        };

        //Xử lý event click next bài
        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong();
            }else{
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong()

        };
        preBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong();
            }else{
                _this.preSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong()

        };
        //Bật tắt Random bài hát
        btnRandomSong.onclick = function(e){
            _this.isRandom = !_this.isRandom;
            btnRandomSong.classList.toggle('active', _this.isRandom)
        }

        btnRepeat.onclick = function(){
            _this.isRepeat = !_this.isRepeat
            btnRepeat.classList.toggle('active', _this.isRepeat)
        }

        //xử lý thumb quay khi chạy nhạc
        const cdThumb = thumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumb.pause()

        audio.onplay = function(){
            _this.isPlaying = true;
            playBtn.classList.add('song-playing')
            cdThumb.play()
        },

        audio.onpause = function(){
            _this.isPlaying = false;
            playBtn.classList.remove('song-playing')
            cdThumb.pause()
        }
        // Xử lý sự kiện next bài khì bài phát hết
        audio.onended = function(){
            if (_this.isRepeat) {
                audio.play();
            }else{
                nextBtn.click();
            }
        }
        //Sự kiện timeupdate: để cập nhật vị trí của thanh trượt khi bài hát đang được phát.
        audio.ontimeupdate = function(){
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }
        // tua đến vị trí bất kì trong bài hát
        progress.oninput = function(e){
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }

        // sự kiện click vào playlist
        playlist.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)')

            if (songNode || e.target.closest('.option')) {
                // sự kiện click vào bài hát
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
                
            }
        }
    },
    nextSong: function(){
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong()
    },

    preSong: function(){
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length -1
        }
        this.loadCurrentSong()

    },

    scrollToActiveSong: function(){
         setTimeout(()=> {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            })
         },300)
    },

    playRandomSong: function(){
        // Nếu mảng unplayedSongs trống, sao chép tất cả các bài hát vào mảng unplayedSongs và reset mảng playedSongs
    if (this.unplayedSongs.length === 0) {
        this.unplayedSongs = [...this.songs]; // Sao chép danh sách bài hát ban đầu
        this.playedSongs = [];
    }
    // Lấy bài hát hiện tại
    const currentSong = this.songs[this.currentIndex];
    
    // Loại bỏ bài hát hiện tại khỏi mảng unplayedSongs và thêm vào mảng playedSongs
    this.unplayedSongs = this.unplayedSongs.filter(song => song !== currentSong);
    this.playedSongs.push(currentSong);

    // Chọn ngẫu nhiên một bài hát từ mảng unplayedSongs
    const randomIndex = Math.floor(Math.random() * this.unplayedSongs.length);
    const nextSong = this.unplayedSongs[randomIndex];

    // Cập nhật chỉ số currentIndex với bài hát ngẫu nhiên đã chọn và tải bài hát này
    this.currentIndex = this.songs.indexOf(nextSong);
    this.loadCurrentSong();
    },

    loadCurrentSong: function(){
        song.textContent = this.currentSong.name;
        art.textContent = this.currentSong.singer;
        thumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path
    },


    start: function(){
        this.defineProperties()
        this.handleEvents()
        this.loadCurrentSong()
        this.render()

    }
    // set config for _this
}

// starto
app.start()
