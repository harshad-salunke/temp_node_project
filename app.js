const express = require('express');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs,addDoc } = require('firebase/firestore');

const app = express();
const port = 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));


const firebaseConfig = {
    apiKey: "AIzaSyBuNZImfsQd2rzMswjANEDrvcWcg24Dlqc",
    authDomain: "fir-d8d1e.firebaseapp.com",
    projectId: "fir-d8d1e",
    storageBucket: "fir-d8d1e.appspot.com",
    messagingSenderId: "1008110848008",
    appId: "1:1008110848008:web:39393b063a0d7c0967a9bd",
    measurementId: "G-6C5P5FYMBJ"
  };

const firebaseApp = initializeApp(firebaseConfig);
console.log('Firebase initialized');

const db = getFirestore(firebaseApp);


const users = [];



//home page route
app.get('/', async (req, res) => {

        res.render('home', {users: users });
   
});

//retrive user route
app.get('/retrive_user', async (req, res) => {

    res.render('retrieve_user', {users: users });

});

//add user route page
app.get('/add_user', (req, res) => {
    res.render('add_user');
});


// Route to handle add user data to Firestore
app.post('/add', async (req, res) => {
    try {
        const userData = {
            name: req.body.name,
            in: req.body.in,
            rollno: req.body.rollno,
            company: req.body.company,
            school: req.body.school
        };

        console.log(userData);
        // Add the user data to Firestore
        const docRef = await addDoc(collection(db, 'user'), userData);
        users.push(userData);
        console.log('Document written with ID: ', docRef.id);
        res.redirect('/retrive_user'); // Redirect to home page or any other page
    } catch (error) {
        console.error('Error adding document: ', error);
        res.status(500).send('Error adding user data');
    }
});


//retrive data from firebase
async function retrieveData() {
    try {
        const querySnapshot = await getDocs(collection(db, 'user'));
        querySnapshot.forEach((doc) => {
            console.log(doc.data());
            //get each entry from firebase doc
            const firebaseuser=doc.data();
            users.push(firebaseuser);
            const rollno=firebaseuser.rollno;
            console.log(rollno);
            
           
        });
    } catch (error) {
        console.error("Error retrieving data:", error);
    }
}
retrieveData();


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
