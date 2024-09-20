# Betika Aviator scrapper
```
Author: @sammykinuthia
Date: 2024-09-04
Version: 1.0
```
# Description: 
This is realtime aviator fly aways values
This script scraps the Betika Aviator game results from the official website. By the use of Puppeteer.
The results are stored in the postgres Database
 
 ![](/aviator-demo.gif)





# Installation

- make sure to redirect connection to the socket in nginx to `/socket.io`
- Use postgres for database
    - create the database
    - create the table
    - create the trigger function
    -(all from the `.sql` file)



