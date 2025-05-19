<template>
  <div class="dashboard-content">
    <div class="row">
      <div class="col-12 col-md-12">
        <div class="messages-container margin-top-0">
          <div
            class="messages-headline"
            style="display: flex; justify-content: space-between"
          >
            <h4>SKMEDICINE</h4>
            <router-link to="/my-manager-message"
              >Quay lại trang trước</router-link
            >
          </div>
        </div>

        <div class="position-relative">
          <div
            class="chat-messages p-4"
            style="max-height: 600px"
            ref="chatMessagesRef"
          >
            <div
              v-for="(message, index) in messages"
              :key="index"
              :class="{
                'pb-4': true,
                'chat-message-right': userId == message.sender.id,
                'chat-message-left': !(userId == message.sender.id),
              }"
            >
              <div>
                <img
                  :src="`${config.MINIO_URL}` + message.sender.avatar"
                  class="rounded-circle mr-1"
                  alt="Chris Wood"
                  width="40"
                  height="40"
                />
                <div class="text-muted small text-nowrap mt-2">
                  {{ formatDate(message.createdAt) }}
                </div>
              </div>
              <div class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
                <div class="font-weight-bold mb-1">
                  {{ message.sender.username }}
                </div>
                {{ message.content }}
              </div>
            </div>
          </div>
        </div>

        <div class="flex-grow-0 py-3 px-4 border-top">
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              placeholder="Nhập tin nhắn"
              style="margin-right: 20px; height: 50px; border-radius: 8px"
              v-model="newMessage"
            />
            <button
              class="btn btn-primary"
              style="width: 90px; border-radius: 8px"
              @click="sendMessage"
            >
              Gửi
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Content / End -->
</template>

<script>
import { io } from "socket.io-client";
import { computed, nextTick, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { formatDate } from "@/utils/formatDate";
import config from "@/configs/config";

export default {
  setup() {
    const store = useStore();
    const conversationCurrentId = ref(""); // id cuộc trò chuyện hiện tại

    const socket = io("http://localhost:80", {
      withCredentials: true,
      auth: {
        jwt: localStorage.getItem("accessToken"),
      },
    });

    const userId = computed(() => store.state.auth.userId);

    const messages = ref([]);
    const newMessage = ref("");
    const chatMessagesRef = ref(null);

    const userLogin = computed(() => store.state.auth.userLogin);

    const fetchData = () => {
      // Lấy ra conversation hiện tại
      socket.emit("getConversation", (conversation) => {
        conversationCurrentId.value = conversation.id;

        if (conversation.id) {
          socket.emit("fetchData", (data) => {
            messages.value = data;
            scrollToBottom(); // Cuộn xuống cuối sau khi thay đổi cuộc trò chuyện
          });

          socket.emit("joinRoom", conversation);
        }
      });
    };

    const sendMessage = () => {
      const messageContent = newMessage.value.trim();
      if (messageContent) {
        const message = {
          senderId: userId.value,
          content: messageContent,
        };
        socket.emit("sendMessage", message);
        newMessage.value = "";
      }
    };

    const handleMessageReceived = (message) => {
      messages.value.push(message);
      scrollToBottom();
    };

    const handleMessageSent = (message) => {
      messages.value.push(message);
      scrollToBottom();
    };

    const scrollToBottom = () => {
      nextTick(() => {
        if (chatMessagesRef.value) {
          chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight;
        }
      });
    };

    socket.on("receiveMessage", handleMessageReceived);
    socket.on("messageSent", handleMessageSent);
    socket.on("afterCreateConversation", (conversation) => {
      socket.emit("joinRoom", conversation);
    });

    socket.on("closeConversation", () => {
      // Kiểm tra nếu pathname hiện tại là "/my-message"
      if (window.location.pathname === "/my-message") {
        // Chuyển trang đến "/my-manager-message"
        window.location.href = "http://localhost:8080/my-manager-message";
      }
    });

    onMounted(() => {
      fetchData();
      scrollToBottom();
    });

    return {
      messages,
      newMessage,
      sendMessage,
      userId,
      userLogin,
      chatMessagesRef,
      formatDate,
      config,
    };
  },
};
</script>

<style scoped>
body {
  margin-top: 20px;
}

.chat-online {
  color: #34ce57;
}

.chat-offline {
  color: #e4606d;
}

.chat-messages {
  display: flex;
  flex-direction: column;
  max-height: 800px;
  overflow-y: scroll;
}

.chat-message-left,
.chat-message-right {
  display: flex;
  flex-shrink: 0;
}

.chat-message-left {
  margin-right: auto;
}

.chat-message-right {
  flex-direction: row-reverse;
  margin-left: auto;
}
.py-3 {
  padding-top: 1rem !important;
  padding-bottom: 1rem !important;
}
.px-4 {
  padding-right: 1.5rem !important;
  padding-left: 1.5rem !important;
}
.flex-grow-0 {
  flex-grow: 0 !important;
}
.border-top {
  border-top: 1px solid #dee2e6 !important;
}
</style>
