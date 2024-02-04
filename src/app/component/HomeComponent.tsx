"use client";
import React, { useEffect, useState } from "react";
import AsyncSelect from "react-select";
import opencage from "opencage-api-client";

const HomeComponent = ({ data }: any) => {
  const [allList, setAllList] = useState<any>(JSON.parse(data));
  const [allListCities, setAllListCities] = useState<any>(
    JSON.parse(data).cities
  );

  const [cityData, setCityData] = useState<any>(null);
  const [selectedOption, setSelectedOption] = useState<any>();
  const [selectedCountry, setSelectedCountry] = useState<any>();
  const [removeCity, setRemoveCity] = useState<any>();
  const [addCity, setAddCity] = useState<any>();
  const [addNewCity, setAddNewCity] = useState<any>(false);
  const [removeCityDatabase, setRemoveCityDatabase] = useState<any>(false);

  useEffect(() => {
    if (selectedOption != undefined) {
      opencage
        .geocode({
          q: selectedOption.value,
          key: "5cf55afcd1894f5196581367774f5e01",
        })
        .then((data) => {
          console.log(
            data.results[0].geometry,
            "data.results[0].geometry.latitude"
          );
          const city = fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${data.results[0].geometry.lat}&lon=${data.results[0].geometry.lng}&units=metric&appid=071afcd8ecc9b53368e8d9b870d5fd21`
          )
            .then((res) => res.json())
            .then((data) => setCityData(data.main));
        })
        .catch((error) => {
          console.log("error", error.message);
        });
    }
  }, [selectedOption]);

  const options: any = allListCities.map((item: any) => {
    return { value: item.name, label: item.name };
  });
  const optionsCountries = allList.countries.map((item: any) => {
    return { value: item, label: item };
  });

  const deleteCityFromList = () => {
    return setAllListCities(
      allListCities.filter(
        (item: { name: any }) => item.name !== removeCity.label
      )
    );
  };

  const addCityInList = () => {
    setAllListCities([
      ...allListCities,
      { name: addCity, country: selectedCountry.value },
    ]);
  };

  return (
    <div style={{ background: "linear-gradient(to right, #3498db, #2c3e50)", minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "Arial, sans-serif", color: "#000" }}>
      <div style={{ padding: "20px", borderRadius: "10px", boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)", background: "rgba(255, 255, 255, 0.9)", maxWidth: "500px", width: "100%", transition: "all 0.3s ease" }}>
        <h2 style={{ textAlign: "center", color: "#333", fontSize: "28px", margin: "0 0 15px" }}>Weather Explorer</h2>
        <div style={{ marginBottom: "20px", textAlign: "center", fontSize: "16px", color: "#555" }}>Discover the weather in your favorite cities</div>
        <div style={{ marginBottom: "10px", textAlign: "center", fontSize: "16px" }}>Select city:</div>
        <AsyncSelect
          value={selectedOption}
          onChange={setSelectedOption}
          options={options}
          styles={{
            control: styles => ({ ...styles, backgroundColor: 'rgba(255, 255, 255, 0.9)', color: '#000', border: '1px solid #ccc', borderRadius: '5px', transition: 'all 0.3s ease' }),
            option: (styles, { isFocused }) => ({ ...styles, backgroundColor: isFocused ? 'rgba(200, 200, 200, 0.9)' : 'rgba(255, 255, 255, 0.9)', color: '#000', transition: 'all 0.3s ease' }),
            singleValue: styles => ({ ...styles, color: '#000', transition: 'all 0.3s ease' }),
          }}
        />
        {cityData != undefined && (
          <div style={{ marginTop: "20px" }}>
            <div>Temperature: {cityData.temp}</div>
            <div>Feels like: {cityData.feels_like}</div>
            <div>Temperature max: {cityData.temp_max}</div>
            <div>Temperature min: {cityData.temp_min}</div>
          </div>
        )}
        <div onClick={() => setAddNewCity(!addNewCity)} style={{ cursor: "pointer", marginTop: "20px", color: "#007bff", textAlign: "center", fontSize: "18px", textDecoration: "underline" }}>
          Add a New City
        </div>
        {addNewCity && (
          <form
            onSubmit={(e) => {
              e.preventDefault(), addCityInList();
            }}
          >
            <div style={{ marginTop: "20px", textAlign: "center", fontSize: "16px" }}>Select country from the list</div>
            <AsyncSelect
              value={selectedCountry}
              onChange={setSelectedCountry}
              options={optionsCountries}
              styles={{
                control: styles => ({ ...styles, backgroundColor: 'rgba(255, 255, 255, 0.9)', color: '#000', border: '1px solid #ccc', borderRadius: '5px', transition: 'all 0.3s ease' }),
                option: (styles, { isFocused }) => ({ ...styles, backgroundColor: isFocused ? 'rgba(200, 200, 200, 0.9)' : 'rgba(255, 255, 255, 0.9)', color: '#000', transition: 'all 0.3s ease' }),
                singleValue: styles => ({ ...styles, color: '#000', transition: 'all 0.3s ease' }),
              }}
            />
            <div style={{ marginTop: "20px", textAlign: "center", fontSize: "16px" }}>City name</div>
            <input
              onChange={(e) => setAddCity(e.target.value)}
              type="text"
              style={{ width: "100%", padding: "10px", marginTop: "10px", borderRadius: "5px", border: '1px solid #ccc', color: "#000", transition: 'all 0.3s ease' }}
            />
            <button type="submit" style={{ marginTop: "20px", padding: "12px", backgroundColor: "#007bff", color: "#fff", borderRadius: "5px", cursor: "pointer", fontSize: "16px", transition: 'background-color 0.3s ease' }}>
              Add
            </button>
          </form>
        )}
        <div onClick={() => setRemoveCityDatabase(!removeCityDatabase)} style={{ cursor: "pointer", marginTop: "20px", color: "#dc3545", textAlign: "center", fontSize: "18px", textDecoration: "underline" }}>
          Remove City
        </div>
        {removeCityDatabase && (
          <form
            onSubmit={(e) => {
              e.preventDefault(), deleteCityFromList();
            }}
          >
            <AsyncSelect
              value={removeCity}
              onChange={setRemoveCity}
              options={options}
              isSearchable
              styles={{
                control: styles => ({ ...styles, backgroundColor: 'rgba(255, 255, 255, 0.9)', color: '#000', border: '1px solid #ccc', borderRadius: '5px', transition: 'all 0.3s ease' }),
                option: (styles, { isFocused }) => ({ ...styles, backgroundColor: isFocused ? 'rgba(200, 200, 200, 0.9)' : 'rgba(255, 255, 255, 0.9)', color: '#000', transition: 'all 0.3s ease' }),
                singleValue: styles => ({ ...styles, color: '#000', transition: 'all 0.3s ease' }),
              }}
            />
            <button type="submit" style={{ marginTop: "20px", padding: "12px", backgroundColor: "#dc3545", color: "#fff", borderRadius: "5px", cursor: "pointer", fontSize: "16px", transition: 'background-color 0.3s ease' }}>
              Delete
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default HomeComponent;
