const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteBtns = document.querySelectorAll(".delete-btn");

const handleDeleteComment = async (event) => {
  const {
    target: { parentElement },
  } = event;
  const {
    dataset: { id },
  } = parentElement;
  await fetch(`/api/comments/${id}`, {
    method: "DELETE",
  });
  parentElement.remove();
};

const addComment = (text, id) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.dataset.id = id;
  newComment.className = "video__comment";
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = `  ${text}`;
  const span2 = document.createElement("span");
  span2.innerText = "❌";
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(span2);
  videoComments.prepend(newComment);
  span2.addEventListener("click", handleDeleteComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (response.status === 201) {
    const { newCommentId } = await response.json();
    textarea.value = "";
    addComment(text, newCommentId);
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
  deleteBtns.forEach((deleteBtn) => {
    deleteBtn.addEventListener("click", handleDeleteComment);
  });
}
