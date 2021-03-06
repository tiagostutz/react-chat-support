import React from 'react';
import ReactDOM from 'react-dom';

import manuh from 'manuh'
import { globalState } from 'rhelena'
import topics from './topics'

import './index.css';
import App from './App';
// import registerServiceWorker from './registerServiceWorker';

import './i18n.js'
import 'moment/locale/pt-br';
import i18n from "i18next";
const language = process.env.REACT_APP_FORCE_i18n_LANGUAGE
if (language) {
  i18n.changeLanguage(language)
}


ReactDOM.render(<App />, document.getElementById('root'));
// registerServiceWorker();


// Detect page focus and notify the application.
// This is useful to mark the message as read and not just as delivered
(function() {
    var hidden = "hidden";
  
    // Standards:
    if (hidden in document)
      document.addEventListener("visibilitychange", onchange);
    else if ((hidden = "mozHidden") in document)
      document.addEventListener("mozvisibilitychange", onchange);
    else if ((hidden = "webkitHidden") in document)
      document.addEventListener("webkitvisibilitychange", onchange);
    else if ((hidden = "msHidden") in document)
      document.addEventListener("msvisibilitychange", onchange);
    // IE 9 and lower:
    else if ("onfocusin" in document)
      document.onfocusin = document.onfocusout = onchange;
    // All others:
    else
      window.onpageshow = window.onpagehide
      = window.onfocus = window.onblur = onchange;
  
    function onchange (evt) {
      var v = "visible", h = "hidden",
          evtMap = {
            focus:v, focusin:v, pageshow:v, blur:h, focusout:h, pagehide:h
          };
  
      evt = evt || window.event;
      let status = "hidden"
      if (evt.type in evtMap) {
        status = evtMap[evt.type];
      } else {
        status = this[hidden] ? "hidden" : "visible";
      }
      
      globalState.windowFocused = (status === "visible")
      manuh.publish(topics.chatStation.window.visibility, { status })
        
    }
  
    // set the initial state (but only if browser supports the Page Visibility API)
    if( document[hidden] !== undefined )
      onchange({type: document[hidden] ? "blur" : "focus"});
  })();
