const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STRORAGE_KEY = 'PLAYER';

const player = $('.player');
const cd = $('.cd');
const header = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STRORAGE_KEY)) || {},
    songs: [
        {
            name: 'Suy nghĩ trong anh',
            singer: 'Khắc Việt',
            path: 'assets/music/song1.mp3',
            img: 'assets/img/song1.png'
        },
        {
            name: 'Chưa quên người yêu cũ',
            singer: 'Nguyễn Trần Trung Quân',
            path: 'assets/music/song2.mp3',
            img: 'assets/img/song2.png'
        },
        {
            name: 'Không còn anh ở đây',
            singer: 'DeeTee ft.Huyền Trang',
            path: 'assets/music/song3.mp3',
            img: 'assets/img/song3.png'
        },
        {
            name: 'Chuyện chúng ta sau này',
            singer: 'Hải Đăng Doo',
            path: 'assets/music/song4.mp3',
            img: 'assets/img/song4.png'
        },
        {
            name: 'Là anh',
            singer: 'Phạm Lịch, BMZ',
            path: 'assets/music/song5.mp3',
            img: 'assets/img/song5.png'
        },
        {
            name: 'Lần cuối mình cạnh nhau',
            singer: 'QuocKiet, Rùa, 3HT, Melomix',
            path: 'assets/music/song6.mp3',
            img: 'assets/img/song6.png'
        },
        {
            name: 'Tôi đã quên thật rồi',
            singer: 'Isaac',
            path: 'assets/music/song7.mp3',
            img: 'assets/img/song7.png'
        },
        {
            name: 'Giấc mơ ngày cũ',
            singer: 'Trang I.U, Melomix',
            path: 'assets/music/song8.mp3',
            img: 'assets/img/song8.png'
        },
        {
            name: 'Yêu lại từ đầu',
            singer: 'Khắc Việt',
            path: 'assets/music/song9.mp3',
            img: 'assets/img/song9.png'
        },
    ],

    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STRORAGE_KEY, JSON.stringify(this.config));
    },

    loadConfig: function() {
        this.isRandom = this.config.isRandom || false;
        this.isRepeat = this.config.isRepeat || false;
    },

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        });
    },

    // Load bài hát hiện tại trên dashboad
    loadCurrentSong: function () {
        header.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`;
        audio.src = this.currentSong.path;
    },

    handleEvents: function () {
        const _this = this;

        // Xử lý CD khi quay và dừng
        const cdTumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            iterations: Infinity,
        });
        cdTumbAnimate.pause();

        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            };
        };

        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdTumbAnimate.play();
        };

        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdTumbAnimate.pause();
        };

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 1000);
                progress.value = progressPercent;
            };
        };

        // Xử lý khi kết thúc bài hát
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            };
        };

        // Xử lý khi tua
        progress.onchange = function (e) {
            const seekTime = e.target.value * audio.duration / 100;
            audio.currentTime = seekTime;
        };

        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            };
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };

        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            };
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };

        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
        };

        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
        };

        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)');
            if (songNode || e.target.closest('.option')) {
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    audio.play();
                    _this.render();
                };
            };
        };
    },

    // Chuyển bài hát
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        };
        this.loadCurrentSong();
    },

    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex <= 0) {
            this.currentIndex = this.songs.length - 1;
        };
        this.loadCurrentSong();
    },

    // Option random song
    playRandomSong: function () {
        let newIndex;

        // Xử lý để một bài hát không lặp lại nhiều lần
        let randomArray = JSON.parse(localStorage.getItem('randomArray')) || [0];
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (randomArray.includes(newIndex));
        randomArray.push(newIndex);
        if (randomArray.length === this.songs.length) {
            randomArray = [newIndex];
        };
        localStorage.setItem('randomArray', JSON.stringify(randomArray));

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    // Chuyển đến bài hát hiện tại trong danh sách
    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        }, 200);
    },

    render: function () {
        const htmls = this.songs.map((s, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index=${index} >
                    <div class="thumb"
                        style="background-image: url('${s.img}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${s.name}</h3>
                        <p class="author">${s.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        });
        playlist.innerHTML = htmls.join('');
    },

    start: function () {
        // Load config từ localstrorage
        this.loadConfig();

        // Định nghĩa thuộc tính cho object
        this.defineProperties();

        // Tải thông tin bài hát hiện tại
        this.loadCurrentSong();

        // Xử lý các sự kiện dashboad
        this.handleEvents();

        // Render playlist
        this.render();

        // Set option từ localstrorage
        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
    },
}

app.start();