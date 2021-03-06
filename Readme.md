# Documentation of the Backend part 
> Deliverable D1

## General group information  
  
| Member n. | Role | First name | Last Name | Matricola | Email address |  
| --------- | ------------- | ---------- | --------- | --------- | --------------- |  
| 1 | administrator | Cosimo | Russo | XXXXXX | --- |  
| 2 | member | Giorgio | Ughini | XXXXXX | --- |  
  
## Links to other deliverables

- Deliverable D0: the web application is accessible at [this address](https://papyro-hypermedia.herokuapp.com).
- Deliverable D2: the YAML or JSON file containing the specification of the app API can be found at [this address](https://papyro-hypermedia.herokuapp.com/backend/spec.yaml).
- Deliverable D3: the SwaggerUI page of the same API is available at [this address](https://papyro-hypermedia.herokuapp.com/backend/swaggerui).    
- Deliverable D4: the source code of D0 is available as a zip file at [this address](https://papyro-hypermedia.herokuapp.com/backend/app.zip).    
- Deliverable D5: the address of the online source control repository is available [this address](https://github.com/CosimoRusso/papyro). We hereby declare that this is a private repository and, upon request, we will give access to the instructors.  

## Specification 

### Web Architecture 
**Describe here, with a diagram, the components of your web application and how they interact. Highlight which parts belong to the application layer, data layer or presentation layer. How did you ensure that HTML is not rendered server side?**
 ![Papyro components][papyro-components]    
In our application we used 'pug' as a template engine. In ExpressJS, this setup is perfect for server-side rendering, and we tried to adapt it to serving static content without losing its benefits.    
The first step was to avoid passing any object to the Express' `render()` function, to make sure that the pug files did not contain any data from the database. This way we have been able to step into the second phase: we stopped calling the `render()` method on each request and compiled pug just once on server startup instead, and each request now sends static HTML files stored in the public/pages directory.    

### API 

#### REST compliance 
**Describe here to what extent did you follow REST principles and what are the reasons for which you might have decided to diverge. Note, you must not describe the whole API here, just the design decisions.**

We sticked to the REST principles as much as we could:
  
- we provided a uniform interface that is consistent among requests and always returns a JSON object.     
- We used the GET verb if the request caused no modification to the application state, POST and DELETE otherwise.    
- We had to slightly diverge from the statelessness because we could not have implemented the login functionality otherwise: since we did not implement a separate login server, the user must first obtain the token through the login POST request and then use it to authenticate requests. This means that the logged in requests depend on the previously done login on the same API.    
- If needed, the requests have a link to other resources. In our case it is always an integer id.    
- Though it is not implemented, the system is thought to be layered: it is easy to move both the database and the login functionality to another server.    
- We did not implement the optional "code on-demand" constraint because we did not need it     

#### OpenAPI Resource models

**Describe here synthetically, which models you have introduced for resources.**  

* Authors: the author's basic information, used when multiple authors are being retrieved  
* Author: extends authors with the information about its books  
* BaseBook: basic data about a book, without any information on its relational fields. used when the book is an attribute of the requested element  
* Books: extends BaseBook with genres, themes and authors. Used when a list of books is requested  
* Book: extends Books with events, similar books and reviews. Used when a single book is requested, has all possible informations about it  
* Genre: the id and name of a genre  
* Theme: the id and name of a theme  
* Event: id, location and date of an event  
* Review: id, name, comment and book id of a review
* Error: a generic error with a message attribute   

### Data model
**Describe with an ER diagram the model used in the data layer of your web application. How these map to the OpenAPI data model?**
 
![Database ER schema](https://papyro-hypermedia.herokuapp.com/assets/img/ER.png)

- The match between the OpenApi models and the database tables is 1:1 for the simplest models: theme, genres and events.   
- The Error model in OpenApi does not map to any table.  
- The Authors model corresponds exactly to the authors table, while the Author model maps the authors table joined with the books table.  
- The BaseBook model matches exactly with the books table, the Books model maps the books table joined with the genres and themes tables (the "name" field only) and the authors table (the "id" and "name" fields only). The Book model has all the fields from the Books model and is also joined with the events table (all the colums) and the books table itself to return the similar books.  

## Implementation
### Tools used 
**Describe here which tools, languages and frameworks did you use for the backend of the application.**  
The backend of the project is entirely developed in Javascript and runs with NodeJS.    
As a base for the webserver we used ExpressJS, a NodeJS framework that sits on top of the native `http` module and enriches it with a series of functionality.    
Its main advantage is the possibility to develop the web app using "middlewares", functions in which each request executes in series and that improves code scalability with zero effort.    
Express' main flaw is that it does not natively support promises, it uses callbacks instead, but this problem is easily solved with a simple wrapper function for the middlewares' callbacks (in the project it can be found under `middlewares/asyncMiddlewares.js`).

To provide a working swagger test environment, we used the "swagger-ui-express" module. We just had to provide the YAML file we wrote to it and run the middleware when the requested path matched '/backend/swaggerui', and the module created the entire swagger test environment for us.

We decided to use LESS instead of directly writing CSS (a choice that we found out to be unnecessary since we wrote less than 100 lines of LESS in the end), and it had to be compiled in the backend. We used the 'less-middleware' module which compiles the LESS files just once (on server startup) and the 'css-beautify' module to make it human-readable.

To provide an abstraction layer with the POSTGRES database, we used Sequelize, a complex but powerful libraries that provided us with a model to represent the database (the tables have been created by sequelize itself) and a query engine that allowed us to write 0 queries by hand through the entire project. It has the annoying problem of a badly written documentation, but by mixing it with the questions found on stackOverflow we never got stuck on anything for too long.

A quite simple tool that really came in handy is the dotenv module. It lets you create environment variables to pass to the application so that we could avoid to provide them each time with the command line. It was particularly useful because we had different setups for the project and the way it connected to the database, and we just had to add them them to the config file at the beginning of the project and then we completely forgot about it.  

### Discussion 
Describe here:  

- **How did you make sure your web application adheres to the provided OpenAPI  specification?**
 
    - We defined the OpenApi models and made sure that the responses were consistent with them, returning exactly what we defined
    - We used the well-known JWT token with the Bearer schema to handle authentication which let us use the default security scheme, and implemented it in each request that required the logged in user  
    - Since the OpenApi specification was created to describe REST APIs, we stuck as much as we could to the REST principles.
  
- **Why do you think your web application adheres to common practices to partition the web application (static assets vs. application data)**

    Our application's static assets have no data in them, only information on how to present the data to the user. Our API, instead, provides JSON objects which only contain data and no information on how to display it.  
    Furthermore, we respect widely used standards: we did not invent anything, we used methods and technologies that are highly standardized, like a REST API, and implemented it without diverging too much from their principles.   
    These are the main reasons why we think that our website adheres to common partition practices.  

- **Describe synthetically why and how did you manage session state, what are the state change triggering actions (e.g., POST to login etc..).**  

    We managed the session state using a JWT token, provided to the user when it logs into the application and added to a blacklist that is saved on db when the user logs out.    
    The main advantage of the JWT token is that it requires less accesses to the database than other types of tokens, since it store encrypted users data that are immediately available when it is decrypted on server. The only access it requires is to check whether it is not valid anymore because the user logged out. This, however, means a query on a table that has a single column and is really efficient on databases like Redis.    
    However, we did not need _that_ speed and we mainly chose it because it is an interesting and widely-used technology that was also fun to implement.    
    In out project there are 2 POST calls that create and destroy a session: `/users/login` to create a session, that returns a JWT token with the Bearer schema, and `/users/logout`, that destroys the session and does not return anything.    
    The api calls that need a valid user to work get it from the JWT, so they do not need access to the database    

- **Which technology did you use (relational or a no-SQL database) for managing the data model?**

    We managed the data model with a relational database (Postgres), because we did not need the full speed of a non-relational database and we find the relational model easier to implement and maintain      

## Other information 

### Task assignment

**Describe here how development tasks have been subdivided among members of the group**  

- Cosimo Russo worked on the backend part of the project (80%) and on the swagger file, plus a 20% on the frontend part of the Project  
- Giorgio Ughini worked on the frontend part of the project (80%), and on the backend part of the project (20%).    

### Analysis of existing API 
**Describe here if you have found relevant APIs that have inspired the OpenAPI specification and why (at least two).**  

- We inspired from the [Bokun APIs](https://docs.google.com/document/d/1tkLLqeAvVtRrDpsM1uJZJvhHg3EfsMw1z_SN8Lbe2Rs/pub), that Cosimo Russo used when working on a project for its job. They are well done and documented in a format that is compatible with the OpenApi specification. These APIs are perfectly stateless: you get the access token in some other way and use it in each request. They have a lot of API calls but we only needed the simpler, for example getting one object by ID in a group of object: as in their APIs, we use a call that is always in the format `/resource/{ID}`.  
    We noticed that they use POST requests when they need to apply filters. It is probably because they have really complex filters and a JSON object has a greater expression power that a query string. Since our filters were way easier we decided to keep using GET requests and apply the filters in the query string, to maintain the meaning of the HTTP verbs.  
    We chose because it is used in a real-world production environment.  
- Another API we inspired from is the [Swagger Pet store API](https://petstore.swagger.io/), it is simple, easy to understand and had everything we needed to implement our API. The only things we added to it are component's inheritance and the use of JWT instead of Oauth2 and apiKey used in the pet store. We used the same HTTP verbs they used, apart from PUT since we did not need to modify any resource, because they perfectly respect the meaning of the HTTP verbs.  

### Learning outcome  

**What was the most important thing all the members have learned while developing this part of the project, what questions remained unanswered, how you will use what you've learned in your everyday life?**  

- Cosimo Russo learned about jwt and implementing a login without using passportjs, he wanted to learn more about microservices, maybe by implementing the registration/login as a separate server.  
- Giorgio Ughini learned how to use ExpressJs as a routing engine, how to use async/await instead of promises and how to implement a JWT login process.  
    
[papyro-components]: https://papyro-hypermedia.herokuapp.com/assets/img/Papyro_components.png
