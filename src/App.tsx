import React, { useEffect, useState } from "react";
import { hot } from "react-hot-loader/root";
useState;

export default hot(
  React.memo(function App() {
    // const [_0] = useState(0);
    // _0;
    useEffect(() => {
      console.log("app first render");
      return () => {
        console.log("app will unmount");
      };
    }, []);
    useEffect(() => {
      console.log("app updated");
      return () => {
        console.log("app before update");
      };
    });
    return <>App</>;
  }),
);
