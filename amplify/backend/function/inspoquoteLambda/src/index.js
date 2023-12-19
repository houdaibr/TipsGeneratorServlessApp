/* Amplify Params - DO NOT EDIT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 * 
 */
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

// Image generation packages
const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');
async function updateQuoteDDBObject() {
  const quoteTableName = process.env.API_INSPIRATIONALQUOTES_QUOTEAPPDATATABLE_NAME;
  const quoteObjectID = "1234567890123456789012345678901234567890";

  try {
      var quoteParams = {
          TableName: quoteTableName,
          Key: {
              "id": quoteObjectID,
          },
          UpdateExpression: "SET #quotesGenerated = #quotesGenerated + :inc",
          ExpressionAttributeValues: {
              ":inc": 1,
          },
          ExpressionAttributeNames: {
              "#quotesGenerated": "quotesGenerated",
          },
          ReturnValues: "UPDATED_NEW"
      };

      const updateQuoteObject = await docClient.update(quoteParams).promise();
      return updateQuoteObject;
  } catch (error) {
      console.log('error updating quote object in DynamoDB', error);
  }
}

exports.handler = async (event) => {
  const apiURL = "https://api.adviceslip.com/advice";

  async function getRandomAdvice(apiURLInput) {
      const response = await fetch(apiURLInput);
      const adviceData = await response.json();
      console.log(adviceData);

      let adviceText = adviceData.slip.advice;

      const width = 750;
      const height = 483;
      const text = adviceText;
      const words = text.split(" ");
      const lineBreak = 4;
      let newText = "";
      let tspanElement = "";
      for (let i = 0; i < words.length; i++) {
          newText += words[i] + " ";
          if ((i + 1) % lineBreak === 0) {
              tspanElement += '<tspan x="' + (width / 2) + '" dy="1.2em">' + newText + '</tspan>';
              newText = "";
          }
      }
      if (newText !== "") {
          tspanElement += '<tspan x="' + (width / 2) + '" dy="1.2em">' + newText + '</tspan>';
      }
  
      console.log(tspanElement);
     // Construct the SVG
    const fixedBackgroundImage = "backgrounds/Aubergine.png"; // Replace with your background image path
    const selectedBackgroundImage = fixedBackgroundImage;

    // Construct the SVG
    const svgImage = `
    <svg width="${width}" height="${height}">
        <style>
           .title { 
             fill: #ffffff; 
             font-size: 20px; 
             font-weight: bold;
          }
          .footerStyles {
             font-size: 20px;
             font-weight: bold;
             fill: lightgrey;
             text-anchor: middle;
             font-family: Verdana;
          }
        </style>

        <circle cx="382" cy="76" r="44" fill="rgba(255, 255, 255, 0.155)"/>
        <text x="382" y="76" dy="50" text-anchor="middle" font-size="90" font-family="Verdana" fill="white">"</text>
        <g>
            <rect x="0" y="0" width="${width}" height="auto"></rect>
            <text id="lastLineOfQuote" x="375" y="120" font-family="Verdana" font-size="35" fill="white" text-anchor="middle">
               ${tspanElement}
            </text>
        </g>
        <text x="${width / 2}" y="${height - 10}" class="footerStyles">Developed by @Houda |  https://api.adviceslip.com/</text>
    </svg>
  `;

    const imagePath = path.join('/tmp', 'quote-card.png');
    fs.writeFileSync(imagePath, svgImage);

    // Function: Update DynamoDB object in table
    try {
      await updateQuoteDDBObject();
    } catch (error) {
      console.log('error updating quote object in DynamoDB', error);
    }

    // Concatenate the array of words into a single string
    const quoteText = words.join(" ");

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "image/png",
        "Access-Control-Allow-Origin": "*",
      },
      body: quoteText,
      isBase64Encoded: true,
    };
  }

  return await getRandomAdvice(apiURL);
};