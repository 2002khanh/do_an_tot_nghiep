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
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const id = computed(() => props.id);
    const store = useStore();

    const socket = io(`${config.SOCKET_URL}`, {
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
      socket.emit(
        "fetchDataNotActive",
        { conversationId: id.value },
        (data) => {
          messages.value = data;
          scrollToBottom();
        }
      );
    };

    const scrollToBottom = () => {
      nextTick(() => {
        if (chatMessagesRef.value) {
          chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight;
        }
      });
    };

    onMounted(() => {
      fetchData();
      scrollToBottom();
    });

    return {
      messages,
      newMessage,
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
