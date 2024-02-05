# FIT3170_Internship_Management_System
This is the repository for FIT3170 Internship Management System

Please visit: https://simp-internship-management.herokuapp.com/

## License
This repository uses MIT License

## Development
Software: NodeJs (v16.14.2), Npm (8.5.0), VueJs (v2.6.14)
Hardware: 4GB RAM, 10GB free space [(for NodeJs installation)](https://www.zeolearn.com/magazine/install-node-js-on-windows)

##### To Start the whole application locally: (Open two terminal at FIT3170_Internship_Management_System/App)
At App/Frontend/vue-project/.env file
Modify VUE_APP_BACKEND_LINK:
```
VUE_APP_BACKEND_LINK="http://localhost:3030/"

!NOTE: this change should not be pushed to Github
```
First terminal 
```
cd Backend 
npm install
npm run start 
```
Second terminal 
```
cd Frontend/vue-project 
npm install 
npm run serve   
```
After both terminal finish running click on either the link in second terminal for the webpage.
Note that package-lock.json will have some changes after both terminal finish running.

##### Additional notes or common issues that future developers might benefit from knowing

* Both terminal will be required to run at the same time in-oder for the function to work. 
* After certain time period, the database have to be cleared following the Retention period in PDPA
* If functions are not working, can try FIRST checking the backend services on the terminal.
* There is a [user documentation](https://docs.google.com/document/d/1fogM80EYCgvqwZCYcCoMweFyaElYIL8CLj1dcAoh1oo/edit?usp=sharing) available on how to use the application for users.

GIT COMMIT TEMPLATE 
======  
`type ` `:` `summarise the changes`

`optional`

`[More detailed explanatory description of the change][footer if any]`

Commit Type | Explanation
---|---
build| Build related changes (eg: npm related/ adding external dependencies)
chore| A code change that external user won't see (eg: change to .gitignore file or etc)
feat| A new feature either complete or incomplete
fix| A bug fix
docs| Documentation related changes
refactor| A code that neither fix bug nor adds a feature. (eg: You can use this when there is semantic changes like renaming a variable/ function name)
perf| A code that improves performance
style| A code that is related to styling
test| Adding new test or making changes to existing test

#### Git commit command
```
> git commit -m "Subject" -m "Description..."
```

## Pull Request Strategy
1. Nominates a git master to manage all the **Pull Request**. 
2. Developers may create a Pull Request after tested the code. 
3. Git master will check on the new code, resolve the merge conflict and approve the Pull Request.

## Versioning Strategy
#### Rules of Version Number: MAJOR.MINOR.PATCH 

MAJOR - version is incremented when you make any breaking change

MINOR - version is incremented when you add a new feature/functionality

PATCH - version is incremented when you make bug fixes

#### Strategy
1. Git Master creates a new release on GitHub
2. Choose the release branch as the target branch
3. Add the title based on the versioning strategy specified
4. Add release notes and changelogs for the new release
5. Publish the new release

#### For Automating Versioning and Releases Using Semantic Release
Find more details about fully automated semantic release here — https://github.com/semantic-release/semantic-release
