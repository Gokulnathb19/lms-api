# Loan Management System API

This API is developed using Node.js and uses MongoDB as DB.

## API Docker Image

This API's Docker image can be pull from website [LMS-API](https://hub.docker.com/r/gokulnathb/lms-api) or by using the command below

```bash
docker pull gokulnathb/lms-api
```

To run the image, run the command below

```bash
docker run -p 5000:5000 -d gokulnathb/lms-api
```

## Schema Design

### Diagram

![Schema Diagram](./diagram.png?raw=true "Schema Diagram")

### json View

```json
{
	"customers": {
		"_id": {
			"primaryKey": true,
			"type": "Object",
			"required": true
		},
		"address": {
			"type": "Object",
			"structure": {
				"street": {
					"type": "Object",
					"structure": {
						"no": {
							"type": "number",
							"required": true
						},
						"name": {
							"type": "string",
							"required": true
						},
						"line1": {
							"type": "string",
							"required": true
						}
					},
					"required": true
				},
				"district": {
					"type": "string",
					"required": true
				},
				"state": {
					"type": "string",
					"required": true
				},
				"country": {
					"type": "string",
					"required": true
				},
				"pincode": {
					"type": "number",
					"required": true
				}
			},
			"required": true
		},
		"documents": {
			"type": "Array",
			"required": true
		},
		"guaranteedBy": {
			"type": "Array",
			"required": true
		},
		"academics": {
			"type": "Array",
			"required": true
		},
		"property": {
			"type": "string",
			"required": true
		},
		"familyIncome": {
			"type": "number",
			"required": true
		},
		"customerId": {
			"foreignKey": true,
			"references": "users",
			"type": "Object",
			"required": true
		},
		"__v": {
			"type": "number",
			"required": true
		}
	},
	"loans": {
		"_id": {
			"primaryKey": true,
			"type": "Object",
			"required": true
		},
		"details": {
			"type": "Object",
			"structure": {
				"tentureSelected": {
					"type": "number",
					"required": true
				},
				"interest": {
					"type": "number",
					"required": true
				},
				"status": {
					"type": "string",
					"required": true
				},
				"duration": {
					"type": "number",
					"required": true
				},
				"reducingIntrestRate": {
					"type": "boolean",
					"required": true
				},
				"description": {
					"type": "string",
					"required": true
				},
				"loanType": {
					"type": "string",
					"required": true
				}
			},
			"required": true
		},
		"customerId": {
			"foreignKey": true,
			"references": "users",
			"type": "Object",
			"required": true
		},
		"createdOn": {
			"type": "Date",
			"required": true
		},
		"createdBy": {
			"foreignKey": true,
			"references": "users",
			"type": "Object",
			"required": true
		},
		"history": {
			"type": "Array",
			"required": true
		},
		"__v": {
			"type": "number",
			"required": true
		},
		"lastUpdatedBy": {
			"foreignKey": true,
			"references": "users",
			"type": "Object",
			"required": true
		},
		"lastUpdatedOn": {
			"type": "Date",
			"required": true
		}
	},
	"files": {},
	"users": {
		"_id": {
			"primaryKey": true,
			"type": "Object",
			"required": true
		},
		"name": {
			"type": "string",
			"required": true
		},
		"email": {
			"key": true,
			"type": "string",
			"required": true
		},
		"mobileNo": {
			"type": "string",
			"required": true
		},
		"password": {
			"type": "string",
			"required": true
		},
		"role": {
			"type": "string",
			"required": true
		},
		"createdAt": {
			"type": "Date",
			"required": true
		},
		"__v": {
			"type": "number",
			"required": true
		}
	}
}
```

## Security

### Authentication

* All the API requests (other than `/register` and `/login` endpoints) allow only authenticated users to access data

* Authentication is done based on Auth token.
After successful login, the user will be issued with token which must be send along with the header to access other endpoints. User with no token when access api endpoints it will return status `401 Unauthorized`

### Authorization

* To access api endpoints, the user must be authenticated and authorized to access that endpoint

* The token send in the header will be decoded to verify user access and session expiry. If the user has access to endpoint then it will return response else will return status `403 Forbidden`

### Passwords

Passwords are hashed using `bcrypt`

### Roles

| User Roles |
| --- |
| customer |
| agent |
| admin |

* Both `agent` and `admin` can able to create new agent and customer

* Only `admin` can create new admins

### Loan

| Loan states |
| --- |
| NEW |
| REJECTED |
| APPROVED |

* Only `admin` can approve / reject the loan
* Only `agent` can create/edit loan details on behalf of the `customer`
* `customer` can only able to view their loan which they have applied

### Filters

