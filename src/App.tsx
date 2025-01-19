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

      if (response.ok) {
        // Session is valid
        setIsLoggedIn(true);
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
          "Content-Type": "application/json", // Inform the server about the payload format
        },
        body: JSON.stringify({
          handle: "western-red-cedar.bsky.social", // Send the handle as JSON
        }),
      });

      if (response.ok) {
        const { oauthUrl } = await response.json();
        console.log("oauthUrl", oauthUrl);
        // Redirect the user to the OAuth URL
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
  // return <Survey readonly model={survey} />;
  if (!isLoggedIn) {
    // Optionally, show a loading indicator while checking login status
    return <div>
      <h1>Login Required</h1>
      <button onClick={handleLogin}>Login</button>
    </div>
  }
  return isSubmitClicked ? <Survey model={survey}/> : <FormBuilder onClickSubmit={onClickSubmit} />;
}

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
