/* ==================================================
   DOM ELEMENTS
================================================== */

const usernameInput = document.getElementById("usernameInput");
const searchBtn = document.getElementById("searchBtn");
const themeBtn = document.getElementById("themeBtn");

/* Loader & Error */

const loader = document.getElementById("loader");
const error = document.getElementById("error");

/* Sections */

const profileSection = document.getElementById("profileSection");
const repoSection = document.getElementById("repoSection");
const statsSection = document.getElementById("statsSection");

/* Profile */

const avatar = document.getElementById("avatar");
const nameEl = document.getElementById("name");
const usernameEl = document.getElementById("username");
const bio = document.getElementById("bio");

const locationEl = document.getElementById("location");
const company = document.getElementById("company");
const joined = document.getElementById("joined");
const website = document.getElementById("website");

const followers = document.getElementById("followers");
const following = document.getElementById("following");
const repos = document.getElementById("repos");

const profileLink = document.getElementById("profileLink");

/* Repository */

const repoContainer = document.getElementById("repoContainer");

/* Statistics */

const publicRepos = document.getElementById("publicRepos");
const totalStars = document.getElementById("totalStars");
const followersCount = document.getElementById("followersCount");
const followingCount = document.getElementById("followingCount");

/* Battle Mode */

const userOne = document.getElementById("userOne");
const userTwo = document.getElementById("userTwo");
const battleBtn = document.getElementById("battleBtn");
const battleResult = document.getElementById("battleResult");


/* ==================================================
   SHOW / HIDE FUNCTIONS
================================================== */

function showLoader(){

    loader.classList.remove("hidden");

}

function hideLoader(){

    loader.classList.add("hidden");

}

function showError(){

    error.classList.remove("hidden");

}

function hideError(){

    error.classList.add("hidden");

}

function hideSections(){

    profileSection.classList.add("hidden");

    repoSection.classList.add("hidden");

    statsSection.classList.add("hidden");

}


/* ==================================================
   DATE FORMATTER
================================================== */

function formatDate(dateString){

    const options = {

        day:"numeric",

        month:"short",

        year:"numeric"

    };

    return new Date(dateString).toLocaleDateString(
        "en-GB",
        options
    );

}


/* ==================================================
   RESET UI
================================================== */

function resetUI(){

    hideLoader();

    hideError();

    hideSections();

    repoContainer.innerHTML = "";

    battleResult.innerHTML = "";

}


/* ==================================================
   DARK MODE
================================================== */

themeBtn.addEventListener("click",()=>{

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){

        themeBtn.innerHTML =

        '<i class="fa-solid fa-sun"></i>';

    }

    else{

        themeBtn.innerHTML =

        '<i class="fa-solid fa-moon"></i>';

    }

});


/* ==================================================
   INITIAL STATE
================================================== */

resetUI();
/* ==================================================
   FETCH GITHUB USER
================================================== */

async function fetchUser(username){

    if(username.trim()===""){

        alert("Please enter a GitHub username.");

        return;

    }

    resetUI();

    showLoader();

    try{

        const response=await fetch(

            `https://api.github.com/users/${username}`

        );

        if(!response.ok){

            throw new Error("User Not Found");

        }

        const user=await response.json();

        hideLoader();

        renderProfile(user);

        await fetchRepositories(user.repos_url);

    }

    catch(error){

        hideLoader();

        showError();

        console.error(error);

    }

}

/* ==================================================
   FETCH REPOSITORIES
================================================== */

async function fetchRepositories(repoUrl){

    try{

        const response=await fetch(repoUrl);

        if(!response.ok){

            throw new Error("Repositories not found");

        }

        const repositories=await response.json();

        renderRepositories(repositories);

        updateStatistics(repositories);

    }

    catch(error){

        console.error(error);

    }

}
/* ==================================================
   RENDER PROFILE
================================================== */

