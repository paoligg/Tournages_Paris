import { useState, useEffect } from "react";
import reactLogo from './assets/react.svg'
import './App.css'
import { MapContainer as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet';



function App() {
 const [data, setData] = useState(null);
 const [error, setError] = useState(null);
 const [searchTerm, setSearchTerm] = useState('');
 const [searchResults, setSearchResults] = useState(null);

 useEffect(() =>{
    const fetchData = async () => {
      try {
        const result = await fetch(
          `https://opendata.paris.fr/api/records/1.0/search/?dataset=lieux-de-tournage-a-paris&rows=100`
        );
        const data = await result.json();
        setData(data);
      } catch (err) {
        setError(err.message);
        setData(null);
      }
    };
    fetchData();
  }, [searchTerm]);
  
  async function handleClick(){
    console.log(searchTerm);
    try{
    const handleClick = await
    fetch(`https://opendata.paris.fr/api/records/1.0/search/?dataset=lieux-de-tournage-a-paris&q=nom_tournage:*"${searchTerm}"*&partial=true`)
      .then((result) => result.json())
      .then((get) => {
        setSearchResults(get);
      });
    
  } 
  catch (err) {
    setError(err.message);
    setData(null);
    console.log(err);
  }
};
  
  return (
    <div className="App">
       <h1>Tournages à Paris</h1>
      {error && (
        <div className="texterror">{`There is a problem fetching the post data - ${error}`}</div>
      )}
      <p><i>Entrer le nom du film recherché et appuyer sur le bouton</i></p>
      <form>
        <input 
          type="text" 
          value={searchTerm} 
          onChange={e => setSearchTerm(e.target.value)} 
        />
        <button type="button" onClick={handleClick}>Rechercher</button>
      </form>

      <br /><br />
      <div>

      <LeafletMap center={[48.856614, 2.3522219]} zoom={12} scrollWheelZoom={true}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors" />
      {searchResults &&
          searchResults.records.map((post) => (
            <Marker position={[post.fields.geo_point_2d[0], post.fields.geo_point_2d[1]]}>
              <Popup>
                <h4>{post.fields.nom_tournage}</h4>
                <p>{post.fields.ardt_lieu}</p>
                <p>Du {post.fields.date_debut} au {post.fields.date_fin}</p>

              </Popup>
            </Marker>
        ))}
      </LeafletMap>
      </div>

      <br /><br />
      <div className="tournages">
        {searchResults &&
          searchResults.records.map((post) => (
            <div className="tournage" key={post.geo_point_2d}>
              <h2>{post.fields.nom_tournage}</h2>
              <p>{post.fields.nom_realisateur}</p>
              <p>{post.fields.ardt_lieu}</p>
              <p>Du {post.fields.date_debut} au {post.fields.date_fin}</p> 
            </div>
        ))}
      </div>
      
      <br /><br />
      <h2><u>Liste des tournages (100 premiers) </u></h2> 
      <div className="liste">
        {data &&
          data.records.map((post) => (
            <div className="list" key={post.geo_point_2d}>
              <h4>{post.fields.nom_tournage}</h4>
              <p>{post.fields.nom_realisateur} | {post.fields.ardt_lieu} | Du {post.fields.date_debut} au {post.fields.date_fin}</p> 
            </div>
        ))}
      </div>
    </div>
  )
}

export default App
