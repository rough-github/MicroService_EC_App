import "bootstrap/dist/css/bootstrap.css";

import Header from "../component/header";
import buildClient from "../api/build-client";

const App =  ({Component, pageProps, currentUser}) => {
  return (
      <div>
        <Header currentUser={currentUser} />
        <div className="container">
          <Component currentUser={currentUser} {...pageProps} />
        </div>
      </div>
    )
}

App.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const {data} = await client.get('/api/users/currentuser');

  let pageProps = {};
  if(appContext.Component.getInitialProps) {
    // pagePropsの整形
    pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, data.currentUser);
  }
  return {
    pageProps,
    ...data
  }
}

// Page Component
// context === {req, res}

// Custom Component
// context = {Component, ..., ctx: {req, res}}

export default App;