function renderProfile(user){

    profileSection.classList.remove("hidden");

    repoSection.classList.remove("hidden");

    statsSection.classList.remove("hidden");

    /* Profile */

    avatar.src = user.avatar_url;

    avatar.alt = user.login;

    nameEl.textContent = user.name || user.login;

    usernameEl.textContent = `@${user.login}`;

    bio.textContent = user.bio || "No bio available.";

    locationEl.textContent = user.location || "Not Available";

    company.textContent = user.company || "Not Available";

    joined.textContent = formatDate(user.created_at);

    /* Website */

    if(user.blog){

        website.href = user.blog.startsWith("http")
            ? user.blog
            : `https://${user.blog}`;

        website.textContent = "Visit Website";

    }else{

        website.removeAttribute("href");

        website.textContent = "Not Available";

    }

    /* Profile Link */

    profileLink.href = user.html_url;

    /* Stats */

    followers.textContent = user.followers;

    following.textContent = user.following;

    repos.textContent = user.public_repos;

    publicRepos.textContent = user.public_repos;

    followersCount.textContent = user.followers;

    followingCount.textContent = user.following;

}


/* ==================================================
   RENDER REPOSITORIES
================================================== */

function renderRepositories(repositories){

    repoContainer.innerHTML = "";

    const latestRepos = repositories

        .sort((a,b)=>

            new Date(b.updated_at) -

            new Date(a.updated_at)

        )

        .slice(0,5);

    latestRepos.forEach(repo=>{

        const card=document.createElement("div");

        card.className="repo-card";

        card.innerHTML=`

        <div class="repo-header">

            <a

                href="${repo.html_url}"

                target="_blank"

                class="repo-name">

                ${repo.name}

            </a>

            <span class="repo-language">

                ${repo.language || "Unknown"}

            </span>

        </div>

        <p class="repo-description">

            ${repo.description || "No description available."}

        </p>

        <div class="repo-footer">

            <span>

                ⭐ ${repo.stargazers_count}

            </span>

            <span>

                🍴 ${repo.forks_count}

            </span>

            <span>

                Updated ${formatDate(repo.updated_at)}

            </span>

        </div>

        `;

        repoContainer.appendChild(card);

    });

}


/* ==================================================
   UPDATE STATISTICS
================================================== */

function updateStatistics(repositories){

    const stars = repositories.reduce(

        (total,repo)=>

            total + repo.stargazers_count,

        0

    );

    totalStars.textContent = stars;

}
/* ==================================================
   SEARCH FUNCTION
================================================== */

function searchGitHubUser(){

    const username = usernameInput.value.trim();

    if(username === ""){

        alert("Please enter a GitHub username.");

        usernameInput.focus();

        return;

    }

    fetchUser(username);

}


/* ==================================================
   SEARCH BUTTON
================================================== */

searchBtn.addEventListener("click",()=>{

    searchGitHubUser();

});


/* ==================================================
   ENTER KEY SUPPORT
================================================== */

usernameInput.addEventListener("keydown",(event)=>{

    if(event.key==="Enter"){

        searchGitHubUser();

    }

});


/* ==================================================
   INPUT PLACEHOLDER UX
================================================== */

usernameInput.addEventListener("focus",()=>{

    usernameInput.placeholder="e.g. octocat";

});

usernameInput.addEventListener("blur",()=>{

    usernameInput.placeholder="Enter GitHub Username";

});


/* ==================================================
   AUTO LOAD (Optional)
================================================== */

/*
   Loads GitHub's official demo account
   when the website opens.
*/

window.addEventListener("DOMContentLoaded", () => {
    fetchUser("saakshigupta-saa");
});

/* ==================================================
   BATTLE MODE
================================================== */

