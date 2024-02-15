const express = require('express');
const admin = require('firebase-admin');
const { BambuClient, IssueWallet, UpdateWallet, GetWallet } = require('@bambumeta/sdk');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const axios = require('axios');
const cookieParser = require('cookie-parser');


require('dotenv').config();




const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
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
  process.env.BRANDID
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

app.post('/update-wallet', async (req, res) => {
  console.log("Request body:", req.body);
  const { firstName, lastName, email, company } = req.body.person;
  const templateTierId = req.body.templateTierId; 
  const brand = req.body.brand; 
  const templateId = req.body.templateId 
  const passdata = req.body.passdata
  const programid = req.body.programid
  const { metaData, points } = req.body.passdata || {};
  // Initialize Bambu Client
const bambuClient = new BambuClient(
  process.env.TENANT_ID,
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.DOMAIN,
  process.env.BRANDID
);
  try {
      const updateWalletData = {
        brandId: brand,
        programid: programid,
        templateId:templateId,
        templateTierId: templateTierId,
        programId: programid,
        email: email,
        person: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          company: company
        },
        passdata:{
        // Include metaData and points only if they are defined
        ...(metaData && { metaData }),
        ...(typeof points !== 'undefined' && { points }),
        }
      };
      console.log("Sending to Bambu:", updateWalletData);
      const updateWallet = new UpdateWallet(updateWalletData);
      const walletPassResponse = await bambuClient.execute(updateWallet);

    console.log("WalletPass response:", walletPassResponse);

    // Check if the response is successful
    if (walletPassResponse.message === 'Wallet update requested') {
      // Success response from Bambu API
      res.json({
        success: true,
        message: walletPassResponse.message,
      });
    } else {
      // If the message is not what we expect, handle it as an error or unexpected response
      console.error('Unexpected response from Bambu:', walletPassResponse);
      res.status(500).send('Unexpected response from Bambu');
    }
  } catch (error) {
    console.error('Error in /update-wallet:', error);
    res.status(500).send('Error updating wallet');
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
