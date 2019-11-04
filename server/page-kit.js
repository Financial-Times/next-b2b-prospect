const React = require("react");
const ReactDOM = require("react-dom/server");
const { Shell } = require("@financial-times/dotcom-ui-shell");

export default ({ response, next, shellProps }) => {
        return (error, html) => {
            if (error) {
                return next(error);
            }

            const document = React.createElement(Shell, {
                ...shellProps,
                contents: html
            });

            response.send("<!DOCTYPE html>" + ReactDOM.renderToStaticMarkup(document));
        };
    };
