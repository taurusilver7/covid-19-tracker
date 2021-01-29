import React, { useEffect, useState } from 'react';
import './App.css';
import {MenuItem, Select, FormControl, Card, CardContent } from '@material-ui/core'
import InfoBox from './components/InfoBox/InfoBox';
import Table from './components/Table/Table';
import { prettyPrintStat, sortData } from './util';
import LineGraph from './components/LineGraph/LineGraph';
import Map from './components/Map/Map';
import 'leaflet/dist/leaflet.css';

const App = () => {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629});
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapContries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
    });
  }, []);

  useEffect(() => {
    // since dependency is blank, the function runs once ony.
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then(response => response.json())
      .then(data => {
        const countries = data.map(country => (
          {
            name: country.country,// United States, United Kingdom, ..
            value: country.countryInfo.iso2,// UK, USA, IND, FR..
          }
        ));

        const sortedData = sortData(data);

        setTableData(sortedData);
        setMapContries(data);
        setCountries(countries);
      })
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    // async b/c event triggers a re-render & collecting the relevant update takes time.(re, res, parse, render & display)
    const countryCode = event.target.value;
    // console.log(countryCode);
    setCountry(countryCode);

    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
    .then(response => response.json())
    .then(data => {
      setCountry(countryCode)
      setCountryInfo(data);
      console.log(data);

      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);
    });
  }

  return (
    <div className="app">
      <div className="app__left">

        <div className="app__header">
          <h1>COVID-19-Tracker</h1>
          <FormControl className="app__dropdown">
            <Select variant="outlined" onChange={onCountryChange} value={country}>
              <MenuItem value="worldwide">worldwide</MenuItem>
              {/* loop thru all countries and dropdown a list of countries */}
              {countries.map(country => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          {/* InfoBox Covid Cases */}
          <InfoBox 
            isRed
            active={casesType === "cases"}
            onClick={() => setCasesType("cases")} 
            title="COVID cases" 
            cases={prettyPrintStat(countryInfo.todayCases)} 
            total={prettyPrintStat(countryInfo.cases)} 
          />

          <InfoBox 
            active={casesType === "recovered"}
            onClick={() => setCasesType("recovered")} 
            title="Recovered" 
            cases={prettyPrintStat(countryInfo.todayRecovered)} 
            total={prettyPrintStat(countryInfo.recovered)} 
          />

          <InfoBox 
            isRed
            active={casesType === "deaths"}
            onClick={() => setCasesType("deaths")} 
            title="Deaths" 
            cases={prettyPrintStat(countryInfo.todayDeaths)} 
            total={prettyPrintStat(countryInfo.deaths)} 
          />

        </div>

        <Map countries={mapCountries} casesType={casesType} center={mapCenter} zoom={mapZoom} />

      </div>

      <Card className="app__right">
        <CardContent>
          <h3>Live cases by country</h3>
          <Table countries={tableData} />
          <h3>Worldwide new {casesType}</h3>
          <LineGraph className="app__graph" casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  )
}

export default App;
