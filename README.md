IRS-MR-2019-01-19-IS1PT-GRP-THOR-Petrol Station Route Optimizer
---

## SECTION 1 : PROJECT TITLE
Petrol Station Route Optimizer

---
## SECTION 2 : EXECUTIVE SUMMARY / PAPER ABSTRACT
How people live, work and spend their money has changed dramatically over the past decade, especially with the advent of today’s disruptive technology. The new and disruptive technologies have opened new ways to make and spend money – online, picking up a “gig” (freelance engagement) is as easy as making plans for dinner or finding a date. In other words, we are also leaving in an “Appgeneration”, where apps are changing the world, and we are part of the change.  The numerous apps are altering the way that people view and perform work. Often driven by algorithms that align supply with demand, these apps are also paving the road towards an economy in which services are supplied only when needed and reachable to a wider audience. 
The result is a system of flexible working that stands in stark contrast to the corporate world’s insistence on a five day, nine-to-five work week. Flexibility and autonomy are what draw many to the freelance lifestyle, but such freelancers have limited productivity and organizational tools unlike multinational companies. The demand for freelance couriers’ services is expected to grow year on year given the popularity of online shopping and e-commerce. In addition, one key weekly tasks that a freelance courier need to do is refueling of his/her vehicle. This task is also a common task to any driver.  
Our project team would like to build an app that helps freelance couriers to improve their productivity as well as locate a preferred petrol station (the petrol station with the best price offer based on choice of credit card) along one of their routes for any driver. The reason we are targeting the logistic industry, is because the need of low cost non urgent delivery services is on the rise, where items can be placed at designated drop off points and delivered to designated collections points for customers to pick up. These drop off points and collections points can be at retails malls or commercial premises. Transportation and manpower expenditure are key cost elements to these companies, and many of these companies leverage freelance couriers for the logistic services. In addition, the app should also benefit the man on the street to locate the optimize route from one destination to another including locating the preferred petrol station.
Using the techniques imparted to us in lectures, our group first set out to build a hybrid reasoning system that incorporates an expert system built using rules engine like Clips which helps in selecting the preferred petrol station together with genetic algorithm written in python to determine optimized routes to any of the app user. The app will display all these through visual maps as well as the suggested segments of the routes. 
Our team had an exciting time working on this project and hope to share our insights with everyone. There are truly are a wide array of individual factors to come to a final decision in the switch to a different pricing plan, and we only wish there was more time to work on the scope and scale of the project.
   

---
## SECTION 3 : CREDITS / PROJECT CONTRIBUTION

| Official Full Name  | Student ID (MTech Applicable)  | Work Items (Who Did What) | Email (Optional) |
| :------------ |:---------------:| :-----| :-----|
| IAN TAN ENG KIONG | A0120534W | Investigated the implementation of GA route optimisation using modified-TSP for open route by fixing the start and end of the genes of each chromosome. Testing. Establish value proposition, skeletion of project report, and overall project report writeup. User Guide. |  |
| KHOO WEE BENG | A0195308Y | Exploration of possible solutions, GA(Python+Javascript), Java J2EE(Optaplanner), GoogleMap APIs, OneMap APIs. Front-end development, integration to OneMap and GoogleMap, integration to CLIPS, integration to GA-Python, integration to Javascript-GA. Demo Video. Overall report refinement and confirmation. |  |
| KOH SOOK BING | A0195413E | Develop python scripts to download the Geocode location for all the petrol kiosks in Singapore using Google API and OneMap API. Develop the rule-based engine in Clips to recommend the petrol brand based on the cards discount. Project report write up(CLIPS). |  |
| RANA BHATTACHARJEE | A0195178N | Investigated the viability of implementing route optimisation using Optaplanner. Investigated the implementation of GA route optimisation using modified-TSP approach. Project report writeup(GA). |  |
| TAN YAO TAI TEERAPONG | A0073460L | Develop python scripts to datamine •	credit card discounts from the different banks •	address of all Petrol Stations in Singapore. Develop scripts to Geocode all the address of all the Petrol Stations using One Map API. Develop Javascript to optimise the “Fixed Route” option. Integration of Javascript to Django, One Map and Google Maps. Project report writeup(JS fixed route). |  |
| YEO WHYE CHUNG NELSON | A0195405A | Investigated the viability of implementing route optimisation using Optaplanner. Investigated the implementation of GA route optimisation using node assignment approach. Project report writeup(Optaplanner). |  |

---
## SECTION 4 : VIDEO OF SYSTEM MODELLING & USE CASE DEMO

[![Petrol Station Route Optimizer](https://i9.ytimg.com/vi/poQ_v2iFA_I/mq2.jpg?sqp=CLTs8eUF&rs=AOn4CLAMbD8fotccakaTQQfSRtivg6dFNg](https://youtu.be/poQ_v2iFA_I "Petrol Station Route Optimizer")

---
## SECTION 5 : USER GUIDE

`<Github File Link>` : <https://github.com/dion797/IRS-RS-2019-03-09-IS01PT-GRP-Thor-Petrol_Station_Route_Optimizer/blob/master/UserGuide/User%20Guide_petrol.pdf>

### [ 1 ] To run the system using iss-vm

> download pre-built virtual machine from http://bit.ly/iss-vm

> start iss-vm

> open terminal in iss-vm

> $ git clone https://github.com/dion797/IRS-RS-2019-03-09-IS01PT-GRP-Thor-Petrol_Station_Route_Optimizer.git

> $ sudo apt-get install python-django

> $ sudo apt-get install python-clips clips build-essential python-dev python-pip python-django

> $ sudo pip install pyclips

> $ cd IRS-RS-2019-03-09-IS01PT-GRP-Thor-Petrol_Station_Route_Optimizer/SystemCode/thor

> $ python2 manage.py runserver

> **Go to URL using web browser** http://localhost:8000

### [ 2 ] To run the system in other/local machine:
### Install additional necessary libraries. This application works in python 2 only.

> $ sudo apt-get install python-clips clips build-essential python-dev python-pip python-django python-tk

> $ pip install pyclips 

> $ pip install numpy

> $ pip install pandas

> $ pip install matplotlib
---
## SECTION 6 : PROJECT REPORT / PAPER

Petrol Station Route Optimizer.pdf
`<Github File Link>` : <https://github.com/dion797/IRS-RS-2019-03-09-IS01PT-GRP-Thor-Petrol_Station_Route_Optimizer/blob/master/ProjectReport/Petrol%20Station%20Route%20Optimizer.pdf>

---
## SECTION 7 : MISCELLANEOUS

RS Optaplanner.7z
`<Github File Link>` : <https://github.com/dion797/IRS-RS-2019-03-09-IS01PT-GRP-Thor-Petrol_Station_Route_Optimizer/blob/master/Miscellaneous/RS%20Optaplanner.7z>

rs_python_ga.7z
`<Github File Link>` : <https://github.com/dion797/IRS-RS-2019-03-09-IS01PT-GRP-Thor-Petrol_Station_Route_Optimizer/blob/master/Miscellaneous/rs_python_ga.7z>

---