* All users has an option to filter the loans based on parameters.
* Filter parameters are: 
  * CreatedOn
    * Users can either specify single date or start and end date to filter. use date format `DD/MM/YYYY` (you can use these [/, ., -, etc] between day month and year)
    * Eg1: `/loans?createdOn=28.09.2020`
    * Eg2: `/loans?createdOn=20.08.2019 AND 28.09.2020`
  * UpdatedOn
    * Users can either specify single date or start and end date to filter. use date format `DD/MM/YYYY` (you can use these [/, ., -, etc] between day month and year)
    * Eg1: `/loans?updatedOn=28.09.2020`
    * Eg2: `/loans?updatedOn=20.08.2019 AND 28.09.2020`
  * status(state)
    * Eg: `/loans?status=NEW`

## Testcases

### Predefined data for login

* `admin`
  * Email - gk_ad@gmail.com
  * password - 12345678

* `agent`
  * Email - gk_ag@gmail.com
  * password - 12345678

* `cutomer`
  * Email - gk@gmail.com
  * password - 12345678

### Template Replacement

In testcases, 

* If the header has authorization, replace `authtoken` with your newly generated token

    **Note**: You'll get token after successful login.

* If the endpoint path or body has `[customerId] / [userId] / [loanId]` replace it with corresponding customer / user / loan id

* If the endpoint query string contains `[dateFormat]`, replace it with expected date with format `DD/MM/YYYY`

### Tescases

1. Create new user (admin creates new admin)
    ```bash
    curl -H "Content-Type: application/json" -H "authorization: authtoken" -X POST -d '{"name": "GK","email": "gk3@gmail.com","password":"12345678", "mobileNo": "1234567893","role": "admin"}' http://localhost:5000/users/
    ```

2. Create new user (admin creates new agent)
    ```bash
    curl -H "Content-Type: application/json" -H "authorization: authtoken" -X POST -d '{"name": "GK","email": "gk3@gmail.com","password":"12345678", "mobileNo": "1234567893","role": "agent"}' http://localhost:5000/users/
    ```

3. Create new user (admin creates new customer)
    ```bash
    curl -H "Content-Type: application/json" -H "authorization: authtoken" -X POST -d '{"name": "GK","email": "gk3@gmail.com","password":"12345678", "mobileNo": "1234567893","role": "customer"}' http://localhost:5000/users/
    ```

4. Create new user (agent creates new admin)
    ```bash
    curl -H "Content-Type: application/json" -H "authorization: authtoken" -X POST -d '{"name": "GK","email": "gk3@gmail.com","password":"12345678", "mobileNo": "1234567893","role": "customer"}' http://localhost:5000/users/
    ```

5. Create new user (agent creates new agent)
    ```bash
    curl -H "Content-Type: application/json" -H "authorization: authtoken" -X POST -d '{"name": "GK","email": "gk3@gmail.com","password":"12345678", "mobileNo": "1234567893","role": "customer"}' http://localhost:5000/users/
    ```

6. Create new user (agent creates new customer)
    ```bash
    curl -H "Content-Type: application/json" -H "authorization: authtoken" -X POST -d '{"name": "GK","email": "gk3@gmail.com","password":"12345678", "mobileNo": "1234567893","role": "customer"}' http://localhost:5000/users/
    ```

7. Create new user (customer creates for any role)
    ```bash
    curl -H "Content-Type: application/json" -H "authorization: authtoken" -X POST -d '{"name": "GK","email": "gk3@gmail.com","password":"12345678", "mobileNo": "1234567893","role": "customer"}' http://localhost:5000/users/
    ```

8. Login
    ```bash
    curl -H "Content-Type: application/json" -X POST -d '{"email": "gk3@gmail.com","password":"12345678"}' http://localhost:5000/login/
    ```

9. Get All users (agent & admin)
    ```bash
    curl -H "Content-Type: application/json" -H "authorization: authtoken" -X GET http://localhost:5000/users/
    ```

10. Get All users (customer)
    ```bash
    curl -H "Content-Type: application/json" -H "authorization: authtoken" -X GET http://localhost:5000/users/
    ```

11. Get specific user
    ```bash
    curl -H "Content-Type: application/json" -H "authorization: authtoken" -X GET http://localhost:5000/users/[userId]
    ```

12. Edit specific user
    ```bash
    curl -H "Content-Type: application/json" -H "authorization: authtoken" -X PUT -d '{"name": "GK"}' http://localhost:5000/users/[userId]
    ```

13. Add Cutomer Details
    ```bash
    curl -H "Content-Type: application/json" -H "authorization: authtoken" -X POST -d '{"address": {"street": {"no": 6,"name": "KK Nagar","line1": "MPM"},"district": "Erode","state": "TN","country": "IN","pincode": 638001},"academics": [{"school": {"name": "KK","location": "Erode"},"course": {"name": "CSE","type": "B.Tech"},"percentge": 87},{"school": {"name": "JJ","location": "Erode"},"course": {"name": "CS","type": "HSE"},"percentge": 94}],"familyIncome": 60000,"documents": [],"guaranteedBy": ["GK1", "GK2"]}' http://localhost:5000/users/addDetails/[userId]
    ```

