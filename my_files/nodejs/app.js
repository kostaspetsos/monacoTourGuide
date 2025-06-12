require('dotenv').config();


const http = require('http');
const url = require('url');
const MongoClient = require('mongodb').MongoClient;
const querystring = require('querystring');
const cors = require('cors');
const fs = require('fs');
const { ObjectId } = require('mongodb');
const nodemailer = require('nodemailer');

const corsMiddleware = cors();

const uri = process.env.MONGO_URI;

// Connect to MongoDB
MongoClient.connect(uri, { useNewUrlParser: true }, (err, client) => {
    if (err) {
        console.error(`Failed to connect to MongoDB: ${err}`);
        return;
    }

    console.log('Connected to MongoDB successfully');

    // Create an HTTP server
    const server = http.createServer(async (req, res) => {
        // Parse the URL and extract the pathname and query parameters
        const { pathname, query } = url.parse(req.url, true);

        // Enable CORS
        corsMiddleware(req, res, () => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        });

        if (req.method === 'GET') {

            if (req.url.startsWith('/user')) {
                const queryObject = url.parse(req.url, true).query;
                const userID = queryObject.id;
                let requestBody = '';

                req.on('data', (chunk) => {
                    requestBody += chunk;
                });

                req.on('end', () => {
                    // Find the user in MongoDB based on the provided ID
                    const db = client.db();
                    const collection = db.collection('users');
                    collection.findOne({ _id: ObjectId(userID) }, (err, user) => {
                        if (err) {
                            console.error(`Failed to find user in MongoDB: ${err}`);
                            res.statusCode = 500;
                            res.setHeader('Content-Type', 'text/plain');
                            res.write('Internal Server Error');
                            res.end();
                        } else if (!user) {
                            console.log(`User not found for ID ${userID}`);
                            res.statusCode = 404;
                            res.setHeader('Content-Type', 'text/plain');
                            res.write('User not found');
                            res.end();
                        } else {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify(user));
                        }
                    });
                });

            } else if (req.url === '/getUsers') {
                let requestBody = '';

                req.on('data', (chunk) => {
                    requestBody += chunk;
                });

                req.on('end', () => {
                    // Find the user in MongoDB based on the provided ID
                    const db = client.db();
                    const collection = db.collection('users');
                    collection.find({}).toArray((err, docs) => {
                        if (err) {
                            console.log(err);
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: 'An error occurred while fetching users.' }));
                        } else {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(docs));
                        }
                    });
                });
            } else if (req.url.startsWith('/eventReservations/')) {
                const encodedEventName = req.url.split('/')[2];
                const eventName = decodeURIComponent(encodedEventName);
                console.log('Event Name:', eventName);

                const db = client.db();
                const eventsCollection = db.collection('Events');
                const reservations = await eventsCollection.find({ eventName }).toArray();
                console.log('Reservations:', reservations);

                const seatIds = reservations.flatMap(reservation => reservation.tickets.map(ticket => ticket.seatId));
                console.log('Seat IDs:', seatIds);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(seatIds));

                // Used in admin page where the admin can edit the General Information page's first p
            } else if (req.url === '/informationFirstP') {
                try {

                    // Get a reference to the "generalInformation" collection
                    const collection = client.db().collection('generalInformation');

                    // Find a document with the "first_paragraph" field
                    const document = await collection.findOne({ first_paragraph: { $exists: true } });

                    if (!document) {
                        res.writeHead(404, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Document not found' }));
                    } else {
                        const firstParagraphValue = document.first_paragraph;
                        res.writeHead(200, { 'Content-Type': 'text/plain' });
                        res.end(firstParagraphValue);
                    }
                } catch (err) {
                    console.error(err);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Internal Server Error' }));
                }

                // Used in admin page where the admin can edit the General Information page's second p
            } else if (req.url === '/informationSecondP') {
                try {

                    // Get a reference to the "generalInformation" collection
                    const collection = client.db().collection('generalInformation');

                    // Find a document with the "second_paragraph" field
                    const document = await collection.findOne({ second_paragraph: { $exists: true } });

                    if (!document) {
                        res.writeHead(404, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Document not found' }));
                    } else {
                        const secondParagraphValue = document.second_paragraph;
                        res.writeHead(200, { 'Content-Type': 'text/plain' });
                        res.end(secondParagraphValue);
                    }
                } catch (err) {
                    console.error(err);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Internal Server Error' }));
                }
            } else if (req.url.startsWith('/getOldReservations')) {
                console.log('Request received for /getOldReservations');

                // Get the user ID from the query parameters
                const parsedUrl = url.parse(req.url, true);
                const userId = parsedUrl.query.userId;
                console.log('Received userId:', userId);

                const collection = client.db('ergasiaKostas').collection('Events');

                // Query the MongoDB collection for reservations with the given userId
                collection.find({ userId: userId }).toArray((err, reservations) => {
                    if (err) {
                        // Handle the error
                        console.log('Error fetching reservations:', err);
                        res.statusCode = 500;
                        res.end('An error occurred while fetching reservations.');
                    } else {
                        // Return the reservations as JSON response 
                        console.log('Retrieved reservations:', reservations);
                        res.setHeader('Content-Type', 'application/json');
                        res.statusCode = 200;
                        res.end(JSON.stringify(reservations));
                    }
                });
            } else if (req.url === '/getEvents') {

                const db = client.db();
                const collection = client.db().collection('EventsCollection');



                // Fetch all events
                collection.find({}).toArray((err, events) => {
                    if (err) {
                        console.error('Error fetching events from MongoDB:', err);
                        res.statusCode = 500;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ error: 'Failed to fetch events from the database' }));
                        return;
                    }


                    // Send the events as a response
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(events));
                });

            } else if (req.url.startsWith('/getEventById/')) {
                const eventId = req.url.split('/')[2]; // Extract the event ID from the URL

                const db = client.db();
                const collection = db.collection('EventsCollection');

                // Find the event by ID
                collection.findOne({ _id: ObjectId(eventId) }, (err, event) => {
                    if (err) {
                        console.error('Error fetching event from MongoDB:', err);
                        res.statusCode = 500;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ error: 'Failed to fetch event from the database' }));
                        return;
                    }

                    if (!event) {
                        res.statusCode = 404;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ error: 'Event not found' }));
                        return;
                    }

                    // Send the event as a response
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(event));
                });
            } else {
                // Handle other routes or endpoints
                res.statusCode = 404;
                res.setHeader('Content-Type', 'text/plain');
                res.end('Not Found');
            }


            // Handle POST requests
        } else if (req.method === 'POST') {


            if (req.url === '/login') {

                let requestBody = '';
                req.on('data', (chunk) => {
                    requestBody += chunk;
                });

                req.on('end', () => {
                    const { username, password } = JSON.parse(requestBody);
                    // Find the user in MongoDB based on the provided credentials
                    const db = client.db();
                    const collection = db.collection('users');
                    collection.findOne({ username, password }, (err, user) => {
                        if (err) {
                            console.error(`Failed to find user in MongoDB: ${err}`);
                            res.statusCode = 500;
                            res.setHeader('Content-Type', 'text/plain');
                            res.write('Internal Server Error');
                            res.end();
                        } else if (!user) {
                            console.log('Login failed: Invalid username or password');
                            res.statusCode = 401;
                            res.setHeader('Content-Type', 'text/plain');
                            res.write('Unauthorized');
                            res.end();
                        } else {
                            console.log(`Login successful: Welcome, ${user.username}!`);
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify({ id: user._id }));
                        }
                    });
                });

                //User register Page
            } else if (req.url === '/register') {
                let requestBody = '';
                req.on('data', (chunk) => {
                    requestBody += chunk;
                });
                req.on('end', () => {
                    const { firstname, lastname, username, password, email } = JSON.parse(requestBody);
                    // Insert the new user into MongoDB
                    const db = client.db();
                    const collection = db.collection('users');
                    console.log(`Inserting user into MongoDB: ${JSON.stringify({ firstname, lastname, username, password, email })}`);
                    collection.insertOne({ firstname: String(firstname), lastname: String(lastname), username: String(username), password: String(password), email: String(email) }, (err, result) => {
                        if (err) {
                            console.error(`Failed to insert user into MongoDB: ${err}`);
                            res.statusCode = 500;
                            res.setHeader('Content-Type', 'text/plain');
                            res.write('Internal Server Error');
                            res.end();
                        } else {
                            console.log(`User registered: ${username}`);
                            res.statusCode = 201;
                            res.setHeader('Content-Type', 'application/json');
                            res.write(JSON.stringify({ message: 'Registration successful' }));
                            res.end();
                        }
                    });
                });

                //User Account Page Save
            } else if (req.url === '/addUserInfo') {
                let requestBody = '';
                req.on('data', (chunk) => {
                    requestBody += chunk;
                });
                req.on('end', () => {
                    const { _id, firstname, lastname, username, password, email } = JSON.parse(requestBody);
                    const db = client.db();
                    const collection = db.collection('users');
                    collection.updateOne(
                        { _id: ObjectId(_id) },
                        { $set: { firstname, lastname, username, password, email } },
                        (err, result) => {
                            if (err) {
                                console.error(`Failed to update user in MongoDB: ${err}`);
                                res.statusCode = 500;
                                res.setHeader('Content-Type', 'text/plain');
                                res.write('Internal Server Error');
                                res.end();
                            } else {
                                console.log(`User ${_id} updated successfully`);
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'text/plain');
                                res.write('User updated successfully');
                                res.end();
                            }
                        }
                    );
                });

                //Admin login page
            } else if (req.url === '/admin_Login') {

                let requestBody = '';
                req.on('data', (chunk) => {
                    requestBody += chunk;
                });

                req.on('end', () => {
                    const { username, password } = JSON.parse(requestBody);
                    // Find the user in MongoDB based on the provided credentials
                    const db = client.db();
                    const collection = db.collection('Admins');
                    collection.findOne({ username, password }, (err, user) => {
                        if (err) {
                            console.error(`Failed to find user in MongoDB: ${err}`);
                            res.statusCode = 500;
                            res.setHeader('Content-Type', 'text/plain');
                            res.write('Internal Server Error');
                            res.end();
                        } else if (!user) {
                            console.log('Login failed: Invalid username or password');
                            res.statusCode = 401;
                            res.setHeader('Content-Type', 'text/plain');
                            res.write('Unauthorized');
                            res.end();
                        } else {
                            console.log(`Login successful: Welcome, ${user.username}!`);
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify({ id: user._id }));
                        }
                    });
                });

                //The admin updates the paragraph 2 on the information page
            } else if (req.url === '/updateP1') {
                let body = '';

                // Accumulate the request body data
                req.on('data', chunk => {
                    body += chunk.toString();
                });

                // Process the request body
                req.on('end', async () => {
                    // Parse the request body
                    const parsedBody = JSON.parse(body);

                    // Extract the new text for the first_paragraph field
                    const updatedFirstParagraph = parsedBody.first_paragraph;

                    console.log('Received update request. New text:', updatedFirstParagraph);



                    try {

                        // Get a reference to the "generalInformation" collection
                        const collection = client.db().collection('generalInformation');

                        // Find the document that contains the first_paragraph field and update its value
                        const result = await collection.updateOne(
                            { first_paragraph: { $exists: true } },
                            { $set: { first_paragraph: updatedFirstParagraph } }
                        );

                        if (result.modifiedCount > 0) {
                            console.log('Update successful');
                            res.writeHead(200, { 'Content-Type': 'text/plain' });
                            res.end(`Updated first paragraph: ${updatedFirstParagraph}`);
                        } else {
                            console.log('Document not found');
                            res.writeHead(404, { 'Content-Type': 'text/plain' });
                            res.end('Document not found');
                        }
                    } catch (error) {
                        console.error('Error:', error);
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Internal Server Error');
                    }
                });

                //The admin updates the paragraph 2 on the information page
            } else if (req.url === '/updateP2') {
                let body = '';

                // Accumulate the request body data
                req.on('data', chunk => {
                    body += chunk.toString();
                });

                // Process the request body
                req.on('end', async () => {
                    // Parse the request body
                    const parsedBody = JSON.parse(body);

                    // Extract the new text for the second_paragraph field
                    const updatedSecondParagraph = parsedBody.second_paragraph;

                    console.log('Received update request. New text:', updatedSecondParagraph);



                    try {

                        // Get a reference to the "generalInformation" collection
                        const collection = client.db().collection('generalInformation');

                        // Find the document that contains the first_paragraph field and update its value
                        const result = await collection.updateOne(
                            { second_paragraph: { $exists: true } },
                            { $set: { second_paragraph: updatedSecondParagraph } }
                        );

                        if (result.modifiedCount > 0) {
                            console.log('Update successful');
                            res.writeHead(200, { 'Content-Type': 'text/plain' });
                            res.end(`Updated second paragraph: ${updatedSecondParagraph}`);
                        } else {
                            console.log('Document not found');
                            res.writeHead(404, { 'Content-Type': 'text/plain' });
                            res.end('Document not found');
                        }
                    } catch (error) {
                        console.error('Error:', error);
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Internal Server Error');
                    }
                });

            } else if (req.url === '/eventReservation') {
                let body = '';
                req.on('data', chunk => {
                    body += chunk.toString();
                });
                req.on('end', async () => {
                    const data = JSON.parse(body);
                    const userId = data.userId;
                    const eventName = data.eventName;
                    const ticketPrice = data.ticketPrice;
                    const tickets = [];
                    for (let i = 1; i <= 4; i++) {
                        if (
                            data[`ticket${i}_firstName`] &&
                            data[`ticket${i}_lastName`] &&
                            data[`ticket${i}_seatId`]
                        ) {
                            tickets.push({
                                firstName: data[`ticket${i}_firstName`],
                                lastName: data[`ticket${i}_lastName`],
                                seatId: data[`ticket${i}_seatId`],
                            });
                        }
                    }
                    const email = data.email;
                    const cardNumber = data.cardNumber;

                    // Save the reservation to the Events collection
                    const eventReservation = {
                        userId: userId, // Include the userId in the event reservation
                        eventName,
                        ticketPrice,
                        tickets,
                        email,
                        cardNumber
                    };

                    const db = client.db();
                    const eventsCollection = await db.collection('Events');
                    const result = await eventsCollection.insertOne(eventReservation);
                    console.log(result);

                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end('Reservation successful');
                });

                //This Sends an email to the user that made the reservation with all the tickets and stuff
            } else if (req.url === '/email') {
                let body = '';

                req.on('data', chunk => {
                    body += chunk.toString();
                });

                req.on('end', () => {
                    // Parse the request body
                    const data = JSON.parse(body);
                    // Extract the necessary data from the request
                    const eventName = data.eventName;
                    const email = data.email;
                    const additionalText = data.additionalText;

                    console.log(email);

                    // Save the reservation to the database or perform other actions as needed

                    // Send the email
                    sendEmail(email, 'Reservation Confirmation', `Thank you for your reservation for the event "${eventName}"`, additionalText)
                        .then(() => {
                            res.writeHead(200, { 'Content-Type': 'text/plain' });
                            res.end('Reservation successful. Email sent.');
                        })
                        .catch(error => {
                            console.log('Error sending email:', error);
                            res.writeHead(500, { 'Content-Type': 'text/plain' });
                            res.end('Error occurred while sending email.');
                        });
                });

                //The admin adds an Event
            } else if (req.url === '/addEvent') {
                let body = '';

                req.on('data', chunk => {
                    body += chunk.toString();
                });

                req.on('end', () => {
                    // Parse the request body
                    const data = JSON.parse(body);

                    // Extract the necessary data from the request
                    const date = data.date;
                    const photo1 = data.photo1;
                    const photo2 = data.photo2;
                    const title = data.title;
                    const info = data.info;

                    // Process the extracted data
                    // Example: Insert the event into the database
                    const eventData = {
                        date: date,
                        photo1: photo1,
                        photo2: photo2,
                        title: title,
                        info: info
                    };

                    const db = client.db();
                    const collection = db.collection('EventsCollection');
                    collection.insertOne(eventData, (error, result) => {
                        if (error) {
                            console.error('Error inserting event:', error);
                        } else {
                            console.log('Event inserted successfully');
                            // Send response to the client
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify({ message: 'Event added successfully' }));
                        }
                    });
                });
            }
            else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Not found');
            }


            //PUT    
        } else if (req.method === 'PUT') {

            if (req.url === '/editUser') {
                let requestBody = '';
                req.on('data', (chunk) => {
                    requestBody += chunk.toString();
                });

                // When the request body is fully read
                req.on('end', () => {
                    const bodyData = JSON.parse(requestBody);

                    const db = client.db();
                    const users = db.collection('users');
                    // find user by id
                    const userId = new ObjectId(bodyData.id);
                    const filter = { _id: userId };
                    const update = {
                        $set: {
                            firstname: bodyData.editedUser.firstname,
                            lastname: bodyData.editedUser.lastname,
                            email: bodyData.editedUser.email
                        }
                    };
                    users.updateOne(filter, update, (err, result) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ success: false, message: 'An error occurred while updating user' }));
                        } else {
                            if (result.matchedCount === 0) {
                                res.writeHead(404, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ success: false, message: 'User not found' }));
                            } else {
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ success: true }));
                            }
                        }
                    });
                });
            } else if (req.url.startsWith('/modifyEvent/')) {
                const eventId = req.url.split('/')[2];
                console.log(eventId);

                let body = '';
                req.on('data', chunk => {
                    body += chunk.toString();
                });

                req.on('end', () => {
                    // Parse the request body
                    const data = JSON.parse(body);

                    // Extract the necessary data from the request
                    const updatedEventData = {
                        date: data.date,
                        photo1: data.photo1,
                        photo2: data.photo2,
                        title: data.title,
                        info: data.info,
                        disableEvent: data.disableEvent // Include the checkbox value in the updatedEventData object
                    };

                    const db = client.db();
                    const collection = db.collection('EventsCollection');
                    collection.updateOne(
                        { _id: ObjectId(eventId) },
                        { $set: updatedEventData },
                        (error, result) => {
                            if (error) {
                                console.error('Error updating event:', error);
                                // Send an error response to the client
                                res.statusCode = 500;
                                res.setHeader('Content-Type', 'application/json');
                                res.end(JSON.stringify({ message: 'Failed to update event' }));
                            } else {
                                console.log('Event updated successfully');
                                // Send a success response to the client
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.end(JSON.stringify({ message: 'Event updated successfully' }));
                            }
                        }
                    );
                });
            }


        } else if (req.method === 'DELETE') {
            console.log('DELETE')

            if (req.url.startsWith('/deleteEvent')) {
                const eventId = req.url.split('/').pop();
                console.log(eventId);

                const db = client.db('ergasiaKostas');
                const collection = db.collection('EventsCollection');
                collection.deleteOne(
                    { _id: ObjectId(eventId) },
                    (error, result) => {
                        if (error) {
                            console.error('Error deleting event:', error);
                            // Send an error response to the client
                            res.statusCode = 500;
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify({ message: 'Failed to delete event' }));
                        } else if (result.deletedCount === 1) {
                            console.log('Event deleted successfully');
                            // Send a success response to the client
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify({ message: 'Event deleted successfully' }));
                        } else {
                            console.log('Event not found');
                            // Send a not found response to the client
                            res.statusCode = 404;
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify({ message: 'Event not found' }));
                        }
                    }
                );
            }


        }
    });

    server.on('error', (err) => {
        console.error(`Server error: ${err.message}`);
    });

    const PORT = 3000;
    server.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
});


// Function to send an email
async function sendEmail(toEmail, subject, text, additionalText) {
    // Create a transporter using your hotmail account
    const transporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    // Define the email options
    const mailOptions = {
        from: 'monacoE18134@outlook.com.gr',
        to: toEmail,
        subject: subject,
        text: `${text}\n\n${additionalText}`, // Combine the main text and additional text
    };

    // Send the email using the transporter and mailOptions
    return transporter.sendMail(mailOptions);
}