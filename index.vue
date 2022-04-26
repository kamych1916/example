<template>
  <div class="stream">
    <client-only>
      <div class="stream-mobile-header">
        <div v-if="dataURL">
          {{ dataURL.building }}
        </div>
        <img @click="copieURL()" src="/images/stream/add-client.svg" />
      </div>

      <div
        class="stream-video"
        :style="{
          paddingBottom: screenWidth < 1024 ? (toggle_clients ? '0' : '') : '',
        }"
      >
        <div
          class="stream-video-zoomer"
          :style="{
            flex: toggle_clients ? null : '0 0 100%',
          }"
        >
          <span class="w-100" v-if="clients.length > 0">
            <span class="w-100" v-for="track in clients" :key="track.id">
              <span v-if="track.userRole == 'manager'">
                <video
                  preload="metadata"
                  autoplay
                  playsinline
                  allowsInlineMediaPlayback
                  :ref="track.id"
                  :id="track.id"
                  :srcObject.prop="track.srcObject"
                  :controls="false"
                  :style="{
                    'z-index': track.videoMuted ? '-1' : '4',
                  }"
                ></video>
                <div
                  :style="{
                    'z-index': track.videoMuted ? '5' : '-2',
                  }"
                  class="stream-video-zoomer__backdrop"
                >
                  <div v-if="dataURL" class="stream-video__avatar-icon">
                    <img
                      class="stream-video__avatar-icon--fill"
                      v-if="dataURL.managerImg"
                      :src="dataURL.managerImg"
                    />
                  </div>
                </div>
              </span>
            </span>
          </span>
          <div class="stream-video-zoomer__backdrop">
            <div class="stream-video__avatar-icon">
              <img
                class="stream-video__avatar-icon--empty"
                src="/images/stream/сlient-avatar-icon.png"
              />
            </div>
          </div>
        </div>

        <div
          :class="[
            toggle_clients
              ? 'stream-video-clients--active'
              : 'stream-video-clients--deactive',
          ]"
          :style="{
            opacity: toggle_clients ? '1' : '0',
            visibility: toggle_clients ? 'visible' : 'hidden',
          }"
          class="stream-video-clients"
        >
          <client-only>
            <Carousel :options="clients_carousel_options">
              <!-- <div class="stream-video-clients__card">
              <div class="stream-video__avatar-icon">
                <img
                  class="stream-video__avatar-icon--empty"
                  src="/images/stream/сlient-avatar-icon.png"
                />
              </div>
            </div>
            <div class="stream-video-clients__card">
              <div class="stream-video__avatar-icon">
                <img
                  class="stream-video__avatar-icon--empty"
                  src="/images/stream/сlient-avatar-icon.png"
                />
              </div>
            </div>
            <div class="stream-video-clients__card">
              <div class="stream-video__avatar-icon">
                <img
                  class="stream-video__avatar-icon--empty"
                  src="/images/stream/сlient-avatar-icon.png"
                />
              </div>
            </div> -->
              <div v-for="track in clients" :key="track.id">
                <div
                  class="stream-video-clients__card"
                  v-if="track.userRole !== 'manager'"
                >
                  <video
                    v-if="track.id == 'localVideo'"
                    :ref="track.id"
                    :id="track.id"
                    :srcObject.prop="track.srcObject"
                    autoplay
                    webkit-playsinline
                    playsinline
                    preload="metadata"
                    muted
                  />
                  <video
                    v-else
                    :ref="track.id"
                    :id="track.id"
                    :srcObject.prop="track.srcObject"
                    autoplay
                    webkit-playsinline
                    playsinline
                  />
                  <div
                    v-if="track.videoMuted || track.audioMuted"
                    class="stream-video-clients__card-backdrop"
                  >
                    <div class="stream-video__avatar-icon">
                      <img
                        v-if="!track.userImg"
                        class="stream-video__avatar-icon--empty"
                        src="/images/stream/сlient-avatar-icon.png"
                      />
                      <img
                        class="stream-video__avatar-icon--fill"
                        v-else
                        :src="track.userImg"
                      />
                    </div>
                  </div>

                  <div
                    class="stream-video-clients__card-name"
                    v-if="track.userName"
                  >
                    {{ track.userName }}
                  </div>
                  <div
                    v-if="track.id !== 'localVideo'"
                    class="stream-video-clients__card-audio"
                    @click="muteClientAudio(track.id)"
                  >
                    <img
                      src="/images/stream/option-micro.svg"
                      :ref="track.id + '_remoteAudio'"
                    />
                  </div>
                </div>
              </div>
            </Carousel>
          </client-only>
        </div>
      </div>

      <div class="stream-options" v-if="dataURL">
        <div class="stream-options__title">
          {{ dataURL.building }}
        </div>
        <div class="stream-options__buttons">
          <div
            class="stream-options__button"
            @click="audioAvailable ? toggleAudio() : null"
          >
            <img
              :src="
                audioAvailable
                  ? localAudioMuted
                    ? '/images/stream/option-micro-mute.svg'
                    : '/images/stream/option-micro.svg'
                  : '/images/stream/option-micro-mute.svg'
              "
            />
          </div>
          <div
            class="stream-options__button"
            @click="videoAvailable ? toggleVideo() : null"
          >
            <img
              :src="
                videoAvailable
                  ? localVideoMuted
                    ? '/images/stream/option-video-mute.svg'
                    : '/images/stream/option-video.svg'
                  : '/images/stream/option-video-mute.svg'
              "
            />
          </div>
          <div class="stream-options__button">
            <img src="/images/stream/option-chat.svg" />
          </div>
          <div
            class="stream-options__button"
            @click="toggle_clients = !toggle_clients"
            :class="[toggle_clients ? 'stream-options__button--active' : '']"
          >
            <img src="/images/stream/option-clients.svg" />
          </div>
          <div
            @click="dialogFeedbackPurchase = true"
            class="stream-options__button stream-options__button-hangup"
          >
            <img src="/images/stream/option-hangup.svg" />
          </div>
        </div>
        <div class="stream-options__link" @click="copieURL()">
          <svg
            width="22"
            height="28"
            viewBox="0 0 22 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.9966 18.0683C11.5134 18.0683 11.9581 17.643 11.9581 17.1468V5.01266L11.886 3.2404L12.6912 4.07927L14.5181 5.99332C14.6864 6.18236 14.9267 6.27688 15.1671 6.27688C15.6599 6.27688 16.0445 5.92242 16.0445 5.43801C16.0445 5.18989 15.9363 5.00085 15.756 4.82362L11.6937 0.971901C11.4533 0.735599 11.249 0.652893 10.9966 0.652893C10.7562 0.652893 10.5519 0.735599 10.2995 0.971901L6.23716 4.82362C6.05688 5.00085 5.96073 5.18989 5.96073 5.43801C5.96073 5.92242 6.32129 6.27688 6.82608 6.27688C7.05443 6.27688 7.31885 6.18236 7.48711 5.99332L9.30195 4.07927L10.1192 3.2404L10.0471 5.01266V17.1468C10.0471 17.643 10.4798 18.0683 10.9966 18.0683ZM4.10983 27.3196H17.8954C20.4073 27.3196 21.6693 26.0908 21.6693 23.6569V11.8654C21.6693 9.43151 20.4073 8.20274 17.8954 8.20274H14.5421V10.105H17.8593C19.0492 10.105 19.7342 10.743 19.7342 11.9718V23.5505C19.7342 24.7793 19.0492 25.4173 17.8593 25.4173H4.13387C2.93199 25.4173 2.27096 24.7793 2.27096 23.5505V11.9718C2.27096 10.743 2.93199 10.105 4.13387 10.105H7.46307V8.20274H4.10983C1.59791 8.20274 0.335938 9.43151 0.335938 11.8654V23.6569C0.335938 26.0908 1.59791 27.3196 4.10983 27.3196Z"
              fill="#717171"
            />
          </svg>

          Share a link to the broadcast
        </div>
      </div>

      <el-dialog
        class="popup_dialog stream_dialog"
        :visible.sync="dialogFeedbackPurchase"
        :append-to-body="true"
        center
      >
        <div slot="title" class="popup_header w-100">
          <!-- <img :src="data.icon" class="popup_icon" /> -->
        </div>
        <div
          class="pt-20 px-20 pb-20 text-center"
          style="word-break: break-word"
        >
          <br />
          <div class="fs-18">
            Are you ready to consider this object for purchase?
          </div>
          <br />
          <div class="d-flex justify-content-between w-100">
            <button
              class="btn btn-outline mt-30 py-14 mr-10"
              @click="
                feedback.purchase.value = 'Yes';
                dialogFeedbackPurchase = false;
                dialogFeedContact = true;
              "
            >
              Yes
            </button>
            <button
              class="btn btn-outline mt-30 py-14 ml-10"
              @click="
                feedback.purchase.value = 'No';
                sendFeedback();
              "
            >
              No
            </button>
          </div>
          <button
            class="btn btn-outline mt-30 py-14 w-100"
            @click="
              feedback.purchase.value = 'I wonder';
              dialogFeedbackPurchase = false;
              dialogFeedContact = true;
            "
          >
            I wonder
          </button>
        </div>
      </el-dialog>

      <el-dialog
        class="popup_dialog stream_dialog"
        :visible.sync="dialogFeedContact"
        :append-to-body="true"
        center
      >
        <div slot="title" class="popup_header w-100">
          <!-- <img :src="data.icon" class="popup_icon" /> -->
        </div>
        <div
          class="pt-20 px-20 pb-20 text-center"
          style="word-break: break-word"
        >
          <br />
          <div class="fs-18">Do you want to leave your contact details?</div>
          <br />
          <div class="d-flex justify-content-between w-100">
            <button
              class="btn-outline mt-30 py-14 mr-10"
              @click="
                feedback.contact.value = 'No';
                sendFeedback();
              "
            >
              No
            </button>
            <button
              class="btn btn mt-30 py-14 ml-10"
              @click="
                feedback.contact.value = 'Yes';
                dialogFeedContact = false;

                dialogSendPhone_access
                  ? (dialogSendPhone = true)
                  : sendFeedback();
              "
            >
              Yes
            </button>
          </div>
        </div>
      </el-dialog>

      <el-dialog
        class="popup_dialog stream_dialog"
        :visible.sync="dialogSendPhone"
        :append-to-body="true"
        center
      >
        <div slot="title" class="popup_header w-100">
          <!-- <img :src="data.icon" class="popup_icon" /> -->
        </div>
        <form
          @submit.prevent="sendFeedback()"
          class="pt-20 px-20 pb-20 text-center"
          style="word-break: break-word"
        >
          <br />
          <div class="fs-18">Enter your phone number</div>
          <br />
          <div class="w-100">
            <el-input
              required
              v-model="feedback.phone"
              name="phone"
              :placeholder="$t('pages.auth.signup.inputs.phone')"
              clearable
              type="phone"
            ></el-input>
          </div>
          <div class="d-flex justify-content-between w-100">
            <button
              type="button"
              class="btn btn-outline mt-30 py-14 mr-10"
              @click="dialogSendPhone = false"
            >
              Cancel
            </button>
            <button type="submit" class="btn mt-30 py-14 ml-10">Send</button>
          </div>
        </form>
      </el-dialog>

      <div v-if="dialogWelcome && dataURL" class="stream-welcome">
        <Header />
        <div class="stream-welcome__wrapper">
          <div class="stream-welcome__video">
            <span class="w-100" v-if="clients.length > 0">
              <span class="w-100" v-for="track in clients" :key="track.id">
                <span v-if="track.userName == 'You'">
                  <video
                    preload="metadata"
                    autoplay
                    playsinline
                    allowsInlineMediaPlayback
                    :ref="track.id"
                    :id="track.id"
                    :srcObject.prop="track.srcObject"
                    muted
                    :style="{
                      'z-index': track.videoMuted ? '-1' : '4',
                    }"
                  ></video>
                  <div
                    :style="{
                      'z-index': track.videoMuted ? '5' : '-2',
                    }"
                    class="stream-video-zoomer__backdrop"
                  >
                    <div class="stream-video__avatar-icon">
                      <img
                        class="stream-video__avatar-icon--empty"
                        src="/images/stream/сlient-avatar-icon.png"
                      />
                    </div>
                  </div>
                </span>
              </span>
            </span>
            <div class="stream-welcome__buttons">
              <div
                class="stream-options__button"
                @click="audioAvailable ? toggleAudio() : null"
              >
                <img
                  :src="
                    audioAvailable
                      ? localAudioMuted
                        ? '/images/stream/option-micro-mute.svg'
                        : '/images/stream/option-micro.svg'
                      : '/images/stream/option-micro-mute.svg'
                  "
                />
              </div>
              <div
                class="stream-options__button"
                @click="videoAvailable ? toggleVideo() : null"
              >
                <img
                  :src="
                    videoAvailable
                      ? localVideoMuted
                        ? '/images/stream/option-video-mute.svg'
                        : '/images/stream/option-video.svg'
                      : '/images/stream/option-video-mute.svg'
                  "
                />
              </div>
            </div>
            <div class="stream-welcome__buttons-backdrop"></div>
          </div>
          <div class="d-flex align-items-center">
            <div>
              <p class="stream-welcome__title mt-30 fs-28 text-center">
                {{ dataURL.building }}
              </p>
              <p class="text-center mt-10 mb-30">
                Check audio and video before streaming
              </p>
              <div class="w-100 d-flex justify-content-center">
                <button
                  class="btn btn-outline mr-20 w-75"
                  @click="$router.go(-1)"
                >
                  Cancel
                </button>
                <button
                  class="btn w-75"
                  @click="
                    dialogWelcome = false;
                    init();
                  "
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </client-only>
  </div>
