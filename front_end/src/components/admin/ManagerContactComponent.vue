<template>
  <div style="flex-grow: 1">
    <a-layout-content style="margin: 0 16px">
      <div class="form-container">
        <a-form>
          <div style="padding-top: 32px"></div>
          <a-row>
            <a-row :span="8" style="margin-left: 8px">
              <a-form-item label="Tên khách hàng">
                <a-input
                  placeholder="nhập dữ liệu"
                  v-model:value="searchValue"
                />
              </a-form-item>
              <div style="margin: 0 8px"></div>
            </a-row>
            <a-col style="display: flex; justify-content: end">
              <a-form-item>
                <a-button
                  type="primary"
                  :loading="iconLoading"
                  @click="handleSearch"
                  style="margin-right: 12px"
                >
                  <template #icon><SearchOutlined /></template>
                  Tìm kiếm
                </a-button>
                <a-button @click="resetData">Làm mới</a-button>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-container">
        <div class="row g-0">
          <div
            class="col-12 col-lg-5 col-xl-3 border-right"
            style="border-right: 1px solid #ccc; height: 70vh; overflow: scroll"
          >
            <a
              href="#"
              class="list-group-item list-group-item-action border-0"
              style="
                border-bottom: 1px solid #ccc;
                padding: 20px;
                border-radius: 4px;
              "
              v-for="(conversation, index) in listConversations"
              :key="index"
              @click="changeConversation(conversation)"
              :class="{
                confirm_conversation: conversation.id == conversationCurrent.id,
              }"
            >
              <!-- Modal confirm support -->
              <!-- <a-modal
                v-model:open="open"
                title="Thông báo"
                @ok="handleOk(conversation)"
                ok-text="Xác nhận"
                cancel-text="Hủy bỏ"
              >
                <p>Xác nhận phiên trò chuyện</p>
              </a-modal> -->
              <!-- End modal -->

              <!-- <div class="badge bg-success float-right">5</div> -->
              <div
                class="d-flex align-items-start"
                @click="conversation.staffId === null ? showModal() : null"
              >
                <img
                  :src="`${config.MINIO_URL}` + conversation.customerId.avatar"
                  class="rounded-circle mr-1"
                  alt="Vanessa Tucker"
                  width="40"
                  height="40"
                />
                <div
                  class="flex-grow-1 ml-3 d-flex"
                  style="position: relative; width: 100%"
                >
                  <div>
                    <span style="font-weight: 600">
                      {{ conversation.customerId.username }}
                    </span>
                    <div class="small">
                      <span
                        :class="conversation.isActive ? 'active' : 'closed'"
                      >
                        {{
                          conversation.isActive == true
                            ? "Đang hoạt động"
                            : "Đã đóng"
                        }}
                      </span>
                    </div>
                  </div>
                  <div
                    style="
                      position: absolute;
                      right: 0;
                      font-size: 10px;
                      font-weight: 600;
                    "
                  >
                    {{ formatDate(conversation.lastActivity) }}
                  </div>
                </div>
              </div>
            </a>

            <hr class="d-block d-lg-none mt-1 mb-0" />
          </div>
          <div class="col-12 col-lg-7 col-xl-9">
            <a-empty
              description="Không có cuộc trò chuyện nào được chọn"
              v-if="Object.keys(conversationCurrent).length === 0"
            ></a-empty>

            <div
              class="position-relative"
              v-if="Object.keys(conversationCurrent).length !== 0"
            >
              <div
                ref="chatMessagesRef"
                class="chat-messages p-4"
                style="height: 70vh"
              >
                <div style="text-align: end; margin-bottom: 8px">
                  <a-button
                    v-if="conversationCurrent.isActive == true"
                    type="primary"
                    @click="handleCloseConversation"
                  >
                    Đóng phiên hiện tại
                  </a-button>
                </div>
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
                  <div
                    class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3"
                    style="margin-left: 4px"
                  >
                    <div class="font-weight-bold mb-1">
                      {{ message.sender.username }}
                    </div>
                    {{ message.content }}
                  </div>
                </div>
              </div>
            </div>

            <div
              class="flex-grow-0 py-3 px-4 border-top"
              v-if="Object.keys(conversationCurrent).length !== 0"
            >
              <div
                class="input-group"
                v-if="disableInput && conversationCurrent.isActive == true"
              >
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
    </a-layout-content>
  </div>
</template>

<script>
import { io } from "socket.io-client";
import { computed, onMounted, ref, nextTick } from "vue";
import { useStore } from "vuex";
import { setStaffToConversation } from "@/apis/modules/api.conversation";
import { message } from "ant-design-vue";
import { formatDate } from "@/utils/formatDate";
import config from "@/configs/config";

