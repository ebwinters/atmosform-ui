import { useCallback, useEffect, useState } from 'react';

import 'survey-core/defaultV2.min.css';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import FormBuilder, { Question } from './Builder';


const createSurveyJson = (questions: Question[]) => {
  return {
    elements: questions.map((q) => {
      return {
        name: q.id,
        title: q.title,
        type: q.type === "text" ? "text" : "radiogroup",
        choices: q.options.map((opt, idx) => {
          return { value: idx, text: opt };
        }),
        isRequired: true
      };
    })
  };
}

function App() {
  const [isSubmitClicked, setisSubmitClicked] = useState(false)
  const [survey, setSurvey] = useState<Model>();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userHandle, setUserHandle] = useState<string | null>(null);
  const [userDid, setUserDid] = useState<string | null>(null);

  const alertResults = useCallback((sender: any) => {
    console.log("SENDER", sender.data);
    console.log("DATA", sender.getPlainData());
    // saveSurveyResults(
    //   "https://your-web-service.com/" + SURVEY_ID,
    //   sender.data
    // )
  }, []);

  const checkSession = async () => {
    try {
      const response = await fetch('http://127.0.0.1:3333/api/v1/check-session', {
        method: 'GET',
        credentials: 'include'
      });
      const data = await response.json();

      if (response.ok) {
        // Session is valid
        setIsLoggedIn(true);
        setUserHandle(data.handle); // Assuming the response includes the handle
        setUserDid(data.did);       // Assuming the response includes the DID
      } else {
        // No valid session found
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Error checking session:', error);
      setIsLoggedIn(false); // Assume not logged in if there's an error
    }
  };

  useEffect(() => {
    // Check session on initial load
    checkSession();
  }, []);

  const handleLogin = async () => {
    // Check if SID cookie exists
    const sid = document.cookie
      .split("; ")
      .find((row) => row.startsWith("sid="));

    if (sid) {
      setIsLoggedIn(true); // User is already logged in
      return;
    }

    // Fetch the OAuth URL from the backend
    try {
      const response = await fetch("http://127.0.0.1:3333/api/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          handle: "western-red-cedar.bsky.social",
        }),
      });

      if (response.ok) {
        const { oauthUrl } = await response.json();
        console.log("oauthUrl", oauthUrl);
        window.location.href = oauthUrl;
      } else {
        console.error("Failed to fetch OAuth URL");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const onClickSubmit = (questions: Question[]) => {
    const m = new Model(createSurveyJson(questions))
    m.onComplete.add(alertResults)
    setSurvey(m);
    setisSubmitClicked(true);
  };

  const headerContent = () => <header style={headerStyle}>
    <div className="user-info">
      <p>{userHandle}</p> {/* Display user handle */}
    </div>
  </header>;
  
  if (!isLoggedIn) {
    return <div>
      {headerContent()}
      <h1>Login Required</h1>
      <button onClick={handleLogin}>Login</button>
    </div>
  }
  return <div>{headerContent()}{isSubmitClicked ? <Survey model={survey}/> : <FormBuilder onClickSubmit={onClickSubmit} />}</div>;
}
const headerStyle: React.CSSProperties = {
  position: 'fixed',
  top: 10,
  right: 10,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: 'white',
  padding: '10px',
  borderRadius: '5px',
};
// function saveSurveyResults(url, json) {
//   fetch(url, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json;charset=UTF-8'
//     },
//     body: JSON.stringify(json)
//   })
//   .then(response => {
//     if (response.ok) {
//       // Handle success
//     } else {
//       // Handle error
//     }
//   })
//   .catch(error => {
//     // Handle error
//   });
// }

export default App;