</template>

<script>
// let socket = io("https://dev.stream.theeye.live");
// let socket = io("https://mirllex.space");
// let socket = io("http://localhost:3001");

const ACTIONS = {
  JOIN: "join",
  LEAVE: "leave",
  SHARE_ROOMS: "share-rooms",
  ADD_PEER: "add-peer",
  REMOVE_PEER: "remove-peer",
  RELAY_SDP: "relay-sdp",
  RELAY_ICE: "relay-ice",
  ICE_CANDIDATE: "ice-candidate",
  SESSION_DESCRIPTION: "session-description",

  RELAY_AUDIO_STATE: "relay-audio-state",
  RELAY_VIDEO_STATE: "relay-video-state",
  AUDIO_STATE: "audio-state",
  VIDEO_STATE: "video-state",
};

export default {
  layout: "empty",

  data() {
    return {
      socket: null,
      myStream: null,
      peerConections: [],
      roomID: null,

      clients: [],

      toggle_clients: true,

      clients_carousel_options: {
        align: "prev",
        circular: false,
        autoResize: true,
        useResizeObserver: true,
        arrows: false,
        dots: false,
        horizontal: false,
      },

      localAudioMuted: false,
      localVideoMuted: false,
      videoAvailable: false,
      audioAvailable: false,

      screenWidth: null,

      inviteURL: null,

      feedback: {
        purchase: {
          value: null,
          label: null,
        },
        contact: {
          value: null,
          label: null,
        },
        phone: null,
      },

      dialogFeedbackPurchase: false,
      dialogFeedContact: false,
      dialogSendPhone: false,
      dialogSendPhone_access: false,
      dialogWelcome: true,

      dataURL: null,
      videoAvailable: false,
      audioAvailable: false,
    };
  },

  fetchOnServer: false,
  async fetch() {
    this.screenWidth = screen.width;
    if (this.screenWidth < 1024) {
      this.clients_carousel_options.horizontal = true;
      this.clients_carousel_options.arrows = true;
    }

    this.socket = null;
    this.peerConections = [];
    this.clients = [];

    this.socket = this.$nuxtSocket({ name: "stream" });
    this.dataURL = this.getData();

    this.getMediaDevices();
  },

  methods: {
    async getMediaDevices() {
      await navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(() => (this.videoAvailable = true))
        .catch(() => (this.videoAvailable = false));

      await navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(() => (this.audioAvailable = true))
        .catch(() => (this.audioAvailable = false));

      navigator.mediaDevices
        .getUserMedia({
          video: this.videoAvailable,
          audio: this.audioAvailable,
        })
        .then((stream) => {
          this.clients.push({
            id: "localVideo",
            srcObject: stream,
            videoMuted: !this.videoAvailable,
            audioMuted: !this.audioAvailable,
            userName: "You",
            userRole: "client",
            userImg: this.dataURL.userImage,
          });
          this.myStream = stream;
        })
        .catch((e) => {
          this.NTFS(
            false,
            "You can't speak or show the camera because we didn't get access to them."
          );
          this.clients.push({
            id: "localVideo",
            srcObject: null,
            videoMuted: true,
            userName: "You",
            userRole: "client",
            userImg: this.dataURL.userImage,
          });
        });
    },

    init() {
      if (!this.dataURL && Object.keys(this.dataURL).length === 0) {
        this.$router.push(this.localePath("/"));
        return;
      }

      this.roomID = this.dataURL.sessionId;
      this.dialogSendPhone_access = this.dataURL.modal_phone;

      this.socket.emit(ACTIONS.JOIN, {
        roomID: this.roomID,
        inviteToken: this.dataURL.inviteToken,
        userToken: this.$cookies.get("csrf"),
      });

      this.socket.on(ACTIONS.ADD_PEER, (data) => {
        this.peerConections.push(data.peerID);
        this.peerConections[data.peerID] = new RTCPeerConnection({
          iceServers: [
            {
              url: "stun:dev.stream.theeye.live:3478",
            },
            {
              url: "stun:stun.ozekiphone.com:3478",
            },
            {
              url: "stun:46.229.213.102:3478",
            },
            {
              url: "turn:dev.stream.theeye.live:3478",
              username: "main",
              credential: "vnui7i34nhvifweh",
            },
            {
              url: "turn:openrelay.metered.ca:80",
              username: "openrelayproject",
              credential: "openrelayproject",
            },
            {
              url: "turn:46.229.213.102:3478",
              username: "test",
              credential: "test123",
            },
          ],
        });
        this.$nextTick();
        this.addParticipant(data);
      });

      this.socket.on(ACTIONS.SESSION_DESCRIPTION, async (data) => {
        this.handleSPD(data.sdp, data.peerID, data.sdpType);
      });

      this.socket.on(ACTIONS.ICE_CANDIDATE, async (data) => {
        if (data.peerID) {
          this.handleICE(data);
        }
      });

      this.socket.on(ACTIONS.REMOVE_PEER, async (data) => {
        this.removePeer(data.peerID);
      });

      this.socket.on(ACTIONS.AUDIO_STATE, async (data) => {
        this.toggleRemoteAudio(data.peerID, data.audioState);
      });

      this.socket.on(ACTIONS.VIDEO_STATE, async (data) => {
        this.muteRemoteVideo(data.peerID, data.videoState);
      });
    },

    sendFeedback() {
      const dataURL = this.getData();
      this.$api
        .post("/stream/feedback", {
          id: dataURL.sessionId,
          purchase: this.feedback.purchase.value
            ? this.feedback.purchase.value
            : null,
          contact: this.feedback.contact.value
            ? this.feedback.contact.value
            : null,
          phone: this.feedback.phone ? this.feedback.phone : null,
        })
        .then(() => {
          this.leaveRoom();
        })
        .catch((e) => {
          console.log(e);
          this.leaveRoom();
        });
    },

    copieURL() {
      "use strict";
      navigator.clipboard.writeText(this.inviteURL);
      this.NTFS(true, "Share link is copied");
    },

    getData() {
      const decryptedText = JSON.parse(
        this.$CryptoJS.AES.decrypt(
          this.$route.query.token.toString(),
          "streamtheeyeliveveronicazaharkamoldima2021"
        ).toString(this.$CryptoJS.enc.Utf8)
      );

      this.inviteURL = decryptedText.inviteURL;
      return decryptedText;
    },

    addParticipant(data) {
      this.clients.push({
        id: data.peerID,
        srcObject: false,
        userImg: data.userImage,
        userName: data.userName,
        userRole: data.userRole,
        videoMuted: false,
      });

      if (this.myStream) {
        this.myStream.getTracks().forEach((track) => {
          this.peerConections[data.peerID].addTrack(track, this.myStream);
        });
      }

      if (data.createOffer) {
        this.createOffer(data.peerID);
      }

      this.sendICE(data.peerID);

      this.peerConections[data.peerID].ontrack = async (event) => {
        this.$refs[data.peerID][0].srcObject = event.streams[0];

        // Визуализация звука
        // const levels = new Array(10);
        // setInterval(() => {
        //   const receiver = this.peerConections[data.peerID].getReceivers().find((r) => {
        //     return r.track.kind === "audio";
        //   });
        //   if (receiver && receiver.getSynchronizationSources) {
        //     const source = receiver.getSynchronizationSources()[0];
        //     if (source) {
        //       levels.push(source.audioLevel);
        //     } else {
        //       levels.push("no level received");
        //     }
        //     levels.shift(); // so we keep a fixed number of levels
        //     console.log(levels);
        //   }
        // }, 200);

        // if (!this.myStream) {
        //   this.$refs[data.peerID][0].muted = true;
        //   let remoteAudioId = data.peerID + "_remoteAudio";
        //   if (this.$refs[remoteAudioId][0]) {
        //     this.$refs[remoteAudioId][0].src =
        //       "/images/stream/option-micro-mute.svg";
        //   }
        // }

        // if (!this.myStream) {
        //   this.$refs[data.peerID][0].muted = true;

        //   document.body.addEventListener(
        //     "mouseover",
        //     () => {
        //       console.log("kek");
        //       this.$refs[data.peerID][0].play();
        //       this.$refs[data.peerID][0].muted = false;
        //     },
        //     true
        //   );
        // }
      };
    },

    createOffer(peerID) {
      let options = { offerToReceiveAudio: true, offerToReceiveVideo: true };
      this.peerConections[peerID]
        .createOffer(options)
        .then((offer) => {
          this.peerConections[peerID].setLocalDescription(offer);
          this.sendSDP(offer, peerID);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    async handleSPD(sdp, peerID, sdpType) {
      let remoteSDP = new RTCSessionDescription({
        sdp: sdp,
        type: sdpType,
      });

      await this.peerConections[peerID].setRemoteDescription(remoteSDP);

      if (sdpType.trim() == "offer") {
        let answer = await this.peerConections[peerID].createAnswer({
          mandatory: {
            OfferToReceiveAudio: true,
            OfferToReceiveVideo: true,
          },
        });
        await this.peerConections[peerID].setLocalDescription(answer);
        this.sendSDP(answer, peerID);
      }
    },

    sendSDP(sdp, peerID) {
      let sdpType = "prAnswer";
      if (sdp.type == "offer") {
        sdpType = "offer";
      } else if (sdp.type == "answer") {
        sdpType = "answer";
      }
      let sessionDescription = sdp.sdp;
      let items = { peerID: peerID, sdp: sessionDescription, sdpType: sdpType };
      this.socket.emit(ACTIONS.RELAY_SDP, items);
    },

    async handleICE(data) {
      await this.peerConections[data.peerID].addIceCandidate(
        new RTCIceCandidate({
          candidate: data.iceSdp,
          sdpMLineIndex: data.iceSdpMLineIndex,
          sdpMid: data.iceSdpMid ? data.iceSdpMid : "",
        })
      );
    },

    sendICE(peerID) {
      this.peerConections[peerID].onicecandidate = ({ candidate }) => {
        if (candidate) {
          this.socket.emit(ACTIONS.RELAY_ICE, {
            peerID: peerID,
            iceSdp: candidate.candidate,
            iceSdpMLineIndex: candidate.sdpMLineIndex,
            iceSdpMid: candidate.sdpMid ? candidate.sdpMid : "",
          });
        }
      };
    },

    toggleAudio() {
      if (this.myStream) {
        this.myStream.getTracks().forEach((track) => {
          if (track.kind === "audio") {
            if (track.enabled) {
              this.localAudioMuted = true;
              track.enabled = false;
              this.socket.emit(ACTIONS.RELAY_AUDIO_STATE, {
                roomID: this.roomID,
                audioState: false,
              });
            } else {
              this.localAudioMuted = false;
              track.enabled = true;
              this.socket.emit(ACTIONS.RELAY_AUDIO_STATE, {
                roomID: this.roomID,
                audioState: true,
              });
            }
          }
        });
      }
    },

    toggleRemoteAudio(peerID, value) {
      let remoteAudio = peerID + "_remoteAudio";
      if (this.$refs[peerID]) {
        if (this.$refs[peerID][0].muted == value) {
          this.$refs[remoteAudio][0].src =
            "/images/stream/option-micro-mute.svg";
        } else {
          this.$refs[remoteAudio][0].src = "/images/stream/option-micro.svg";
        }
      }
    },

    muteClientAudio(id) {
      let remoteAudioId = id + "_remoteAudio";
      if (this.$refs[id]) {
        if (this.$refs[id][0].muted == true) {
          this.$refs[remoteAudioId][0].src = "/images/stream/option-micro.svg";
          this.$refs[id][0].muted = false;
        } else {
          this.$refs[remoteAudioId][0].src =
            "/images/stream/option-micro-mute.svg";
          this.$refs[id][0].muted = true;
        }
      }
    },

    toggleVideo() {
      if (this.myStream) {
        this.myStream.getTracks().forEach((track) => {
          if (track.kind === "video") {
            if (track.enabled) {
              this.localVideoMuted = true;
              track.enabled = false;
              this.clients.forEach((el) => {
                if (el.id == "localVideo") el.videoMuted = true;
              });
              this.socket.emit(ACTIONS.RELAY_VIDEO_STATE, {
                roomID: this.roomID,
                videoState: false,
              });
            } else {
              this.localVideoMuted = false;
              track.enabled = true;
              this.clients.forEach((el) => {
                if (el.id == "localVideo") el.videoMuted = false;
              });
              this.socket.emit(ACTIONS.RELAY_VIDEO_STATE, {
                roomID: this.roomID,
                videoState: true,
              });
            }
          }
        });
      }
    },

    muteRemoteVideo(peerID, videoState) {
      this.clients.forEach(async (el) => {
        if (el.id == peerID) {
          if (videoState) {
            el.videoMuted = false;
          } else {
            el.videoMuted = true;
          }
        }
      });
    },

    removePeer(peerID) {
      this.peerConections[peerID].close();
      this.peerConections = this.peerConections.filter((el) => {
        return el === peerID ? false : true;
      });
      this.clients = this.clients.filter((element) => {
        return element.id === peerID ? false : true;
      });
    },

    leaveRoom() {
      this.socket.emit(ACTIONS.LEAVE);
      this.socket.disconnect();
      this.peerConections = [];
      this.clients = [];
      this.$cookies.remove("streamURL");
      if (this.myStream) {
        this.myStream.getTracks().forEach((track) => {
          track.stop();
        });
      }
      this.myStream = null;
      this.$router.push(this.localePath("/"));
    },
  },

  unmounted() {
    this.leaveRoom();
  },
};
</script>

<style lang="scss">
$stream-options: calc(20px + env(safe-area-inset-bottom));

.stream_dialog {
  .el-input__inner {
    padding: 10px 22px !important;
    height: 46px !important;
  }
  button {
    flex: 1 auto;
  }
}

.stream {
  background: #222222;
  height: 100vh;
  padding: 24px;
  position: relative;
  width: 100%;
  transition: all ease 0.6s;

  @include less-than(laptop) {
    padding: 0px;
    // padding-bottom: env(safe-area-inset-bottom) !important;
    $safe-area-inset-bottom: env(safe-area-inset-bottom);
    height: calc(100vh + $safe-area-inset-bottom);
    // margin-bottom: env(safe-area-inset-bottom);
    // height: 100%;
    // height: calc(100% - env(safe-area-inset-bottom));

    // padding: env(safe-area-inset-top) env(safe-area-inset-right)
    //   env(safe-area-inset-bottom) env(safe-area-inset-left);
    // padding-top: constant(safe-area-inset-top);
    // margin-top: -constant(safe-area-inset-top);
  }

  .stream-video {
    position: relative;
    display: flex;
    transition: all ease 0.6s;
    gap: 24px;
    height: calc(95% - $stream-options);
    width: 100%;
    @include less-than(laptop_l) {
      height: calc(96% - $stream-options);
    }
    @include less-than(laptop) {
      display: block;
      padding: 0;
      height: 100%;
    }
  }

  .stream-mobile-header {
    display: none;
    @include less-than(laptop) {
      top: env(safe-area-inset-top);
      position: absolute;
      width: 100%;
      z-index: 6;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 60px;
      color: #fff;
      padding-left: 24px;
      padding-right: 24px;
      background: rgba(34, 34, 34, 0.5);
    }
  }

  .stream-video__avatar-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #5a5a5a;
    border-radius: 100%;
    width: 100px;
    height: 100px;
    position: relative;

    .stream-video__avatar-icon--empty {
      width: 28px;
      height: 28px;
    }
    .stream-video__avatar-icon--fill {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 100%;
      position: absolute;

      // @include less-than(laptop) {
      //   border-radius: 0px;
      // }
    }
  }

  .stream-video-zoomer {
    position: relative;
    flex: 4;
    transition: all ease 0.2s;
    border-radius: 16px;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    background-size: cover;
    object-fit: cover;
    background-repeat: no-repeat;
    background: #313131;

    @include less-than(laptop) {
      overflow: hidden;
      border-radius: 0px;
      position: absolute;
      background: #222222;
    }

    video {
      width: 100%;
      height: 100%;
      border-radius: 16px;
      transition: all ease 0.3s;
      background: black;
      object-fit: cover;
      background-size: cover;
      position: absolute;
      z-index: 4;

      @include less-than(laptop) {
        // height: calc(94% - $stream-options);
        width: 100vw !important;
        height: 100% !important;
        border-radius: 0px;
      }
    }
  }

  .stream-video-zoomer__wrapper {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 5;
  }

  .stream-video-zoomer__backdrop {
    position: absolute;
    display: block;
    background: #313131;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    transition: all ease 0.3s;
    border-radius: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
    @include less-than(laptop) {
      width: 100vw;
      border-radius: 0px;
      bottom: env(safe-area-inset-bottom);
      background: #222222;
    }
    img {
      border-radius: 100%;
    }
  }

  .stream-video-clients {
    flex: 1;

    @include less-than(laptop) {
      width: 100%;
      position: fixed;
      padding: 20px;
      bottom: calc(env(safe-area-inset-bottom));
      padding-bottom: calc(60px + $stream-options);
      z-index: 7;
    }

    .flicking-viewport {
      height: 100%;
      display: flex;
      -webkit-border-radius: 24px;
      -moz-border-radius: 24px;
      border-radius: 24px;
      -khtml-border-radius: 24px;

      @include less-than(laptop) {
        border-radius: 14px;
      }

      .flicking-arrow-prev {
        left: 1%;
      }
      .flicking-arrow-next {
        right: 1%;
      }
      .flicking-arrow-prev,
      .flicking-arrow-next {
        z-index: 9 !important;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 45px;
        height: 45px;
        border-radius: 100%;
        box-sizing: border-box;
        // border: 1px solid #eaeaea;
        box-shadow: 0px 8px 30px rgba(0, 0, 0, 0.07);
        background: #4545457a;
        cursor: pointer;
        top: 50%;
        // bottom: calc(155px + env(safe-area-inset-bottom));
        color: rgb(255, 255, 255);
        svg {
          filter: invert(100%) sepia(100%) saturate(0%) hue-rotate(288deg)
            brightness(102%) contrast(102%);
        }
        &::before,
        &::after {
          content: none;
        }

        @include less-than(tablet) {
          display: none;
        }
      }
    }
  }

  .stream-video-clients--active {
    animation-name: animate-stream-video-clients--active;
    animation-duration: 0.3s;
  }

  .stream-video-clients--deactive {
    animation-name: animate-stream-video-clients--deactive;
    animation-duration: 0.3s;
  }

  @keyframes animate-stream-video-clients--active {
    from {
      visibility: hidden;
      opacity: 0;
    }
    to {
      opacity: 1;
      visibility: visible;
    }
  }

  @keyframes animate-stream-video-clients--deactive {
    from {
      opacity: 1;
      visibility: visible;
    }
    to {
      visibility: hidden;
      opacity: 0;
    }
  }

  .stream-video-clients__card {
    -webkit-border-radius: 24px;
    -moz-border-radius: 24px;
    border-radius: 24px;
    -khtml-border-radius: 24px;
    width: 100%;
    height: 219px;
    border-radius: 24px;
    margin-bottom: 24px;
    position: relative;
    display: flex !important;
    justify-content: center;
    align-items: center;
    background: #313131;

    @include less-than(laptop) {
      margin-right: 10px;
      margin-bottom: 0px;
      width: 130px;
      height: 170px;
      border-radius: 16px;
    }

    @include less-than(tablet) {
      width: 110px;
      height: 140px;
      margin-right: 16px;
      border-radius: 16px;
    }

    .stream-video-clients__card-backdrop {
      position: absolute;
      display: block;
      background: #313131;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      transition: all ease 0.3s;
      border-radius: 16px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .stream-video__avatar-icon {
      width: 80px;
      height: 80px;
      .stream-video__avatar-icon--empty {
        width: 22px;
        height: 22px;
      }
      .stream-video__avatar-icon--fill {
        border-radius: 100%;
        position: relative;
      }
      @include less-than(laptop) {
        width: 50px;
        height: 50px;
        .stream-video__avatar-icon--empty {
          width: 14px;
          height: 14px;
        }
      }
    }

    video {
      transition: all ease 0.6s;
      width: 100%;
      height: 100%;
      // max-width: fit-content;
      object-fit: cover;
      border-radius: 16px;
      -ms-transform: scaleX(-1);
      -moz-transform: scaleX(-1);
      -webkit-transform: scaleX(-1);
      transform: scaleX(-1);
    }
  }

  .stream-video-clients__card-audio {
    cursor: pointer;
    width: 40px;
    height: 40px;
    position: absolute;
    right: 15px;
    top: 15px;
    // padding: 16px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all ease 0.3s;

    img {
      width: 50%;
      height: 50%;
    }
  }

  .stream-video-clients__card-name {
    position: absolute;
    left: 15px;
    bottom: 15px;
    color: #fff;
    @include less-than(laptop) {
      display: none;
    }
  }

  .stream-video-clients-empty {
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    width: 100%;
    height: 100%;
  }

  .stream-options {
    display: flex;
    bottom: env(safe-area-inset-bottom);
    padding-bottom: $stream-options;
    left: 50%;
    transform: translate(-50%);
    // max-width: 374px;
    width: 100%;
    z-index: 11;
    position: fixed;
    padding-left: 24px;
    padding-right: 24px;
    color: #fff;
    padding-top: 20px;

    @include less-than(laptop_l) {
    }
    @include less-than(laptop) {
      background: linear-gradient(
        0deg,
        rgb(83, 83, 83) 0%,
        rgba(41, 38, 38, 0.1) 82%,
        rgba(98, 106, 128, 0) 100%
      );
    }
    @include less-than(tablet) {
      background: linear-gradient(
        0deg,
        #000 0%,
        rgba(0, 0, 0, 0.1) 82%,
        rgba(25, 32, 49, 0) 100%
      );
    }
  }

  .stream-options__title {
    flex: 1;
    display: flex;
    align-items: center;
    @include less-than(laptop) {
      display: none;
    }
  }

  .stream-options__buttons {
    flex: 1;
    display: flex;
    justify-content: center;
  }

  .stream-options__link {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    cursor: pointer;
    svg {
      height: 14px;
    }
    @include less-than(laptop) {
      display: none;
    }
  }

  .stream-options__button {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100%;
    background: #454545;
    width: 50px;
    height: 50px;
    margin: 0 10px;
    transition: all ease 0.2s;
    img {
      width: 40%;
      height: 40%;
    }
    @include less-than(laptop_l) {
      width: 40px;
      height: 40px;
    }
    @include less-than(laptop) {
      width: 50px;
      height: 50px;
      background: RGBA(255, 255, 255, 0.16);
    }
  }

  .stream-options__button--active {
    background: #979292;
    @include less-than(laptop) {
      background: RGBA(205, 205, 205, 0.16) !important;
    }
  }

  .stream-options__button-hangup {
    background: #ff3b30;
    &:hover {
      background: #ee5850;
    }
  }

  .stream-welcome {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    background: white;
    z-index: 20;
  }
  .stream-welcome__wrapper {
    width: 100%;
    height: 80%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 100px;
    @include less-than(tablet) {
      height: 80%;
      justify-content: start;
      flex-direction: column;
      gap: 0px;
    }
  }
  .stream-welcome__video {
    position: relative;
    background-color: #202124;
    width: 600px;
    height: 400px;
    border-radius: 16px;

    @include less-than(laptop_l) {
      width: 600px;
      height: 300px;
    }

    @include less-than(tablet) {
      width: 100%;
      height: 65%;
      margin-top: 0px;
      border-radius: 0;
    }
    video {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 16px;
      position: absolute;
      z-index: 4;
      @include less-than(tablet) {
        border-radius: 0;
      }
    }
  }

  .stream-welcome__buttons {
    display: flex;
    justify-content: center;
    width: 100%;
    position: absolute;
    bottom: 20px;
    z-index: 6;
    .stream-options__button {
      background-color: transparent;
      border: 1px solid #fff;
      color: #fff;
      &:hover {
        background: rgba(255, 255, 255, 0.259);
      }
    }
  }
  .stream-welcome__buttons-backdrop {
    background-image: -webkit-linear-gradient(
      bottom,
      rgba(0, 0, 0, 0.7) 0,
      rgba(0, 0, 0, 0.2) 50%,
      rgba(0, 0, 0, 0) 100%
    );
    border-radius: 16px;
    margin-top: -80px;
    height: 80px;
    position: absolute;
    width: 100%;
    bottom: 0;
    z-index: 5;
    @include less-than(tablet) {
      border-radius: 0;
    }
  }
}

.mirror-mode {
  -ms-transform: scaleX(-1);
  -moz-transform: scaleX(-1);
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
}
</style>