14. Edit Cutomer Details
    ```bash
    curl -H "Content-Type: application/json" -H "authorization: authtoken" -X PUT -d '{"address": {"street": {"no": 6,"name": "KK Nagar","line1": "MPM"},"district": "Erode","state": "TN","country": "IN","pincode": 638001},"academics": [{"school": {"name": "KK","location": "Erode"},"course": {"name": "CSE","type": "B.Tech"},"percentge": 87},{"school": {"name": "JJ","location": "Erode"},"course": {"name": "CS","type": "HSE"},"percentge": 94}],"familyIncome": 60000,"documents": [],"guaranteedBy": ["GK1", "GK2"]}' http://localhost:5000/users/updateDetails/[userId]
    ```

15. Create new loan (admin creates loan)
    ```bash
    curl -H "Content-Type: application/json" -H "authorization: authtoken" -X POST -d '{"name": "GK","email": "gk3@gmail.com","password":"12345678", "mobileNo": "1234567893","role": "customer"}' http://localhost:5000/loans/
    ```

16. Create new loan (agent creates loan)
    ```bash
    curl -H "Content-Type: application/json" -H "authorization: authtoken" -X POST -d '{"name": "GK","email": "gk3@gmail.com","password":"12345678", "mobileNo": "1234567893","role": "customer"}' http://localhost:5000/loans/
    ```

17. Create new loan (customer creates loan)
    ```bash
    curl -H "Content-Type: application/json" -H "authorization: authtoken" -X POST -d '{"name": "GK","email": "gk3@gmail.com","password":"12345678", "mobileNo": "1234567893","role": "customer"}' http://localhost:5000/loans/
    ```

18. Edit specific loan
    ```bash
    curl -H "Content-Type: application/json" -H "authorization: authtoken" -X PUT -d '{"interest": "15","status": "NEW"}' http://localhost:5000/loans/[loanId]
    ```

19. Update loan status (Either APPROVED or REJECTED by admin)
    ```bash
    curl -H "Content-Type: application/json" -H "authorization: authtoken" -X PUT -d '{"interest": "15","status": "NEW"}' http://localhost:5000/loans/updateStatus/[loanId]
    ```

20. Update loan status (Either APPROVED or REJECTED by agent)
    ```bash
    curl -H "Content-Type: application/json" -H "authorization: authtoken" -X PUT -d '{"interest": "15","status": "NEW"}' http://localhost:5000/loans/updateStatus/[loanId]
    ```

21. Edit specific loan (when status is in APPROVED state)
    ```bash
    curl -H "Content-Type: application/json" -H "authorization: authtoken" -X PUT -d '{"interest": "15","status": "NEW"}' http://localhost:5000/loans/[loanId]
    ```

22. Edit specific loan (when status is in APPROVED state)
    ```bash
    curl -H "Content-Type: application/json" -H "authorization: authtoken" -X PUT -d '{"interest": "15","status": "NEW"}' http://localhost:5000/loans/[loanId]
    ```

23. View Loans (customer view)
    ```bash
    curl -H "Content-Type: application/json" -H "authorization: authtoken" -X GET http://localhost:5000/loans/
    ```

24. View Loans (agent & admin view)
    ```bash
    curl -H "Content-Type: application/json" -H "authorization: authtoken" -X GET http://localhost:5000/loans/
    ```

25. View Loans (with status filter)
    ```bash
    curl -H "Content-Type: application/json" -H "authorization: authtoken" -X GET http://localhost:5000/loans/
    ```

26. View Loans (with createdOn specific date filter)
    ```bash
    curl -H "Content-Type: application/json" -H "authorization: authtoken" -X GET http://localhost:5000/loans/
    ```

27. View Loans (with createdOn start and end date filter)
    ```bash
    curl -H "Content-Type: application/json" -H "authorization: authtoken" -X GET http://localhost:5000/loans/
    ```

28. View Loans (with updatedOn specific date filter)
    ```bash
    curl -H "Content-Type: application/json" -H "authorization: authtoken" -X GET http://localhost:5000/loans?updatedOn="[dateFormat] AND [dateFormat]"
    ```

29. View Loans (with updatedOn start and end date filter)
    ```bash
    curl -H "Content-Type: application/json" -H "authorization: authtoken" -X GET http://localhost:5000/loans?updatedOn="[dateFormat] AND [dateFormat]"
    ```

30. View Loans (with multiple filter)
    ```bash
    curl -H "Content-Type: application/json" -H "authorization: authtoken" -X GET http://localhost:5000/loans?updatedOn="[dateFormat] AND [dateFormat]"&status=NEW
    ```