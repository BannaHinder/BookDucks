//Inlogg strapi:
//Name: Hanna
//Email: hanna@email.com
//Password: Hanna1234

//User-1:
//Name: User1
//Email: User1@email.com
//Password: User1111

//etc

//Toggle log-in
let userLoginPage = document.querySelector(".login-panel");
let userRegisterPage = document.querySelector(".register-user");
document.querySelector("#toggle-login-btn").addEventListener("click", () => {
  userLoginPage.classList.toggle("hide");
  document.querySelector(".login-user").classList.remove("hide");
  userRegisterPage.classList.add('hide')
});
document.querySelector("#toggle-register-btn").addEventListener("click", () => {
  userRegisterPage.classList.toggle("hide");
  document.querySelector(".login-user").classList.add("hide");
});

//Log-in
document.querySelector("#login-btn").addEventListener("click", async () => {
  const userName = document.querySelector("#username-login");
  const password = document.querySelector("#password-login");
  let response = await axios.post("http://localhost:1337/api/auth/local", {
    identifier: userName.value,
    password: password.value,
  });
  console.log(response);
  sessionStorage.setItem("token", response.data.jwt);
  checkLoginStatus();
});

//register new user
document.querySelector("#register-btn").addEventListener("click", async () => {
  let username = document.querySelector("#username-register").value;
  let email = document.querySelector("#email-register").value;
  let password = document.querySelector("#password-register").value;
  try {
    let response = await axios.post(
      "http://localhost:1337/api/auth/local/register",
      {
        username,
        password,
        email,
      }
    );
    console.log(response);
    sessionStorage.setItem("token", response.data.jwt);
    username = email = password = "";
    checkLoginStatus()
  } catch (error) {
    console.log(error);
    password = "";
  }
});

//CHeck if logged in func
const checkLoginStatus = () => {
  if (sessionStorage.getItem("token")) {
    userLoginPage.classList.add("hide");
    document.querySelector("#toggle-login-btn").classList.add("hide")
    document.querySelector(".header-icons").classList.remove("hide");
  }
};
//log out user
const logOut = () => {
  sessionStorage.removeItem("token");
  document.querySelector("#toggle-login-btn").classList.remove("hide");
  document.querySelector(".header-icons").classList.add("hide");
  userLoginPage.classList.add("hide");
  document.querySelector(".user-profile-popup").classList.add("hide");
  document.querySelector(".add-book").classList.add("hide");
  userLibrary.classList.add('hide')
};

// fetch data
const getProducts = async (product) => {
  let {
    data: { data },
  } = await axios.get(`http://localhost:1337/api/${product}?populate=*`);
  console.log(data);
  return data;
};
//Render Books
const renderBooks = async () => {
  let bookList = document.querySelector(".book-list");
  bookList.innerHTML = "";
  let books = await getProducts("books");
  books.forEach((book) => {
    let genreString = "";
    book.attributes.genres.data.forEach((item) => {
      genreString += item.attributes.genre + ", ";
    });

    const li = document.createElement("li");
    li.innerHTML = `<h4>${book.attributes.title}</h4>
        <div>
        <img src="http://localhost:1337${book.attributes.cover.data.attributes.url}" height="220" width="150" alt="cover-art">
        <div>
        <p>Author: ${book.attributes.author}</p><p>Page count: ${book.attributes.pages}</p>
        <p> Genre(s): ${genreString}</p> <p>Rating: ${book.attributes.rating}</p>
        <div class="lender-info">
        <p>Lender: ${book.attributes.user.data.attributes.username}</p><p> Email: ${book.attributes.user.data.attributes.email}</p></div></div></div>`;
    bookList.append(li);
  });
  //return bookList
};
//render Audiobooks
const renderAudioBooks = async () => {
  let books = await getProducts("audio-books");
  let bookList = document.querySelector(".audio-book-list");
  bookList.innerHTML = "";
  books.forEach((book) => {
    const li = document.createElement("li");
    let genreString = "";
    book.attributes.genres.data.forEach((item) => {
      genreString += item.attributes.genre + ", ";
    });
    li.innerHTML = `<h4>${book.attributes.title}</h4>
        <div>
        <img src="http://localhost:1337${book.attributes.cover.data.attributes.url}" height="220" width="150" alt="cover-art">
        <div>
        <p> duration: ${book.attributes.minutes} min</p>
        <p> Genre(s): ${genreString}</p><p> Rating: ${book.attributes.rating}</p>
        <p>Release date: ${book.attributes.release_date}</p>
        <div class="lender-info">
        <p>Lender: ${book.attributes.user.data.attributes.username}</p><p> Email: ${book.attributes.user.data.attributes.email}</p></div></div></div>`;
    bookList.append(li);
  });
  //return bookList
};
//toggle user profile
const toggleUserProfile = () =>{
  document.querySelector(".user-profile-popup").classList.toggle("hide");
  renderProfile();
}