export default {
  setup() {
    // Khai báo biến
    const store = useStore();
    const userId = computed(() => store.state.auth.userId);
    const messages = ref([]);
    const newMessage = ref("");
    const listConversations = ref([]);
    const conversationCurrent = ref({});
    const userLogin = computed(() => store.state.auth.userLogin);
    const chatMessagesRef = ref(null); // Ref cho chat-messages
    const disableInput = ref(true);
    const selectedConversation = ref(null);
    const searchValue = ref("");
    const backupListConversation = ref([]);

    const socket = io("http://localhost:80", {
      withCredentials: true,
      auth: {
        jwt: localStorage.getItem("accessToken"),
      },
    });

    // handle modal confirm support
    const open = ref(false);

    const showModal = () => {
      open.value = true;
    };

    const handleCloseConversation = async () => {
      socket.emit("closeConversation", {
        conversationId: conversationCurrent.value.id,
      });
      message.success("Đóng phiên thành công");

      listConversations.value = listConversations.value.map((conversation) => {
        if (conversation.id === conversationCurrent.value.id) {
          conversation.isActive = false;
        }

        return conversation;
      });

      conversationCurrent.value = {};
      backupListConversation.value = listConversations.value;
    };

    // Kết hợp xử lý xác nhận vào cuộc trò chuyện
    const handleOk = async () => {
      try {
        await setStaffToConversation({
          conversation: config.ADMIN_ID,
        });
        fetchAllConversation();
        open.value = false;
        socket.emit("updateAfterJoined");
      } catch (err) {
        message.error(err?.response?.data?.message || "Có lỗi xảy ra");
        console.log(err);
      }
    };
    // end handle modal

    // lấy ra tất cả các cuộc trò chuyện
    const fetchAllConversation = () => {
      socket.emit("fetchAllConversation", (conversations) => {
        listConversations.value = conversations;
        backupListConversation.value = conversations;
      });
    };

    // Lấy ra tất cả tin nhắn của từng conversation
    const changeConversation = (conversation) => {
      selectedConversation.value = conversation;
      if (
        conversation.staffId != null &&
        conversation.staffId.id == userId.value
      ) {
        disableInput.value = true;
        conversationCurrent.value = conversation;
        socket.emit("fetchDataByConversation", conversation, (metadata) => {
          messages.value = metadata.messages;
          scrollToBottom(); // Cuộn xuống cuối sau khi thay đổi cuộc trò chuyện
        });

        socket.emit("joinRoom", conversation);
      } else if (userLogin.value.role == "ADMIN") {
        disableInput.value = false;
        conversationCurrent.value = conversation;
        socket.emit("fetchDataByConversation", conversation, (metadata) => {
          messages.value = metadata.messages;
          scrollToBottom(); // Cuộn xuống cuối sau khi thay đổi cuộc trò chuyện
        });

        socket.emit("joinRoom", conversation);
      }
    };

    // Gửi tin nhắn
    const sendMessage = () => {
      const messageContent = newMessage.value.trim();
      if (messageContent) {
        const metadata = {
          senderId: userId.value,
          receiverId: conversationCurrent.value.customerId.id,
          content: messageContent,
          conversation: conversationCurrent.value,
        };
        socket.emit("sendMessageAdminOrEmployee", metadata);
        newMessage.value = "";
      }
    };

    const handleMessageReceived = (message) => {
      messages.value.push(message);
      scrollToBottom(); // Cuộn xuống cuối khi nhận tin nhắn mới
    };

    const handleMessageSent = (message) => {
      messages.value.push(message);
      scrollToBottom(); // Cuộn xuống cuối khi gửi tin nhắn mới
    };

    // Xử lý tìm kiếm theo tên khách hàng
    function handleSearch() {
      listConversations.value = backupListConversation.value;

      listConversations.value = listConversations.value.filter(
        (conversation) => {
          const username = conversation.customerId.username.toLowerCase();
          const search = searchValue.value.toLowerCase();
          return username.includes(search);
        }
      );
    }

    const resetData = () => {
      listConversations.value = backupListConversation.value;
    };

    const scrollToBottom = () => {
      nextTick(() => {
        if (chatMessagesRef.value) {
          chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight;
        }
      });
    };

    socket.on("receiveMessageAdminOrEmployee", handleMessageReceived);
    socket.on("messageSentAdminOrEmployee", handleMessageSent);

    socket.on("fetchAllConversation", fetchAllConversation);

    onMounted(() => {
      fetchAllConversation();
      scrollToBottom(); // Cuộn xuống cuối khi mount component
    });

    return {
      messages,
      newMessage,
      sendMessage,
      userId,
      userLogin,
      listConversations,
      showModal,
      handleOk,
      open,
      changeConversation,
      chatMessagesRef,
      conversationCurrent,
      disableInput,
      formatDate,
      handleCloseConversation,
      config,
      handleSearch,
      searchValue,
      resetData,
    };
  },
};
</script>
<style scoped>
body {
  margin-top: 20px;
}

.active {
  color: green;
}

.closed {
  color: red;
}

.confirm_conversation {
  background-color: #cdcdcd;
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

.form-container {
  background: #fff;
  padding: 0 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 20px 0;
}

.m-6 {
  margin: 6px;
}

.await_confirm {
  background-color: #ccc;
}
</style>
