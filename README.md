# WatchLog
### Track and Review Your Favourite Shows!
<p>Sign Up, View Shows you watched, Invite friends to watch-a-long</p>

## User Stories
* As a User, i want to have an account i can register and sign up
* As a User, i want to be a able to add other users as friends
* As a User, i want to be able to add friends to watchalongs 
* AS a USer, i want to be able to search shows and create watchalongs with episodes selections
* As a User, i want to be able to add shows to watchlist so i can view later


## Wireframes

### Landing Page
![Landing](./assets/Index.png)
### Home Page
![Home](./assets/Home.png)
### Your Profile
![Profile](./assets/Profile.png)


## Entity Relationship Diagram
![ERD](./assets/WatchLogERD.png)

## Routes Table
| Method | Path | Purpose|
|--------|------|--------|
| **Auth Routes** |
| GET | `/auth/sign-up` | Register Page |
| POST | `/auth/sign-up` | Create Account |
| GET | `/auth/sign-in` | Login Page |
| POST | `/auth/sign-in` | Login |
| POST | `/auth/sign-out` | Sign Out |
| **Common Pages**|
| GET | `/` | Landing |
| GET | `/home` | Home Page |
|**Users**|
| GET | `/users` | Get all Users |
| GET | `/users/:id` | Get specific User |
| GET | `/users/:id/edit` | Get Profile Edit |
| PUT | `/users/:id` | Update User |
|**Watchlist**|
| GET | `/watchlist` | Get current user's watchlist |
| POST | `/watchlist/:id` | Add show to watchlist |
| DELETE | `/watchlist/:id` | Remove from watchlist |
|**Friend**|
| GET | `/friends` | Get all friends |
| DELETE | `/friends/:id` | Remove friend |
| GET | `/friend-requests` | Get all friend requests |
| POST | `/friend-requests` | Create Request |
| PATCH | `/friend-requests/:id` | Accept/decline request |
| DELETE | `/friend-requests/:id` | Delete request |
|**Watch Along** |
| GET | `/watch-alongs` | Get all watchalongs |
| GET | `/watch-alongs/:id` | Get specific watchalong |
| GET | `/watch-alongs/new` | Create Page |
| POST | `/watch-alongs` | Create WatchAlong |
| GET | `/watch-alongs/:id/edit` | Edit WatchAlong page |
| PUT | `/watch-alongs/:id` | Update WatchAlong |
| PATCH | `/watch-alongs/:id` | Accept/decline invite |
| DELETE | `/watch-alongs/:id` | Delete WatchAlong |
|**Show**|
| GET | `/shows` | Get Shows page |
| GET | `/shows/:id` | Get specific show page |
|**AJAX**|
| GET | `/api/shows/search` | Search shows |
| GET | `/api/shows/:id/episodes` | Get episodes of show |