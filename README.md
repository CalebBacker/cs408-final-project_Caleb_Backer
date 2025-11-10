# Bricker Breaker Web Clone, Final Project CS408

## Project Spec

The General theme of this application projec will be a simple brick breaker clone. It will take logic form the previous lab with the bouncing balls and greatly expand it with the funcitonality of the game brick breaker. You will be able to move your character along the bottom of the screen to catch a single ball, that will bounce around making contact with and destroying blocks. Once all the blocks are clear you can continue to the next level and your score increases. You have a limited amount of lives, and the game is over once you lose them all. Its intent is to be a simple web game.

The game will be built with AWS and javascript on the backend. AWS will handle the data management, such as the high scores. Javascript will be used to control the game objects and game logic. For the front end html and css will be used to create and style the actual website and game graphics.

The web application will consist of a home screen, a play screen, and a high score screen. The second two screens will be accessed from the home screen via buttons. CLicking on the play button will start the game at level one, switching to the play screen and loading the ame logic, once all bricks have been cleared the next level will load. My plan is to make at least 3 levels to work through, with more being added as stretch goals. Once the game is either beaten OR the player loses all their lives, a game ove/game won screen will show, and the user will be prompeted to input their name for the leaderboard. THeir score will be input with their name, and they will be prompted to return to the main menu. Clicking on the main menu from here will direct the users to the leaderboard screen, consisting of a table with all the high scores. There will be a return to home button here as well.

The target audience is anyone who wants to play a simple web brick breaker game, so the general public. It will have a global leaderboard so it will have a competitive element as well.

The data it will mainly manage is scores and a leaderboard. One of the stretch goals would be user generated levels and those would be stored by AWS as well. Other data that could be managed is user accounts, or at least user names. Adding user personalizations may be a strectch goal, however starting out more basic user data will be the focus. A feature to upload a custom background will likely be implemented first as more data to store. All stored data will be user generated or supplied via gameplay or uploads.

The list of stretch goals include:
- power ups, 
- more levels, 
- graphical improvements, 
- a level editor(and uploader as mentioned above),
- level downlaoder
- level browser
- ability to upvote levels
- new game modes.
- A pause feature
- multiplayer
- Timer feature

## Project Wireframe

Welcome screen
![welcome-screen](<img width="2026" height="1288" alt="image" src="https://github.com/user-attachments/assets/dde06380-261f-4bb0-8dc1-f33fe16eabd4" />
)
Play Screen
![play-screen](<img width="1558" height="1514" alt="image" src="https://github.com/user-attachments/assets/59227ea6-6af8-4d29-8cf1-2d26ec2ef122" />
)
Leaderboard
![Leaderboard](<img width="2066" height="1324" alt="image" src="https://github.com/user-attachments/assets/86da2d7e-c6f2-4516-aeb9-8c9f54bec28b" />
)

