# Plugin Name
`babel-plugin-replace-env-vars`

## Plugin Description
`babel-plugin-replace-env-vars` is a Babel plugin designed to replace occurrences of `process.env.xxx` in your code with the corresponding environment variable values at build time. If the environment variable `process.env.xxx` does not exist during the build, it will be replaced with undefined. This plugin helps to inject environment variables during the build process, optimizing code execution and improving performance.

## Plugin Code
```js
// This plugin replaces process.env.xxx with the corresponding environment variable values
module.exports = function ({ types: t }) {
  function isLeftSideOfAssignmentExpression(path) {
    return t.isAssignmentExpression(path.parent) && path.parent.left === path.node;
  }

  return {
    name: 'babel-plugin-replace-env-vars',
    visitor: {
      MemberExpression(path, { opts: { exclude } = {} }) {
        // Check if it's a process.env.xxx expression
        if (path.get('object').matchesPattern('process.env')) {
          const key = path.toComputedKey();

          // Ensure the key is a string literal, not on the left side of an assignment, and not in the exclude list
          if (t.isStringLiteral(key) && !isLeftSideOfAssignmentExpression(path) && (!exclude || exclude.indexOf(key.value) === -1)) {
            const value = process.env[key.value];

            // If the environment variable does not exist, replace with undefined
            if (typeof value === 'undefined') {
              path.replaceWith(t.identifier('undefined'));
            } else {
              // Otherwise, replace with the corresponding value
              path.replaceWith(t.valueToNode(value));
            }
          }
        }
      }
    }
  }
}
```

## Detailed Explanation
This plugin traverses all member expression nodes (MemberExpression) in the code, checking if they are process.env.xxx expressions. It then replaces them based on the following conditions:

The xxx key is a string literal.
The process.env.xxx expression is not on the left side of an assignment (e.g., process.env.xxx = value).
The xxx key is not in the exclude list provided by the plugin options.
When all these conditions are met, the plugin replaces the process.env.xxx expression with the value from process.env:

If the environment variable exists, it replaces the expression with its value.
If the environment variable does not exist, it replaces the expression with undefined.
## Usage
Add the plugin to your project.
Reference the plugin in your Babel configuration file.
## Example:

```js
// babel.config.js
module.exports = {
  presets: [
    // other presets
  ],
  plugins: [
    ['babel-plugin-replace-env-vars', { exclude: ['NODE_ENV'] }]
  ]
};
```
By using `babel-plugin-replace-env-vars`, you can dynamically inject environment variables into your code at build time, enhancing the flexibility and performance of your application.