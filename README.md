[![Build Status](https://travis-ci.com/OrbitalbooKING/booKING.svg?branch=main)](https://travis-ci.com/OrbitalbooKING/booKING)
<br />
# booKING 

## Orbital 2021 
![](./assets/logo.png)

## Motivation 
With the limited venues and resources available in School of Computing, students struggle to find a proper venue to study or to work on group projects. Even if a vacant venue is found, students are also uncertain whether the room is currently occupied, or whether it will be occupied halfway during their usage. In addition, if they want to use it for project meetings or discussions, they are also unsure if the venue itself has the relevant infrastructure (such as projectors, computers or seats) to suit their requirements and preferences. 

---
## Aim 
To maximise the venue and resources usage in School of Computing, we hope to help users find and reserve a venue for their own usage through a simple and user-friendly web application. 

---
## Description
To maximise the venue and resources usage in School of Computing, we hope to help users find and reserve a venue for their own usage through a simple and user-friendly web application.

---
## Documentations
- [User Guide](https://docs.google.com/document/d/1zvFvemhVmstVMCiOg0dLkmLf1wWBZFmuWxLuLHR_zJg/edit?usp=sharing)
- [Developer Guide](https://docs.google.com/document/d/1SV7XcLXzWC8Oh0ZJ9_ezHnF3e7drr1Ee3bozCdLTEl8/edit?usp=sharing)
- [Prototype on Figma](https://www.figma.com/file/StFYx2rDrqAGr74XKgNIck/booKING?node-id=3%3A20)
- [Prototype on Heroku](https://orbitalbooking.herokuapp.com)
- [Video](https://drive.google.com/file/d/1vGCY2l3TweOiyNjKtW0HgWrqVh6GVa57/view?usp=sharing)
- [Poster](https://drive.google.com/file/d/1n0D9r45ZNvhBg2152Rb4YcsB8wWRc8oz/view?usp=sharing)
- [Cognitive Walkthrough](https://drive.google.com/file/d/1qtbvl8xnwmnuFjW62ugDXUMCpetBr5eh/view?usp=sharing)

---
## Timeline
### **Setup: (3 weeks)**
1. - [x] Setup database
2. - [x] CRUD for database 
3. - [x] Basic interface 
4. - [x] Design for web application

### **Core Features: (4 weeks)**
1. - [x] User authentication
2. - [x] Adding all the venues to the database 
3. - [x] Venue reservation
   - - [ ] Maximum reservation hours per user
   - - [x] Venue classifications 
   - - [x] Resources available in each venue 
4. - [x] Available venues search function
5. - [ ] Venue reservation notification
6. - [x] Autocomplete function in venue search bar 
7. - [ ] Points system
8. - [ ] Approval process; we will create an interface for staff in SoC to view and approve venue bookings, this allows them to prioritise SoC users who wants to reserve a venue
9. - [ ] Editing of reserved venues by staff users to address ad-hoc changes

### **Advanced Features: (4 weeks)**
1. - [ ] Venue sharing system
2. - [ ] Automatic categorisation of venue type
3. - [ ] Priority queue for SoC users to reserve rooms over non-SoC users

### **Nice-to-have Features: (2 weeks)**
1. - [ ] Prevent interval bookings (don’t let users book 30 mins and leave it empty for 30 mins etc) 
2. - [ ] Lock incorrect attempts out
3. - [ ] Minimum number of characters for password
4. - [ ] Responsive design for different screen sizes
5. - [ ] Statistics displayed for each venue for staff users
6. - [ ] User-friendly interface
   - - [ ] Dark Mode
   - - [ ] Screen size

---
## Tech Stack
1. ReactJS
2. CSS/HTML
3. PostgreSQL
4. GOLang

---
## Project Log
| S/N | Description | Hours spent by Jason | Hours spent by Jie Wei | Time Period | Remarks |
| - | - | - | - | - | - |
| 1 | Poster creation for Lift-off | 2 | 2 | 10/5/2021 | Liftoff |
| 2 | Video creation for Lift-off | 3 | 3 | 10/5/2021 | Liftoff |
| 3 | Team meeting: initial planning | 5 | 5 | 11/5/2021 | 1) Layout the full idea for the project and the technology required<br />2) Delegated roles<br />3) Asked friends for feedback |
| 4 | Project research | 4 | 4 | 12/5/2021 | 1) Read up and research on similar products in the market<br />2) Comparing which software is the best among similar ones |
| 5 | Mission control | 3 | 3 | 13/5/2021 | Met up with mentor Robin to discuss our project ideas and to get feedback on the softwares we intend to use | 
| 6 | Programming at home: Frontend & Backend | 2 | 2 | 16/5/2021 | 1) Setup PostgreSQL and make connection with Golang<br />2) Design simple web page using React |
| 7 | Programming at home: Frontend & Backend | 3 | 3 | 18/5/2021 | 1) Develop APIs<br />2) Design buttons for login features |
| 8 | Programming at home: Frontend & Backend | 3 | 3 | 22/5/2021 | 1) Testing of database query calls with APIs<br />2) Designing of registration and reset pages |
| 9 | Programming at home: Integration | 3 | 3 | 26/5/2021 | Successfully connected React frontend with PostgreSQL backend using Golang to carry out authentication |
| 10 | Programming at home: Integration | 2 | 2 | 26/5/2021 | Successfully connected React frontend with PostgreSQL backend using Go to carry out authentication | 
| 11 | Documentation at home: User Guide | 8 | 8 | 27/5/2021 |  Worked on documenting a user guide for Milestone 1 | 
| 12 | Documentation at home: Developer Guide | 8 | 8 | 28/5/2021 | Worked on documenting a developer guide for Milestone 1 | 
| 13 | Team meeting: milestone review | 2 | 2 | 1/6/2021 | 1) Met with mentor Loh Zi Bin Robin to look through milestone one feedbacks as well as plan out next course of action |
| 14 | Programming at home: Frontend & Backend | 10 | 10 | 7/6/2021 | 1) Obtain venue information from NUS website to populate venue lists to store in database<br />2) Create API routes to fetch all venues<br />3) Implement search bar and venue display on react | 
| 15 | Programming at home: Frontend & Backend | 10 | 10 | 14/6/2021 | 1) Implement filters for queries to only display certain venues<br />2) Create booking page with a calendar for users to select their desired time slots |
| 16 | Programming at home: Frontend & Backend | 10 | 10 | 21/6/2021 | 1) Create booking services<br />2) Integration of frontend and backend to test out search features and booking |
| 17 | Documentation at home: Frontend & Backend tests | 8 | 8 | 25/6/2021 | 1) Create test files to conduct testing of backend code<br />2) Qualitative evaluation of application (heuristics evaluation and cognitive walkthrough) |

| Total hours | Jason | Jiewei |
| - | - | - |
| | 93 | 93 |

---
## Qualifications 
Both of us have experience with programming using Java and Python (explored python in our free time and are currently learning Java from CS2030S this semester) hence we are confident that we will be able to utilise GOLang which is similar to both languages. 

We also have basic knowledge in CSS and HTML to code and design websites (Jason has experimented with it during the MOOC course CS50 by edX while Jie Wei has designed a webpage for one of his course projects back in Temasek Polytechnic). In the same way, we have also integrated MySQL together with the websites we have designed.
