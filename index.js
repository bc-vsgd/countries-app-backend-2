// Test

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());

const countriesUrl = process.env.COUNTRIES_API_URL;

// All countries, alphabetical sort + regions & subregions array
app.get("/countries", async (req, res) => {
  try {
    // data: countries array
    const { data } = await axios.get(`${countriesUrl}/all`);
    // alphabetical sort
    const sortedData = data.sort((a, b) => {
      return a.name.common.localeCompare(b.name.common);
    });
    // continents (regions & subregions)
    const continents = await axios.get(
      `${countriesUrl}/all?fields=region,subregion`
    );
    // languages
    const languages = await axios.get(`${countriesUrl}/all?fields=languages`);
    // currencies
    const currencies = await axios.get(`${countriesUrl}/all?fields=currencies`);

    return res.status(200).json({
      message: "Home page",
      data: sortedData,
      continents: continents.data,
      languages: languages.data,
      currencies: currencies.data,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Countries sorted by name, population or area
app.get("/countries/sort", async (req, res) => {
  try {
    const { data } = await axios.get(`${countriesUrl}/all`);
    // Get the values of query params
    const { name, pop, area } = req.query;
    // console.log(req.query);
    // Sort by name
    if (name) {
      if (name === "asc") {
        const sortedData = data.sort((a, b) => {
          return a.name.common.localeCompare(b.name.common);
        });
        return res
          .status(200)
          .json({ message: "Countries sort by name: asc", data: sortedData });
      } else if (name === "desc") {
        const sortedData = data.sort((a, b) => {
          return b.name.common.localeCompare(a.name.common);
        });
        return res
          .status(200)
          .json({ message: "Countries sort by name: desc", data: sortedData });
      }
    }
    // Sort by population
    if (pop) {
      if (pop === "asc") {
        const sortedData = data.sort((a, b) => {
          return a.population - b.population;
        });
        return res
          .status(200)
          .json({ message: "Countries sort: asc", data: sortedData });
      } else if (pop === "desc") {
        const sortedData = data.sort((a, b) => {
          return b.population - a.population;
        });
        return res
          .status(200)
          .json({ message: "Countries sort: desc", data: sortedData });
      }
    }
    // Sort by area
    if (area) {
      if (area === "asc") {
        const sortedData = data.sort((a, b) => {
          return a.area - b.area;
        });
        return res
          .status(200)
          .json({ message: "Countries: sort by area: asc", data: sortedData });
      } else if (area === "desc") {
        const sortedData = data.sort((a, b) => {
          return b.area - a.area;
        });
        return res
          .status(200)
          .json({ message: "Countries: sort by area: desc", data: sortedData });
      }
    }
    // if no query params
    return res
      .status(200)
      .json({ message: "Countries sort", query: req.query, data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Countries searched by name, continent/region/subregion, language or currency
app.get("/countries/search", async (req, res) => {
  try {
    // console.log(req.query);
    const { name, cont, type, lang, curr } = req.query;
    if (name) {
      const { data } = await axios.get(`${countriesUrl}/name/${name}`);
      return res
        .status(200)
        .json({ message: `Country name search: ${name}`, data });
    }
    if (cont) {
      const { data } = await axios.get(`${countriesUrl}/${type}/${cont}`);
      return res
        .status(200)
        .json({ message: "Country continent search", data });
    }
    if (lang) {
      const { data } = await axios.get(`${countriesUrl}/lang/${lang}`);
      return res
        .status(200)
        .json({ message: `Country language search: ${lang}`, data });
    }
    if (curr) {
      const { data } = await axios.get(`${countriesUrl}/currency/${curr}`);
      return res
        .status(200)
        .json({ message: `Country currency search: ${curr}`, data });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// One country
app.get("/country/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const { data } = await axios.get(`${countriesUrl}/name/${name}`);
    return res.status(200).json({ message: `One country: ${name}`, data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.all("*", (req, res) => {
  return res.status(400).json({ message: "This page does not exist" });
});

app.listen(3000, () => {
  console.log("Server started !!!");
});
