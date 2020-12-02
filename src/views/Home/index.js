import React, { useState } from 'react'

/* Recoil */
import { useRecoilState, useResetRecoilState } from 'recoil';

/* Atoms */
import { spotifyTokenResponse } from '../../recoil/auth/atoms'
import { spotifyResult } from '../../recoil/songs/atoms'
import { filterType as filterTypeSelector } from '../../recoil/songs/selectors'


import searchImage from '../../assets/images/search.jpg'
import { spotifySearchCall } from '../../utils'
import "./style.css"

/* Components */
import HomeFilters from '../../components/HomeFilters';
import Track from '../../components/Track';
import Album from '../../components/Album';
import Artist from '../../components/Artist';
import Episode from '../../components/Episode';
import Playlist from '../../components/Playlist';



export default function Home() {

  const [searchText, setSearchText] = useState("");
  const [tokenResponse] = useRecoilState(spotifyTokenResponse);
  const [searchResponse, setSearchResponse] = useRecoilState(spotifyResult);
  const [filterType] = useRecoilState(filterTypeSelector);
  const resetFilter = useResetRecoilState(filterTypeSelector)


  const handleSearchClick = async () => {
    //TODO hacer o ejecutar la llamada a la API 
    let type = filterType ?? "track";

    const paramsArray = [{
      q: searchText
    }, {
      type,
    }, {
      offset: 50,
    }];
    const response = await spotifySearchCall(paramsArray, tokenResponse.access_token)
    setSearchResponse(response)
  };

  const handleResetFilterClick = () => {
    resetFilter();
    setSearchResponse([]);
    setSearchText("")
  }

  return (
    <div className="home">
      <div style={{ backgroundImage: `url(${searchImage})` }} className="home-cover-container" />
      <h2 className="home-title">Busca tu canción favorita</h2>
      <div className="home-searchbox">
        <input type="text" className="home-searchbox-input" value={searchText} onChange={({ target: { value } }) => setSearchText(value)} />
        <button className="home-searchbox-button" onClick={handleSearchClick}>Buscar</button>
      </div>
      <HomeFilters />
      <button className="home-clean-filters-button" onClick={handleResetFilterClick}>Limpiar filtros</button>
      {searchResponse?.tracks?.items && (
        <div className="home-tracks-container">
          <p className="home-tracks-title">Canciones</p>
          <div className="home-tracks-container-items">
            {searchResponse?.tracks?.items?.map((item, index) => <Track key={index} {...item} />)}
          </div>
        </div>
      )}
      {searchResponse?.albums?.items && (
        <div className="home-album-container">
          <p className="home-album-title">Album</p>
          <div className="home-album-container-items">
            {searchResponse?.albums?.items?.map((item, index) => <Album key={index} {...item} />)}
          </div>
        </div>
      )}
      {searchResponse?.artists?.items && (
        <div className="home-artist-container">
          <p className="home-artist-title">Artista</p>
          <div className="home-artist-container-items">
            {searchResponse?.artists?.items?.map((item, index) => <Artist key={index} {...item} />)}
          </div>
        </div>
      )}
      {searchResponse?.episodes?.items && (
        <div className="home-episodes-container">
          <p className="home-episodes-title">Episodio</p>
          <div className="home-episodes-container-items">
            {searchResponse?.episodes?.items?.map((item, index) => <Episode key={index} {...item} />)}
          </div>
        </div>
      )}
      {searchResponse?.playlists?.items && (
        <div className="home-playlist-container">
          <p className="home-playlist-title">Playlist</p>
          <div className="home-playlist-container-items">
            {searchResponse?.playlists?.items?.map((item, index) => <Playlist key={index} {...item} />)}
          </div>
        </div>
      )}
    </div>
  )
}