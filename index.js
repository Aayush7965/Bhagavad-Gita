import 'dotenv/config';
import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const date = new Date();
const app = express();
// When loading website from render.com it will use process.env.PORT to get PORT information from the website
// If loading it on localhost it will use PORT 3000
const port = process.env.PORT;
let versesData = [];
// You have to add your own RapidAPI key, I am using "process.env.API_KEY" because I stored my API_KEY in render.com and this is the way to access it
const API_KEY = process.env.API_KEY;
let currentChapterNumber;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())

async function getData(chapterNumber, res) {
    versesData = [];
    const chapterURL = `https://bhagavad-gita3.p.rapidapi.com/v2/chapters/${chapterNumber}/`;
    const versesURL = `https://bhagavad-gita3.p.rapidapi.com/v2/chapters/${chapterNumber}/verses/`;
    const optionsForChapter = {headers: {'X-RapidAPI-Key': API_KEY, 'X-RapidAPI-Host': 'bhagavad-gita3.p.rapidapi.com'}};
    try {
        // Getting chapter
        const response = await axios.get(chapterURL, optionsForChapter)
        const data = response.data;
        // Getting verses
        const optionsForVerses = {headers: {'X-RapidAPI-Key': API_KEY,'X-RapidAPI-Host': 'bhagavad-gita3.p.rapidapi.com'}};
        const getVerse = await axios.get(versesURL, optionsForVerses); 
        // Creating a array that have verse data that we got from our API
        let verseArray = getVerse.data; 
        // Looping to get every single data from array
        for(let verse of verseArray) {
            // Putting single verse object in numberOfVerse
            const numberOfVerse = verse
            // Searching in our object if our author_name matches "Swami Sivananda" only then give us the verse data
            const desiredBlock = numberOfVerse.translations.find(translation => translation.author_name === "Swami Sivananda");
            // Push all the data into versesData array
            versesData.push(desiredBlock.description)
        }
        currentChapterNumber = chapterNumber; // 1

        let leftArrowData = currentChapterNumber;
        let rightArrowData = currentChapterNumber;

        if (rightArrowData == 18) {
            rightArrowData = 1
        } else {
            rightArrowData ++;
        }

        if (leftArrowData == 1) {
            leftArrowData = 18;
        } else {
            leftArrowData --;
        }


        res.render("index.ejs", {
                  chapterNumber: data.chapter_number,
                  chapterName: data.name_translated,
                  chapterSummary: data.chapter_summary,
                  slokArray: versesData,
                  currentYear: date.getFullYear(),
                  leftArrowData: leftArrowData,
                  rightArrowData: rightArrowData
          });
          
    } catch (error) {
        console.error("This is an error", error);
    }
}

app.get("/", async (req, res) => {
    // Calling getData function for chapter 1
    res.redirect(`/chapter/1`)
})


app.get("/chapter", (req, res) => {
    // If user click reload when in "/chapter" url it will redirect them to "/"
    res.redirect("/")
})

app.post("/chapter", (req, res) => {
    // Getting chapter number from our button pressed in hamburger menu e.x. Chapter 1, Chapter 2
    let originalString = req.body.chapter;
    if (originalString) {
        // Removing "Chapter " from our result e.x. Chapter 1 => 1, Chapter 5 => 5
        const newString = originalString.replace("Chapter ", "");
        // Sending these chapter numbers to our getData function to get data from our API for a specific chapter
        // await getData(newString, res);
        res.redirect(`/chapter/${newString}`)
    } else {
        res.redirect(`/chapter/1`)
    }
});

app.get("/chapterNumber", (req, res) => {
    const data = {
        chapterNumber: currentChapterNumber
    };
    // Send the data as JSON to the client
    res.json(data);
})

app.get("/chapter/:chapterNumber", (req, res) => {
    getData(req.params.chapterNumber, res)
})


app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
})