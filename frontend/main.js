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
let userLoginPage = document.querySelector(".login-user")
let userRegisterPage = document.querySelector(".register-user")
document.querySelector("#toggle-login-btn").addEventListener("click", ()=>{
    document.querySelector(".login-user").classList.toggle('hide')
    //document.querySelector('.register-user').classList.toggle('hide')

})
document.querySelector('#toggle-register-btn').addEventListener('click', ()=>{
    document.querySelector('.register-user').classList.toggle('hide')
    document.querySelector(".login-user").classList.toggle('hide')
})

//Log-in
document.querySelector('#login-btn').addEventListener('click', async ()=>{
    const userName = document.querySelector('#username-login')
    const password = document.querySelector('#password-login')
    let response = await axios.post("http://localhost:1337/api/auth/local", {
        identifier: userName.value,
        password: password.value
    });
    console.log(response);
    sessionStorage.setItem("token", response.data.jwt);
    checkLoginStatus()
})

//register new user
document.querySelector("#register-btn").addEventListener("click", async ()=>{
    let username = document.querySelector('#username-register').value
    let email = document.querySelector('#email-register').value
    let password = document.querySelector('#password-register').value
    try {
        let response = await axios.post(
            "http://localhost:1337/api/auth/local/register",
        {
            username,
            password,
            email,
        });
        console.log(response);
        sessionStorage.setItem("token", response.data.jwt);
        username = email = password = '';
    } catch (error) {
        console.log(error)
        username = email = password = '';
    }
    
})

//CHeck if logged in func
const checkLoginStatus = () => {
    if (sessionStorage.getItem("token")){
        document.querySelector(".login-panel").classList.add("hide");
        document.querySelector(".header-icons").classList.remove("hide");
    }
}
//log out user
const logOut = ()=>{
sessionStorage.removeItem("token")
document.querySelector(".login-panel").classList.remove("hide");
document.querySelector(".header-icons").classList.add("hide");
document.querySelector(".login-user").classList.add("hide")
document.querySelector(".user-profile-popup").classList.add("hide")
document.querySelector(".add-book").classList.add("hide")
}


// fetch data
const getProducts = async (product) =>{
 let {data:{data}} = await axios.get(`http://localhost:1337/api/${product}?populate=*`)
 console.log(data)
 return data;
}
//Render Books
const renderBooks = async ()=>{
    let bookList = document.querySelector(".book-list");
    bookList.innerHTML='';
    let books = await getProducts("books");
    books.forEach(book => {
        let genreString = ''
        book.attributes.genres.data.forEach((item) =>{
            genreString+= item.attributes.genre + ', '
        })

        const li = document.createElement('li')
        li.innerHTML= `<h4>${book.attributes.title}</h4>
        <p>Author: ${book.attributes.author}, page count: ${book.attributes.pages}</p>
        <p> Genre(s): ${genreString} Rating: ${book.attributes.rating}</p>
        <img src="http://localhost:1337${book.attributes.cover.data.attributes.url}" height="150" width="100" alt="cover-art">
        <p>Lender: ${book.attributes.user.data.attributes.username}, Email: ${book.attributes.user.data.attributes.email}</p>`
        bookList.append(li)
    });
    //return bookList
}
//render Audiobooks
const renderAudioBooks = async ()=>{
    let bookList = document.querySelector(".audio-book-list");
    bookList.innerHTML='';
    let books = await getProducts("audio-books");
    books.forEach(book => {
        const li = document.createElement('li')
        let genreString = ''
        book.attributes.genres.data.forEach((item) =>{
            genreString+= item.attributes.genre  + ', '
        })
        li.innerHTML= `<h4>${book.attributes.title}</h4>
        <p>Release date: ${book.attributes.release_date}, duration: ${book.attributes.minutes} min</p>
        <p> Genre(s): ${genreString} Rating: ${book.attributes.rating}</p>
        <img src="http://localhost:1337${book.attributes.cover.data.attributes.url}" height="150" width="100" alt="cover-art">
        <p>Lender: ${book.attributes.user.data.attributes.username}, Email: ${book.attributes.user.data.attributes.email}</p></p>`
        bookList.append(li)
    });
    //return bookList
}
//toggle user profile
document.querySelector(".fa-user").addEventListener("click", ()=>{
    document.querySelector(".user-profile-popup").classList.toggle("hide")
    renderProfile()
})
//användarnamn, email, id, samt vilket datum användaren registrerade sig. 
//(VG) Sidan ska även innehålla en lista över samtliga böcker och ljudböcker
// som användaren har lagt ut för utlåning.

//render user profile ,maybe the user Array should be done simultaneously 
//when logging in so there's not too many fetches when opening user profile??
// if (userArr= []){fetch data}

const renderProfile = async ()=>{
 const user = await getUserData()
 const books = await getProducts("books")
 const audioBooks = await getProducts("audio-books")
 let userBooksArr = [];
 books.forEach(book =>{
     if(book.attributes.user.data.id ==user.id){
         userBooksArr.push(book)}
 })
 audioBooks.forEach(book =>{
    if(book.attributes.user.data.id ==user.id){
        userBooksArr.push(book)}
})
console.log(userBooksArr)
let container = document.querySelector(".profile-details")
container.innerHTML=`<h3>${user.username}</h3>
<p>Email: ${user.email}</p>
<p>Id: ${user.id}</p>
<p>Registered: ${user.createdAt}</p>`
//skriv ut arrrayen

}



//toggle add book/audiobook
const addBookIcon = document.querySelector(".fa-plus")
const addBook = document.querySelector(".add-book")
const selectBook = document.querySelector("#book-type")
const bookInput = document.querySelector(".book-input")
const audioInput = document.querySelector(".audio-input")
addBookIcon.addEventListener("click", ()=>{
    addBook.classList.toggle("hide")
})
//toggle input
selectBook.addEventListener("change", (x)=>{
    if(x.target.value=="book"){
        bookInput.classList.remove("hide")
        audioInput.classList.add("hide")
    }else if(x.target.value=="audio"){
        audioInput.classList.remove("hide")
        bookInput.classList.add("hide")
    }
})


//Lägga till bok (post) till en users lista



//check current user data
const getUserData = async () => {
    let {data} = await axios.get("http://localhost:1337/api/users/me",
    {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`
        }
    })
    console.log(data);
    return data
}

checkLoginStatus()