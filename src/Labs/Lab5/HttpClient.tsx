import { useEffect, useState } from "react";
import axios from "axios";
import * as client from "./client";

const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;

export default function HttpClient() {
  const [welcomeOnClick, setWelcomeOnClick] = useState("");
  const [welcomeOnLoad, setWelcomeOnLoad] = useState("");

  const fetchWelcomeOnClick = async () => {
    try {
      const response = await axios.get(`${REMOTE_SERVER}/lab5/welcome`);
      setWelcomeOnClick(response.data);
    } catch (error) {
      console.error("Error fetching welcome message:", error);
      setWelcomeOnClick("Error fetching message");
    }
  };

  // Separate function for loading data
  const fetchWelcomeOnLoad = async () => {
    try {
      const welcome = await client.fetchWelcomeMessage();
      setWelcomeOnLoad(welcome);
    } catch (error) {
      console.error("Error fetching initial welcome message:", error);
      setWelcomeOnLoad("Error fetching message");
    }
  };

  // useEffect hook at the component level
  useEffect(() => {
    fetchWelcomeOnLoad();
  }, []);

  return (
    <div className="p-4">
      <h3>HTTP Client</h3>
      <hr />
      
      <div className="mb-4">
        <h4>Requesting on Click</h4>
        <button 
          className="btn btn-primary me-2 mb-2" 
          onClick={fetchWelcomeOnClick}
        >
          Fetch Welcome
        </button>
        <div>
          Response from server: <b>{welcomeOnClick}</b>
        </div>
      </div>

      <div className="mb-4">
        <h4>Requesting on Load</h4>
        <div>
          Response from server: <b>{welcomeOnLoad}</b>
        </div>
      </div>
      <hr />
    </div>
  );
}