async function battleMode(){

    const firstUser = userOne.value.trim();

    const secondUser = userTwo.value.trim();

    if(firstUser==="" || secondUser===""){

        alert("Please enter both GitHub usernames.");

        return;

    }

    battleResult.classList.add("hidden");

    battleResult.innerHTML="";

    try{

        showLoader();

        const [userOneResponse,userTwoResponse]=await Promise.all([

            fetch(`https://api.github.com/users/${firstUser}`),

            fetch(`https://api.github.com/users/${secondUser}`)

        ]);

        if(!userOneResponse.ok || !userTwoResponse.ok){

            throw new Error("User Not Found");

        }

        const userOneData=await userOneResponse.json();

        const userTwoData=await userTwoResponse.json();

        const [repoOneResponse,repoTwoResponse]=await Promise.all([

            fetch(userOneData.repos_url),

            fetch(userTwoData.repos_url)

        ]);

        const reposOne=await repoOneResponse.json();

        const reposTwo=await repoTwoResponse.json();

        const starsOne=reposOne.reduce(

            (total,repo)=>total+repo.stargazers_count,

            0

        );

        const starsTwo=reposTwo.reduce(

            (total,repo)=>total+repo.stargazers_count,

            0

        );

        hideLoader();

        renderBattle(

            userOneData,

            starsOne,

            userTwoData,

            starsTwo

        );

    }

    catch(error){

        hideLoader();

        alert("Unable to compare users.");

        console.error(error);

    }

}


/* ==================================================
   RENDER BATTLE RESULT
================================================== */

function renderBattle(user1,stars1,user2,stars2){

    battleResult.classList.remove("hidden");

    battleResult.innerHTML="";

    const firstWinner = stars1 >= stars2;

    battleResult.innerHTML=`

    <div class="battle-card ${firstWinner ? "winner":"loser"}">

        <h3>

            ${firstWinner ? "🏆 Winner":"❌ Loser"}

        </h3>

        <img src="${user1.avatar_url}" alt="${user1.login}">

        <h2>${user1.login}</h2>

        <p>Total Stars : ${stars1}</p>

        <p>Repositories : ${user1.public_repos}</p>

        <p>Followers : ${user1.followers}</p>

    </div>

    <div class="battle-card ${!firstWinner ? "winner":"loser"}">

        <h3>

            ${!firstWinner ? "🏆 Winner":"❌ Loser"}

        </h3>

        <img src="${user2.avatar_url}" alt="${user2.login}">

        <h2>${user2.login}</h2>

        <p>Total Stars : ${stars2}</p>

        <p>Repositories : ${user2.public_repos}</p>

        <p>Followers : ${user2.followers}</p>

    </div>

    `;

}


/* ==================================================
   BATTLE BUTTON
================================================== */

battleBtn.addEventListener("click",()=>{

    battleMode();

});


/* ==================================================
   ENTER KEY SUPPORT
================================================== */

[userOne,userTwo].forEach(input=>{

    input.addEventListener("keydown",(event)=>{

        if(event.key==="Enter"){

            battleMode();

        }

    });

});
/* ==================================================
   BUTTON LOADING STATE
================================================== */

function disableSearchButton(){

    searchBtn.disabled = true;

    searchBtn.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> Searching...';

}

function enableSearchButton(){

    searchBtn.disabled = false;

    searchBtn.innerHTML =
        '<i class="fa-solid fa-magnifying-glass"></i> Search';

}

/* ==================================================
   OVERRIDE FETCH USER
================================================== */

const originalFetchUser = fetchUser;

fetchUser = async function(username){

    disableSearchButton();

    try{

        await originalFetchUser(username);

    }

    finally{

        enableSearchButton();

    }

};

/* ==================================================
   GITHUB RATE LIMIT CHECK
================================================== */

window.addEventListener("unhandledrejection",(event)=>{

    if(event.reason?.message?.includes("403")){

        alert(
            "GitHub API rate limit exceeded. Please try again later."
        );

    }

});

/* ==================================================
   INPUT AUTO TRIM
================================================== */

usernameInput.addEventListener("change",()=>{

    usernameInput.value = usernameInput.value.trim();

});

userOne.addEventListener("change",()=>{

    userOne.value = userOne.value.trim();

});

userTwo.addEventListener("change",()=>{

    userTwo.value = userTwo.value.trim();

});

/* ==================================================
   DEFAULT FOCUS
================================================== */

window.addEventListener("load",()=>{

    usernameInput.focus();

});

/* ==================================================
   CONSOLE MESSAGE
================================================== */

console.log(
    "%cGitHub Profile Explorer Loaded Successfully!",
    "color:green;font-size:16px;font-weight:bold;"
);

console.log(
    "Sprint 03 completed using Fetch API, Async/Await, Promise.all() and GitHub REST API."
);

/* ==================================================
   END OF SCRIPT
================================================== */