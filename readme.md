<h1>Steps to run the Application</h1>
<br><br>
Run the servers -> <br>
1) node BackEnd/server.js (Default port used is 5500, Can be changed from config - BackEnd/config/port.js) <br>
2) Login is implemented using ethereal mail<br>
      User - jeff.ferry@ethereal.email<br>
      Password - 7zzVpERUdxPrdB4eBU<br>
    Above credentials might be expired, need to create new from ethereal mail and set them up in BackEnd/config/mail.js<br><br>

    Or else an endpoint is exposed to fetch the otp details -> <br>
    GET http://localhost:5500/user/:userId<br>
