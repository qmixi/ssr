import React from 'react';

// import { Provider } from 'react-redux';
import { Provider } from 'mobx-react';
import { renderToString } from 'react-dom/server';
import { renderRoutes } from 'react-router-config';
import { StaticRouter } from 'react-router-dom';
import serialize from "serialize-javascript";
import { Helmet } from 'react-helmet'

import Routes from '../client/Routes';


export default (req, state, context) => {    
    const content = renderToString(
        <Provider {...state}>
            <StaticRouter context={context} location={req.url}>
                <div>{renderRoutes(Routes)}</div>
            </StaticRouter>
        </Provider>
    );

    const helmet = Helmet.renderStatic()
    const initialState = state.appstate.toJson()

    return `
        <html>
            <head>
                ${helmet.title.toString()}
                ${helmet.meta.toString()}
                <link rel="stylesheet" href="/static/styles.css">
                
            </head>
            <body>
                <div id="root">${content}</div>
            </body>
            <script>
                window.INITIAL_STATE = ${ serialize({ appstate: state.appstate.toJson() })};
            </script>
            <script src="/static/bundle.js"></script>
        </html>
    `;
}