<template>
  <!-- Content page -->
  <section class="">
    <div class="container">
      <h1>VỀ CÂU CHUYỆN CỦA SKMEDICINE</h1>

      <section class="mission-vision">
        <h2>Tầm nhìn và sứ mệnh:</h2>
        <p>
          Skmedicine là một nền tảng chăm sóc sức khỏe trực tuyến với sứ mệnh
          mang đến các sản phẩm thuốc chính hãng, chất lượng cao đến tay người
          tiêu dùng một cách tiện lợi và an toàn nhất.
        </p>
        <p>
          Chúng tôi hướng tới việc trở thành hệ sinh thái y tế uy tín, nơi khách
          hàng có thể dễ dàng tra cứu thông tin thuốc, đặt mua và nhận được tư
          vấn y tế từ các dược sĩ chuyên môn.
        </p>
        <div class="logo">
          <img
            src="/images/logo/logo.png"
            alt="Skmedicine Logo"
            style="width: 300px; margin: 0 auto"
          />
          <h2>Skmedicine</h2>
        </div>
      </section>

      <section class="core-values">
        <h2>Giá trị cốt lõi:</h2>
        <p>Chính trực, minh bạch, tận tâm, an toàn và hướng đến cộng đồng.</p>
      </section>

      <section class="brand-identity">
        <h2>NHẬN DIỆN THƯƠNG HIỆU</h2>
        <p>
          Skmedicine tạo dựng niềm tin bằng chất lượng sản phẩm và dịch vụ. Tất
          cả các loại thuốc và thực phẩm chức năng đều có nguồn gốc rõ ràng,
          được kiểm định và cấp phép lưu hành bởi cơ quan chức năng.
        </p>
        <p>
          Thương hiệu của chúng tôi đại diện cho sự an tâm trong từng sản phẩm
          và sự tận tình trong từng lời tư vấn.
        </p>
      </section>

      <section class="business-philosophy">
        <h2>TRIẾT LÝ KINH DOANH</h2>
        <p>
          Sức khỏe là tài sản quý giá nhất của mỗi người. Skmedicine không chỉ
          bán thuốc, mà còn lan tỏa thông tin y học đúng đắn, hỗ trợ khách hàng
          trong việc tự chăm sóc sức khỏe mỗi ngày.
        </p>
        <p>
          Chúng tôi cam kết xây dựng một hệ sinh thái y tế an toàn – tiện lợi –
          hiệu quả cho tất cả mọi người.
        </p>
      </section>

      <section class="business-models">
        <h3>Những Mô hình hoạt động của Skmedicine</h3>
        <ul>
          <li>
            <strong>Bán thuốc online chính hãng</strong><br />
            Từ thuốc kê đơn, không kê đơn đến thực phẩm chức năng, tất cả đều
            được cung cấp thông tin minh bạch và giao hàng tận nơi.
          </li>
          <li>
            <strong>Hệ thống dược sĩ tư vấn miễn phí</strong><br />
            Tư vấn sử dụng thuốc đúng cách, hỗ trợ chăm sóc sức khỏe theo từng
            độ tuổi và bệnh lý.
          </li>
          <li>
            <strong>Hợp tác với phòng khám & nhà thuốc</strong><br />
            Kết nối chuỗi nhà thuốc, phòng khám và bệnh viện để mở rộng mạng
            lưới phân phối và tư vấn.
          </li>
        </ul>
      </section>
    </div>
  </section>
</template>

<script>
export default {};
</script>

<style scoped>
body {
  background-color: black;
  color: white;
  font-family: Arial, sans-serif;
  line-height: 1.6;
  margin: 0;
  padding: 0;
}

.container {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  text-align: left; /* Đặt text-align về left để căn lề trái */
}

h1 {
  color: red;
  font-size: 24px;
  text-align: center; /* Căn giữa cho tiêu đề chính */
  margin-bottom: 20px;
}

h2 {
  color: green;
  font-size: 20px;
  margin-top: 30px;
  margin-bottom: 10px;
}

h3 {
  color: red;
  font-size: 18px;
  margin-top: 30px;
  margin-bottom: 10px;
}

p {
  margin: 10px 0;
  text-align: justify; /* Để căn đều văn bản */
}

a {
  color: cyan;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.logo {
  text-align: center; /* Căn giữa cho phần logo */
  margin-top: 20px;
}

.logo img {
  width: 150px;
  height: auto;
}

.logo h2 {
  color: white;
  font-size: 24px;
  margin-top: 10px;
}
</style>
