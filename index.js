console.log("Jello world!");

/* Note(Leo): Structure explanation
Our blogs are structured as folders in our root folder. Each blog has its own folder.
For each blog we have a file called content.html which is the snippet we pull down and insert into our content area when the user clicks.
Each blog also has a file called thumbnail.jpg which is the thumbnail we grab when indexing on the main page.
Each blog also has preview.txt which is a short description of what the blog talks about which we also grab and insert.

Then to index our content we have the CONTENT_INDEX const object. This object has an array called Content. Each object in the array has 2 properties.
First is the name of the article, second is the url to get to the subfolder where the article is stored (which is all we need since we have standardised our
file names).

*/
const CONTENT_INDEX = {
    "Content" :
    [
        { name : "500,000,000x Faster with C++", url: "clickbait_cpp"},
        { name: "How I made a $2m startup", url: "onlyfans"},
        { name: "How I made a $2m startup", url: "article_1"},
    ]
};

var top_bar = null;
var content_target = null;

var window_title = null;
var window_icon = null;
var article_row_template = null;

var dynamic_script = null;

function load_content_snippet(url, target)
{
  fetch(url)
    .then(response => {
      if (!response.ok)
      {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return response.text();
    })
    .then(html =>
    {
      target.innerHTML = html;
    })
    .catch(error => {
      console.error('Error loading HTML:', error);
    });
}

function run_dynamic_script(url, target)
{
    target.src = url;
    
    if(script_main == null)
    {
        return;
    }
    
    script_main();
}

async function load_article_description(url, target)
{
    fetch(url)
    .then(response => {
      if (!response.ok)
      {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return response.text();
    })
    .then(txt =>
    {
      target.innerText = txt;
    })
    .catch(error => {
      console.error('Error loading article description:', error);
    });
}

// Note(Leo): Idiotic search
function get_article_name_from_url(path)
{
    const content = CONTENT_INDEX.Content;
    for(let i = 0; i < content.length; i++)
    {
        let item = content[i];
        if(item.url === path)
        {
            return item.name;
        }
    }
    
    return "not_found_lol";
}

function Article(path, name)
{
    // Switch the window title and icon. We use the notepad icon for articles.
    window_icon.src = "notepad.ico"
    window_title.innerText = `C:\\Blog\\${name}.txt - Notepad`

    // Load our content snippet
    load_content_snippet("articles/" + path + "/content.html", content_target);
}

// Create a new article row by cloning the template
function new_article_row(path, name)
{
    const created = document.importNode(article_row_template.content, true);
    
    // Adding the onclick that switches us to this article
    let container_el = created.getElementById("article_row_container");
    container_el.addEventListener('click', function (e) { on_article_clicked(path, name); });
    
    let title_el = created.getElementById("article_row_title");
    title_el.innerText = name;

    let thumbnail_el = created.getElementById("article_row_image");
    thumbnail_el.src = "articles/" + path + "/thumbnail.jpg";

    // Fetch the description for this row asynchronously
    let description_el = created.getElementById("article_row_description");
    load_article_description("articles/" + path + "/preview.txt", description_el);
    
    // Return the created element
    return created;
}

function BlogPage()
{
    // Switch the window title and icon. We use the file explorer icon for the home page.
    window_icon.src = "explorer.ico"
    window_title.innerText = "C:\\Blog - File Explorer"
 
    content_target.innerHTML = "";
    
    
    const content_array = CONTENT_INDEX.Content;

    for(let i = 0; i < content_array.length; i++)
    {
        let item = content_array[i];
        content_target.appendChild(new_article_row(item.url, item.name));
    }
}

function HomePage()
{
    // Switch the window title and icon. We use the file explorer icon for the home page.
    window_icon.src = "explorer.ico"
    window_title.innerText = "C:\\Home - File Explorer"
 
    content_target.innerHTML = "";

    // Load our content snippet
    load_content_snippet("pages/home/content.html", content_target);
    run_dynamic_script("pages/home/script.js", dynamic_script);
}

// Add the article path to the current URL without reloading
function SetArticleUrl(path)
{
    const new_url = new URL(window.location.href);
    new_url.searchParams.set('a', path);
    window.history.pushState({}, '', new_url.href);   
}

// Add the page id to the current URL without reloading
function SetPageUrl(path)
{
    const new_url = new URL(window.location.href);
    new_url.searchParams.set('p', path);
    window.history.pushState({}, '', new_url.href);   
}

function on_article_clicked(path)
{
    // Add the path to the current URL so that the user will be put back on the same article if they reload the page
    SetArticleUrl(path);
    
    // Switch the page content to the selected article
    Article(path, get_article_name_from_url(path));
}

function on_blog_clicked()
{
    // Set current article to blank and the page to blog so the user lands on the blog page if they reload
    SetArticleUrl("");
    SetPageUrl("blog");
    
    // Switch the page content to the home page
    BlogPage();
}

function on_home_clicked()
{
    // Set current article to blank and the page to blank so the user lands on the home page if they reload
    SetArticleUrl("");
    SetPageUrl("");
    
    // Switch the page content to the home page
    HomePage();
}

function main()
{
    top_bar = document.getElementById('top_bar');
    content_target = document.getElementById('content_target');
    
    window_title = document.getElementById('window_title');
    window_icon = document.getElementById('window_icon');
    
    article_row_template = document.getElementById('article_row_template');
    
    dynamic_script = document.getElementById('dynamic_script');
    
    // Check if the user was on an article already
    const params = new URLSearchParams(window.location.search);
    const article_path = params.get('a');
    
    // Grab the article content
    if(article_path != null && article_path != "")
    {
        Article(article_path, get_article_name_from_url(article_path));
        return;
    }
    
    // We werent on an articles so check which page we were on
    const page_id = params.get('p');
    if(page_id != null && page_id != "")
    {
        // We are on the home page
        BlogPage();
        return;
    }
    
    HomePage();
};

window.addEventListener("load", main);