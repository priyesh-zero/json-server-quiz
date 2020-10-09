// global state
const globalState = {};

// gloal templates
const globalTemplates = {
  users: (d) =>
    `<tr><td>${d._id}</td><td>${d.name}</td><td>${d.email}</td><td>${
      d.password
    }</td><td><img src="${d.photo}" /></td><td>${
      d.gender
    }</td><td class="center-align">${
      globalState["posts"].filter((p) => p.userId === d._id).length
    }</td></tr>`,
  posts: (d) =>
    `<tr><td>${d._id}</td><td>${d.title}</td><td>${d.userId}</td><td>${
      d.content
    }</td><td>${d.votes}</td><td>${dayjs(d.publishAt).format(
      "D MMMM YYYY hh:mm A"
    )}</td><td class="center-align">${
      globalState["comments"].filter((c) => c.postId === d._id).length
    }</td></tr>`,
  comments: (d) =>
    `<tr>
        <td>${d._id}</td>
        <td>${d.comment}</td>
        <td>${d.votes}</td>
        <td>${d.userId}</td>
        <td>${d.postId}</td>
        <td>${d.parentId}</td>
        <td>${dayjs(d.publishAt).format("D MMMM YYYY hh:mm A")}</td>
    </tr>`,
};

// generic get data
const getData = async (url) => {
  const response = await fetch(url, {
    method: "GET",
    headers: { Authorization: "Bearer 41b8494f-0118-4d9f-8f9f-10df9805ce1a" },
  });
  return response.json();
};

// re-render all the data
const renderAll = () => {
  renderData("users");
  renderData("posts");
  renderData("comments");
};
// generic post data
const postData = async (section, data) => {
  const response = await fetch(`/${section}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer 41b8494f-0118-4d9f-8f9f-10df9805ce1a",
    },
    body: JSON.stringify(data),
  });
  console.log(await response.json());
  globalState[`${section}`] = await getData(`/api/${section}`);
  globalState[`${section}-ids`] = globalState[`${section}`].map(
    (section) => section._id
  );
  renderAll();
};

// generic data html rendering
const renderData = (section) => {
  const countSmall = document.querySelector(`#${section} h5 span`);
  const tbody = document.querySelector(`#${section} table tbody`);
  countSmall.innerText = globalState[section].length || 0;
  tbody.innerHTML = globalState[section].map((d) =>
    globalTemplates[section](d)
  );
};

// generic random ids from state
const getRandomId = (section) => {
  const ids = globalState[`${section}-ids`];
  return ids[Math.floor(Math.random() * ids.length)];
};

// generate and add user
const addUser = async () => {
  const id = faker.random.uuid();
  const user = {
    _id: id,
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    password: faker.internet.password(),
    photo: faker.internet.avatar(),
    email: faker.internet.email(),
    gender: faker.random.boolean() ? "Male" : "Female",
  };
  postData("users", user);
};

// generate and add post
const addPost = async () => {
  const id = faker.random.uuid();
  const post = {
    _id: id,
    title: `${faker.random.words()}`,
    userId: getRandomId("users"),
    content: faker.lorem.paragraph(),
    votes: faker.random.number(),
    publishAt: faker.date.past(),
  };
  postData("posts", post);
};

// generate and add comment
const addComment = () => {
  const postId = getRandomId("posts");
  const hasComments = globalState["comments"].some((c) => c.postId === postId);
  const parentId = !hasComments
    ? null
    : faker.random.boolean
    ? getRandomId("comments")
    : null;
  let publishAt = null;
  if (parentId) {
    const comment = globalState["comments"].find((c) => c._id === parentId);
    publishAt = faker.date.between(comment.publishAt, new Date());
  } else {
    const post = globalState["posts"].find((p) => p._id === postId);

    publishAt = faker.date.between(post.publishAt, new Date());
  }

  const comment = {
    _id: faker.random.uuid(),
    comment: faker.hacker.phrase(),
    votes: faker.random.number(),
    userId: getRandomId("users"),
    postId,
    parentId,
    publishAt,
  };
  postData("comments", comment);
};

// document.ready function
document.addEventListener("DOMContentLoaded", async () => {
  globalState["posts"] = await getData("/posts");
  globalState[`posts-ids`] = globalState[`posts`].map((section) => section._id);
  globalState["comments"] = await getData("/comments");
  globalState[`comments-ids`] = globalState[`comments`].map(
    (section) => section._id
  );
  globalState["users"] = await getData("/users");
  globalState[`users-ids`] = globalState[`users`].map((section) => section._id);
  renderAll();
});
