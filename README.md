# JSON Fake REST Server 

## Introduction
I made this fake server usin JSON server for my team to practice their front-end in different frameworks like react, angular or vue. (I know naming is wrong saying a quiz but I had something else in mind when I created the repository, so try and move past it, TY)

## Challenge
### Overview
In essence we have three collections users, posts and comments,I guess it is clear what relationship they have but still I'll enumerate it for you.
- Users can create posts (1-M)
- Users can create comments (1-M)
- Posts can have comments (1-M)

### Task
You need to create a SPA(you can opt out if you like) inside the client folder(There is some html and js files, wipe them out), in which:
- Home Page
  - This will contain the list of posts.
  - There are a total of 20 so you can also go for a pagination of 5/page
  - Each Post will compulsarily have title, author, avatar of the author, publish date and votes. Optionally you can add a truncated version of the content and the number of comments
  - Each Post will lead to a post page.
- Post Page
  - This will render individual post
  - It will have the complete content of the post
  - It will also have the comments
  - Some detail about the comment
    - Comments are of two type root and child
    - Root comments are direct thread to the post
    - Child comments are sub-comments or replies to a certain comments
    - There is no depth to the nesting but the api only porvides the list so nesting has to be done on front-end
    - If you are confused of the structure, visit [Reddit](https://www.reddit.com/) and see how they did it.
  - Comments will be ordered from latest to oldest for the root comments and oldest to newest for the sub-comments
  - Each Comment will have the Author, Author's Avatar, Comment, Publish Date, votes on the comment
  - Optional: You can show only the first comment on page load and all the comments when your clicks a button
  - Optional: You can show other posts from the same user after the comments under the heading "Posts from the same user" in the same format as the Home Page
- User Page
  - People will be re-directed to this page by clicking on the name or avatar of authors from post or comments
  - It will have all the information except the user id and the password
  - It should also have the number of posts and number of comments that user has authored
  - Below the profile all the posts from the user should be mentioned in the same format as the Home Page

### Routes
To get ther server Running just install the dependencies and
`yarn server:json` or `npm run server:json`
And the server will be running on [http://localhost:8000/](http://localhost:8000/)

The following routes will be accessible to you
```
/api/posts
/api/comments
/api/users
``` 
These routes are build with JSON Server, please visit this [link](https://github.com/typicode/json-server) for information on how the api's can be consumed and what are the options available, since it is build from JSON server it follows everything in their documentations.

### Take it up a notch - Advanced
If you are feeling a daredevil, you can try increasing the difficulty with the following additional features. But I strongly recommend you complete the above task before you move to the following.

- Additional Features
  - Add Authentication
    - Each user have a unique Email and Password combo
    - Use them to authenticate the user with `POST - /api/auth/login` route.
    - This route if successfull will send you a Bearer Token
    - All the routes are private now so you need this token for everything except `POST - /api/auth/login` and `GET - /api/auth/whoami`
    - Depending on the token provided the *whoami* route will give you info about the current user
  - Complete the CRUD
    - Before everything was Readonly, but now
    - User can update their posts and comments
    - Can up-vote or down-vote other comments
    - Update their own profile
    - Validation on the update entry should be managed on the front-end, with proper error messages
    - Optional: Server dosen't support file upload, but users can change their profile photo.

*To run the server with auth support use `yarn server:dev` or `npm run server:dev`*

### Most Important TASK of all
Have fun while doing it, enjoy the highs and lows, and cherish the effort you are putting in. Thank You

## Future
While I really don't think I would update it any further, but if I do, I have the following thing in mind

- [ ] Make all GET routes public to make it SSR friendly for NEXT.js/NUXT.js users
- [ ] Add Validation to updation, only by the owner, this is handled in the front-end but should be a part of back-end as well
- [ ] Add Validation to update and new entry to the collections so garbage data is not pushed in, and integrity is maintained
- [ ] Host the server on Heroku so people don't have to clone the repo, just consume the endpoint
- [ ] Add a sign-up route for new users. with jwt for token and bcrypt for password. (I think Argon will be overkill :D)

## Person note
Docker Command during development
`docker run --name json-server --user $(id -u):$(id -g) -p 3000:3000 -p 8000:8000 --rm -it -w /usr/src/app -v $(pwd):/usr/src/app node bash `
