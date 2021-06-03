/**
 * 1. Render song
 * 2. Scroll top
 * 3. Play / pause / seek
 * 4. CD rotate
 * 5. Next/ pre
 * 6. Random
 * 7. Next/ repeat when ended
 * 8. Active Song
 * 9. Scroll active song into view
 * 10. play song when click
 */
const PLAYER_STORAGE_KEY = 'PLAYER';
const $ = document.querySelector.bind(document);
const $$ = document.querySelector.bind(document);
const heading = $('.heading');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.toggle-play-btn');
const player = $('.player');
const process = $('input[type = "range"]');
const nextBtn = $('.next-btn');
const preBtn = $('.pre-btn');
const randomBtn = $('.random-btn');
const repeatBtn = $('.repeat-btn');
const song = $('.song');
const playList = $('.play-list');

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  isRepeat: false,
  songs: [
      {
        name: "Walk On Da Street",
        singer: "16 Typh x 16 BrT",
        path: "./assets/mp3/16 Typh x 16 BrT - WALK ON DA STREET (Official Music Video).mp3",
        image: "./assets/img/Walk on da street.jpg"
      },
      {
        name: "Quá Bảnh",
        singer: "Andrew Right Hand",
        path: "./assets/mp3/Andree Right Hand - QuaBanh [Official MV].mp3",
        image: "./assets/img/Quá bảnh.jpg"
      },
      {
        name: "Chạy Ngay Đi",
        singer: "Sơn Tùng M-TP",
        path: "/assets/mp3/CHẠY NGAY ĐI - RUN NOW - SƠN TÙNG M-TP - Official Music Video.mp3",
        image: "./assets/img/Chạy ngay đi.jpg"
      },
      {
        name: "Trốn Tìm",
        singer: "Đen ft MTV band",
        path: "./assets/mp3/Đen - Trốn Tìm ft. MTV band (M-V).mp3",
        image: "./assets/img/Trốn tìm.jpg"
      },
      {
        name: "Double Take",
        singer: "Dhruv",
        path: "./assets/mp3/dhruv - double take (Official Audio).mp3",
        image: "./assets/img/Double take.jpg"
      },
      {
        name: "Khi Em Lớn",
        singer: "Oreange x Hoàng Dũng",
        path: "./assets/mp3/Khi Em Lớn - Orange x Hoàng Dũng - Lyrics Video.mp3",
        image: "./assets/img/Khi em lớn.jpg"
      },
      {
        name: "Hãy Trao Cho Anh",
        singer: "Sơn Tùng M-TP",
        path: "./assets/mp3/SƠN TÙNG M-TP - HÃY TRAO CHO ANH ft. Snoop Dogg - Official MV.mp3",
        image: "./assets/img/Hãy trao cho anh.jpg"
      },
      {
          name: "Muộn Rồi Mà Sao Còn",
          singer: "Sơn Tùng M-TP",
          path: "./assets/mp3/SƠN TÙNG M-TP - MUỘN RỒI MÀ SAO CÒN - OFFICIAL MUSIC VIDEO.mp3",
          image: "./assets/img/Muộn rồi mà sao còn.jpg"
        },
        {
          name: "The Playah",
          singer: "Soobin x SlimV",
          path: "./assets/mp3/SOOBIN X SLIMV - THE PLAYAH (Special Performance - Official Music Video).mp3",
          image: "./assets/img/The playah.jpg"
        },
        {
          name: "Yêu Sắc Yếu",
          singer: "OSAD",
          path: "./assets/mp3/Yêu Sắc Yếu - OSAD - Official Music Video.mp3",
          image: "./assets/img/Yêu sắc yếu.jpg"
        },
  ],
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  setConfig(key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  
  loadConfig() {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },

   //  Render playList
  renderPlayList() {
    const htmls = this.songs.map(
      (song, index) => {
             
        return `<div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = "${index}">
                  <div class="song-img" style="background-image: url('${song.image}');"></div>
                    <div class="body">
                      <div class="song-wrap">
                        <h3 class="song-name">${song.name}</h3>
                        <p class="song-author">${song.singer}</p>
                      </div>
                      <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                      </div>
                  </div>
                </div>`
      })
        playList.innerHTML = htmls.join('');
  },

  defineProperties() {
    Object.defineProperty(this, 'currentSong', {
      get: function() {
        return this.songs[this.currentIndex];
      }
    })
  },

  nextSong() {
      this.currentIndex++;
      if (this.currentIndex >= this.songs.length) {
        this.currentIndex = 0;
      }
    this.loadCurrentSong()
  },

  preSong() {
    this.currentIndex--;
      if (this.currentIndex < 0) {
        this.currentIndex = this.songs.length - 1;
      }
    this.loadCurrentSong()
  },
  
  playRandom() {
    var newIndex 
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
      
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },

  scrollIntoView() {
    setTimeout(() => {
      $('.song.active').scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    }, 300)
  },

  handleEvents() {
    const cd = $('.cd');
    const cdWidth = cd.offsetWidth;
    const _this = this;
      //Xu ly phong to thu nho khi scroll
      document.onscroll = function() {
        const scrollTop = document.documentElement.scrollTop || window.scrollY;
        var newWidth = cdWidth - scrollTop;
        cd.style.width = newWidth > 0 ? newWidth + 'px' : 0;
        cd.style.opacity = newWidth / cdWidth;
      }

      //XU ly play/ pause 
      playBtn.onclick = function() {
        if (_this.isPlaying) {
          audio.pause();
        } else {
          audio.play();
        }
      }

      //Play
      audio.onplay = function() {
        _this.isPlaying = true;
        player.classList.add('playing');
        cdRotate.play();
        _this.renderPlayList();
        _this.scrollIntoView();
      }

      //Pause
      audio.onpause = function() {
        _this.isPlaying = false;
        player.classList.remove('playing');
        cdRotate.pause();
      }

      //When playing
      audio.ontimeupdate = function() {
        if(audio.duration) {
          process.value = Math.floor(audio.currentTime / audio.duration * 100)
        }
      }

      process.onchange = function() {
        const length = audio.duration;
        audio.currentTime = length / 100 * this.value;
      }

      //Cd rotate
      var cdRotate = cdThumb.animate([
        {transform: 'rotate(360deg)'}
      ], {
        duration: 10000,
        iterations: Infinity
      })
      cdRotate.pause();

    //XU ly next song
    nextBtn.onclick = function() {
      if (_this.isRandom) {
        _this.playRandom()
      } else {
        _this.nextSong();
      }
      
      audio.play();
    }

    //Xu ly pre song
    preBtn.onclick = function() {
      if (_this.isRandom) {
        _this.playRandom()
      } else {
        _this.preSong();
      }
      audio.play();
    }
    
    // Random
    randomBtn.onclick = function() {
      _this.isRandom = !_this.isRandom;
      _this.setConfig('isRandom', _this.isRandom);
      this.classList.toggle('active', _this.isRandom)
    }

    //Repeat
    repeatBtn.onclick = function() {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig('isRepeat', _this.isRepeat);
      this.classList.toggle('active', _this.isRandom)
    }

    //Next/repeat on ended 
    audio.onended = function() {
      if (_this.isRepeat) {
        audio.play()
      } else {
        nextBtn.click();
      }
    }

    //Play on click song
    playList.onclick = function(e) {
      const songNode = e.target.closest('.song:not(.active)');
      const optionNode = e.target.closest('.option');
      if (songNode || optionNode) {
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          audio.play();
        }
      }
      
    }
  },

  loadCurrentSong() {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path; 
  },

  start() {
    //Load config
    this.loadConfig();

    //Dinh nghia cac thuoc tinh
    this.defineProperties();

    //Xu ly cac su kien
    this.handleEvents();

    //Load bai hat hien tai len UI
    this.loadCurrentSong();

    //Render giao dien
    this.renderPlayList();

    randomBtn.classList.toggle('active', this.isRandom);
    repeatBtn.classList.toggle('active', this.isRepeat);
  }
}
 
 
app.start();
