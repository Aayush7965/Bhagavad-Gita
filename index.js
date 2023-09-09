import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = process.env.PORT || 3000;
let versesData = [];
const API_KEY = "91dd75f53fmsha4a24ba49c969ccp15becajsn6b59fa268aa7"



app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

async function getData(chapterNumber, res) {
    const chapterURL = `https://bhagavad-gita3.p.rapidapi.com/v2/chapters/${chapterNumber}/`;
    const versesURL = `https://bhagavad-gita3.p.rapidapi.com/v2/chapters/${chapterNumber}/verses/`;

    versesData = [];
    const optionsForChapter = {headers: {'X-RapidAPI-Key': API_KEY, 'X-RapidAPI-Host': 'bhagavad-gita3.p.rapidapi.com'}};
    try {
        const response = await axios.get(chapterURL, optionsForChapter)
        const data = response.data;
        const optionsForShloks = {headers: {'X-RapidAPI-Key': API_KEY,'X-RapidAPI-Host': 'bhagavad-gita3.p.rapidapi.com'}};
        const getVerse = await axios.get(versesURL, optionsForShloks); 
        let verseArray = getVerse.data; 
        for(let verse of verseArray) {
            const numberOfVerse = verse
            const desiredBlock = numberOfVerse.translations.find(translation => translation.author_name === "Swami Sivananda");
            versesData.push(desiredBlock.description)
        }

        res.render("index.ejs", {
                  chapterNumber: data.chapter_number,
                  chapterName: data.name_translated,
                  chapterSummary: data.chapter_summary,
                  slokArray: versesData
          });
    } catch (error) {
        console.error("This is an error--->    "+error);
    }
}

app.get("/", async (req, res) => {
    getData(1, res)
})

app.post("/chapter", (req, res) => {
    let originalString = req.body.chapter;
    const newString = originalString.replace("Chapter ", "");
    getData(newString, res);
});



app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
})