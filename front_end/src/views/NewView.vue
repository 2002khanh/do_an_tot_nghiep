<template>
  <section class="bg0 p-t-75 p-b-120">
    <div class="container">
      <!-- Bài viết -->
      <div class="row">
        <div class="col-md-4 custom-post" v-for="post in posts" :key="post.id">
          <div class="post-content">
            <h5>{{ post.title }}</h5>
            <p>{{ post.content }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      posts: [
        {
          id: 1,
          title: "Post Title 1",
          content:
            "Post content goes here. This is a summary of the post content.",
          image: "https://via.placeholder.com/350",
        },
        {
          id: 2,
          title: "Post Title 2",
          content:
            "Post content goes here. This is a summary of the post content.",
          image: "https://via.placeholder.com/350",
        },
        {
          id: 3,
          title: "Post Title 3",
          content:
            "Post content goes here. This is a summary of the post content.",
          image: "https://via.placeholder.com/350",
        },
        {
          id: 4,
          title: "Post Title 4",
          content:
            "Post content goes here. This is a summary of the post content.",
          image: "https://via.placeholder.com/350",
        },
        {
          id: 5,
          title: "Post Title 5",
          content:
            "Post content goes here. This is a summary of the post content.",
          image: "https://via.placeholder.com/350",
        },
        {
          id: 6,
          title: "Post Title 6",
          content:
            "Post content goes here. This is a summary of the post content.",
          image: "https://via.placeholder.com/350",
        },
      ],
    };
  },
};
</script>

<style>
.custom-post {
  margin-bottom: 30px;
}
.post-img {
  height: 200px;
  background-size: cover;
  background-position: center;
}
.post-content {
  padding: 15px;
  background-color: #f8f9fa;
}
</style>
