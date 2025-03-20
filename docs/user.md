
=== User Route ===
POST	= http://localhost/master_api/public/api/admin/{{app_token}}/user

GET 	= http://localhost/master_api/public/api/admin/{{app_token}}/user?limit_per_page=1&role_id=2&page=2&data=all
GET 	= http://localhost/master_api/public/api/admin/{{app_token}}/user/5/edit
GET 	= http://localhost/master_api/public/api/admin/{{app_token}}/user/5

put   = http://localhost/master_api/public/api/admin/{{app_token}}/user/5
patch = http://localhost/master_api/public/api/admin/{{app_token}}/user/5


=== User Query Parameters ===
limit_per_page = 1 // Default 15
role_id = 1
page = 1 // number of page for pagination
extendProps[check_02] = hello_2
data = all


user register
http://localhost/master_api/public/api/register

HTTP_header:{
App-Master-Key: {{app_token}}
}


body: {
    name // required,
    email // required,
    password // required,
    password_confirmation,
    country_id,
}

{
  "access_token": "13|oPqOLZUsT1mQKRkquOPvNl3fpeTHmjlwNruQyU5q",
  "token_type": "Bearer",
  "user_data": {
    "name": "shohagh",
    "email": "majadul.dev@gmail.com",
    "country_id": "1",
    "status": "1",
    "unique_id": 1684122382,
    "otp": 1684122382,
    "extend_props": null,
    "updated_at": "2023-05-15T03:46:22.000000Z",
    "created_at": "2023-05-15T03:46:22.000000Z",
    "id": 14
  }
}



password forget
post:
http://localhost/master_api/public/api/forgetPassword
HTTP_header:{
App-Master-Key: {{app_token}}
}
body: {
  email
}

output

{
  "message": "We send you a verifaction code in this mail majadul.dev@gmail.com please check",
  "send": "success",
  "user_data": {
    "id": 14,
    "role_id": 2,
    "country_id": 1,
    "name": "shohagh",
    "email": "majadul.dev@gmail.com",
    "extend_props": null,
    "email_verified_at": null,
    "unique_id": "1684122382",
    "otp": 439523,
    "created_by": null,
    "description": null,
    "status": 1,
    "updated_by": null,
    "created_at": "2023-05-14T21:46:22.000000Z",
    "updated_at": "2023-05-17T02:32:34.000000Z",
    "deleted_at": null
  }
}


password reset
post:
http://localhost/master_api/public/api/resetPassword

HTTP_header:{
App-Master-Key: {{app_token}}
}

body: {
  password,
  password_confirmation,
  otp
}

output
{
  "message": "Password Reset",
  "send": "success"
}

   