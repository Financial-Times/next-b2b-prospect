import React from 'react';
import ReactDOM from 'react-dom/server';
import { Shell } from '@financial-times/dotcom-ui-shell';
import { Layout } from '@financial-times/dotcom-ui-layout';

export default ({ response, next, shellProps }) => {
        const layoutProps = {
            navigationData: response.locals.navigation,
            headerOptions: { ...response.locals.anon }
        };

        return (error, html) => {
            if (error) {
                return next(error);
            }

            const document = React.createElement(Shell,
                {...shellProps},
                React.createElement(Layout, { ...layoutProps, contents: html })
            );

            response.send("<!DOCTYPE html>" + ReactDOM.renderToStaticMarkup(document));
        };
    };
