const express = require('express');
const admin = require('firebase-admin');
const { BambuClient, IssueWallet, UpdateWallet, GetWallet } = require('@bambumeta/sdk');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const axios = require('axios');


require('dotenv').config();


// Initialize Bambu Client
const bambuClient = new BambuClient(
  process.env.TENANT_ID,
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.DOMAIN,
  process.env.BRANDID
);

if (!process.env.TENANT_ID || !process.env.CLIENT_ID || !process.env.CLIENT_SECRET || !process.env.DOMAIN || !process.env.BRANDID) {
  console.error('BambuClient initialization error: Ensure all environment variables are set.');
  process.exit(1);
}

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected successfully to MongoDB Atlas'))
  .catch(err => console.error('Error connecting to MongoDB Atlas:', err));
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
    socketTimeoutMS: 30000,
  });
// Connect to MongoDB Atlas when the server starts
async function connectMongoDB() {
  try {
    await client.connect();
    console.log('Connected successfully to MongoDB Atlas');
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error);
  }
}
connectMongoDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/build')));

// API Endpoints
app.post('/issue-wallet', async (req, res) => {
  console.log("Request body:", req.body);
  const { firstName, lastName, email, company } = req.body.person;
  const templateTierId = req.body.templateTierId; 
  const brand = req.body.brand; 
  const templateId = req.body.templateId 
  const passdata = req.body.passdata
  const programid = req.body.programid
  // Initialize Bambu Client
const bambuClient = new BambuClient(
  process.env.TENANT_ID,
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.DOMAIN,
  brand
);
  try {
      const issueWalletData = {
        brandId: brand,
        programid: programid,
        templateId:templateId,
        templateTierId: templateTierId,
        programId: programid,
        person: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          company: company
        },
        passdata: passdata,
      };
      console.log("Sending to Bambu:", issueWalletData);
      const issueWallet = new IssueWallet(issueWalletData);
      const walletPass = await bambuClient.execute(issueWallet);

      // Ensure you capture the correct passId from the response
      const passId = walletPass.id; // Use the 'id' from walletPass as 'passId'
      console.log("WalletPass response:", walletPass);
      if (walletPass && walletPass.id && walletPass.downloadUrl) {
      // Send the response back with the download URL and referral URL
      res.json({
        downloadUrl: walletPass.downloadUrl,
        passId: walletPass.id // This assumes the ID is the passId
      });
    } else {
      // Handle the case where the passId or downloadUrl is missing
      console.error('Missing passId or downloadUrl in the response');
      res.status(500).send('Error retrieving wallet pass details');
    }
  } catch (error) {
    console.error('Error in /issue-wallet:', error);
    res.status(500).send('Error issuing wallet');
  }
});


app.post('/increment-referral', async (req, res) => {
  try {
    const { passId } = req.body;
    console.log('Received passId:', passId);

    // Convert passId to String to match schema
    const passIdString = String(passId);

    // Find the ambassador with the exact passId and increment the referral count
    const updatedAmbassador = await Ambassador.findOneAndUpdate(
      { passId: passIdString },
      { $inc: { referrals: 1 } },
      { new: true, upsert: false }
    );

    if (!updatedAmbassador) {
      return res.status(404).send('Ambassador not found');
    }

    console.log(`Referral count before update: ${updatedAmbassador.referrals}`);
    console.log('Current message: "You have a new friend!"');

    // Prepare the data for UpdateWallet
    const updateData = {
      brandId: 9,
      programId: 570,
      templateId: 400,
      passdata: {
        metaData: {
          referrals: updatedAmbassador.referrals.toString() // Convert referrals to string
        }
      },
      currentMessage: "You have a new friend!"
    };

    console.log(`Setting referral count to: ${updateData.passdata.metaData.referrals}`);

    // Call UpdateWallet from BambuMeta SDK
    const updateWallet = new UpdateWallet({ ...updateData, passId: passIdString });

    try {
      // Execute the update and log the response
      const updateResponse = await bambuClient.execute(updateWallet);
      console.log('UpdateWallet response:', updateResponse);
      console.log('Pass updated with new referral count');
    } catch (sdkError) {
      console.error('Error updating wallet pass:', sdkError);
    }

    res.json({
      message: 'Referral incremented and pass updated',
      ambassador: updatedAmbassador
    });
  } catch (error) {
    console.error('Error incrementing referral:', error);
    res.status(500).send('Error incrementing referral');
  }
});

