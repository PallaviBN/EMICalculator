import React from "react";
import ReactDOM from "react-dom/client";
import Main from "./Main";

const App = () => {
    return (<Main />);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);