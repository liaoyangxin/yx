<template>
  <div>
    <div v-if="youtobeId" :id="divId" style="width: 100%; height: 100%;background-color:#000"></div>
    <div v-else style="width: 100%; height: 100%;">
      <el-empty class="noFont" description="暂无数据"></el-empty>
    </div>

  </div>
</template>
<script>
import "./iframe_api";
export default {
  props: {
    youtobeId: {
      type: String,
      default: "",
    },
    muted: {
      type: Boolean,
      default: true,
    },
    divId: {
      type: String,
      default: "player",
    },
    toPlay: {
      type: Boolean,
      default: true,
    },
    fromView: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      player: null,
      done: false,
      currentTimeNew: null
    };
  },
  mounted() {
    if (this.youtobeId){
      this.onYouTubeIframeAPIReady();
    }
  },
  onBeforeUnmount() {
    clearInterval(this.currentTimeNew);
  },
  methods: {
    onYouTubeIframeAPIReady() {
      if (YT) {
        this.player = new YT.Player(`${this.divId}`, {
          // height: "100%",
          // width: "100%",
          videoId: this.youtobeId,
          events: {
            onReady: this.onPlayerReady,
            onStateChange: this.onPlayerStateChange,
          },
        });
      }
    },
    onPlayerReady(event) {
      var YoutobeTime = event.target.getDuration();
      this.$emit("youtobePlay", YoutobeTime);
      if (this.muted) {
        event.target.mute();
      } else {
        event.target.unMute();
      }
      if (this.toPlay) {
        event.target.playVideo();
        if (this.fromView) {
          this.currentTimeNew = setInterval(() => {
            this.$emit("currentTime", this.player.getCurrentTime());
          }, 1000);
        }
      } else {
        event.target.pauseVideo();
      }
    },
    onPlayerStateChange(event) {
      if (event.target.getPlayerState()) {
        switch (event.target.getPlayerState()) {
          case 1:
            this.$emit("youtobePlay");
            break;
          case 2:
            this.$emit("youtobeStop", this.player.getCurrentTime());
            break;
        }
      } else {
        this.$emit("youtobePlay", 0);
        this.$emit("youtobeStop", 0);
      }
    },
    stopVideo() {
      this.player.pauseVideo();
      this.$emit("youtobeStop", this.player.getCurrentTime());
    },
    getNewCurrentTime() {
      this.$emit("youtobeStop", this.player.getCurrentTime());
    },
    playVideo() {
      this.$nextTick(() => {
        this.player.playVideo();
      });
    },
  },
  watch: {
    youtobeId() {
      this.onYouTubeIframeAPIReady();
    },
  },
};
</script>
<style lang="less" scoped>
.noFont{
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
}
</style>