//render user profile ,maybe the user Array should be done simultaneously
//when logging in so there's not too many fetches when opening user profile??
// if (userArr= []){fetch data}

const renderProfile = async () => {
  const user = await getUserData();
  const books = await getProducts("books");
  const audioBooks = await getProducts("audio-books");
  let userBooksArr = [];

  books.forEach((book) => {
    if (book.attributes.user.data.id == user.id) {
      book.type = "book";
      userBooksArr.push(book);
    }
  });
  audioBooks.forEach((book) => {
    if (book.attributes.user.data.id == user.id) {
      book.type = "audio-book";
      userBooksArr.push(book);
    }
  });
  console.log(userBooksArr);
  let container = document.querySelector(".profile-details");
  container.innerHTML = `<div><div><h3><i class="fa fa-user"></i>  ${user.username}</h3>
<p>Email: ${user.email}</p>
<p>Id: ${user.id}</p>
<p>Registered: ${user.createdAt}</p></div>`;
  //skriv ut arrrayen
  document.querySelector(".user-library-btn").addEventListener("click", ()=>{
    userLibrary.classList.remove("hide")
    addBook.classList.add('hide')
    userLibrary.innerHTML= `<h3>${user.username}'s books:</h3>`
    if(userBooksArr.length==0){
      userLibrary.innerHTML+= `<p>${user.username} has no books yet.</p>`
    }else{
      userBooksArr.forEach((book) =>{
        let div = document.createElement("div")
        div.innerHTML=`<h4>${book.attributes.title}</h4><p>(${book.type})</p>`
        userLibrary.append(div)
      })
    }
  })
};

//toggle add book/audiobook
const addBookBtn = document.querySelector(".add-book-btn");
const addBook = document.querySelector(".add-book");
const selectBook = document.querySelector("#book-type");
const bookInput = document.querySelector(".book-input");
const audioInput = document.querySelector(".audio-input");
const newBookInput = document.querySelector(".new-book-input");
const userLibrary = document.querySelector(".user-library")

addBookBtn.addEventListener("click", () => {
  addBook.classList.toggle("hide");
  userLibrary.classList.add('hide')
});

//toggle input
selectBook.addEventListener("change", (x) => {
  if (x.target.value == "book") {
    newBookInput.classList.remove("hide");
    bookInput.classList.remove("hide");
    audioInput.classList.add("hide");
  } else if (x.target.value == "audio-book") {
    newBookInput.classList.remove("hide");
    audioInput.classList.remove("hide");
    bookInput.classList.add("hide");
  }
});

//L??gga till bok (post) till en users lista
const getBook = async () => {
  const { id } = await getUserData();
  let genres = [];
  $('input[name="genre"]:checked').each(function () {
    genres.push(parseInt(this.value));
  });
  let image = document.querySelector("#book-cover").files;
  let imgData = new FormData();
  imgData.append("files", image[0]);

  const type = document.querySelector("#book-type").value;
  const title = document.querySelector("#book-title").value;
  const author = document.querySelector("#book-author").value;
  const pages = document.querySelector("#book-page").value;
  const rating = document.querySelector("#book-rating").value;
  const release_date = document.querySelector("#audio-date").value;
  const minutes = document.querySelector("#audio-min").value;

  console.log([parseInt(id)])
  console.log(genres)
  axios
    .post("http://localhost:1337/api/upload", imgData, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
    .then((res) => {
      let imageId = res.data[0].id;
      axios.post(
        `http://localhost:1337/api/${type}s`,
        {
          data: {
            title,
            author,
            pages,
            rating,
            release_date,
            minutes,
            genres,
            user: [parseInt(id)],
            cover: imageId,
          },
        },
        {
          headers: {Authorization: `Bearer ${sessionStorage.getItem("token")}`,},
        }
      );
    })
    .catch((error) => {
      console.log("something went wrong with file upload");
      console.log(error);
      alert("Please fill in all the input-fields")
    });
};

//check current user data
const getUserData = async () => {
  let { data } = await axios.get("http://localhost:1337/api/users/me", {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  console.log(data);
  return data;
};

$('#book-cover').bind('change', function() { 
  var fileName = ''; 
  fileName = $(this).val().replace(/C:\\fakepath\\/i, '')
  $('#file-name').html(fileName); })



checkLoginStatus();
renderBooks(); 
renderAudioBooks();