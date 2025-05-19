<template>
  <!-- Change Password -->
  <div class="dashboard-content">
    <div class="row">
      <div
        class="col-lg-12 col-md-12"
        style="padding-left: 0; padding-right: 0"
      >
        <div class="dashboard-list-box margin-top-0">
          <h4 class="d-flex justify-content-between align-items-center">
            Danh sách phiên hỗ trợ
            <a-button type="primary" @click="visible = true">
              <router-link to="/my-message">
                <PlusOutlined /> Tới phiên hiện tại
              </router-link>
            </a-button>
          </h4>

          <div class="row">
            <div
              v-for="(item, index) in listConversation"
              :key="index"
              class="address-item col-md-4"
            >
              <router-link
                style="color: black"
                :to="{ name: 'my-message-detail', params: { id: item.id } }"
                class="address-link"
                v-if="item.isActive == false"
              >
                <div class="d-flex">
                  <div class="address-details">
                    <ul class="address-info">
                      <p style="font-weight: bold">Ngày tạo phiên:</p>
                      <li>{{ formatDate(item.created_at) }}</li>
                      <li>
                        <p style="font-weight: bold">Trạng thái phiên:</p>
                        {{
                          item.isActive == false
                            ? "Đã hoàn thành"
                            : "Đang xử lý"
                        }}
                      </li>
                    </ul>
                  </div>
                </div>
              </router-link>
              <router-link
                style="color: black"
                :to="{ name: 'my-message', params: { id: item.id } }"
                class="address-link"
                v-if="item.isActive == true"
              >
                <div class="d-flex">
                  <div class="address-details">
                    <ul class="address-info">
                      <p style="font-weight: bold">Ngày tạo phiên:</p>
                      <li>{{ formatDate(item.created_at) }}</li>
                      <li>
                        <p style="font-weight: bold">Trạng thái phiên:</p>
                        {{
                          item.isActive == false
                            ? "Đã hoàn thành"
                            : "Đang xử lý"
                        }}
                      </li>
                    </ul>
                  </div>
                </div>
              </router-link>
            </div>
            <div style="margin: 30px 0"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { gettAllConversationByUser } from "@/apis/modules/api.conversation";
import { formatDate } from "@/utils/formatDate";

export default {
  components: {},
  setup() {
    const listConversation = ref([]);
    const fetchData = async () => {
      try {
        listConversation.value = await gettAllConversationByUser();
      } catch (err) {
        console.log(err);
      }
    };
    onMounted(() => {
      fetchData();
    });

    return {
      listConversation,
      formatDate,
    };
  },
};
</script>

<style scoped>
li {
  padding: 4px 0 !important;
  border: none !important;
  word-wrap: break-word; /* Đảm bảo văn bản sẽ bọc khi cần thiết */
  word-break: break-all; /* Đảm bảo văn bản sẽ bọc khi cần thiết */
}

.icon {
  z-index: 100;
  position: absolute;
  right: 18px;
  top: 12px;
  font-size: 18px;
  cursor: pointer;
}

.li_header {
  font-size: 16px;
  font-weight: 600;
}

.row {
  margin: 0 !important;
}

.title {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.address-item {
  padding: 16px;
  overflow: hidden;
  justify-content: space-between;
  border-radius: 8px;
  border: 1px double #ccc;
  flex: 0 0 calc(33.333% - 48px);
  box-sizing: border-box;
  margin: 24px;
  margin-top: 24px;
}

.address-details {
  display: flex;
}

.address-info {
  display: flex;
  flex-direction: column;
  margin-left: 8px; /* Thêm khoảng cách giữa icon và thông tin */
}

.address-actions {
  display: flex;
  flex-direction: column;
  align-items: center; /* Căn giữa các nút */
}

.spacer {
  margin-top: 12px;
}
</style>