app.post('/card-data', async (req, res) => {
  console.log("Received cardData in /card-data:", req.body); 
  try {
    // Destructuring the request body
    const { firstName, lastName, email, college, referrals, passId } = req.body;
    console.log("Extracted passId from cardData:", passId); 

    // Connecting to MongoDB
    await client.connect();
    const database = client.db('illicitelixirs');
    const collection = database.collection('ambassadors');

    // Check if a record with the same email already exists
    const existingRecord = await collection.findOne({ email: email });

    if (existingRecord) {
      // Check for any differences between existing data and new data
      const isDifferent = firstName !== existingRecord.firstName ||
                          lastName !== existingRecord.lastName ||
                          college !== existingRecord.college ||
                          referrals !== existingRecord.referrals ||
                          passId !== existingRecord.passId;

      if (isDifferent) {
        // Update the record if there are differences
        await collection.updateOne(
          { email: email },
          { $set: { firstName, lastName, college, referrals, passId } }
        );
        res.status(200).json({ message: "Record updated successfully" });
      } else {
        // If no differences, return a message
        res.status(200).json({ message: "No changes were made, record already exists" });
      }
    } else {
      // If no existing record, create a new one
      await collection.insertOne({ firstName, lastName, email, college, referrals, passId });
      res.status(200).json({ message: "New record created successfully" });
    }
  } catch (error) {
    console.error('Error in /card-data:', error);
    res.status(500).send('An error occurred while processing the request.');
  } finally {
    // Close the MongoDB client
    await client.close();
  }
});


app.get('/referral/:email', async (req, res) => {
  const email = req.params.email; // Assuming email is passed as a URL parameter

  try {
    // Connect to MongoDB and fetch the ambassador record by email
    const ambassadorRecord = await Ambassador.findOne({ email: email });

    if (!ambassadorRecord) {
      return res.status(404).send('Ambassador record not found');
    }

    // Use the email to get the wallet details
    const getWallet = new GetWallet({
      passId: ambassadorRecord.passId // passId of the wallet pass
    });

    const walletDetails = await bambuClient.execute(getWallet);

    // Check if the wallet was successfully retrieved
    if (!walletDetails) {
      return res.status(404).send('Wallet not found');
    }

    // Increment the referral count
    const updatedReferrals = ambassadorRecord.referrals + 1;

    // Update the record in MongoDB
    await Ambassador.updateOne({ email: email }, { $set: { referrals: updatedReferrals } });

    // Update the wallet pass with the new referral count
    const updateWallet = new UpdateWallet({
      passId: walletDetails.passId, // or other identifier as needed
      // Other necessary fields...
      passdata: {
        metaData: {
          referrals: updatedReferrals.toString(), // Ensure the data type matches the expected in the wallet template
          // ...other metaData
        },
      },
    });

    await bambuClient.execute(updateWallet);

    // Continue with your response logic, such as rendering the referral form
    res.render('referralForm', { userData: ambassadorRecord });
  } catch (error) {
    console.error('Error in referral route:', error);
    res.status(500).send('Error processing referral');
  }
});
app.get('/track-qr', async (req, res) => {
  const sessionId = req.query.sessionId;
  const redirectUrl = decodeURIComponent(req.query.redirectUrl);

  console.log('Received request:', { sessionId, redirectUrl });

  // Validate and sanitize sessionId and redirectUrl here

  try {
    console.log('Sending event to GA...');
    await sendEventToGA(sessionId, 'QR Scan', 'Wallet_Card_Download');
    console.log('Event sent to GA, redirecting to:', redirectUrl);
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('Error tracking event or redirecting:', error);
    // Handle error (e.g., send a different response or a fallback URL)
  }
});

async function sendEventToGA(sessionId, category, action) {
  const GA_MEASUREMENT_ID = process.env.GA_MEASUREMENT_ID;
  const GA_API_SECRET = process.env.GA_API_SECRET;
  const url = `https://www.google-analytics.com/debug/mp/collect`;

  const eventData = {
    client_id: sessionId,
    events: [{ name: action, params: { category: category } }],
  };

  console.log('Event data being sent:', eventData);

  try {
    const response = await axios({
      method: 'post',
      url: url,
      params: { measurement_id: GA_MEASUREMENT_ID, api_secret: GA_API_SECRET },
      data: eventData,
      headers: { 'Content-Type': 'application/json' }
    });

    console.log('GA response:', response.status, response.data);
  } catch (error) {
    console.error('Error sending event to GA:', error.message);
  }
}




// Serve React App
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Start the server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

// Error handling for async routes
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).send('An error occurred');
});

// General request logging (optional)
app.use((req, res, next) => {
  console.log('Received request:', req.method, req.path);
  next();
});
